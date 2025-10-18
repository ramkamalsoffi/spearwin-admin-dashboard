# 🔧 Fix Backend 500 Internal Server Error

## 🚨 **Current Issue**
Your backend is returning a 500 Internal Server Error when calling `/locations/countries`. This means there's a bug in your backend code.

## 🔍 **How to Debug the 500 Error**

### **1. Check Your Backend Logs**
Look at your backend console/terminal for the exact error message. The 500 error should show:
- Stack trace
- Error details
- Which line is causing the issue

### **2. Common Causes of 500 Errors**

#### **A. Database Connection Issues**
```typescript
// Check if your database is connected
// Look for errors like:
// - "Connection refused"
// - "Database not found"
// - "Authentication failed"
```

#### **B. Missing Dependencies**
```typescript
// Check if you have all required packages installed
// Common missing packages:
// - @nestjs/typeorm
// - typeorm
// - pg (for PostgreSQL)
// - mysql2 (for MySQL)
```

#### **C. Environment Variables**
```typescript
// Check your .env file has:
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
PORT=5001
```

#### **D. Database Schema Issues**
```typescript
// Check if your countries table exists
// Check if the table has the right columns
// Check if there's data in the table
```

### **3. Quick Fixes to Try**

#### **Option 1: Add Error Handling to Countries Controller**
```typescript
@Get('countries')
async getCountries() {
  try {
    console.log('Fetching countries...');
    const countries = await this.locationService.getCountries();
    console.log('Countries fetched successfully:', countries.length);
    
    return {
      success: true,
      data: countries,
      message: 'Countries retrieved successfully'
    };
  } catch (error) {
    console.error('Countries service error:', error);
    return {
      success: false,
      message: 'Failed to retrieve countries',
      error: error.message
    };
  }
}
```

#### **Option 2: Check Database Connection**
```typescript
// Add this to your app startup to test database connection
async onModuleInit() {
  try {
    await this.dataSource.initialize();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}
```

#### **Option 3: Test Database Query Directly**
```typescript
// In your countries service, add logging:
async getCountries() {
  try {
    console.log('Starting getCountries...');
    
    // Test database connection
    const connection = this.dataSource;
    console.log('Database connection status:', connection.isInitialized);
    
    // Test query
    const countries = await this.countryRepository.find();
    console.log('Countries found:', countries.length);
    
    return countries;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
```

### **4. Test Your Backend Directly**

#### **Test with curl:**
```bash
# Test the endpoint
curl -v http://localhost:5001/locations/countries

# Check if other endpoints work
curl http://localhost:5001/
```

#### **Test with Postman:**
1. Open Postman
2. Create new request
3. Set method to GET
4. URL: `http://localhost:5001/locations/countries`
5. Send request
6. Check the response and error details

### **5. Check Your Database**

#### **If using PostgreSQL:**
```sql
-- Check if countries table exists
SELECT * FROM information_schema.tables WHERE table_name = 'countries';

-- Check if table has data
SELECT COUNT(*) FROM countries;

-- Check table structure
\d countries;
```

#### **If using MySQL:**
```sql
-- Check if countries table exists
SHOW TABLES LIKE 'countries';

-- Check if table has data
SELECT COUNT(*) FROM countries;

-- Check table structure
DESCRIBE countries;
```

### **6. Common Error Patterns**

#### **TypeError: Cannot read property 'find' of undefined**
```typescript
// Fix: Make sure repository is properly injected
constructor(
  @InjectRepository(Country)
  private countryRepository: Repository<Country>,
) {}
```

#### **Connection refused**
```typescript
// Fix: Check database connection string
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

#### **Table 'countries' doesn't exist**
```typescript
// Fix: Run database migrations
npm run migration:run
```

#### **JWT_SECRET is not defined**
```typescript
// Fix: Add to .env file
JWT_SECRET=your-secret-key-here
```

## 🎯 **Next Steps**

1. **Check your backend logs** for the exact error message
2. **Try the quick fixes** above
3. **Test the endpoint** directly with curl/Postman
4. **Check your database** connection and data
5. **Share the error details** with me so I can help you fix it

## 📞 **Need Help?**

Share your backend error logs with me, and I'll help you fix the specific issue!

Common error patterns:
- `TypeError: Cannot read property 'find' of undefined` → Repository injection issue
- `Connection refused` → Database connection problem
- `Table 'countries' doesn't exist` → Database schema issue
- `JWT_SECRET is not defined` → Environment variable missing
