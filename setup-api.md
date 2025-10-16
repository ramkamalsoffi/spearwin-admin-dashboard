# 🚀 API Setup Guide

## Quick Start - Mock API Server

I've created a mock API server to test the company management functionality. Here's how to set it up:

### 1. Install Dependencies

```bash
npm install express cors
```

### 2. Start the Mock API Server

```bash
# In one terminal window
npm run api
```

This will start the mock API server on `http://localhost:5000`

### 3. Start the Frontend

```bash
# In another terminal window
npm run dev
```

This will start the React frontend on `http://localhost:3001`

### 4. Test the API

Visit `http://localhost:5000/api/health` to verify the API is running.

## 📋 Available API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | Get all companies |
| GET | `/api/companies/:id` | Get company by ID |
| POST | `/api/companies` | Create new company (ADMIN+) |
| PUT | `/api/companies/:id` | Update company |
| DELETE | `/api/companies/:id` | Delete company |
| PATCH | `/api/companies/:id/status` | Update company status |
| GET | `/api/health` | Health check |

## 🔧 API Features

- ✅ Full CRUD operations for companies
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled
- ✅ JSON responses
- ✅ Mock data included

## 🎯 Testing the Frontend

1. Open `http://localhost:3001`
2. Navigate to Companies page
3. Click "Add Company" button
4. Fill out the form and submit
5. The company should appear in the list

## 🔄 Next Steps

This mock server is for development/testing only. For production, you'll need to:

1. **Choose a Backend Framework**: Node.js/Express, Python/Django, Java/Spring Boot, etc.
2. **Set up Database**: PostgreSQL, MongoDB, MySQL, etc.
3. **Implement Authentication**: JWT, OAuth, etc.
4. **Deploy Backend**: AWS, Heroku, DigitalOcean, etc.

## 🛠️ Alternative Solutions

### Option 2: Use JSON Server (Even Simpler)

```bash
npm install -g json-server
```

Create `db.json`:
```json
{
  "companies": [
    {
      "id": 1,
      "companyName": "Spearwin Pvt. Ltd.",
      "industry": "Technology",
      "location": "Bangalore, IN",
      "status": "ACTIVE"
    }
  ]
}
```

Run: `json-server --watch db.json --port 5000`

### Option 3: Use a Backend-as-a-Service

- **Firebase**: Google's BaaS with real-time database
- **Supabase**: Open source Firebase alternative
- **Appwrite**: Self-hosted BaaS
- **AWS Amplify**: Full-stack development platform

## 📝 Notes

- The mock server stores data in memory (resets on restart)
- No authentication implemented (for development only)
- All endpoints return consistent JSON responses
- CORS is enabled for frontend communication

