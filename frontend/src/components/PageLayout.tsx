import React from 'react';

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4 sm:p-8">
    <div className="w-full max-w-5xl mx-auto">
      {children}
    </div>
  </div>
);

export default PageLayout; 