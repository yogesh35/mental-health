# PowerShell script to set up MySQL database for Resource Hub
# Run this script from the project root directory

Write-Host "🗄️  MySQL Database Setup for Resource Hub" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check if MySQL is accessible
Write-Host "`n🔍 Checking MySQL installation..." -ForegroundColor Yellow

try {
    $mysqlVersion = mysql --version 2>$null
    if ($mysqlVersion) {
        Write-Host "✅ MySQL found: $mysqlVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ MySQL command not found in PATH" -ForegroundColor Red
        Write-Host "Please make sure MySQL is installed and added to your PATH" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error checking MySQL: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Get MySQL credentials
Write-Host "`n🔐 Please enter your MySQL credentials:" -ForegroundColor Yellow
$username = Read-Host "MySQL username (default: root)"
if ([string]::IsNullOrEmpty($username)) {
    $username = "root"
}

$password = Read-Host "MySQL password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# Test MySQL connection
Write-Host "`n🔌 Testing MySQL connection..." -ForegroundColor Yellow

$testConnection = "SELECT 1;" | mysql -u $username -p$passwordPlain 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MySQL connection successful!" -ForegroundColor Green
} else {
    Write-Host "❌ MySQL connection failed. Please check your credentials." -ForegroundColor Red
    exit 1
}

# Run the database setup script
Write-Host "`n🏗️  Setting up database and tables..." -ForegroundColor Yellow

$scriptPath = "backend\scripts\setup_database.sql"
if (Test-Path $scriptPath) {
    try {
        Get-Content $scriptPath | mysql -u $username -p$passwordPlain
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database setup completed successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Database setup failed!" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "❌ Error running setup script: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Setup script not found: $scriptPath" -ForegroundColor Red
    exit 1
}

# Update .env file
Write-Host "`n⚙️  Updating .env configuration..." -ForegroundColor Yellow

$envFile = ".env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $newEnvContent = @()
    
    foreach ($line in $envContent) {
        if ($line -match "^DB_USER=") {
            $newEnvContent += "DB_USER=$username"
        } elseif ($line -match "^DB_PASSWORD=") {
            $newEnvContent += "DB_PASSWORD=$passwordPlain"
        } elseif ($line -match "^DB_TYPE=") {
            $newEnvContent += "DB_TYPE=mysql"
        } else {
            $newEnvContent += $line
        }
    }
    
    $newEnvContent | Set-Content $envFile
    Write-Host "✅ .env file updated with MySQL configuration" -ForegroundColor Green
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
}

Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host "✅ Database: mental_health_resources created" -ForegroundColor Green
Write-Host "✅ Tables: categories, tags, resources, resource_tags, user_interactions" -ForegroundColor Green
Write-Host "✅ Sample categories and tags inserted" -ForegroundColor Green
Write-Host "✅ .env file configured for MySQL" -ForegroundColor Green
Write-Host "`n🚀 You can now restart your backend server to use MySQL!" -ForegroundColor Cyan
Write-Host "   Run: cd backend && node server.js" -ForegroundColor Cyan