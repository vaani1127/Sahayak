import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MessageCircle, Send, Phone, Mail, Calendar, Bell, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const ParentCommunication = () => {
  const { selectedClass } = useAuth();
  const { toast } = useToast();
  const [messageType, setMessageType] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [communicationHistory, setCommunicationHistory] = useState([]);

  // Mock parent data
  const parents = [
    {
      id: '1',
      studentName: 'Emma Johnson',
      parentName: 'Sarah Johnson',
      relationship: 'Mother',
      phone: '+1-555-0101',
      email: 'sarah.johnson@email.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face',
      preferredContact: 'email',
      lastContact: '2024-02-10T14:30:00Z'
    },
    {
      id: '2',
      studentName: 'Liam Smith',
      parentName: 'Michael Smith',
      relationship: 'Father',
      phone: '+1-555-0102',
      email: 'michael.smith@email.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      preferredContact: 'sms',
      lastContact: '2024-02-08T09:15:00Z'
    },
    {
      id: '3',
      studentName: 'Olivia Brown',
      parentName: 'Jennifer Brown',
      relationship: 'Mother',
      phone: '+1-555-0103',
      email: 'jennifer.brown@email.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      preferredContact: 'email',
      lastContact: '2024-02-12T16:45:00Z'
    }
  ];

  // Mock communication history
  const mockHistory = [
    {
      id: '1',
      type: 'attendance',
      subject: 'Attendance Alert - Emma Johnson',
      recipient: 'Sarah Johnson',
      status: 'delivered',
      sentAt: '2024-02-14T09:00:00Z',
      content: 'Emma was absent today. Please confirm if this was planned.'
    },
    {
      id: '2',
      type: 'progress',
      subject: 'Weekly Progress Update',
      recipient: 'All Parents',
      status: 'sent',
      sentAt: '2024-02-12T15:30:00Z',
      content: 'Weekly progress reports are now available in the parent portal.'
    },
    {
      id: '3',
      type: 'event',
      subject: 'Science Fair Reminder',
      recipient: '15 Parents',
      status: 'delivered',
      sentAt: '2024-02-10T08:00:00Z',
      content: 'Reminder: Science Fair is tomorrow. Please ensure your child brings their project.'
    }
  ];

  const messageTypes = [
    { value: 'attendance', label: 'Attendance Alert', icon: Calendar },
    { value: 'progress', label: 'Progress Update', icon: CheckCircle },
    { value: 'behavior', label: 'Behavior Report', icon: Users },
    { value: 'event', label: 'Event Notification', icon: Bell },
    { value: 'assignment', label: 'Assignment Reminder', icon: AlertTriangle },
    { value: 'general', label: 'General Message', icon: MessageCircle }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-800' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High Priority', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  const handleRecipientToggle = (parentId) => {
    setRecipients(prev => 
      prev.includes(parentId) 
        ? prev.filter(id => id !== parentId)
        : [...prev, parentId]
    );
  };

  const selectAllRecipients = () => {
    setRecipients(parents.map(p => p.id));
  };

  const clearAllRecipients = () => {
    setRecipients([]);
  };

  const sendMessage = async () => {
    if (!messageType || recipients.length === 0 || !subject || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select recipients.",
        variant: "destructive",
      });
      return;
    }

    // Simulate sending message
    const newCommunication = {
      id: Date.now().toString(),
      type: messageType,
      subject,
      recipient: recipients.length === 1 ? parents.find(p => p.id === recipients[0])?.parentName : `${recipients.length} Recipients`,
      status: 'sending',
      sentAt: new Date().toISOString(),
      content: message
    };

    setCommunicationHistory(prev => [newCommunication, ...prev]);

    // Simulate delivery
    setTimeout(() => {
      setCommunicationHistory(prev => 
        prev.map(comm => 
          comm.id === newCommunication.id 
            ? { ...comm, status: 'delivered' }
            : comm
        )
      );
    }, 2000);

    // Reset form
    setMessageType('');
    setRecipients([]);
    setSubject('');
    setMessage('');
    setPriority('normal');

    toast({
      title: "Message Sent!",
      description: `Message sent to ${recipients.length} recipient(s) successfully.`,
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-600" />;
      case 'sending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type) => {
    const typeData = messageTypes.find(t => t.value === type);
    if (typeData) {
      const Icon = typeData.icon;
      return <Icon className="h-4 w-4" />;
    }
    return <MessageCircle className="h-4 w-4" />;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <MessageCircle className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-slate-800">Parent Communication</h1>
        </div>
        <p className="text-slate-600">Send notifications, updates, and messages to parents automatically</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Composer */}
        <Card className="lg:col-span-2 border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5 text-green-600" />
              <span>Compose Message</span>
            </CardTitle>
            <CardDescription>
              Send messages to parents via SMS, email, or app notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Message Type */}
            <div className="space-y-2">
              <Label>Message Type</Label>
              <Select value={messageType} onValueChange={setMessageType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  {messageTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Recipients */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Recipients ({recipients.length} selected)</Label>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={selectAllRecipients}
                  >
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAllRecipients}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {parents.map(parent => (
                  <div
                    key={parent.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      recipients.includes(parent.id) ? 'bg-green-50 border border-green-200' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => handleRecipientToggle(parent.id)}
                  >
                    <Checkbox
                      checked={recipients.includes(parent.id)}
                      readOnly
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={parent.avatar} alt={parent.parentName} />
                      <AvatarFallback>{parent.parentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{parent.parentName}</p>
                      <p className="text-xs text-slate-600">{parent.studentName} - {parent.relationship}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {parent.preferredContact === 'email' && <Mail className="h-3 w-3 text-slate-500" />}
                      {parent.preferredContact === 'sms' && <Phone className="h-3 w-3 text-slate-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      <Badge className={level.color} variant="outline">
                        {level.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter message subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
            </div>

            {/* Send Button */}
            <Button 
              onClick={sendMessage}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              size="lg"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </CardContent>
        </Card>

        {/* Parent Directory */}
        <Card className="border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Parent Directory</span>
            </CardTitle>
            <CardDescription>
              Quick access to parent contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parents.map(parent => (
                <div key={parent.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={parent.avatar} alt={parent.parentName} />
                    <AvatarFallback>{parent.parentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{parent.parentName}</p>
                    <p className="text-xs text-slate-600">{parent.studentName}</p>
                    <p className="text-xs text-slate-500">{parent.relationship}</p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <Mail className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <Phone className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t space-y-2">
              <h3 className="text-sm font-medium text-slate-700">Quick Messages</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => {
                    setMessageType('attendance');
                    setSubject('Daily Attendance Update');
                    setMessage('Your child was marked absent today. Please confirm if this was expected.');
                  }}
                >
                  <Calendar className="mr-2 h-3 w-3" />
                  Attendance Alert
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => {
                    setMessageType('progress');
                    setSubject('Weekly Progress Report');
                    setMessage('Your child\'s weekly progress report is now available. Please review the performance summary.');
                  }}
                >
                  <CheckCircle className="mr-2 h-3 w-3" />
                  Progress Update
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => {
                    setMessageType('event');
                    setSubject('Upcoming School Event');
                    setMessage('Reminder: Parent-teacher meeting is scheduled for this Friday. Please confirm your attendance.');
                  }}
                >
                  <Bell className="mr-2 h-3 w-3" />
                  Event Reminder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication History */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <span>Communication History</span>
          </CardTitle>
          <CardDescription>
            Recent messages and notifications sent to parents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...communicationHistory, ...mockHistory].slice(0, 10).map(comm => (
              <div key={comm.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(comm.type)}
                  <div>
                    <h4 className="font-medium text-slate-800">{comm.subject}</h4>
                    <p className="text-sm text-slate-600">To: {comm.recipient}</p>
                    <p className="text-xs text-slate-500">{new Date(comm.sentAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(comm.status)}
                  <Badge variant="outline" className="capitalize">
                    {comm.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border-0 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">💬 Communication Features</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <ul className="space-y-1">
            <li>• Automatic attendance alerts sent when students are absent</li>
            <li>• Bulk messaging for announcements and event notifications</li>
            <li>• Individual progress reports and behavior updates</li>
            <li>• Multiple communication channels: SMS, email, and app notifications</li>
            <li>• Delivery tracking and read receipts for important messages</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentCommunication;