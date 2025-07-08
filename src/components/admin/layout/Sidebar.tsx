import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  Home,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {

  const [activeTab, setActiveTab] = useState('activities');
  const location = useLocation();

  // Hàm xác định tab dựa vào path
  function getActiveTabFromPath(pathname: string) {
    if (pathname.startsWith('/dashboard/activities')) return 'activities';
    if (pathname.startsWith('/dashboard/members')) return 'members';
    if (pathname.startsWith('/dashboard/reports')) return 'reports';
    if (pathname.startsWith('/dashboard/media')) return 'media';
    if (pathname.startsWith('/dashboard/settings')) return 'settings';
    if (pathname === '/dashboard' || pathname === '/dashboard/') return 'dashboard';
    return '';
  }

  // Tự động cập nhật activeTab khi path thay đổi
  useEffect(() => {
    const currentTab = getActiveTabFromPath(location.pathname);
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [location.pathname]);

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: Home , path: '/dashboard'},
    { id: 'activities', label: 'Quản lý hoạt động', icon: Calendar, path: '/dashboard/activities' },
    { id: 'members', label: 'Thành viên', icon: Users, path: '/dashboard/members' },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3, path: '/dashboard/reports' },
    { id: 'media', label: 'Thư viện media', icon: FileText, path: '/dashboard/media' },
    { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <h1 className="font-bold text-xl text-gray-800">Dashboard</h1>
          <button
            onClick={onToggle}
            className="md:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-200
                      ${activeTab === item.id 
                        ? 'bg-primary-100 text-primary-700 font-semibold' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t">
          <div className="text-sm text-gray-500">
            <p className="font-medium">Nhóm Tình Nguyện</p>
            <p>Phiên bản 1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
};
