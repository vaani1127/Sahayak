import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Calendar as CalendarIcon, Clock, BookOpen, Download, Sparkles, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '../lib/utils';

const LessonPlanner = () => {
  const { selectedClass } = useAuth();
  const { toast } = useToast();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [subjects, setSubjects] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [specialEvents, setSpecialEvents] = useState('');
  const [planningScope, setPlanningScope] = useState('week');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const availableSubjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Art', 'Physical Education'];
  const mockHolidays = [
    { date: '2024-02-14', name: 'Valentine\'s Day', type: 'celebration' },
    { date: '2024-02-19', name: 'Presidents Day', type: 'holiday' },
    { date: '2024-03-17', name: 'St. Patrick\'s Day', type: 'celebration' }
  ];

  const handleSubjectToggle = (subject) => {
    setSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const generateLessonPlan = async () => {
    if (subjects.length === 0) {
      toast({
        title: "No Subjects Selected",
        description: "Please select at least one subject for lesson planning.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      const mockPlan = generateMockPlan();
      setGeneratedPlan(mockPlan);
      setIsGenerating(false);

      toast({
        title: "Lesson Plan Generated!",
        description: `${planningScope === 'week' ? 'Weekly' : 'Monthly'} lesson plan created successfully.`,
      });
    }, 4000);
  };

  const generateMockPlan = () => {
    const weekStart = startOfWeek(selectedWeek);
    const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i + 1)); // Mon-Fri

    return {
      id: Date.now(),
      period: planningScope,
      weekStart: format(weekStart, 'yyyy-MM-dd'),
      subjects: subjects,
      grade: selectedClass?.grade || 'Grade 5',
      className: selectedClass?.className || 'A',
      dailyPlans: days.map((day, dayIndex) => {
        const dayHoliday = mockHolidays.find(h => h.date === format(day, 'yyyy-MM-dd'));
        
        return {
          date: format(day, 'yyyy-MM-dd'),
          dayName: format(day, 'EEEE'),
          isHoliday: !!dayHoliday,
          holiday: dayHoliday,
          sessions: dayHoliday ? [] : subjects.map((subject, subjectIndex) => ({
            id: `${dayIndex}-${subjectIndex}`,
            subject,
            time: `${9 + subjectIndex}:00 AM - ${9 + subjectIndex + 1}:00 AM`,
            topic: generateTopicForSubject(subject, dayIndex + 1),
            objectives: generateObjectives(subject),
            activities: generateActivities(subject),
            materials: generateMaterials(subject),
            assessment: generateAssessment(subject),
            homework: generateHomework(subject),
            notes: generateNotes(subject, dayHoliday)
          }))
        };
      }),
      createdAt: new Date().toISOString(),
      adjustments: {
        holidayAdjustments: mockHolidays.length,
        eventIntegrations: specialEvents ? 1 : 0,
        totalSessions: days.length * subjects.length - mockHolidays.length * subjects.length
      }
    };
  };

  const generateTopicForSubject = (subject, day) => {
    const topics = {
      'Mathematics': [`Fractions - Day ${day}`, `Geometry Basics - Day ${day}`, `Problem Solving - Day ${day}`],
      'Science': [`Plant Life Cycle - Day ${day}`, `Weather Patterns - Day ${day}`, `Simple Machines - Day ${day}`],
      'English': [`Reading Comprehension - Day ${day}`, `Creative Writing - Day ${day}`, `Grammar Rules - Day ${day}`],
      'Social Studies': [`Community Helpers - Day ${day}`, `Local History - Day ${day}`, `Geography Skills - Day ${day}`],
      'Art': [`Color Theory - Day ${day}`, `Drawing Techniques - Day ${day}`, `Craft Project - Day ${day}`],
      'Physical Education': [`Team Sports - Day ${day}`, `Fitness Activities - Day ${day}`, `Coordination Games - Day ${day}`]
    };
    return topics[subject]?.[day % 3] || `${subject} Lesson - Day ${day}`;
  };

  const generateObjectives = (subject) => [
    `Students will understand key concepts in ${subject}`,
    `Students will demonstrate practical application skills`,
    `Students will work collaboratively and think critically`
  ];

  const generateActivities = (subject) => [
    'Warm-up discussion and review',
    'Interactive lesson demonstration',
    'Hands-on practice activity',
    'Group work and peer learning',
    'Wrap-up and reflection'
  ];

  const generateMaterials = (subject) => {
    const materials = {
      'Mathematics': ['Whiteboard', 'Calculators', 'Worksheets', 'Manipulatives'],
      'Science': ['Lab equipment', 'Specimens', 'Charts', 'Safety gear'],
      'English': ['Books', 'Writing materials', 'Audio devices', 'Vocabulary cards'],
      'Social Studies': ['Maps', 'Historical artifacts', 'Multimedia resources', 'Worksheets'],
      'Art': ['Art supplies', 'Paper', 'Brushes', 'Reference images'],
      'Physical Education': ['Sports equipment', 'Cones', 'Balls', 'Mats']
    };
    return materials[subject] || ['Basic classroom supplies', 'Reference materials'];
  };

  const generateAssessment = (subject) => 
    `Formative assessment through observation, quick quiz, and student participation in ${subject} activities.`;

  const generateHomework = (subject) => 
    `Complete practice worksheet and prepare for next ${subject} lesson. Review today's key concepts.`;

  const generateNotes = (subject, holiday) => {
    if (holiday) return `Adjusted for ${holiday.name} - content will be covered in next session.`;
    return `Regular ${subject} lesson. Consider individual learning needs and provide extra support as needed.`;
  };

  const downloadPlan = () => {
    if (!generatedPlan) return;

    const content = `LESSON PLAN - ${generatedPlan.grade} Class ${generatedPlan.className}
Week of: ${format(new Date(generatedPlan.weekStart), 'MMMM d, yyyy')}
Subjects: ${generatedPlan.subjects.join(', ')}

${generatedPlan.dailyPlans.map(day => `
${day.dayName.toUpperCase()} - ${format(new Date(day.date), 'MMMM d')}
${day.isHoliday ? `HOLIDAY: ${day.holiday.name}` : `
${day.sessions.map(session => `
${session.time} - ${session.subject}
Topic: ${session.topic}
Objectives:
${session.objectives.map(obj => `- ${obj}`).join('\n')}

Activities:
${session.activities.map(act => `- ${act}`).join('\n')}

Materials: ${session.materials.join(', ')}
Assessment: ${session.assessment}
Homework: ${session.homework}
Notes: ${session.notes}
`).join('\n---\n')}
`}
`).join('\n======\n')}

SUMMARY:
- Total Sessions: ${generatedPlan.adjustments.totalSessions}
- Holiday Adjustments: ${generatedPlan.adjustments.holidayAdjustments}
- Event Integrations: ${generatedPlan.adjustments.eventIntegrations}
`;

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Lesson_Plan_${format(new Date(generatedPlan.weekStart), 'yyyy_MM_dd')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Download Started",
      description: "Lesson plan is being downloaded.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-slate-800">AI Lesson Planner</h1>
        </div>
        <p className="text-slate-600">Generate comprehensive lesson plans with automatic holiday and event adjustments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1 border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-green-600" />
              <span>Plan Configuration</span>
            </CardTitle>
            <CardDescription>
              Set up your lesson planning parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Week Selection */}
            <div className="space-y-2">
              <Label>Select Week</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedWeek && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedWeek ? format(selectedWeek, 'PPP') : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedWeek}
                    onSelect={setSelectedWeek}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Planning Scope */}
            <div className="space-y-2">
              <Label>Planning Scope</Label>
              <Select value={planningScope} onValueChange={setPlanningScope}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Weekly Plan</SelectItem>
                  <SelectItem value="month">Monthly Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subject Selection */}
            <div className="space-y-2">
              <Label>Subjects to Include</Label>
              <div className="grid grid-cols-1 gap-2">
                {availableSubjects.map(subject => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={subject}
                      checked={subjects.includes(subject)}
                      onCheckedChange={() => handleSubjectToggle(subject)}
                    />
                    <Label htmlFor={subject} className="text-sm">{subject}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Events */}
            <div className="space-y-2">
              <Label htmlFor="events">Special Events/Themes</Label>
              <Textarea
                id="events"
                placeholder="e.g., Science Fair preparation, Black History Month, etc."
                value={specialEvents}
                onChange={(e) => setSpecialEvents(e.target.value)}
                rows={3}
              />
            </div>

            {/* Holidays Preview */}
            <div className="space-y-2">
              <Label>Upcoming Holidays</Label>
              <div className="space-y-1">
                {mockHolidays.slice(0, 3).map(holiday => (
                  <div key={holiday.date} className="flex items-center justify-between text-sm">
                    <span>{holiday.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {format(new Date(holiday.date), 'MMM d')}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generation & Display Panel */}
        <Card className="lg:col-span-2 border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                <span>Generated Lesson Plan</span>
              </div>
              <Button 
                onClick={generateLessonPlan}
                disabled={isGenerating || subjects.length === 0}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Plan
                  </>
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              AI-powered lesson planning with automatic adjustments for holidays and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-green-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Creating Your Lesson Plan</h3>
                <p className="text-slate-600 mb-4">Analyzing curriculum, adjusting for holidays, and optimizing learning outcomes...</p>
                <div className="max-w-xs mx-auto space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Curriculum Analysis</span>
                    <span>✓</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Holiday Adjustments</span>
                    <span>⏳</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Activity Planning</span>
                    <span>⏳</span>
                  </div>
                </div>
              </div>
            )}

            {generatedPlan && (
              <div className="space-y-6">
                {/* Plan Overview */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Plan Generated Successfully</h3>
                    </div>
                    <Button 
                      onClick={downloadPlan}
                      variant="outline"
                      size="sm"
                      className="border-green-200 text-green-700 hover:bg-green-100"
                    >
                      <Download className="mr-2 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-green-600 font-medium">Total Sessions:</span>
                      <p className="text-slate-700">{generatedPlan.adjustments.totalSessions}</p>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Holiday Adjustments:</span>
                      <p className="text-slate-700">{generatedPlan.adjustments.holidayAdjustments}</p>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Subjects:</span>
                      <p className="text-slate-700">{generatedPlan.subjects.join(', ')}</p>
                    </div>
                  </div>
                </div>

                {/* Daily Plans */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700 mb-4">Daily Schedule</h3>
                  {generatedPlan.dailyPlans.map(day => (
                    <Card key={day.date} className={`border ${day.isHoliday ? 'border-orange-200 bg-orange-50' : 'border-slate-200'}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-slate-800">{day.dayName}</h4>
                            <Badge variant="outline">{format(new Date(day.date), 'MMM d')}</Badge>
                          </div>
                          {day.isHoliday && (
                            <Badge className="bg-orange-100 text-orange-800">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              {day.holiday.name}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {day.isHoliday ? (
                          <p className="text-orange-700 text-sm">No classes scheduled - {day.holiday.name}</p>
                        ) : (
                          <div className="space-y-3">
                            {day.sessions.map(session => (
                              <div key={session.id} className="bg-slate-50 p-3 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-slate-500" />
                                    <span className="font-medium text-slate-700">{session.time}</span>
                                  </div>
                                  <Badge className="bg-blue-100 text-blue-800">{session.subject}</Badge>
                                </div>
                                <h5 className="font-medium text-slate-800 mb-1">{session.topic}</h5>
                                <p className="text-sm text-slate-600">{session.activities.slice(0, 2).join(' • ')}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!isGenerating && !generatedPlan && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">Ready to Plan</h3>
                <p className="text-slate-500">Select subjects and generate your AI-powered lesson plan</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Card */}
      <Card className="border-0 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">💡 Lesson Planning Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <ul className="space-y-1">
            <li>• AI considers grade-level appropriateness and learning objectives</li>
            <li>• Holiday adjustments ensure no learning time is wasted</li>
            <li>• Plans include activities, materials, assessments, and homework</li>
            <li>• Special events are integrated into relevant subject lessons</li>
            <li>• Generated plans can be edited and customized for your needs</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonPlanner;