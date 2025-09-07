@echo off
echo Installing Mental Health Support System...
echo.

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b %errorlevel%
)

echo.
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b %errorlevel%
)

cd ..
echo.
echo Installation complete!
echo.
echo Next steps:
echo 1. Copy .env.example to .env and configure your Descope settings
echo 2. Copy backend/.env.example to backend/.env and configure your backend settings
echo 3. Run 'npm run dev' to start both servers
echo.
pause
