import { useNavigate } from "react-router";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
  showAdmin?: boolean;
}

export default function PageBreadcrumb({ items, showAdmin = false }: PageBreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
      {showAdmin && (
        <>
          <button 
            onClick={() => navigate("/")}
            className="hover:text-gray-700 transition-colors"
          >
            Admin
          </button>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </>
      )}
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          
          {item.path ? (
            <button 
              onClick={() => navigate(item.path!)}
              className="hover:text-gray-700 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-lg font-semibold text-gray-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}