import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Users, Calendar as CalendarIcon, Save, Edit3, UserCheck, UserX } from 'lucide-react';
import { mockStudents, mockApiResponses } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState(mockStudents);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleStudentToggle = (studentId) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, present: !student.present }
        : student
    ));
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, present: true })));
    toast({
      title: "All Students Marked Present",
      description: "All students have been marked as present.",
    });
  };

  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({ ...student, present: false })));
    toast({
      title: "All Students Marked Absent",
      description: "All students have been marked as absent.",
    });
  };

  const saveAttendance = async () => {
    setIsSaving(true);
    
    const presentStudents = students.filter(s => s.present);
    const attendanceData = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      presentCount: presentStudents.length,
      totalStudents: students.length,
      students: students
    };

    // Simulate API call
    setTimeout(() => {
      const response = mockApiResponses.attendance(attendanceData);
      setIsSaving(false);
      toast({
        title: "Attendance Saved!",
        description: response.message,
      });
    }, 1500);
  };

  const presentCount = students.filter(s => s.present).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Users className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-slate-800">Attendance Management</h1>
        </div>
        <p className="text-slate-600">Track and manage student attendance efficiently</p>
      </div>

      {/* Date Selection & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-purple-600" />
              <span>Select Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-slate-700">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                <div className="text-sm text-slate-600">Present</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                <div className="text-sm text-slate-600">Absent</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-700">{students.length}</div>
                <div className="text-sm text-slate-600">Total</div>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(presentCount / students.length) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Student List</span>
              </CardTitle>
              <CardDescription>
                Mark attendance for {format(selectedDate, 'MMMM d, yyyy')}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={markAllPresent}
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                All Present
              </Button>
              <Button
                onClick={markAllAbsent}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <UserX className="mr-2 h-4 w-4" />
                All Absent
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {students.map((student) => (
              <div
                key={student.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                  student.present 
                    ? 'bg-green-50 border-green-200 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Checkbox
                  id={`student-${student.id}`}
                  checked={student.present}
                  onCheckedChange={() => handleStudentToggle(student.id)}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label
                  htmlFor={`student-${student.id}`}
                  className={`flex-1 cursor-pointer text-sm font-medium ${
                    student.present ? 'text-green-800' : 'text-slate-700'
                  }`}
                >
                  {student.name}
                </Label>
                {student.present && (
                  <UserCheck className="h-4 w-4 text-green-600" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={saveAttendance}
          disabled={isSaving}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          size="lg"
        >
          {isSaving ? (
            <>
              <Save className="mr-2 h-4 w-4 animate-pulse" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Attendance
            </>
          )}
        </Button>
        
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          size="lg"
          className="border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Edit Students
        </Button>
      </div>

      {/* Tips Card */}
      <Card className="border-0 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">💡 Attendance Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <ul className="space-y-1">
            <li>• Click on student names or checkboxes to mark attendance</li>
            <li>• Use "All Present" or "All Absent" for quick marking</li>
            <li>• Green background indicates present students</li>
            <li>• Select different dates to manage historical attendance</li>
            <li>• Student list can be customized using the "Edit Students" option</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;