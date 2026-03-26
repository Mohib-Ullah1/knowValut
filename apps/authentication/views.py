import pyotp
import secrets
from django.contrib.auth import authenticate, get_user_model
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.analytics.models import UserActivity
from .serializers import (
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserProfileUpdateSerializer,
    UserSerializer,
)

User = get_user_model()


def _log_activity(user, action, metadata=None):
    UserActivity.objects.create(user=user, action=action, metadata=metadata)


def _get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        _log_activity(user, 'login', {'method': 'register'})
        return Response({
            'user': UserSerializer(user).data,
            'tokens': _get_tokens_for_user(user),
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = authenticate(request, username=user.username, password=password)
        if user is None:
            return Response(
                {'detail': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {'detail': 'Account is disabled.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        _log_activity(user, 'login')

        response_data = {
            'user': UserSerializer(user).data,
            'tokens': _get_tokens_for_user(user),
            'mfa_required': user.mfa_enabled,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass
        _log_activity(request.user, 'logout')
        return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return UserProfileUpdateSerializer
        return UserSerializer


class ChangePasswordView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'old_password': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'detail': 'Password updated successfully.'}, status=status.HTTP_200_OK)


class MFASetupView(APIView):
    def get(self, request):
        """Generate a new TOTP secret for the user."""
        secret = pyotp.random_base32()
        request.user.mfa_secret = secret
        request.user.save(update_fields=['mfa_secret'])

        totp = pyotp.TOTP(secret)
        provisioning_uri = totp.provisioning_uri(
            name=request.user.email,
            issuer_name='KnowVault',
        )
        return Response({
            'secret': secret,
            'provisioning_uri': provisioning_uri,
        })

    def delete(self, request):
        """Disable MFA for the user."""
        request.user.mfa_enabled = False
        request.user.mfa_secret = None
        request.user.save(update_fields=['mfa_enabled', 'mfa_secret'])
        return Response({'detail': 'MFA disabled.'}, status=status.HTTP_200_OK)


class MFAVerifyView(APIView):
    def post(self, request):
        """Verify a TOTP code and enable MFA."""
        code = request.data.get('code', '')
        user = request.user

        if not user.mfa_secret:
            return Response(
                {'detail': 'MFA setup not initiated. Call setup endpoint first.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        totp = pyotp.TOTP(user.mfa_secret)
        if not totp.verify(code, valid_window=1):
            return Response(
                {'detail': 'Invalid verification code.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.mfa_enabled = True
        user.save(update_fields=['mfa_enabled'])

        # Generate backup codes
        backup_codes = [secrets.token_hex(4).upper() for _ in range(8)]

        return Response({
            'detail': 'MFA enabled successfully.',
            'backup_codes': backup_codes,
        }, status=status.HTTP_200_OK)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Always return success to prevent email enumeration
        return Response({
            'detail': 'If an account with that email exists, a password reset link has been sent.',
        }, status=status.HTTP_200_OK)
