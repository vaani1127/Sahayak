import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BookOpen, Users, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('teacher@school.com');
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle(selectedUser);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const userOptions = [
    { value: 'teacher@school.com', label: 'Sarah Johnson (Existing Teacher)' },
    { value: 'principal@school.com', label: 'Dr. Michael Brown (Principal)' },
    { value: 'newteacher@school.com', label: 'Emily Davis (New Teacher)' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Sahayak</h1>
            <p className="text-lg text-slate-600 mt-2">Teacher Assistant Platform</p>
            <p className="text-sm text-slate-500 mt-1">Streamline classroom management & enhance student engagement</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span>Welcome Back</span>
            </CardTitle>
            <CardDescription>
              Sign in to access your teaching dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo User Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Demo User (Development Mode)</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {userOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Google Login Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:shadow-md transition-all duration-200"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            {/* Features Preview */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center mb-3">What you'll get access to:</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center space-x-2 text-slate-600">
                  <BookOpen className="h-3 w-3 text-blue-600" />
                  <span>Notes & Quiz Generator</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Users className="h-3 w-3 text-purple-600" />
                  <span>Attendance Tracking</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Sparkles className="h-3 w-3 text-green-600" />
                  <span>Performance Analytics</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <BookOpen className="h-3 w-3 text-orange-600" />
                  <span>Syllabus Tracking</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          <p>Secure authentication powered by Google OAuth</p>
          <p className="mt-1">© 2025 Sahayak - Teacher Assistant Platform</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;