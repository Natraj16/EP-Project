# Test Database Connection Script
# This script checks if the backend server and MongoDB are properly connected

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  EP Project - Database Connection Test" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if MongoDB service is running
Write-Host "1. Checking MongoDB Service..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoService) {
    if ($mongoService.Status -eq 'Running') {
        Write-Host "   ✅ MongoDB Service is RUNNING" -ForegroundColor Green
    } else {
        Write-Host "   ❌ MongoDB Service is NOT RUNNING" -ForegroundColor Red
        Write-Host "   Starting MongoDB..." -ForegroundColor Yellow
        Start-Service -Name MongoDB
        Start-Sleep -Seconds 2
        Write-Host "   ✅ MongoDB Service STARTED" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ MongoDB Service NOT FOUND" -ForegroundColor Red
    Write-Host "   Please install MongoDB from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    exit
}

# Check if backend server is running
Write-Host "`n2. Checking Backend Server..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -ErrorAction Stop
    
    Write-Host "   ✅ Backend Server is RUNNING" -ForegroundColor Green
    Write-Host "   ✅ API is ACCESSIBLE" -ForegroundColor Green
    
    if ($response.database -eq "connected") {
        Write-Host "   ✅ Database is CONNECTED" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Database is NOT CONNECTED" -ForegroundColor Red
    }
    
    Write-Host "`n3. Server Response:" -ForegroundColor Yellow
    Write-Host "   Status: $($response.status)" -ForegroundColor Cyan
    Write-Host "   Message: $($response.message)" -ForegroundColor Cyan
    Write-Host "   Database: $($response.database)" -ForegroundColor Cyan
    Write-Host "   Timestamp: $($response.timestamp)" -ForegroundColor Cyan
    
} catch {
    Write-Host "   ❌ Backend Server is NOT RUNNING" -ForegroundColor Red
    Write-Host "`n   To start the server, run:" -ForegroundColor Yellow
    Write-Host "   cd server" -ForegroundColor Cyan
    Write-Host "   npm start" -ForegroundColor Cyan
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Connection Status Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($mongoService.Status -eq 'Running') {
    Write-Host "  MongoDB: ✅ Running" -ForegroundColor Green
} else {
    Write-Host "  MongoDB: ❌ Not Running" -ForegroundColor Red
}

try {
    $testConnection = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -ErrorAction SilentlyContinue
    Write-Host "  Backend: ✅ Running" -ForegroundColor Green
    if ($testConnection.database -eq "connected") {
        Write-Host "  Database Connection: ✅ Connected" -ForegroundColor Green
    }
} catch {
    Write-Host "  Backend: ❌ Not Running" -ForegroundColor Red
}

Write-Host "`n========================================`n" -ForegroundColor Cyan
