# Backend Integration Fix

## Problem
The frontend was sending data in a different format than what the backend DTO expected, causing a 404 error.

## Backend DTO Structure
The backend expects these fields:
- `title` (not `jobTitle`)
- `description` (not `jobDescription`) 
- `companyId` (not `companyName`)
- `jobType` with enum values: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `FREELANCE`
- `workMode` with enum values: `REMOTE`, `ONSITE`, `HYBRID`
- `experienceLevel` with enum values: `ENTRY_LEVEL`, `MID_LEVEL`, `SENIOR_LEVEL`, `EXECUTIVE`
- `status` with enum values: `DRAFT`, `PUBLISHED`, `CLOSED`, `ARCHIVED`

## Changes Made

### 1. Updated DTO Interface (`src/services/jobsApi.ts`)
```typescript
export interface CreateJobDto {
  title: string;
  description: string;
  companyId: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  workMode: 'REMOTE' | 'ONSITE' | 'HYBRID';
  experienceLevel: 'ENTRY_LEVEL' | 'MID_LEVEL' | 'SENIOR_LEVEL' | 'EXECUTIVE';
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
}
```

### 2. Updated Form Fields (`src/pages/AddJob.tsx`)
- Changed `jobTitle` → `title`
- Changed `jobDescription` → `description`
- Changed `companyName` → `companyId`
- Added `workMode` field
- Added `experienceLevel` field
- Updated enum values to match backend

### 3. Updated Form Validation
- Updated validation to check for required fields
- Updated form reset to use new field names

## New Form Structure

The form now includes:
1. **Job Title** (`title`) - Text input
2. **Company ID** (`companyId`) - Text input
3. **Job Type** (`jobType`) - Select with backend enum values
4. **Work Mode** (`workMode`) - Select with backend enum values
5. **Experience Level** (`experienceLevel`) - Select with backend enum values
6. **Status** (`status`) - Select with backend enum values (optional)
7. **Job Description** (`description`) - Textarea

## API Endpoint
- **URL**: `POST http://localhost:5173/api/admin/jobs`
- **Content-Type**: `application/json`
- **Authentication**: Bearer token in Authorization header

## Testing
1. Fill out the form with all required fields
2. Submit the form
3. Check browser console for debug logs
4. Verify the API call is made to the correct endpoint
5. Check that the data format matches the backend DTO

## Expected Request Body
```json
{
  "title": "Software Engineer",
  "description": "Job description here...",
  "companyId": "company-123",
  "jobType": "FULL_TIME",
  "workMode": "REMOTE",
  "experienceLevel": "MID_LEVEL",
  "status": "DRAFT"
}
```

The integration should now work correctly with your NestJS backend!
