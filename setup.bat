@echo off
echo ========================================
echo   KnowVault AI - Initial Setup
echo ========================================
echo.
echo Installing Python dependencies...
pip install -r requirements.txt
echo.
echo Running database migrations...
python manage.py migrate
echo.
echo Creating superuser...
echo Username: admin
echo Email: admin@knowvault.ai
echo Password: admin123
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@knowvault.ai', 'admin123')"
echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start the server, run: run.bat
echo Or: python manage.py runserver
echo.
echo Admin Panel: http://127.0.0.1:8000/admin
echo Username: admin
echo Password: admin123
echo.
pause
