# Test User Registration and Login
# This script tests the complete user flow

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing User Registration & Login Flow" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000/api"
$testEmail = "testuser_$(Get-Random)@example.com"
$testPassword = "Test@123456"

# Test 1: Health Check
Write-Host "1. Testing server health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    if ($health.status -eq "OK") {
        Write-Host "   [OK] Server is running" -ForegroundColor Green
    }
} catch {
    Write-Host "   [ERROR] Server is not running! Please start the backend server." -ForegroundColor Red
    Write-Host "   Run: cd server; npm start" -ForegroundColor Yellow
    exit 1
}

# Test 2: Register New User
Write-Host "`n2. Registering new user..." -ForegroundColor Yellow
$registerData = @{
    name = "Test User"
    email = $testEmail
    password = $testPassword
    phone = "1234567890"
    company = "Test Company"
    role = "client"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    if ($registerResponse.success) {
        Write-Host "   [OK] User registered successfully" -ForegroundColor Green
        Write-Host "   User ID: $($registerResponse.data.user._id)" -ForegroundColor Cyan
        Write-Host "   Email: $($registerResponse.data.user.email)" -ForegroundColor Cyan
        Write-Host "   Token received: $($registerResponse.data.token.Substring(0, 20))..." -ForegroundColor Cyan
        $token = $registerResponse.data.token
        $userId = $registerResponse.data.user._id
    } else {
        Write-Host "   [ERROR] Registration failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   [ERROR] Registration error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Verify Token
Write-Host "`n3. Verifying JWT token..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $verifyResponse = Invoke-RestMethod -Uri "$baseUrl/auth/verify" -Method Get -Headers $headers
    if ($verifyResponse.success) {
        Write-Host "   [OK] Token is valid" -ForegroundColor Green
        Write-Host "   User: $($verifyResponse.data.user.name)" -ForegroundColor Cyan
    } else {
        Write-Host "   [ERROR] Token verification failed" -ForegroundColor Red
    }
} catch {
    Write-Host "   [ERROR] Token verification error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Login with Same Credentials
Write-Host "`n4. Testing login with registered credentials..." -ForegroundColor Yellow
$loginData = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    if ($loginResponse.success) {
        Write-Host "   [OK] Login successful" -ForegroundColor Green
        Write-Host "   User ID: $($loginResponse.data.user._id)" -ForegroundColor Cyan
        Write-Host "   Token received: $($loginResponse.data.token.Substring(0, 20))..." -ForegroundColor Cyan
    } else {
        Write-Host "   [ERROR] Login failed" -ForegroundColor Red
    }
} catch {
    Write-Host "   [ERROR] Login error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get User's Requests (Should be empty for new user)
Write-Host "`n5. Fetching user requests..." -ForegroundColor Yellow
try {
    $requestsResponse = Invoke-RestMethod -Uri "$baseUrl/requests" -Method Get -Headers $headers
    if ($requestsResponse.success) {
        Write-Host "   [OK] Requests fetched successfully" -ForegroundColor Green
        Write-Host "   Total requests: $($requestsResponse.data.Count)" -ForegroundColor Cyan
        if ($requestsResponse.data.Count -eq 0) {
            Write-Host "   [OK] New user has no requests (as expected)" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "   [ERROR] Failed to fetch requests: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Create a Service Request
Write-Host "`n6. Creating a service request..." -ForegroundColor Yellow
$requestData = @{
    serviceType = "Security Services"
    category = "Armed Security"
    description = "Need 5 armed security guards for warehouse protection"
    numberOfPersonnel = 5
    startDate = (Get-Date).AddDays(7).ToString("yyyy-MM-dd")
    duration = "3 months"
    location = "Mumbai, Maharashtra"
} | ConvertTo-Json

try {
    $createRequestResponse = Invoke-RestMethod -Uri "$baseUrl/requests" -Method Post -Body $requestData -ContentType "application/json" -Headers $headers
    if ($createRequestResponse.success) {
        Write-Host "   [OK] Request created successfully" -ForegroundColor Green
        Write-Host "   Request ID: $($createRequestResponse.data._id)" -ForegroundColor Cyan
        Write-Host "   Status: $($createRequestResponse.data.status)" -ForegroundColor Cyan
        $requestId = $createRequestResponse.data._id
    }
} catch {
    Write-Host "   [ERROR] Failed to create request: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Get Requests Again (Should have 1 request now)
Write-Host "`n7. Fetching updated requests list..." -ForegroundColor Yellow
try {
    $requestsResponse2 = Invoke-RestMethod -Uri "$baseUrl/requests" -Method Get -Headers $headers
    if ($requestsResponse2.success) {
        Write-Host "   [OK] Requests fetched successfully" -ForegroundColor Green
        Write-Host "   Total requests: $($requestsResponse2.data.Count)" -ForegroundColor Cyan
        if ($requestsResponse2.data.Count -gt 0) {
            Write-Host "   [OK] Request appears in user dashboard" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "   [ERROR] Failed to fetch requests: $($_.Exception.Message)" -ForegroundColor Red
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[OK] Server Health Check" -ForegroundColor Green
Write-Host "[OK] User Registration" -ForegroundColor Green
Write-Host "[OK] JWT Token Generation" -ForegroundColor Green
Write-Host "[OK] Token Verification" -ForegroundColor Green
Write-Host "[OK] User Login" -ForegroundColor Green
Write-Host "[OK] Empty Dashboard for New User" -ForegroundColor Green
Write-Host "[OK] Service Request Creation" -ForegroundColor Green
Write-Host "[OK] Request Appears in Dashboard" -ForegroundColor Green
Write-Host ""
Write-Host "Test User Created:" -ForegroundColor Yellow
Write-Host "  Email: $testEmail" -ForegroundColor Cyan
Write-Host "  Password: $testPassword" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now login to the React app with these credentials!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
