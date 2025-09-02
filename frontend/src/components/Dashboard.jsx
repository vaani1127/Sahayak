import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BookOpen, FileText, Users, Bell, ArrowRight, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const features = [
    {
      title: 'Notes Generator',
      description: 'Generate comprehensive study notes for any topic instantly',
      icon: FileText,
      href: '/notes',
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Quiz Generator',
      description: 'Create engaging quizzes and assessments for your students',
      icon: BookOpen,
      href: '/quiz',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Attendance',
      description: 'Track and manage student attendance efficiently',
      icon: Users,
      href: '/attendance',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Reminders',
      description: 'Set and manage important reminders and deadlines',
      icon: Bell,
      href: '/reminders',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-8 w-8 text-indigo-600" />
          <h1 className="text-4xl font-bold text-slate-800">Welcome to Sahayak</h1>
        </div>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Your intelligent teaching assistant to streamline classroom management and enhance student engagement
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.title} 
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <CardHeader className="pb-4">
                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold text-slate-800">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to={feature.href}>
                  <Button 
                    className={`w-full group-hover:shadow-lg transition-all duration-300 bg-gradient-to-r ${feature.color} hover:opacity-90`}
                    size="lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-0">
        <CardHeader>
          <CardTitle className="text-center text-slate-800">Quick Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-sm text-slate-600">Students</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-emerald-600">8</div>
              <div className="text-sm text-slate-600">Notes Created</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-slate-600">Quizzes Generated</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-slate-600">Active Reminders</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// CSS Animation (add to index.css or component styles)
const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export default Dashboard;