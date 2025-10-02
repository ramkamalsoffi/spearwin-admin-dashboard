import React from "react";

/**
 * Standard Page Layout Component
 * 
 * This component provides consistent layout structure for all pages:
 * - Title Bar: White rounded card with shadow and border
 * - Content Area: Consistent px-30 py-4 spacing
 * 
 * Usage: Wrap your page content with this component for consistent styling
 */
interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <>
      {/* Title Bar */}
      <div className="px-30 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-30 py-4">
        {children}
      </div>
    </>
  );
}
