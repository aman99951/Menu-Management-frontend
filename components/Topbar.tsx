'use client';
import React from 'react';
import { Folder } from 'lucide-react';

const Topbar = () => {
  return (
  <div className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 mt-[50px] sm:mt-10 md:mt-10 pl-[24px] sm:pl-4 md:pl-6">

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Folder Icon */}
        <div className="flex items-center justify-center">
          <Folder 
            size={16} 
            className="text-gray-500 sm:w-5 sm:h-5 md:w-5 md:h-5" 
            fill="currentColor"
          />
        </div>
        
        {/* Title */}
        <h1 className="text-sm sm:text-base font-normal text-gray-700 truncate">
          / Menus
        </h1>
      </div>
    </div>
  );
};

export default Topbar;