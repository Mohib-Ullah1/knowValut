/**
 * KnowVault API Client
 * Handles JWT authentication, token refresh, and API requests.
 */
const KnowVaultAPI = (() => {
    const TOKEN_KEY = 'kv_access_token';
    const REFRESH_KEY = 'kv_refresh_token';
    const USER_KEY = 'kv_user';
    const API_BASE = '/api';

    // ── Token Management ──────────────────────────────────────
    function getAccessToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function getRefreshToken() {
        return localStorage.getItem(REFRESH_KEY);
    }

    function setTokens(access, refresh) {
        localStorage.setItem(TOKEN_KEY, access);
        if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    }

    function clearTokens() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
    }

    function setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    function getUser() {
        try {
            return JSON.parse(localStorage.getItem(USER_KEY));
        } catch {
            return null;
        }
    }

    function isAuthenticated() {
        return !!getAccessToken();
    }

    // ── CSRF Token ────────────────────────────────────────────
    function getCSRFToken() {
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='));
        return cookie ? cookie.split('=')[1] : '';
    }

    // ── Token Refresh ─────────────────────────────────────────
    let refreshPromise = null;

    async function refreshAccessToken() {
        // Deduplicate concurrent refresh requests
        if (refreshPromise) return refreshPromise;

        refreshPromise = (async () => {
            const refresh = getRefreshToken();
            if (!refresh) {
                throw new Error('No refresh token');
            }

            const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh }),
            });

            if (!res.ok) {
                clearTokens();
                throw new Error('Token refresh failed');
            }

            const data = await res.json();
            setTokens(data.access, data.refresh || refresh);
            return data.access;
        })();

        try {
            return await refreshPromise;
        } finally {
            refreshPromise = null;
        }
    }

    // ── Core Request ──────────────────────────────────────────
    async function request(endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
        const isFormData = options.body instanceof FormData;

        const headers = { ...options.headers };
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        headers['X-CSRFToken'] = getCSRFToken();

        const token = getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        let res = await fetch(url, {
            ...options,
            headers,
            body: isFormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
        });

        // Auto-refresh on 401
        if (res.status === 401 && getRefreshToken()) {
            try {
                const newToken = await refreshAccessToken();
                headers['Authorization'] = `Bearer ${newToken}`;
                res = await fetch(url, {
                    ...options,
                    headers,
                    body: isFormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
                });
            } catch {
                clearTokens();
                window.location.href = '/auth/login/';
                throw new Error('Session expired. Please log in again.');
            }
        }

        // Parse response
        const contentType = res.headers.get('content-type') || '';
        let data;
        if (contentType.includes('application/json')) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        if (!res.ok) {
            const error = new Error(
                typeof data === 'object' ? (data.detail || JSON.stringify(data)) : data
            );
            error.status = res.status;
            error.data = data;
            throw error;
        }

        return data;
    }

    // ── Convenience Methods ───────────────────────────────────
    function get(endpoint) {
        return request(endpoint, { method: 'GET' });
    }

    function post(endpoint, body) {
        return request(endpoint, { method: 'POST', body });
    }

    function patch(endpoint, body) {
        return request(endpoint, { method: 'PATCH', body });
    }

    function put(endpoint, body) {
        return request(endpoint, { method: 'PUT', body });
    }

    function del(endpoint) {
        return request(endpoint, { method: 'DELETE' });
    }

    // ── Auth Helpers ──────────────────────────────────────────
    async function login(email, password) {
        const data = await post('/auth/login/', { email, password });
        setTokens(data.tokens.access, data.tokens.refresh);
        setUser(data.user);
        return data;
    }

    async function register(formData) {
        const data = await post('/auth/register/', formData);
        setTokens(data.tokens.access, data.tokens.refresh);
        setUser(data.user);
        return data;
    }

    async function logout() {
        try {
            await post('/auth/logout/', { refresh: getRefreshToken() });
        } finally {
            clearTokens();
        }
    }

    // ── Auth Guard ────────────────────────────────────────────
    function requireAuth() {
        if (!isAuthenticated()) {
            window.location.href = '/auth/login/';
            return false;
        }
        return true;
    }

    // ── Public API ────────────────────────────────────────────
    return {
        get,
        post,
        patch,
        put,
        delete: del,
        request,
        login,
        register,
        logout,
        getUser,
        setUser,
        isAuthenticated,
        requireAuth,
        clearTokens,
        getAccessToken,
    };
})();

// Also expose as `api` for convenience in templates
const api = KnowVaultAPI;
