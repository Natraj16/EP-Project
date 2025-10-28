# Test Contact Form Email

Write-Host ""
Write-Host "Contact Form Email Test" -ForegroundColor Cyan
Write-Host ""

# Check if server is running
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -ErrorAction Stop
    Write-Host "Server is running" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Server is not running!" -ForegroundColor Red
    Write-Host "Please start the server first: cd server && npm start" -ForegroundColor Yellow
    Write-Host ""
    exit
}

Write-Host "Testing Contact Form Endpoint..." -ForegroundColor Yellow
Write-Host ""

# Test contact form submission
$contactData = @{
    name = "John Doe"
    email = "john.doe@example.com"
    phone = "+1 (555) 123-4567"
    company = "ABC Construction Company"
    subject = "Inquiry about Infrastructure Services"
    message = "Hello! I am interested in learning more about your infrastructure services for our upcoming commercial project. Please contact me at your earliest convenience. Best regards, John Doe"
} | ConvertTo-Json

try {
    Write-Host "Sending contact form..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/contact" `
        -Method Post `
        -Body $contactData `
        -ContentType "application/json"
    
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host "  Message: $($response.message)" -ForegroundColor White
    Write-Host ""
    Write-Host "Emails should be sent to:" -ForegroundColor Yellow
    Write-Host "  1. office@pjinfra.com (main notification)" -ForegroundColor White
    Write-Host "  2. john.doe@example.com (user confirmation)" -ForegroundColor White
    Write-Host ""
    Write-Host "Note: Email delivery depends on SMTP configuration" -ForegroundColor Yellow
    Write-Host "Check server/.env and configure SMTP settings" -ForegroundColor Gray
    
} catch {
    Write-Host "FAILED!" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd() | ConvertFrom-Json
        
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        Write-Host "Error: $($responseBody.message)" -ForegroundColor Red
        
        if ($responseBody.error) {
            Write-Host "Details: $($responseBody.error)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Make sure SMTP settings are configured in server/.env" -ForegroundColor White
    Write-Host "  2. For Gmail use App Password not regular password" -ForegroundColor White
    Write-Host "  3. Check server/EMAIL_SETUP_GUIDE.md for detailed setup" -ForegroundColor White
}

Write-Host ""
