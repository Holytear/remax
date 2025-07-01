import React from "react";

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className = "", count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-white rounded-xl shadow p-8 h-56 w-full max-w-xs flex flex-col items-center justify-center ${className}`}
        >
          <div className="w-20 h-20 rounded-full bg-slate-200 mb-4" />
          <div className="h-4 bg-slate-200 rounded w-2/3 mb-2" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader; 