import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BookOpen, Home, Users, Bell, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, selectedClass, switchClass, getAllClasses, logout } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Content Upload', href: '/content-upload', icon: BookOpen },
    { name: 'Lesson Planner', href: '/lesson-planner', icon: BookOpen },
    { name: 'Question Papers', href: '/question-papers', icon: BookOpen },
    { name: 'Student Evaluation', href: '/evaluation', icon: Users },
    { name: 'Reports', href: '/reports', icon: Bell },
    { name: 'Parent Communication', href: '/communication', icon: Bell },
    { name: 'Notes', href: '/notes', icon: BookOpen },
    { name: 'Quiz', href: '/quiz', icon: BookOpen },
    { name: 'Attendance', href: '/attendance', icon: Users },
    { name: 'Reminders', href: '/reminders', icon: Bell },
  ];

  const allClasses = getAllClasses();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getUserInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Sahayak</h1>
                <p className="text-sm text-slate-600">Teacher Assistant</p>
              </div>
            </div>

            {/* Class Selector - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {selectedClass && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Current Class:</span>
                  <Select 
                    value={selectedClass ? `${selectedClass.grade}-${selectedClass.className}` : ''} 
                    onValueChange={(value) => {
                      const [grade, className] = value.split('-');
                      switchClass({ grade, className });
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allClasses.map((classItem) => (
                        <SelectItem key={`${classItem.grade}-${classItem.className}`} value={`${classItem.grade}-${classItem.className}`}>
                          {classItem.grade} - {classItem.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {/* Navigation & User Menu */}
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-blue-100 text-blue-700 shadow-sm'
                          : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                    {getUserInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-slate-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Class Selector */}
      {selectedClass && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Class:</span>
            <Select 
              value={selectedClass ? `${selectedClass.grade}-${selectedClass.className}` : ''} 
              onValueChange={(value) => {
                const [grade, className] = value.split('-');
                switchClass({ grade, className });
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allClasses.map((classItem) => (
                  <SelectItem key={`${classItem.grade}-${classItem.className}`} value={`${classItem.grade}-${classItem.className}`}>
                    {classItem.grade} - Class {classItem.className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-50">
        <div className="flex justify-around py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;