import express from 'express';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock authentication middleware
app.use((req, res, next) => {
  // Skip auth for login endpoint
  if (req.path === '/api/admin/login') {
    return next();
  }
  
  // For all other endpoints, check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      statusCode: 401
    });
  }
  
  // Mock token validation - accept any Bearer token
  next();
});

// Mock data
let companies = [
  {
    id: "1",
    name: "Spearwin Pvt. Ltd.",
    slug: "spearwin-pvt-ltd",
    description: "Leading technology company specializing in AI and machine learning solutions for enterprise clients.",
    website: "https://www.spearwin.com",
    logo: "https://cdn.example.com/logos/spearwin-logo.png",
    industry: "Technology",
    foundedYear: 2020,
    employeeCount: "51-100",
    headquarters: "Bangalore, IN",
    cityId: "city_12345678-1234-1234-1234-123456789012",
    address: "123 Tech Street, Suite 100, Bangalore, IN 560001",
    linkedinUrl: "https://linkedin.com/company/spearwin",
    twitterUrl: "https://twitter.com/spearwin",
    facebookUrl: "https://facebook.com/spearwin",
    isVerified: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "TechCorp Solutions",
    slug: "techcorp-solutions",
    description: "Innovative software development company focused on cloud solutions and digital transformation.",
    website: "https://www.techcorp.com",
    logo: "https://cdn.example.com/logos/techcorp-logo.png",
    industry: "Software",
    foundedYear: 2018,
    employeeCount: "101-500",
    headquarters: "Mumbai, IN",
    cityId: "city_87654321-4321-4321-4321-210987654321",
    address: "456 Business Avenue, Floor 5, Mumbai, IN 400001",
    linkedinUrl: "https://linkedin.com/company/techcorp",
    twitterUrl: "https://twitter.com/techcorp",
    facebookUrl: "https://facebook.com/techcorp",
    isVerified: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Routes

// GET /api/companies - Get all companies
app.get('/api/companies', (req, res) => {
  res.json({
    success: true,
    data: companies,
    message: 'Companies retrieved successfully'
  });
});

// GET /api/companies/:id - Get company by ID
app.get('/api/companies/:id', (req, res) => {
  const company = companies.find(c => c.id === req.params.id);
  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }
  res.json({
    success: true,
    data: company,
    message: 'Company retrieved successfully'
  });
});

// POST /api/companies - Create new company (ADMIN+)
app.post('/api/companies', (req, res) => {
  const { 
    name, slug, description, website, logo, industry, foundedYear, 
    employeeCount, headquarters, cityId, address, linkedinUrl, 
    twitterUrl, facebookUrl, isVerified, isActive 
  } = req.body;
  
  // Validation
  if (!name || !slug || !description || !website || !industry || !foundedYear || 
      !employeeCount || !headquarters || !cityId || !address) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
      errors: ['name', 'slug', 'description', 'website', 'industry', 'foundedYear', 'employeeCount', 'headquarters', 'cityId', 'address']
    });
  }

  // Check if company with same slug already exists
  const existingCompany = companies.find(c => c.slug === slug);
  if (existingCompany) {
    return res.status(409).json({
      success: false,
      message: 'Company with this slug already exists'
    });
  }

  const newCompany = {
    id: (companies.length + 1).toString(),
    name,
    slug,
    description,
    website,
    logo: logo || undefined,
    industry,
    foundedYear,
    employeeCount,
    headquarters,
    cityId,
    address,
    linkedinUrl: linkedinUrl || undefined,
    twitterUrl: twitterUrl || undefined,
    facebookUrl: facebookUrl || undefined,
    isVerified: isVerified || false,
    isActive: isActive !== undefined ? isActive : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  companies.push(newCompany);

  res.status(201).json({
    success: true,
    data: newCompany,
    message: 'Company created successfully'
  });
});

// PUT /api/companies/:id - Update company
app.put('/api/companies/:id', (req, res) => {
  const companyIndex = companies.findIndex(c => c.id === req.params.id);
  if (companyIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }

  const updatedCompany = {
    ...companies[companyIndex],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString()
  };

  companies[companyIndex] = updatedCompany;

  res.json({
    success: true,
    data: updatedCompany,
    message: 'Company updated successfully'
  });
});

