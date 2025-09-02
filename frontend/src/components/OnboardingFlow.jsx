import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BookOpen, Users, GraduationCap, ArrowRight, Plus, Minus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const OnboardingFlow = () => {
  const { user, completeOnboarding } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    grades: [],
    subjects: [],
    classes: {},
    experience: '',
    specialization: '',
    bio: ''
  });

  const availableGrades = [
    'Pre-K', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 
    'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
    'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  ];

  const availableSubjects = [
    'Mathematics', 'Science', 'English', 'Social Studies', 'History',
    'Geography', 'Physics', 'Chemistry', 'Biology', 'Literature',
    'Art', 'Music', 'Physical Education', 'Computer Science'
  ];

  const handleGradeToggle = (grade) => {
    const newGrades = formData.grades.includes(grade)
      ? formData.grades.filter(g => g !== grade)
      : [...formData.grades, grade];
    
    // Update classes when grades change
    const newClasses = { ...formData.classes };
    if (newGrades.includes(grade) && !newClasses[grade]) {
      newClasses[grade] = ['A']; // Default to one class
    } else if (!newGrades.includes(grade)) {
      delete newClasses[grade];
    }
    
    setFormData({
      ...formData,
      grades: newGrades,
      classes: newClasses
    });
  };

  const handleSubjectToggle = (subject) => {
    const newSubjects = formData.subjects.includes(subject)
      ? formData.subjects.filter(s => s !== subject)
      : [...formData.subjects, subject];
    
    setFormData({
      ...formData,
      subjects: newSubjects
    });
  };

  const addClassToGrade = (grade) => {
    const currentClasses = formData.classes[grade] || [];
    const nextLetter = String.fromCharCode(65 + currentClasses.length); // A, B, C, etc.
    
    setFormData({
      ...formData,
      classes: {
        ...formData.classes,
        [grade]: [...currentClasses, nextLetter]
      }
    });
  };

  const removeClassFromGrade = (grade, classToRemove) => {
    const currentClasses = formData.classes[grade] || [];
    if (currentClasses.length > 1) {
      setFormData({
        ...formData,
        classes: {
          ...formData.classes,
          [grade]: currentClasses.filter(c => c !== classToRemove)
        }
      });
    }
  };

  const handleComplete = async () => {
    if (formData.grades.length === 0) {
      toast({
        title: "Grades Required",
        description: "Please select at least one grade you teach.",
        variant: "destructive",
      });
      return;
    }

    if (formData.subjects.length === 0) {
      toast({
        title: "Subjects Required",
        description: "Please select at least one subject you teach.",
        variant: "destructive",
      });
      return;
    }

    await completeOnboarding(formData);
    toast({
      title: "Welcome to Sahayak!",
      description: "Your profile has been set up successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name}!</h1>
              <p className="text-slate-600">Let's set up your teaching profile</p>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-3 h-3 rounded-full transition-colors ${
                  step >= stepNum ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <span>What grades do you teach?</span>
                </CardTitle>
                <CardDescription>
                  Select all the grades you're currently teaching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableGrades.map((grade) => (
                    <div
                      key={grade}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.grades.includes(grade)
                          ? 'bg-blue-50 border-blue-200 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                      onClick={() => handleGradeToggle(grade)}
                    >
                      <Checkbox
                        checked={formData.grades.includes(grade)}
                        readOnly
                      />
                      <span className="text-sm font-medium">{grade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span>What subjects do you teach?</span>
                </CardTitle>
                <CardDescription>
                  Select your subject specializations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableSubjects.map((subject) => (
                    <div
                      key={subject}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.subjects.includes(subject)
                          ? 'bg-green-50 border-green-200 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                      onClick={() => handleSubjectToggle(subject)}
                    >
                      <Checkbox
                        checked={formData.subjects.includes(subject)}
                        readOnly
                      />
                      <span className="text-sm font-medium">{subject}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Class Details & Experience</span>
                </CardTitle>
                <CardDescription>
                  Configure your classes and tell us about your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Classes Configuration */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Classes per Grade</Label>
                  {formData.grades.map((grade) => (
                    <div key={grade} className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-700">{grade}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addClassToGrade(grade)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Class
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(formData.classes[grade] || []).map((className) => (
                          <div
                            key={className}
                            className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border"
                          >
                            <span className="text-sm">{grade}-{className}</span>
                            {formData.classes[grade].length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeClassFromGrade(grade, className)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Teaching Experience</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => setFormData({...formData, experience: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2 years">1-2 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="6-10 years">6-10 years</SelectItem>
                        <SelectItem value="11-15 years">11-15 years</SelectItem>
                        <SelectItem value="15+ years">15+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      placeholder="e.g., STEM Education, Special Needs"
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">About You (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us a bit about your teaching philosophy or interests..."
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={3}
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          <div className="p-6 pt-0 flex justify-between">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                Previous
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && formData.grades.length === 0) ||
                    (step === 2 && formData.subjects.length === 0)
                  }
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete}>
                  Complete Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;