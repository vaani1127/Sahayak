import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Clock, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  BarChart3,
  Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EnhancedDashboard = () => {
  const { user, selectedClass, switchClass, getAllClasses } = useAuth();
  const [timeRange, setTimeRange] = useState('thisWeek');

  const allClasses = getAllClasses();

  // Mock data for performance metrics
  const performanceData = {
    attendance: 87,
    avgQuizScore: 78,
    completedAssignments: 23,
    totalAssignments: 28,
    syllabusProgress: 65
  };

  // Mock syllabus data
  const syllabusTopics = [
    { id: 1, topic: 'Algebra Basics', progress: 100, status: 'completed' },
    { id: 2, topic: 'Linear Equations', progress: 85, status: 'in-progress' },
    { id: 3, topic: 'Quadratic Functions', progress: 40, status: 'in-progress' },
    { id: 4, topic: 'Geometry Fundamentals', progress: 0, status: 'pending' },
    { id: 5, topic: 'Trigonometry', progress: 0, status: 'pending' }
  ];

  // Mock weekly schedule
  const weeklySchedule = [
    { day: 'Monday', time: '9:00 AM', subject: 'Mathematics', topic: 'Linear Equations' },
    { day: 'Monday', time: '11:00 AM', subject: 'Science', topic: 'Photosynthesis' },
    { day: 'Tuesday', time: '10:00 AM', subject: 'Mathematics', topic: 'Problem Solving' },
    { day: 'Wednesday', time: '9:00 AM', subject: 'Science', topic: 'Plant Structure' },
    { day: 'Thursday', time: '11:00 AM', subject: 'Mathematics', topic: 'Review Session' },
    { day: 'Friday', time: '10:00 AM', subject: 'Science', topic: 'Lab Activity' }
  ];

  // Quick action items
  const quickActions = [
    {
      title: 'Notes Generator',
      description: 'Create study materials',
      icon: BookOpen,
      href: '/notes',
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Quiz Generator',
      description: 'Generate assessments',
      icon: BookOpen,
      href: '/quiz',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Attendance',
      description: 'Track student presence',
      icon: Users,
      href: '/attendance',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Reminders',
      description: 'Manage deadlines',
      icon: Clock,
      href: '/reminders',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Class Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {user?.role === 'principal' ? 'School Overview' : 'Teaching Dashboard'}
          </h1>
          <p className="text-slate-600">
            {selectedClass ? `${selectedClass.grade} - Class ${selectedClass.className}` : 'Select a class to get started'}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={selectedClass ? `${selectedClass.grade}-${selectedClass.className}` : ''} onValueChange={(value) => {
            const [grade, className] = value.split('-');
            switchClass({ grade, className });
          }}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {allClasses.map((classItem) => (
                <SelectItem key={`${classItem.grade}-${classItem.className}`} value={`${classItem.grade}-${classItem.className}`}>
                  {classItem.grade} - Class {classItem.className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="thisQuarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedClass ? (
        <>
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Attendance Rate</p>
                    <p className="text-3xl font-bold text-blue-900">{performanceData.attendance}%</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-4">
                  <Progress value={performanceData.attendance} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Avg Quiz Score</p>
                    <p className="text-3xl font-bold text-green-900">{performanceData.avgQuizScore}%</p>
                  </div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-4">
                  <Progress value={performanceData.avgQuizScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Assignments</p>
                    <p className="text-3xl font-bold text-purple-900">
                      {performanceData.completedAssignments}/{performanceData.totalAssignments}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-4">
                  <Progress value={(performanceData.completedAssignments / performanceData.totalAssignments) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Syllabus Progress</p>
                    <p className="text-3xl font-bold text-orange-900">{performanceData.syllabusProgress}%</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
                <div className="mt-4">
                  <Progress value={performanceData.syllabusProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Syllabus Tracker */}
            <Card className="lg:col-span-2 border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Syllabus Tracker</span>
                </CardTitle>
                <CardDescription>
                  Track curriculum progress for {selectedClass.grade} - Class {selectedClass.className}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {syllabusTopics.map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(topic.status)}
                        <div>
                          <h4 className="font-medium text-slate-700">{topic.topic}</h4>
                          <p className="text-sm text-slate-500">{topic.progress}% completed</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24">
                          <Progress value={topic.progress} className="h-2" />
                        </div>
                        <Badge className={getStatusColor(topic.status)}>
                          {topic.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Schedule */}
            <Card className="border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span>This Week's Schedule</span>
                </CardTitle>
                <CardDescription>
                  Auto-generated teaching schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklySchedule.slice(0, 5).map((session, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {session.subject}
                        </p>
                        <p className="text-xs text-slate-500">
                          {session.day} • {session.time}
                        </p>
                        <p className="text-xs text-slate-600">{session.topic}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View Full Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Teaching Tools</CardTitle>
              <CardDescription>
                Quick access to your most used features for {selectedClass.grade} - Class {selectedClass.className}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.title} to={action.href}>
                      <div className={`${action.bgColor} p-4 rounded-lg hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer`}>
                        <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-medium text-slate-800 mb-1">{action.title}</h3>
                        <p className="text-sm text-slate-600 mb-3">{action.description}</p>
                        <div className="flex items-center text-slate-600 text-sm">
                          <span>Get Started</span>
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="py-16 text-center">
            <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Select a Class</h3>
            <p className="text-slate-500 mb-6">
              Choose a class from the dropdown above to view performance metrics and teaching tools.
            </p>
            {allClasses.length > 0 && (
              <Button onClick={() => switchClass(allClasses[0])}>
                Select {allClasses[0].grade} - Class {allClasses[0].className}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedDashboard;