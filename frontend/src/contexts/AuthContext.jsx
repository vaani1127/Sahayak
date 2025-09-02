import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  // Mock users for development
  const mockUsers = {
    'teacher@school.com': {
      id: '1',
      name: 'Sarah Johnson',
      email: 'teacher@school.com',
      role: 'teacher',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face',
      isOnboarded: true,
      profile: {
        grades: ['Grade 5', 'Grade 6'],
        subjects: ['Mathematics', 'Science'],
        classes: {
          'Grade 5': ['5A', '5B'],
          'Grade 6': ['6A']
        },
        experience: '8 years',
        specialization: 'STEM Education'
      }
    },
    'principal@school.com': {
      id: '2',
      name: 'Dr. Michael Brown',
      email: 'principal@school.com',
      role: 'principal',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isOnboarded: true,
      profile: {
        schoolName: 'Green Valley Elementary',
        totalStudents: 450,
        totalTeachers: 25,
        experience: '15 years'
      }
    },
    'newteacher@school.com': {
      id: '3',
      name: 'Emily Davis',
      email: 'newteacher@school.com',
      role: 'teacher',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isOnboarded: false,
      profile: null
    }
  };

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('sahayak_user');
    const savedClass = localStorage.getItem('sahayak_selected_class');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      if (savedClass) {
        setSelectedClass(JSON.parse(savedClass));
      }
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async (email = 'teacher@school.com') => {
    // Simulate Google OAuth login
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const userData = mockUsers[email];
    if (userData) {
      setUser(userData);
      localStorage.setItem('sahayak_user', JSON.stringify(userData));
      
      // Auto-select first class for teachers
      if (userData.role === 'teacher' && userData.isOnboarded && userData.profile?.classes) {
        const firstGrade = Object.keys(userData.profile.classes)[0];
        const firstClass = userData.profile.classes[firstGrade][0];
        const classData = { grade: firstGrade, className: firstClass };
        setSelectedClass(classData);
        localStorage.setItem('sahayak_selected_class', JSON.stringify(classData));
      }
    }
    setLoading(false);
    return userData;
  };

  const completeOnboarding = async (profileData) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser = {
      ...user,
      isOnboarded: true,
      profile: profileData
    };
    
    setUser(updatedUser);
    localStorage.setItem('sahayak_user', JSON.stringify(updatedUser));
    
    // Auto-select first class
    if (profileData.classes) {
      const firstGrade = Object.keys(profileData.classes)[0];
      const firstClass = profileData.classes[firstGrade][0];
      const classData = { grade: firstGrade, className: firstClass };
      setSelectedClass(classData);
      localStorage.setItem('sahayak_selected_class', JSON.stringify(classData));
    }
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setSelectedClass(null);
    localStorage.removeItem('sahayak_user');
    localStorage.removeItem('sahayak_selected_class');
  };

  const switchClass = (classData) => {
    setSelectedClass(classData);
    localStorage.setItem('sahayak_selected_class', JSON.stringify(classData));
  };

  const getAllClasses = () => {
    if (!user) return [];
    
    if (user.role === 'principal') {
      // Principal sees all school classes
      return [
        { grade: 'Grade 1', className: '1A' },
        { grade: 'Grade 1', className: '1B' },
        { grade: 'Grade 2', className: '2A' },
        { grade: 'Grade 2', className: '2B' },
        { grade: 'Grade 3', className: '3A' },
        { grade: 'Grade 4', className: '4A' },
        { grade: 'Grade 5', className: '5A' },
        { grade: 'Grade 5', className: '5B' },
        { grade: 'Grade 6', className: '6A' },
      ];
    } else if (user.role === 'teacher' && user.profile?.classes) {
      // Teacher sees only their classes
      const classes = [];
      Object.entries(user.profile.classes).forEach(([grade, classNames]) => {
        classNames.forEach(className => {
          classes.push({ grade, className });
        });
      });
      return classes;
    }
    
    return [];
  };

  const value = {
    user,
    loading,
    selectedClass,
    loginWithGoogle,
    completeOnboarding,
    logout,
    switchClass,
    getAllClasses
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};