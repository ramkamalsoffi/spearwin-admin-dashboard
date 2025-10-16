# Setup Guide for API Integration

## Current Configuration
- **Frontend**: Running on port 5173 (Vite dev server)
- **Backend API**: Running on port 5173
- **API Endpoint**: `POST http://localhost:5173/api/admin/jobs`

## Setup Steps

### 1. Create Environment File
Create a `.env` file in your project root with:
```bash
VITE_API_URL=http://localhost:5173/
```

### 2. Verify Backend API
Make sure your NestJS backend is running on port 5173 and has the endpoint:
```typescript
@Post('jobs')
@UseGuards(JwtAuthGuard)
@HttpCode(HttpStatus.CREATED)
async createJob(
  @Body(ValidationPipe) createJobDto: CreateJobDto,
  @GetCurrentUser() user: CurrentUser,
) {
  return this.adminService.createJob(createJobDto, user);
}
```

### 3. CORS Configuration
Make sure your NestJS backend has CORS enabled for localhost:5173:
```typescript
// In your main.ts or app.module.ts
app.enableCors({
  origin: ['http://localhost:5173'],
  credentials: true,
});
```

### 4. Authentication
Make sure you have an auth token stored in localStorage:
```javascript
localStorage.setItem('authToken', 'your-jwt-token-here');
```

## Testing the Integration

1. **Start your backend** on port 5173
2. **Start your frontend** on port 5173
3. **Open browser console** to see debug logs
4. **Fill out the Add Job form** and submit
5. **Check console** for API calls and responses

## Debug Information

The integration includes debug logs that will show:
- API Base URL: `http://localhost:5173/`
- Job data being sent
- Full API URL: `http://localhost:5173/api/admin/jobs`
- Success/error responses

## Common Issues

### CORS Error
If you see CORS errors, make sure your backend has CORS configured for localhost:5173

### 401 Unauthorized
Make sure you have a valid auth token in localStorage

### Network Error
Check that your backend is running on port 5173

### 404 Not Found
Verify the API endpoint is `/api/admin/jobs` (not `/admin/jobs`)

## Expected Flow

1. User fills form → 2. API call to `http://localhost:5173/api/admin/jobs` → 3. Success → 4. Redirect to jobs page
