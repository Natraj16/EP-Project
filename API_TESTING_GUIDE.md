### API Testing Examples - PowerShell & cURL

## Quick Start - Test All Endpoints

### 1. Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
```

### 2. Register a New User (Client)
```powershell
$registerBody = @{
    name = "Test Client"
    email = "client@example.com"
    password = "password123"
    role = "client"
    phone = "+1234567890"
    company = "Test Company"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method Post `
    -Body $registerBody `
    -ContentType "application/json"

# Save the token
$clientToken = $registerResponse.data.token
Write-Host "Client Token: $clientToken"
```

### 3. Register Admin User
```powershell
$adminBody = @{
    name = "Admin User"
    email = "admin@example.com"
    password = "admin123"
    role = "admin"
} | ConvertTo-Json

$adminResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method Post `
    -Body $adminBody `
    -ContentType "application/json"

$adminToken = $adminResponse.data.token
Write-Host "Admin Token: $adminToken"
```

### 4. Login User
```powershell
$loginBody = @{
    email = "client@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method Post `
    -Body $loginBody `
    -ContentType "application/json"

Write-Host "Login successful: $($loginResponse.data.user.name)"
```

### 5. Create a New Request (Client)
```powershell
$headers = @{
    "Authorization" = "Bearer $clientToken"
    "Content-Type" = "application/json"
}

$requestBody = @{
    title = "Electrical Wiring Installation"
    description = "Need complete electrical wiring for new office space"
    category = "electrical"
    priority = "high"
    budget = 5000
    deadline = "2025-11-15"
    location = "123 Main Street, Office Building"
} | ConvertTo-Json

$newRequest = Invoke-RestMethod -Uri "http://localhost:5000/api/requests" `
    -Method Post `
    -Headers $headers `
    -Body $requestBody

Write-Host "Request created: $($newRequest.data._id)"
$requestId = $newRequest.data._id
```

### 6. Get All Requests (Client)
```powershell
$headers = @{
    "Authorization" = "Bearer $clientToken"
}

$requests = Invoke-RestMethod -Uri "http://localhost:5000/api/requests" `
    -Method Get `
    -Headers $headers

Write-Host "Total requests: $($requests.count)"
$requests.data | Format-Table title, category, status, priority
```

### 7. Get Single Request by ID
```powershell
$headers = @{
    "Authorization" = "Bearer $clientToken"
}

$request = Invoke-RestMethod -Uri "http://localhost:5000/api/requests/$requestId" `
    -Method Get `
    -Headers $headers

Write-Host "Request Details:"
$request.data | Format-List
```

### 8. Update Request (Client)
```powershell
$headers = @{
    "Authorization" = "Bearer $clientToken"
    "Content-Type" = "application/json"
}

$updateBody = @{
    priority = "urgent"
    budget = 6000
    description = "URGENT: Need complete electrical wiring for new office space ASAP"
} | ConvertTo-Json

$updated = Invoke-RestMethod -Uri "http://localhost:5000/api/requests/$requestId" `
    -Method Put `
    -Headers $headers `
    -Body $updateBody

Write-Host "Request updated successfully"
```

### 9. Add Comment to Request
```powershell
$headers = @{
    "Authorization" = "Bearer $clientToken"
    "Content-Type" = "application/json"
}

$commentBody = @{
    text = "Please contact me before starting the work. Available Mon-Fri 9AM-5PM."
} | ConvertTo-Json

$commented = Invoke-RestMethod -Uri "http://localhost:5000/api/requests/$requestId/comments" `
    -Method Post `
    -Headers $headers `
    -Body $commentBody

Write-Host "Comment added successfully"
```

### 10. Get Current User Profile
```powershell
$headers = @{
    "Authorization" = "Bearer $clientToken"
}

$profile = Invoke-RestMethod -Uri "http://localhost:5000/api/users/profile" `
    -Method Get `
    -Headers $headers

Write-Host "User Profile:"
$profile.data | Format-List
```

### 11. Update User Profile
```powershell
$headers = @{
    "Authorization" = "Bearer $clientToken"
    "Content-Type" = "application/json"
}

$profileUpdate = @{
    name = "Updated Client Name"
    phone = "+9876543210"
    company = "Updated Company Inc"
} | ConvertTo-Json

$updatedProfile = Invoke-RestMethod -Uri "http://localhost:5000/api/users/$($loginResponse.data.user._id)" `
    -Method Put `
    -Headers $headers `
    -Body $profileUpdate

Write-Host "Profile updated successfully"
```

### 12. Get All Users (Admin Only)
```powershell
$headers = @{
    "Authorization" = "Bearer $adminToken"
}

$users = Invoke-RestMethod -Uri "http://localhost:5000/api/users" `
    -Method Get `
    -Headers $headers

Write-Host "Total users: $($users.count)"
$users.data | Format-Table name, email, role, company
```

### 13. Filter Requests by Status (Admin)
```powershell
$headers = @{
    "Authorization" = "Bearer $adminToken"
}

$pendingRequests = Invoke-RestMethod -Uri "http://localhost:5000/api/requests?status=pending" `
    -Method Get `
    -Headers $headers

Write-Host "Pending requests: $($pendingRequests.count)"
```

### 14. Update Request Status (Admin Only)
```powershell
$headers = @{
    "Authorization" = "Bearer $adminToken"
    "Content-Type" = "application/json"
}

$statusUpdate = @{
    status = "in-progress"
} | ConvertTo-Json

$statusUpdated = Invoke-RestMethod -Uri "http://localhost:5000/api/requests/$requestId" `
    -Method Put `
    -Headers $headers `
    -Body $statusUpdate

Write-Host "Status updated to in-progress"
```

### 15. Verify Token
```powershell
$headers = @{
    "Authorization" = "Bearer $clientToken"
}

$verify = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/verify" `
    -Method Get `
    -Headers $headers

Write-Host "Token is valid for user: $($verify.data.user.name)"
```

---

## cURL Examples (for Linux/Mac or Git Bash)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "client"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Request (Replace TOKEN with your actual token)
```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "HVAC Repair",
    "description": "AC not working",
    "category": "hvac",
    "priority": "urgent",
    "budget": 3000
  }'
```

### Get All Requests
```bash
curl -X GET http://localhost:5000/api/requests \
  -H "Authorization: Bearer TOKEN"
```

---

## Complete Test Script

Save this as `test-api.ps1` and run it:

```powershell
# Complete API Test Script
Write-Host "`n=== EP Project API Testing ===" -ForegroundColor Cyan

# 1. Health Check
Write-Host "`n1. Testing Health Check..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:5000/api/health"
Write-Host "Status: $($health.status)" -ForegroundColor Green

# 2. Register Client
Write-Host "`n2. Registering Client..." -ForegroundColor Yellow
$clientReg = @{
    name = "John Doe"
    email = "john@test.com"
    password = "test123"
    role = "client"
    company = "ABC Corp"
} | ConvertTo-Json

try {
    $client = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $clientReg -ContentType "application/json"
    $clientToken = $client.data.token
    Write-Host "Client registered: $($client.data.user.name)" -ForegroundColor Green
} catch {
    # User might already exist, try login
    $loginData = @{ email = "john@test.com"; password = "test123" } | ConvertTo-Json
    $client = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    $clientToken = $client.data.token
    Write-Host "Client logged in: $($client.data.user.name)" -ForegroundColor Green
}

# 3. Create Request
Write-Host "`n3. Creating Request..." -ForegroundColor Yellow
$newReq = @{
    title = "Test Request $(Get-Date -Format 'HHmmss')"
    description = "This is a test request"
    category = "electrical"
    priority = "medium"
    budget = 2500
} | ConvertTo-Json

$headers = @{ "Authorization" = "Bearer $clientToken" }
$request = Invoke-RestMethod -Uri "http://localhost:5000/api/requests" -Method Post -Headers $headers -Body $newReq -ContentType "application/json"
Write-Host "Request created: $($request.data.title)" -ForegroundColor Green

# 4. Get All Requests
Write-Host "`n4. Fetching All Requests..." -ForegroundColor Yellow
$allReqs = Invoke-RestMethod -Uri "http://localhost:5000/api/requests" -Method Get -Headers $headers
Write-Host "Total requests: $($allReqs.count)" -ForegroundColor Green

# 5. Add Comment
Write-Host "`n5. Adding Comment..." -ForegroundColor Yellow
$comment = @{ text = "This is a test comment" } | ConvertTo-Json
$commented = Invoke-RestMethod -Uri "http://localhost:5000/api/requests/$($request.data._id)/comments" -Method Post -Headers $headers -Body $comment -ContentType "application/json"
Write-Host "Comment added successfully" -ForegroundColor Green

Write-Host "`n=== All Tests Completed! ===" -ForegroundColor Cyan
```
