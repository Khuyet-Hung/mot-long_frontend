import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

const DASHBOARD_PASSWORD = '123'; // Đổi mật khẩu tại đây

const DashboardLayout: React.FC = () => {
  const [input, setInput] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === DASHBOARD_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Sai mật khẩu!');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs">
          <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập Dashboard</h2>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Nhập mật khẩu"
            value={input}
            onChange={e => setInput(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded font-semibold">Đăng nhập</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile menu button */}
        <div className="md:hidden p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 bg-white shadow-sm"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
