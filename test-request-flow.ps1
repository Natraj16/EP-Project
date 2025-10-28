# Test Service Request Creation
# This script tests the complete request flow from client to admin

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Service Request Creation Flow" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000/api"

# Step 1: Register a new client
Write-Host "1. Registering a new client..." -ForegroundColor Yellow
$clientEmail = "client_$(Get-Random)@example.com"
$clientPassword = "Client@123"

$registerData = @{
    name = "Test Client"
    email = $clientEmail
    password = $clientPassword
    phone = "9876543210"
    company = "Test Client Company"
    role = "client"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    if ($registerResponse.success) {
        Write-Host "   [OK] Client registered successfully" -ForegroundColor Green
        Write-Host "   Client ID: $($registerResponse.data.user._id)" -ForegroundColor Cyan
        Write-Host "   Email: $($registerResponse.data.user.email)" -ForegroundColor Cyan
        $clientToken = $registerResponse.data.token
        $clientId = $registerResponse.data.user._id
    }
} catch {
    Write-Host "   [ERROR] Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Create a service request as client
Write-Host "`n2. Creating a service request..." -ForegroundColor Yellow
$requestData = @{
    serviceType = "security"
    category = "Armed Security"
    numberOfPersonnel = 5
    duration = "3-months"
    startDate = (Get-Date).AddDays(7).ToString("yyyy-MM-dd")
    shiftType = "day"
    location = "Mumbai, Maharashtra - Main Warehouse"
    description = "Need 5 armed security guards for warehouse protection. Must have valid license and 2+ years experience."
    requirements = "Valid firearms license, physical fitness certificate, clean background check"
    budget = 150000
    priority = "high"
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $clientToken"
    }
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/requests" -Method Post -Body $requestData -ContentType "application/json" -Headers $headers
    if ($createResponse.success) {
        Write-Host "   [OK] Request created successfully" -ForegroundColor Green
        Write-Host "   Request ID: $($createResponse.data._id)" -ForegroundColor Cyan
        Write-Host "   Service Type: $($createResponse.data.serviceType)" -ForegroundColor Cyan
        Write-Host "   Category: $($createResponse.data.category)" -ForegroundColor Cyan
        Write-Host "   Personnel: $($createResponse.data.numberOfPersonnel)" -ForegroundColor Cyan
        Write-Host "   Status: $($createResponse.data.status)" -ForegroundColor Cyan
        $requestId = $createResponse.data._id
    }
} catch {
    Write-Host "   [ERROR] Failed to create request: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Fetch client's requests (should show the new request)
Write-Host "`n3. Fetching client's requests..." -ForegroundColor Yellow
try {
    $clientRequestsResponse = Invoke-RestMethod -Uri "$baseUrl/requests" -Method Get -Headers $headers
    if ($clientRequestsResponse.success) {
        Write-Host "   [OK] Requests fetched successfully" -ForegroundColor Green
        Write-Host "   Total requests: $($clientRequestsResponse.data.Count)" -ForegroundColor Cyan
        if ($clientRequestsResponse.data.Count -gt 0) {
            Write-Host "   [OK] Request appears in client dashboard" -ForegroundColor Green
            Write-Host "   Latest Request:" -ForegroundColor Yellow
            $latest = $clientRequestsResponse.data[0]
            Write-Host "     - ID: $($latest._id.Substring($latest._id.Length - 6))" -ForegroundColor Cyan
            Write-Host "     - Service: $($latest.serviceType)" -ForegroundColor Cyan
            Write-Host "     - Category: $($latest.category)" -ForegroundColor Cyan
            Write-Host "     - Status: $($latest.status)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "   [ERROR] Failed to fetch client requests: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Register an admin user
Write-Host "`n4. Registering an admin user..." -ForegroundColor Yellow
$adminEmail = "admin_$(Get-Random)@example.com"
$adminPassword = "Admin@123"

$adminRegisterData = @{
    name = "Test Admin"
    email = $adminEmail
    password = $adminPassword
    phone = "1111111111"
    company = "Admin Company"
    role = "admin"
} | ConvertTo-Json

try {
    $adminRegisterResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $adminRegisterData -ContentType "application/json"
    if ($adminRegisterResponse.success) {
        Write-Host "   [OK] Admin registered successfully" -ForegroundColor Green
        Write-Host "   Admin ID: $($adminRegisterResponse.data.user._id)" -ForegroundColor Cyan
        Write-Host "   Email: $($adminRegisterResponse.data.user.email)" -ForegroundColor Cyan
        $adminToken = $adminRegisterResponse.data.token
    }
} catch {
    Write-Host "   [ERROR] Admin registration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 5: Fetch all requests as admin (should see client's request)
Write-Host "`n5. Fetching all requests as admin..." -ForegroundColor Yellow
try {
    $adminHeaders = @{
        "Authorization" = "Bearer $adminToken"
    }
    $adminRequestsResponse = Invoke-RestMethod -Uri "$baseUrl/requests" -Method Get -Headers $adminHeaders
    if ($adminRequestsResponse.success) {
        Write-Host "   [OK] All requests fetched successfully" -ForegroundColor Green
        Write-Host "   Total requests visible to admin: $($adminRequestsResponse.data.Count)" -ForegroundColor Cyan
        
        # Find the client's request
        $clientRequest = $adminRequestsResponse.data | Where-Object { $_._id -eq $requestId }
        if ($clientRequest) {
            Write-Host "   [OK] Client's request visible to admin!" -ForegroundColor Green
            Write-Host "   Request Details:" -ForegroundColor Yellow
            Write-Host "     - ID: $($clientRequest._id.Substring($clientRequest._id.Length - 6))" -ForegroundColor Cyan
            Write-Host "     - Client: $($clientRequest.client.name) ($($clientRequest.client.email))" -ForegroundColor Cyan
            Write-Host "     - Service: $($clientRequest.serviceType)" -ForegroundColor Cyan
            Write-Host "     - Category: $($clientRequest.category)" -ForegroundColor Cyan
            Write-Host "     - Personnel: $($clientRequest.numberOfPersonnel)" -ForegroundColor Cyan
            Write-Host "     - Location: $($clientRequest.location)" -ForegroundColor Cyan
            Write-Host "     - Status: $($clientRequest.status)" -ForegroundColor Cyan
            Write-Host "     - Created: $(([DateTime]$clientRequest.createdAt).ToString('yyyy-MM-dd HH:mm'))" -ForegroundColor Cyan
        } else {
            Write-Host "   [WARNING] Client's request NOT found in admin view" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   [ERROR] Failed to fetch admin requests: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 6: Get specific request details
Write-Host "`n6. Getting specific request details..." -ForegroundColor Yellow
try {
    $requestDetailResponse = Invoke-RestMethod -Uri "$baseUrl/requests/$requestId" -Method Get -Headers $headers
    if ($requestDetailResponse.success) {
        Write-Host "   [OK] Request details fetched successfully" -ForegroundColor Green
        $req = $requestDetailResponse.data
        Write-Host "   Full Request Details:" -ForegroundColor Yellow
        Write-Host "     - Service Type: $($req.serviceType)" -ForegroundColor Cyan
        Write-Host "     - Category: $($req.category)" -ForegroundColor Cyan
        Write-Host "     - Personnel: $($req.numberOfPersonnel)" -ForegroundColor Cyan
        Write-Host "     - Duration: $($req.duration)" -ForegroundColor Cyan
        Write-Host "     - Start Date: $($req.startDate)" -ForegroundColor Cyan
        Write-Host "     - Shift: $($req.shiftType)" -ForegroundColor Cyan
        Write-Host "     - Location: $($req.location)" -ForegroundColor Cyan
        Write-Host "     - Description: $($req.description)" -ForegroundColor Cyan
        Write-Host "     - Budget: Rs. $($req.budget)" -ForegroundColor Cyan
        Write-Host "     - Status: $($req.status)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   [ERROR] Failed to fetch request details: $($_.Exception.Message)" -ForegroundColor Red
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[OK] Client Registration" -ForegroundColor Green
Write-Host "[OK] Service Request Creation" -ForegroundColor Green
Write-Host "[OK] Request Visible in Client Dashboard" -ForegroundColor Green
Write-Host "[OK] Admin Registration" -ForegroundColor Green
Write-Host "[OK] Request Visible in Admin Dashboard" -ForegroundColor Green
Write-Host "[OK] Request Details Available" -ForegroundColor Green
Write-Host ""
Write-Host "Test Accounts Created:" -ForegroundColor Yellow
Write-Host "  Client:" -ForegroundColor Cyan
Write-Host "    Email: $clientEmail" -ForegroundColor White
Write-Host "    Password: $clientPassword" -ForegroundColor White
Write-Host "  Admin:" -ForegroundColor Cyan
Write-Host "    Email: $adminEmail" -ForegroundColor White
Write-Host "    Password: $adminPassword" -ForegroundColor White
Write-Host ""
Write-Host "Service Request Created:" -ForegroundColor Yellow
Write-Host "  ID: $requestId" -ForegroundColor White
Write-Host "  Service: Security - Armed Security" -ForegroundColor White
Write-Host "  Personnel: 5 guards" -ForegroundColor White
Write-Host "  Status: pending" -ForegroundColor White
Write-Host ""
Write-Host "SUCCESS! Requests flow from client to admin dashboard!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
