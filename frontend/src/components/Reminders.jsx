import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Bell, Calendar as CalendarIcon, Clock, Plus, Trash2, AlertCircle } from 'lucide-react';
import { mockApiResponses } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

const Reminders = () => {
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Submit quarterly reports',
      datetime: '2024-02-15T10:00',
      created: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Parent-teacher meeting preparation',
      datetime: '2024-02-20T14:30',
      created: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Grade assignment submissions',
      datetime: '2024-02-18T16:00',
      created: new Date().toISOString()
    }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createReminder = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for the reminder.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Date Required",
        description: "Please select a date for the reminder.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTime) {
      toast({
        title: "Time Required",
        description: "Please select a time for the reminder.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    const datetime = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`;
    const reminderData = {
      title: title.trim(),
      datetime: datetime
    };

    // Simulate API call
    setTimeout(() => {
      const response = mockApiResponses.reminder(reminderData);
      
      // Add to local state
      const newReminder = {
        id: Date.now(),
        title: title.trim(),
        datetime: datetime,
        created: new Date().toISOString()
      };
      
      setReminders(prev => [newReminder, ...prev]);
      
      // Reset form
      setTitle('');
      setSelectedDate(null);
      setSelectedTime('');
      setIsCreating(false);
      
      toast({
        title: "Reminder Created!",
        description: response.message,
      });
    }, 1500);
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
    toast({
      title: "Reminder Deleted",
      description: "The reminder has been removed.",
    });
  };

  const formatReminderDate = (datetime) => {
    const date = new Date(datetime);
    return format(date, 'MMM d, yyyy \'at\' h:mm a');
  };

  const isUpcoming = (datetime) => {
    return new Date(datetime) > new Date();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Bell className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-slate-800">Reminders</h1>
        </div>
        <p className="text-slate-600">Set and manage important reminders and deadlines</p>
      </div>

      {/* Create Reminder Form */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-orange-600" />
            <span>Create New Reminder</span>
          </CardTitle>
          <CardDescription>
            Set up important deadlines and reminders for your teaching schedule
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Reminder Title</Label>
            <Input
              id="title"
              placeholder="e.g., Grade assignments, Parent meeting, Submit reports"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>

          <Button 
            onClick={createReminder}
            disabled={isCreating}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            size="lg"
          >
            {isCreating ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-pulse" />
                Creating Reminder...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Reminder
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Reminders List */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-orange-600" />
            <span>Your Reminders</span>
          </CardTitle>
          <CardDescription>
            {reminders.length} reminders • {reminders.filter(r => isUpcoming(r.datetime)).length} upcoming
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No reminders yet. Create your first reminder above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                    isUpcoming(reminder.datetime)
                      ? 'bg-orange-50 border-orange-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      isUpcoming(reminder.datetime) ? 'bg-orange-100' : 'bg-slate-200'
                    }`}>
                      {isUpcoming(reminder.datetime) ? (
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-medium ${
                        isUpcoming(reminder.datetime) ? 'text-orange-800' : 'text-slate-700'
                      }`}>
                        {reminder.title}
                      </h3>
                      <p className={`text-sm ${
                        isUpcoming(reminder.datetime) ? 'text-orange-600' : 'text-slate-500'
                      }`}>
                        {formatReminderDate(reminder.datetime)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteReminder(reminder.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border-0 bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">💡 Reminder Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <ul className="space-y-1">
            <li>• Set reminders for important deadlines and meetings</li>
            <li>• Include specific details in the title for clarity</li>
            <li>• Orange background indicates upcoming reminders</li>
            <li>• Use reminders for recurring tasks like grading periods</li>
            <li>• Set reminders a day or two before important events</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reminders;