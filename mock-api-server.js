const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
  console.log(`   GET    /api/companies`);
  console.log(`   GET    /api/companies/:id`);
  console.log(`   POST   /api/companies (ADMIN+)`);
  console.log(`   PUT    /api/companies/:id`);
  console.log(`   DELETE /api/companies/:id`);
  console.log(`   PATCH  /api/companies/:id/status`);
  console.log(`   GET    /api/health`);
});

