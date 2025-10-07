import { useState } from "react";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

// Job Attribute Card Component
const JobAttributeCard = ({ 
  title, 
  options, 
  onAddNew 
}: { 
  title: string; 
  options: { id: number; name: string; checked: boolean }[]; 
  onAddNew: () => void;
}) => {
  return (
    <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3 mb-6">
        {options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              type="checkbox"
              id={`${title}-${option.id}`}
              checked={option.checked}
              className="h-4 w-4 text-blue-800 focus:ring-blue-800 border-gray-300 rounded accent-blue-800"
            />
            <label 
              htmlFor={`${title}-${option.id}`}
              className="ml-2 text-sm text-gray-700"
            >
              {option.name}
            </label>
          </div>
        ))}
      </div>
      
      <div
        onClick={onAddNew}
        className="text-blue-900 hover:text-blue-800 cursor-pointer text-sm font-medium transition-colors"
      >
        + Add New
      </div>
    </div>
  );
};

export default function JobAttributes() {
  const [languageLevels, setLanguageLevels] = useState([
    { id: 1, name: "Beginner", checked: true },
    { id: 2, name: "Intermediate", checked: false },
    { id: 3, name: "Advanced", checked: true },
    { id: 4, name: "Native Speaker", checked: false }
  ]);

  const [careerLevels, setCareerLevels] = useState([
    { id: 1, name: "High School / Secondary", checked: true },
    { id: 2, name: "Diploma / Certification", checked: false },
    { id: 3, name: "Bachelor's Degree", checked: true },
    { id: 4, name: "Master's Degree", checked: false }
  ]);

  const [functionalAreas, setFunctionalAreas] = useState([
    { id: 1, name: "Software Development", checked: true },
    { id: 2, name: "UI/UX & Design", checked: false },
    { id: 3, name: "Banking & Insurance", checked: true },
    { id: 4, name: "Education & Training", checked: false }
  ]);

  const [genders, setGenders] = useState([
    { id: 1, name: "Male", checked: true },
    { id: 2, name: "Female", checked: false },
    { id: 3, name: "Transgender", checked: true },
    { id: 4, name: "Non-Binary", checked: false }
  ]);

  const [industries, setIndustries] = useState([
    { id: 1, name: "IT", checked: true },
    { id: 2, name: "Banking", checked: false },
    { id: 3, name: "Manufacturing", checked: true },
    { id: 4, name: "Healthcare", checked: false }
  ]);

  const [jobExperience, setJobExperience] = useState([
    { id: 1, name: "Fresher / Entry", checked: true },
    { id: 2, name: "0 - 1 Year", checked: false },
    { id: 3, name: "1 - 3 Years", checked: true },
    { id: 4, name: "3 - 5 Years", checked: false }
  ]);

  const [jobSkills, setJobSkills] = useState([
    { id: 1, name: "Project Management", checked: true },
    { id: 2, name: "UI/UX & Design", checked: false },
    { id: 3, name: "React.js", checked: true },
    { id: 4, name: "Digital Marketing", checked: false }
  ]);

  const [jobTypes, setJobTypes] = useState([
    { id: 1, name: "Full-Time", checked: true },
    { id: 2, name: "Part-Time", checked: false },
    { id: 3, name: "Internship", checked: true },
    { id: 4, name: "Contract", checked: false }
  ]);

  const [jobShifts, setJobShifts] = useState([
    { id: 1, name: "Day Shift", checked: true },
    { id: 2, name: "Night Shift", checked: false },
    { id: 3, name: "Manufacturing", checked: true },
    { id: 4, name: "Flexible", checked: false }
  ]);

  const [degreeLevels, setDegreeLevels] = useState([
    { id: 1, name: "High School / Secondary", checked: true },
    { id: 2, name: "Diploma / Certification", checked: false },
    { id: 3, name: "Bachelor's Degree", checked: true },
    { id: 4, name: "Master's Degree", checked: false }
  ]);

  const [degreeTypes, setDegreeTypes] = useState([
    { id: 1, name: "Arts & Science", checked: true },
    { id: 2, name: "Engineering", checked: false },
    { id: 3, name: "Medicine", checked: true },
    { id: 4, name: "Agriculture", checked: false }
  ]);

  const [majorSubjects, setMajorSubjects] = useState([
    { id: 1, name: "Computer Science", checked: true },
    { id: 2, name: "Mechanical Engineering", checked: false },
    { id: 3, name: "Electronics", checked: true },
    { id: 4, name: "Nursing", checked: false }
  ]);

  const handleAddNew = (category: string) => {
    console.log(`Add new item to ${category}`);
    // Handle adding new items to each category
  };

  return (
    <>
      <PageMeta
        title="Job Attributes | spearwin-admin"
        description="Manage Job Attributes"
      />
      
      {/* Title Bar */}
      <div className="px-4 sm:px-6 lg:px-30 ">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <PageBreadcrumb 
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Job Attributes" }
            ]}
            showAdmin={true}
          />
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-30 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Row 1 */}
          <JobAttributeCard
            title="Language Level"
            options={languageLevels}
            onAddNew={() => handleAddNew("Language Level")}
          />
          
          <JobAttributeCard
            title="Career Level"
            options={careerLevels}
            onAddNew={() => handleAddNew("Career Level")}
          />
          
          <JobAttributeCard
            title="Functional Areas"
            options={functionalAreas}
            onAddNew={() => handleAddNew("Functional Areas")}
          />
          
          <JobAttributeCard
            title="Genders"
            options={genders}
            onAddNew={() => handleAddNew("Genders")}
          />

          {/* Row 2 */}
          <JobAttributeCard
            title="Industries"
            options={industries}
            onAddNew={() => handleAddNew("Industries")}
          />
          
          <JobAttributeCard
            title="Job Experience"
            options={jobExperience}
            onAddNew={() => handleAddNew("Job Experience")}
          />
          
          <JobAttributeCard
            title="Job Skills"
            options={jobSkills}
            onAddNew={() => handleAddNew("Job Skills")}
          />
          
          <JobAttributeCard
            title="Job Types"
            options={jobTypes}
            onAddNew={() => handleAddNew("Job Types")}
          />

          {/* Row 3 */}
          <JobAttributeCard
            title="Job Shifts"
            options={jobShifts}
            onAddNew={() => handleAddNew("Job Shifts")}
          />
          
          <JobAttributeCard
            title="Degree Levels"
            options={degreeLevels}
            onAddNew={() => handleAddNew("Degree Levels")}
          />
          
          <JobAttributeCard
            title="Degree Types"
            options={degreeTypes}
            onAddNew={() => handleAddNew("Degree Types")}
          />
          
          <JobAttributeCard
            title="Major Subjects"
            options={majorSubjects}
            onAddNew={() => handleAddNew("Major Subjects")}
          />
        </div>
      </div>
    </>
  );
}