// DELETE /api/companies/:id - Delete company
app.delete('/api/companies/:id', (req, res) => {
  const companyIndex = companies.findIndex(c => c.id === req.params.id);
  if (companyIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }

  companies.splice(companyIndex, 1);

  res.json({
    success: true,
    message: 'Company deleted successfully'
  });
});

// PATCH /api/companies/:id/status - Update company status
app.patch('/api/companies/:id/status', (req, res) => {
  const companyIndex = companies.findIndex(c => c.id === req.params.id);
  if (companyIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }

  const { status } = req.body;
  if (!['ACTIVE', 'PENDING', 'INACTIVE'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be ACTIVE, PENDING, or INACTIVE'
    });
  }

  companies[companyIndex].status = status;
  companies[companyIndex].updatedAt = new Date().toISOString();

  res.json({
    success: true,
    data: companies[companyIndex],
    message: 'Company status updated successfully'
  });
});

// Mock data for locations
let countries = [
  {
    id: "1",
    name: "United States",
    code: "US",
    language: "English",
    nationality: "American",
    isDefault: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2", 
    name: "India",
    code: "IN",
    language: "Hindi",
    nationality: "Indian",
    isDefault: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "United Kingdom", 
    code: "GB",
    language: "English",
    nationality: "British",
    isDefault: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let states = [
  {
    id: "1",
    name: "California",
    code: "CA",
    countryId: "1",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "New York", 
    code: "NY",
    countryId: "1",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Maharashtra",
    code: "MH",
    countryId: "2", 
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Karnataka",
    code: "KA", 
    countryId: "2",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let cities = [
  {
    id: "1",
    name: "San Francisco",
    code: "SF",
    stateId: "1",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2", 
    name: "Los Angeles",
    code: "LA",
    stateId: "1",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "New York City",
    code: "NYC", 
    stateId: "2",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Mumbai",
    code: "MUM",
    stateId: "3",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    name: "Bangalore", 
    code: "BLR",
    stateId: "4",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Countries endpoints
// GET /locations/countries - Get all countries
app.get('/locations/countries', (req, res) => {
  res.json({
    success: true,
    data: countries,
    message: 'Countries retrieved successfully'
  });
});

// GET /locations/countries/:id - Get country by ID
app.get('/locations/countries/:id', (req, res) => {
  const country = countries.find(c => c.id === req.params.id);
  if (!country) {
    return res.status(404).json({
      success: false,
      message: 'Country not found'
    });
  }
  res.json({
    success: true,
    data: country,
    message: 'Country retrieved successfully'
  });
});

// POST /locations/countries - Create new country
app.post('/locations/countries', (req, res) => {
  const { name, code, language, nationality, isActive } = req.body;
  
  // Validation
  if (!name || !code) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name and code'
    });
  }

  // Check if country with same code already exists
  const existingCountry = countries.find(c => c.code === code);
  if (existingCountry) {
    return res.status(409).json({
      success: false,
      message: 'Country with this code already exists'
    });
  }

  const newCountry = {
    id: (countries.length + 1).toString(),
    name,
    code,
    language: language || 'English',
    nationality: nationality || name,
    isDefault: false,
    isActive: isActive !== undefined ? isActive : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  countries.push(newCountry);

  res.status(201).json({
    success: true,
    data: newCountry,
    message: 'Country created successfully'
  });
});

// PUT /locations/countries/:id - Update country
app.put('/locations/countries/:id', (req, res) => {
  const countryIndex = countries.findIndex(c => c.id === req.params.id);
  if (countryIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Country not found'
    });
  }

  const updatedCountry = {
    ...countries[countryIndex],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString()
  };

  countries[countryIndex] = updatedCountry;

  res.json({
    success: true,
    data: updatedCountry,
    message: 'Country updated successfully'
  });
});

// DELETE /locations/countries/:id - Delete country
app.delete('/locations/countries/:id', (req, res) => {
  const countryIndex = countries.findIndex(c => c.id === req.params.id);
  if (countryIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Country not found'
    });
  }

  countries.splice(countryIndex, 1);

  res.json({
    success: true,
    message: 'Country deleted successfully'
  });
});

// States endpoints
// GET /locations/states - Get all states
app.get('/locations/states', (req, res) => {
  res.json({
    success: true,
    data: states,
    message: 'States retrieved successfully'
  });
});

// GET /locations/countries/:countryId/states - Get states by country ID
app.get('/locations/countries/:countryId/states', (req, res) => {
  const countryStates = states.filter(s => s.countryId === req.params.countryId);
  res.json({
    success: true,
    data: countryStates,
    message: 'States retrieved successfully'
  });
});

// GET /locations/states/:id - Get state by ID
app.get('/locations/states/:id', (req, res) => {
  const state = states.find(s => s.id === req.params.id);
  if (!state) {
    return res.status(404).json({
      success: false,
      message: 'State not found'
    });
  }
  res.json({
    success: true,
    data: state,
    message: 'State retrieved successfully'
  });
});

// POST /locations/states - Create new state
app.post('/locations/states', (req, res) => {
  const { name, code, countryId, isActive } = req.body;
  
  // Validation
  if (!name || !code || !countryId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, code, and countryId'
    });
  }

  // Check if country exists
  const country = countries.find(c => c.id === countryId);
  if (!country) {
    return res.status(400).json({
      success: false,
      message: 'Country not found'
    });
  }

  // Check if state with same code in country already exists
  const existingState = states.find(s => s.code === code && s.countryId === countryId);
  if (existingState) {
    return res.status(409).json({
      success: false,
      message: 'State with this code already exists in this country'
    });
  }

  const newState = {
    id: (states.length + 1).toString(),
    name,
    code,
    countryId,
    isActive: isActive !== undefined ? isActive : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  states.push(newState);

  res.status(201).json({
    success: true,
    data: newState,
    message: 'State created successfully'
  });
});

// PUT /locations/states/:id - Update state
app.put('/locations/states/:id', (req, res) => {
  const stateIndex = states.findIndex(s => s.id === req.params.id);
  if (stateIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'State not found'
    });
  }

  const updatedState = {
    ...states[stateIndex],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString()
  };

  states[stateIndex] = updatedState;

  res.json({
    success: true,
    data: updatedState,
    message: 'State updated successfully'
  });
});

// DELETE /locations/states/:id - Delete state
app.delete('/locations/states/:id', (req, res) => {
  const stateIndex = states.findIndex(s => s.id === req.params.id);
  if (stateIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'State not found'
    });
  }

  states.splice(stateIndex, 1);

  res.json({
    success: true,
    message: 'State deleted successfully'
  });
});

// Cities endpoints
// GET /locations/cities - Get all cities
app.get('/locations/cities', (req, res) => {
  res.json({
    success: true,
    data: cities,
    message: 'Cities retrieved successfully'
  });
});

// GET /locations/states/:stateId/cities - Get cities by state ID
app.get('/locations/states/:stateId/cities', (req, res) => {
  const stateCities = cities.filter(c => c.stateId === req.params.stateId);
  res.json({
    success: true,
    data: stateCities,
    message: 'Cities retrieved successfully'
  });
});

// GET /locations/cities/:id - Get city by ID
app.get('/locations/cities/:id', (req, res) => {
  const city = cities.find(c => c.id === req.params.id);
  if (!city) {
    return res.status(404).json({
      success: false,
      message: 'City not found'
    });
  }
  res.json({
    success: true,
    data: city,
    message: 'City retrieved successfully'
  });
});

