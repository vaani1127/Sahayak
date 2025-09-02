import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { BarChart3, TrendingUp, Users, Award, Download, Calendar, Target, BookOpen, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const ReportsAnalytics = () => {
  const { selectedClass, user } = useAuth();
  const { toast } = useToast();
  const [reportType, setReportType] = useState('individual');
  const [timeRange, setTimeRange] = useState('month');
  const [selectedStudent, setSelectedStudent] = useState('');

  // Mock student data
  const students = [
    {
      id: '1',
      name: 'Emma Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face',
      overall: 88,
      subjects: {
        Mathematics: { score: 92, trend: 'up', assignments: 8, attendance: 95 },
        Science: { score: 85, trend: 'stable', assignments: 6, attendance: 92 },
        English: { score: 90, trend: 'up', assignments: 7, attendance: 98 }
      },
      strengths: ['Problem Solving', 'Critical Thinking', 'Participation'],
      weaknesses: ['Time Management', 'Presentation Skills'],
      attendance: 95
    },
    {
      id: '2',
      name: 'Liam Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      overall: 76,
      subjects: {
        Mathematics: { score: 78, trend: 'up', assignments: 7, attendance: 88 },
        Science: { score: 82, trend: 'up', assignments: 6, attendance: 90 },
        English: { score: 68, trend: 'down', assignments: 5, attendance: 85 }
      },
      strengths: ['Creativity', 'Hands-on Learning', 'Team Work'],
      weaknesses: ['Written Communication', 'Concentration'],
      attendance: 88
    },
    {
      id: '3',
      name: 'Olivia Brown',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      overall: 95,
      subjects: {
        Mathematics: { score: 96, trend: 'stable', assignments: 9, attendance: 98 },
        Science: { score: 94, trend: 'up', assignments: 8, attendance: 100 },
        English: { score: 95, trend: 'stable', assignments: 8, attendance: 97 }
      },
      strengths: ['Academic Excellence', 'Leadership', 'Consistency'],
      weaknesses: ['Peer Interaction', 'Risk Taking'],
      attendance: 98
    }
  ];

  // Mock class analytics
  const classAnalytics = {
    totalStudents: 15,
    averageScore: 84,
    attendanceRate: 92,
    completedAssignments: 89,
    subjectPerformance: {
      Mathematics: { average: 85, highest: 96, lowest: 68, trend: 'up' },
      Science: { average: 87, highest: 94, lowest: 72, trend: 'up' },
      English: { average: 81, highest: 95, lowest: 58, trend: 'stable' }
    },
    weeklyTrends: [
      { week: 'Week 1', score: 82, attendance: 90 },
      { week: 'Week 2', score: 84, attendance: 93 },
      { week: 'Week 3', score: 85, attendance: 91 },
      { week: 'Week 4', score: 87, attendance: 94 }
    ],
    upcomingDeadlines: [
      { title: 'Mathematics Test', date: '2024-02-20', type: 'exam' },
      { title: 'Science Project', date: '2024-02-25', type: 'project' },
      { title: 'English Essay', date: '2024-02-28', type: 'assignment' }
    ]
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const downloadReport = (type) => {
    let content = '';
    
    if (type === 'individual' && selectedStudent) {
      const student = students.find(s => s.id === selectedStudent);
      content = `STUDENT PROGRESS REPORT
      
Student: ${student.name}
Class: ${selectedClass?.grade} - ${selectedClass?.className}
Report Period: ${timeRange}
Generated: ${new Date().toLocaleDateString()}

OVERALL PERFORMANCE
Overall Score: ${student.overall}%
Grade: ${getGrade(student.overall)}
Attendance: ${student.attendance}%

SUBJECT-WISE PERFORMANCE
${Object.entries(student.subjects).map(([subject, data]) => `
${subject}:
  Score: ${data.score}%
  Assignments Completed: ${data.assignments}
  Attendance: ${data.attendance}%
  Trend: ${data.trend}
`).join('')}

STRENGTHS
${student.strengths.map(s => `• ${s}`).join('\n')}

AREAS FOR IMPROVEMENT
${student.weaknesses.map(w => `• ${w}`).join('\n')}
`;
    } else {
      content = `CLASS PERFORMANCE REPORT
      
Class: ${selectedClass?.grade} - ${selectedClass?.className}
Report Period: ${timeRange}
Generated: ${new Date().toLocaleDateString()}

CLASS OVERVIEW
Total Students: ${classAnalytics.totalStudents}
Average Score: ${classAnalytics.averageScore}%
Attendance Rate: ${classAnalytics.attendanceRate}%
Assignment Completion: ${classAnalytics.completedAssignments}%

SUBJECT PERFORMANCE
${Object.entries(classAnalytics.subjectPerformance).map(([subject, data]) => `
${subject}:
  Class Average: ${data.average}%
  Highest Score: ${data.highest}%
  Lowest Score: ${data.lowest}%
  Trend: ${data.trend}
`).join('')}

TOP PERFORMERS
${students.slice(0, 3).map((s, i) => `${i + 1}. ${s.name} - ${s.overall}%`).join('\n')}
`;
    }

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${type}_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Report Downloaded",
      description: `${type === 'individual' ? 'Individual' : 'Class'} report has been downloaded.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-800">Reports & Analytics</h1>
        </div>
        <p className="text-slate-600">Comprehensive performance tracking and detailed progress reports</p>
      </div>

      {/* Controls */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-700">Report Type:</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual Student</SelectItem>
                  <SelectItem value="class">Class Overview</SelectItem>
                  <SelectItem value="subject">Subject Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-700">Time Range:</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType === 'individual' && (
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-slate-700">Student:</label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button 
              onClick={() => downloadReport(reportType)}
              variant="outline"
              className="ml-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Student Report */}
      {reportType === 'individual' && selectedStudent && (
        <div className="space-y-6">
          {(() => {
            const student = students.find(s => s.id === selectedStudent);
            return (
              <>
                {/* Student Overview */}
                <Card className="border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-800">{student.name}</h2>
                          <p className="text-slate-600">{selectedClass?.grade} - Class {selectedClass?.className}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">{student.overall}%</div>
                        <Badge className={`${student.overall >= 85 ? 'bg-green-100 text-green-800' : student.overall >= 70 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          Grade {getGrade(student.overall)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(student.subjects).map(([subject, data]) => (
                    <Card key={subject} className="border-0 bg-white/70 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{subject}</CardTitle>
                          {getTrendIcon(data.trend)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold" style={{ color: getScoreColor(data.score) }}>
                            {data.score}%
                          </span>
                          <Badge variant="outline">Grade {getGrade(data.score)}</Badge>
                        </div>
                        <Progress value={data.score} className="h-2" />
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-slate-600">Assignments:</span>
                            <p className="font-medium">{data.assignments}/10</p>
                          </div>
                          <div>
                            <span className="text-slate-600">Attendance:</span>
                            <p className="font-medium">{data.attendance}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-0 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-800 flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {student.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center text-green-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-800 flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {student.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-center text-blue-700">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Class Overview Report */}
      {reportType === 'class' && (
        <div className="space-y-6">
          {/* Class Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Students</p>
                    <p className="text-3xl font-bold text-blue-900">{classAnalytics.totalStudents}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Average Score</p>
                    <p className="text-3xl font-bold text-green-900">{classAnalytics.averageScore}%</p>
                  </div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Attendance</p>
                    <p className="text-3xl font-bold text-purple-900">{classAnalytics.attendanceRate}%</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Assignments</p>
                    <p className="text-3xl font-bold text-orange-900">{classAnalytics.completedAssignments}%</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subject Performance */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(classAnalytics.subjectPerformance).map(([subject, data]) => (
                  <div key={subject} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <h3 className="font-medium text-slate-800">{subject}</h3>
                      {getTrendIcon(data.trend)}
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Average</p>
                        <p className="font-bold text-slate-800">{data.average}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Highest</p>
                        <p className="font-bold text-green-600">{data.highest}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600">Lowest</p>
                        <p className="font-bold text-red-600">{data.lowest}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students.slice(0, 5).map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-slate-800">{student.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-800">{student.overall}%</span>
                      <Badge className="bg-green-100 text-green-800">
                        Grade {getGrade(student.overall)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classAnalytics.upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-800">{deadline.title}</h4>
                      <p className="text-sm text-slate-600 capitalize">{deadline.type}</p>
                    </div>
                    <Badge variant="outline" className="border-orange-200 text-orange-700">
                      {new Date(deadline.date).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subject Analysis */}
      {reportType === 'subject' && (
        <Card className="border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Subject-wise Detailed Analysis</CardTitle>
            <CardDescription>In-depth performance analysis by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">Subject Analysis</h3>
              <p className="text-slate-500">Detailed subject-wise analytics and comparisons</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">📊 Reports & Analytics Features</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <ul className="space-y-1">
            <li>• Individual student progress tracking with detailed insights</li>
            <li>• Class-wide performance analytics and trends</li>
            <li>• Subject-wise performance comparison and analysis</li>
            <li>• Attendance and assignment completion tracking</li>
            <li>• Export reports for parent-teacher meetings and records</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAnalytics;