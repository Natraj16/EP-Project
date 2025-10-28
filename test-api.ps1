# Complete API Test Script
# Run this script to test all API endpoints

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  EP Project - API Testing Suite" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if server is running
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -ErrorAction Stop
    Write-Host "✅ Server is running" -ForegroundColor Green
    Write-Host "✅ Database: $($health.database)`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Server is not running!" -ForegroundColor Red
    Write-Host "Please start the server first: cd server && npm start`n" -ForegroundColor Yellow
    exit
}

# Test Results
$passed = 0
$failed = 0

# 1. Test Health Endpoint
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health"
    if ($health.status -eq "ok") {
        Write-Host "  ✅ PASSED - Server healthy" -ForegroundColor Green
        $passed++
    }
} catch {
    Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# 2. Test Register Client
Write-Host "`nTest 2: Register Client" -ForegroundColor Yellow
$clientEmail = "testclient_$(Get-Random)@example.com"
$clientData = @{
    name = "Test Client"
    email = $clientEmail
    password = "password123"
    role = "client"
    phone = "+1234567890"
    company = "Test Company"
} | ConvertTo-Json

try {
    $clientReg = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method Post -Body $clientData -ContentType "application/json"
    $clientToken = $clientReg.data.token
    $clientId = $clientReg.data.user._id
    Write-Host "  ✅ PASSED - Client registered: $($clientReg.data.user.name)" -ForegroundColor Green
    Write-Host "     Token: $($clientToken.Substring(0,20))..." -ForegroundColor Gray
    $passed++
} catch {
    Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
    exit
}

# 3. Test Login
Write-Host "`nTest 3: Login Client" -ForegroundColor Yellow
$loginData = @{
    email = $clientEmail
    password = "password123"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
        -Method Post -Body $loginData -ContentType "application/json"
    Write-Host "  ✅ PASSED - Login successful: $($login.data.user.name)" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# 4. Test Verify Token
Write-Host "`nTest 4: Verify Token" -ForegroundColor Yellow
$headers = @{ "Authorization" = "Bearer $clientToken" }
try {
    $verify = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/verify" `
        -Method Get -Headers $headers
    Write-Host "  ✅ PASSED - Token verified for: $($verify.data.user.name)" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# 5. Test Get User Profile
Write-Host "`nTest 5: Get User Profile" -ForegroundColor Yellow
try {
    $profile = Invoke-RestMethod -Uri "http://localhost:5000/api/users/profile" `
        -Method Get -Headers $headers
    Write-Host "  ✅ PASSED - Profile retrieved: $($profile.data.email)" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# 6. Test Create Request
Write-Host "`nTest 6: Create Request" -ForegroundColor Yellow
$requestData = @{
    title = "Test Electrical Work"
    description = "Need electrical wiring installation"
    category = "electrical"
    priority = "high"
    budget = 5000
    deadline = "2025-11-15"
    location = "123 Test Street"
} | ConvertTo-Json

try {
    $newRequest = Invoke-RestMethod -Uri "http://localhost:5000/api/requests" `
        -Method Post -Headers (@{ "Authorization" = "Bearer $clientToken"; "Content-Type" = "application/json" }) `
        -Body $requestData
    $requestId = $newRequest.data._id
    Write-Host "  ✅ PASSED - Request created: $($newRequest.data.title)" -ForegroundColor Green
    Write-Host "     ID: $requestId" -ForegroundColor Gray
    $passed++
} catch {
    Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# 7. Test Get All Requests
Write-Host "`nTest 7: Get All Requests" -ForegroundColor Yellow
try {
    $requests = Invoke-RestMethod -Uri "http://localhost:5000/api/requests" `
        -Method Get -Headers $headers
    Write-Host "  ✅ PASSED - Retrieved $($requests.count) request(s)" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# 8. Test Get Single Request
Write-Host "`nTest 8: Get Single Request" -ForegroundColor Yellow
try {
    $request = Invoke-RestMethod -Uri "http://localhost:5000/api/requests/$requestId" `
        -Method Get -Headers $headers
    Write-Host "  ✅ PASSED - Request retrieved: $($request.data.title)" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# 9. Test Update Request
Write-Host "`nTest 9: Update Request" -ForegroundColor Yellow
$updateData = @{
    priority = "urgent"
    budget = 6000
} | ConvertTo-Json

try {
    $updated = Invoke-RestMethod -Uri "http://localhost:5000/api/requests/$requestId" `
        -Method Put -Headers (@{ "Authorization" = "Bearer $clientToken"; "Content-Type" = "application/json" }) `
        -Body $updateData
    Write-Host "  ✅ PASSED - Request updated (priority: $($updated.data.priority))" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# 10. Test Add Comment
Write-Host "`nTest 10: Add Comment to Request" -ForegroundColor Yellow
$commentData = @{
    text = "This is a test comment from automated testing"
} | ConvertTo-Json

try {
    $commented = Invoke-RestMethod -Uri "http://localhost:5000/api/requests/$requestId/comments" `
        -Method Post -Headers (@{ "Authorization" = "Bearer $clientToken"; "Content-Type" = "application/json" }) `
        -Body $commentData
    Write-Host "  ✅ PASSED - Comment added successfully" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# 11. Test Update User Profile
Write-Host "`nTest 11: Update User Profile" -ForegroundColor Yellow
$profileUpdate = @{
    name = "Updated Test Client"
    phone = "+9876543210"
} | ConvertTo-Json

try {
    $updatedProfile = Invoke-RestMethod -Uri "http://localhost:5000/api/users/$clientId" `
        -Method Put -Headers (@{ "Authorization" = "Bearer $clientToken"; "Content-Type" = "application/json" }) `
        -Body $profileUpdate
    Write-Host "  ✅ PASSED - Profile updated: $($updatedProfile.data.name)" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# 12. Test Filter Requests by Category
Write-Host "`nTest 12: Filter Requests by Category" -ForegroundColor Yellow
try {
    $filtered = Invoke-RestMethod -Uri "http://localhost:5000/api/requests?category=electrical" `
        -Method Get -Headers $headers
    Write-Host "  ✅ PASSED - Filtered requests: $($filtered.count)" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "  ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Test Results Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Passed: $passed" -ForegroundColor Green
Write-Host "  ❌ Failed: $failed" -ForegroundColor $(if($failed -gt 0){"Red"}else{"Green"})
Write-Host "  📊 Total: $($passed + $failed)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host "🎉 All tests passed successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some tests failed. Please check the errors above." -ForegroundColor Yellow
}

# Display sample data created
Write-Host "`n📝 Sample Data Created:" -ForegroundColor Cyan
Write-Host "  Client Email: $clientEmail" -ForegroundColor Gray
Write-Host "  Client Password: password123" -ForegroundColor Gray
Write-Host "  Request ID: $requestId" -ForegroundColor Gray
Write-Host "`n"