// POST /locations/cities - Create new city
app.post('/locations/cities', (req, res) => {
  const { name, code, stateId, isActive } = req.body;
  
  // Validation
  if (!name || !code || !stateId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, code, and stateId'
    });
  }

  // Check if state exists
  const state = states.find(s => s.id === stateId);
  if (!state) {
    return res.status(400).json({
      success: false,
      message: 'State not found'
    });
  }

  // Check if city with same code in state already exists
  const existingCity = cities.find(c => c.code === code && c.stateId === stateId);
  if (existingCity) {
    return res.status(409).json({
      success: false,
      message: 'City with this code already exists in this state'
    });
  }

  const newCity = {
    id: (cities.length + 1).toString(),
    name,
    code,
    stateId,
    isActive: isActive !== undefined ? isActive : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  cities.push(newCity);

  res.status(201).json({
    success: true,
    data: newCity,
    message: 'City created successfully'
  });
});

// PUT /locations/cities/:id - Update city
app.put('/locations/cities/:id', (req, res) => {
  const cityIndex = cities.findIndex(c => c.id === req.params.id);
  if (cityIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'City not found'
    });
  }

  const updatedCity = {
    ...cities[cityIndex],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString()
  };

  cities[cityIndex] = updatedCity;

  res.json({
    success: true,
    data: updatedCity,
    message: 'City updated successfully'
  });
});

// DELETE /locations/cities/:id - Delete city
app.delete('/locations/cities/:id', (req, res) => {
  const cityIndex = cities.findIndex(c => c.id === req.params.id);
  if (cityIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'City not found'
    });
  }

  cities.splice(cityIndex, 1);

  res.json({
    success: true,
    message: 'City deleted successfully'
  });
});

// Mock data for jobs
let jobs = [
  {
    id: "1",
    title: "Senior Software Engineer",
    companyId: "1",
    description: "We are looking for a senior software engineer to join our team. You will be responsible for developing and maintaining our core applications using modern technologies.",
    jobType: "FULL_TIME",
    workMode: "REMOTE",
    experienceLevel: "SENIOR_LEVEL",
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Frontend Developer",
    companyId: "2",
    description: "Join our frontend team to build amazing user experiences. We use React, TypeScript, and modern web technologies.",
    jobType: "FULL_TIME",
    workMode: "HYBRID",
    experienceLevel: "MID_LEVEL",
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Data Scientist Intern",
    companyId: "1",
    description: "Great opportunity for students to gain experience in data science and machine learning. Work on real projects with our data team.",
    jobType: "INTERNSHIP",
    workMode: "ONSITE",
    experienceLevel: "ENTRY_LEVEL",
    status: "DRAFT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Jobs endpoints
// GET /api/admin/jobs - Get all jobs
app.get('/api/admin/jobs', (req, res) => {
  res.json({
    success: true,
    data: jobs,
    message: 'Jobs retrieved successfully'
  });
});

// GET /jobs - Alternative endpoint for jobs
app.get('/jobs', (req, res) => {
  res.json({
    success: true,
    data: jobs,
    message: 'Jobs retrieved successfully'
  });
});

// GET /api/admin/jobs/:id - Get job by ID
app.get('/api/admin/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }
  res.json({
    success: true,
    data: job,
    message: 'Job retrieved successfully'
  });
});

// GET /jobs/:id - Alternative endpoint for job by ID
app.get('/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }
  res.json({
    success: true,
    data: job,
    message: 'Job retrieved successfully'
  });
});

// POST /api/admin/jobs - Create new job
app.post('/api/admin/jobs', (req, res) => {
  const { title, companyId, description, jobType, workMode, experienceLevel, status } = req.body;
  
  // Validation
  if (!title || !companyId || !description || !jobType || !workMode || !experienceLevel || !status) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
      errors: ['title', 'companyId', 'description', 'jobType', 'workMode', 'experienceLevel', 'status']
    });
  }

  // Validate description length
  if (description.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Description must be at least 10 characters long'
    });
  }

  if (description.length > 5000) {
    return res.status(400).json({
      success: false,
      message: 'Description must be less than 5000 characters'
    });
  }

  // Validate title length
  if (title.length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Title must be less than 200 characters'
    });
  }

  // Check if company exists
  const company = companies.find(c => c.id === companyId);
  if (!company) {
    return res.status(400).json({
      success: false,
      message: 'Company not found'
    });
  }

  const newJob = {
    id: (jobs.length + 1).toString(),
    title,
    companyId,
    description,
    jobType,
    workMode,
    experienceLevel,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  jobs.push(newJob);

  res.status(201).json({
    success: true,
    data: newJob,
    message: 'Job created successfully'
  });
});

