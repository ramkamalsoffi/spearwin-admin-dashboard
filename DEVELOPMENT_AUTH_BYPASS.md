# 🔧 Development Authentication Bypass

## Current Issue
Your backend requires authentication but doesn't have login endpoints set up yet.

## Quick Solutions

### Option 1: Backend - Disable Authentication Temporarily

Add this to your backend companies controller:

```typescript
@Post('companies')
// @UseGuards(JwtAuthGuard) // Comment this out temporarily
async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
  return await this.companyService.createCompany(createCompanyDto);
}

@Get('companies')
// @UseGuards(JwtAuthGuard) // Comment this out temporarily  
async getCompanies() {
  return await this.companyService.findAll();
}
```

### Option 2: Backend - Add Mock Authentication

Add this to your backend:

```typescript
@Post('auth/login')
async mockLogin(@Body() loginDto: { email: string; password: string }) {
  // Accept any email/password for development
  return {
    accessToken: 'dev-token-12345',
    user: {
      id: '1',
      email: loginDto.email,
      role: 'ADMIN'
    }
  };
}
```

### Option 3: Frontend - Use Development Mode

The frontend is already configured with mock authentication for development mode.

## Test Credentials (when auth is set up)
- Email: `admin@test.com`
- Password: `password123`
