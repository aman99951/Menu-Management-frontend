'use client';
import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Code, 
  Settings, 
  Grid3x3, 
  List, 
  Users, 
  Trophy,
  Menu,
  ChevronRight,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Menus');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    {
      id: 'Systems',
      label: 'Systems',
      icon: Database,
      hasSubmenu: false
    },
    {
      id: 'System Code',
      label: 'System Code',
      icon: Code,
      hasSubmenu: false
    },
    {
      id: 'Properties',
      label: 'Properties',
      icon: Settings,
      hasSubmenu: false
    },
    {
      id: 'Menus',
      label: 'Menus',
      icon: Grid3x3,
      hasSubmenu: false
    },
    {
      id: 'API List',
      label: 'API List',
      icon: List,
      hasSubmenu: false
    },
    {
      id: 'Users & Group',
      label: 'Users & Group',
      icon: Users,
      hasSubmenu: false
    },
    {
      id: 'Competition',
      label: 'Competition',
      icon: Trophy,
      hasSubmenu: false
    }
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-transparent text-black hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-transparent bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          bg-slate-900 transition-all duration-300 h-screen rounded-3xl border-r border-slate-700 flex flex-col
          ${isMobile ? 'fixed top-0 left-0 z-50' : 'relative'}
          ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
          ${!isMobile && isExpanded ? 'w-60' : !isMobile ? 'w-16' : 'w-60'}
        `}
        style={{
          width: isMobile ? '240px' : (isExpanded ? '240px' : '64px'),
          margin: isMobile ? '0' : '24px',
          borderRadius: isMobile ? '0 24px 24px 0' : '24px',
          height: isMobile ? '100vh' : 'calc(100vh - 48px)',
        }}
      >
        {/* Header */}
        <div className={`flex items-center p-6 ${!isExpanded && !isMobile ? 'justify-center' : 'justify-between'}`}>
          {(isExpanded || isMobile) && (
            <div className="flex items-center">
              <h1 
                className="text-white text-xl font-bold tracking-tight"
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 700,
                  fontSize: '20px',
                  letterSpacing: '-2%',
                  lineHeight: '100%'
                }}
              >
                CLOIT
              </h1>
            </div>
          )}
          {!isMobile && (
            <button 
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white transition-colors"
              style={{
                width: '24px',
                height: '24px'
              }}
            >
              <Menu size={24} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center rounded-xl transition-all duration-200 group relative
                      ${!isExpanded && !isMobile ? 'justify-center px-2 py-3' : 'px-4 py-3'}
                      ${isActive
                        ? 'text-black shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-slate-800'
                      }`}
                    style={{
                      backgroundColor: isActive ? '#9FF443' : 'transparent',
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '14px',
                      letterSpacing: '-2%',
                      lineHeight: '100%'
                    }}
                    title={!isExpanded && !isMobile ? item.label : ''}
                  >
                    <IconComponent 
                      size={20} 
                      className={`${
                        isActive ? 'text-black' : 'text-gray-400 group-hover:text-white'
                      } transition-colors ${!isExpanded && !isMobile ? '' : ''}`}
                    />
                    {(isExpanded || isMobile) && (
                      <>
                        <span className="ml-3 truncate">
                          {item.label}
                        </span>
                        {item.hasSubmenu && (
                          <ChevronRight 
                            size={16} 
                            className={`ml-auto ${
                              isActive ? 'text-black' : 'text-gray-400 group-hover:text-white'
                            } transition-colors`}
                          />
                        )}
                      </>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {!isExpanded && !isMobile && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;