// POST /jobs - Alternative endpoint for creating job
app.post('/jobs', (req, res) => {
  const { title, companyId, description, jobType, workMode, experienceLevel, status } = req.body;
  
  // Validation
  if (!title || !companyId || !description || !jobType || !workMode || !experienceLevel || !status) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
      errors: ['title', 'companyId', 'description', 'jobType', 'workMode', 'experienceLevel', 'status']
    });
  }

  // Validate description length
  if (description.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Description must be at least 10 characters long'
    });
  }

  if (description.length > 5000) {
    return res.status(400).json({
      success: false,
      message: 'Description must be less than 5000 characters'
    });
  }

  // Validate title length
  if (title.length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Title must be less than 200 characters'
    });
  }

  // Check if company exists
  const company = companies.find(c => c.id === companyId);
  if (!company) {
    return res.status(400).json({
      success: false,
      message: 'Company not found'
    });
  }

  const newJob = {
    id: (jobs.length + 1).toString(),
    title,
    companyId,
    description,
    jobType,
    workMode,
    experienceLevel,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  jobs.push(newJob);

  res.status(201).json({
    success: true,
    data: newJob,
    message: 'Job created successfully'
  });
});

// PUT /api/admin/jobs/:id - Update job
app.put('/api/admin/jobs/:id', (req, res) => {
  const jobIndex = jobs.findIndex(j => j.id === req.params.id);
  if (jobIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  const updatedJob = {
    ...jobs[jobIndex],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString()
  };

  jobs[jobIndex] = updatedJob;

  res.json({
    success: true,
    data: updatedJob,
    message: 'Job updated successfully'
  });
});

// PUT /jobs/:id - Alternative endpoint for updating job
app.put('/jobs/:id', (req, res) => {
  const jobIndex = jobs.findIndex(j => j.id === req.params.id);
  if (jobIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  const updatedJob = {
    ...jobs[jobIndex],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString()
  };

  jobs[jobIndex] = updatedJob;

  res.json({
    success: true,
    data: updatedJob,
    message: 'Job updated successfully'
  });
});

// DELETE /api/admin/jobs/:id - Delete job
app.delete('/api/admin/jobs/:id', (req, res) => {
  const jobIndex = jobs.findIndex(j => j.id === req.params.id);
  if (jobIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  jobs.splice(jobIndex, 1);

  res.json({
    success: true,
    message: 'Job deleted successfully'
  });
});

// DELETE /jobs/:id - Alternative endpoint for deleting job
app.delete('/jobs/:id', (req, res) => {
  const jobIndex = jobs.findIndex(j => j.id === req.params.id);
  if (jobIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  jobs.splice(jobIndex, 1);

  res.json({
    success: true,
    message: 'Job deleted successfully'
  });
});

// PATCH /api/admin/jobs/:id/status - Update job status
app.patch('/api/admin/jobs/:id/status', (req, res) => {
  const jobIndex = jobs.findIndex(j => j.id === req.params.id);
  if (jobIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  const { status } = req.body;
  if (!['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be DRAFT, PUBLISHED, CLOSED, or ARCHIVED'
    });
  }

  jobs[jobIndex].status = status;
  jobs[jobIndex].updatedAt = new Date().toISOString();

  res.json({
    success: true,
    data: jobs[jobIndex],
    message: 'Job status updated successfully'
  });
});

// PATCH /jobs/:id/stats - Alternative endpoint for updating job status
app.patch('/jobs/:id/stats', (req, res) => {
  const jobIndex = jobs.findIndex(j => j.id === req.params.id);
  if (jobIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  const { status } = req.body;
  if (!['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be DRAFT, PUBLISHED, CLOSED, or ARCHIVED'
    });
  }

  jobs[jobIndex].status = status;
  jobs[jobIndex].updatedAt = new Date().toISOString();

  res.json({
    success: true,
    data: jobs[jobIndex],
    message: 'Job status updated successfully'
  });
});

// Mock data for admin users
let adminUsers = [
  {
    id: "1",
    email: "superadmin3@example.com",
    password: "SuperSecurePass456!", // In real app, this would be hashed
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    firstName: "Super",
    lastName: "Admin",
    designation: "System Administrator",
    department: "IT",
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "AdminPass123!",
    role: "ADMIN",
    status: "ACTIVE",
    firstName: "Admin",
    lastName: "User",
    designation: "Administrator",
    department: "Operations",
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

// Admin authentication endpoints
// POST /api/admin/login - Admin login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Find user by email
  const user = adminUsers.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check password (in real app, this would be hashed comparison)
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if user is active
  if (user.status !== 'ACTIVE') {
    return res.status(401).json({
      success: false,
      message: 'Account is not active'
    });
  }

  // Update last login
  user.lastLoginAt = new Date().toISOString();

  // Generate mock tokens (in real app, these would be JWT tokens)
  const accessToken = `mock_access_token_${user.id}_${Date.now()}`;
  const refreshToken = `mock_refresh_token_${user.id}_${Date.now()}`;

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: userWithoutPassword
    },
    message: 'Login successful'
  });
});

// POST /api/admin/logout - Admin logout
app.post('/api/admin/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// GET /api/admin/profile - Get admin profile
app.get('/api/admin/profile', (req, res) => {
  // In real app, this would verify the token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token required'
    });
  }

  // For mock purposes, return the first user
  const user = adminUsers[0];
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    data: userWithoutPassword,
    message: 'Profile retrieved successfully'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   Companies:`);
  console.log(`     GET    /api/companies`);
  console.log(`     GET    /api/companies/:id`);
  console.log(`     POST   /api/companies (ADMIN+)`);
  console.log(`     PUT    /api/companies/:id`);
  console.log(`     DELETE /api/companies/:id`);
  console.log(`     PATCH  /api/companies/:id/status`);
  console.log(`   Countries:`);
  console.log(`     GET    /locations/countries`);
  console.log(`     GET    /locations/countries/:id`);
  console.log(`     POST   /locations/countries`);
  console.log(`     PUT    /locations/countries/:id`);
  console.log(`     DELETE /locations/countries/:id`);
  console.log(`   States:`);
  console.log(`     GET    /locations/states`);
  console.log(`     GET    /locations/states/:id`);
  console.log(`     GET    /locations/countries/:countryId/states`);
  console.log(`     POST   /locations/states`);
  console.log(`     PUT    /locations/states/:id`);
  console.log(`     DELETE /locations/states/:id`);
  console.log(`   Cities:`);
  console.log(`     GET    /locations/cities`);
  console.log(`     GET    /locations/cities/:id`);
  console.log(`     GET    /locations/states/:stateId/cities`);
  console.log(`     POST   /locations/cities`);
  console.log(`     PUT    /locations/cities/:id`);
  console.log(`     DELETE /locations/cities/:id`);
  console.log(`   Jobs:`);
  console.log(`     GET    /api/admin/jobs`);
  console.log(`     GET    /api/admin/jobs/:id`);
  console.log(`     POST   /api/admin/jobs`);
  console.log(`     PUT    /api/admin/jobs/:id`);
  console.log(`     DELETE /api/admin/jobs/:id`);
  console.log(`     PATCH  /api/admin/jobs/:id/status`);
  console.log(`     GET    /jobs (alternative)`);
  console.log(`     GET    /jobs/:id (alternative)`);
  console.log(`     POST   /jobs (alternative)`);
  console.log(`     PUT    /jobs/:id (alternative)`);
  console.log(`     DELETE /jobs/:id (alternative)`);
  console.log(`     PATCH  /jobs/:id/stats (alternative)`);
  console.log(`   Admin Auth:`);
  console.log(`     POST   /api/admin/login`);
  console.log(`     POST   /api/admin/logout`);
  console.log(`     GET    /api/admin/profile`);
  console.log(`   Health:`);
  console.log(`     GET    /api/health`);
});

