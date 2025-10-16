# API Integration Setup

## Overview
The AddJob component has been updated to use TanStack Query with the real API endpoint `api/admin/jobs`.

## Files Created/Modified

### New Files:
- `src/services/api.ts` - Axios configuration with auth interceptors
- `src/services/jobsApi.ts` - Jobs API service functions
- `src/hooks/useJobs.ts` - TanStack Query hooks for job operations
- `src/lib/queryClient.ts` - TanStack Query client configuration

### Modified Files:
- `src/App.tsx` - Added QueryClientProvider wrapper
- `src/pages/AddJob.tsx` - Integrated with TanStack Query for job creation

## API Endpoint Configuration

The integration expects your backend API to be available at:
- **Endpoint**: `POST /api/admin/jobs`
- **Base URL**: Configured via `VITE_API_URL` environment variable
- **Default**: `http://localhost:3000` (without /api)

## Environment Setup

Create a `.env` file in your project root:

```bash
# .env
VITE_API_URL=http://localhost:3000
```

## Request Format

The API expects the following request body:

```typescript
{
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  jobDescription: string;
  status: "Active" | "Pending" | "Inactive";
}
```

## Features Implemented

### AddJob Component:
- ✅ **Real API Integration** - Calls `POST /api/admin/jobs`
- ✅ **Form Validation** - Ensures all fields are filled
- ✅ **Loading States** - Shows spinner during API call
- ✅ **Error Handling** - Displays user-friendly error messages
- ✅ **Success Handling** - Redirects to jobs page after successful creation
- ✅ **Form Reset** - Clears form after successful submission

### Authentication:
- ✅ **Auto Token Inclusion** - Automatically includes auth token from localStorage
- ✅ **401 Handling** - Redirects to login on unauthorized access

## Usage

1. **Set up your backend** with the `/api/admin/jobs` endpoint
2. **Configure the API URL** in your `.env` file
3. **Ensure authentication** - Store auth token in localStorage with key 'authToken'
4. **Test the integration** - Create jobs through the form

## How It Works

1. User fills out the job form
2. On submit, the form validates all required fields
3. TanStack Query mutation calls the API endpoint
4. Loading state is shown during the API call
5. On success: form resets and redirects to jobs page
6. On error: displays error message to user

The integration is now complete and ready to work with your NestJS backend!
