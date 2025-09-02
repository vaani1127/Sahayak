import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { FileText, Download, Sparkles, Loader2 } from 'lucide-react';
import { mockApiResponses } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';

const NotesGenerator = () => {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateNotes = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate notes.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const response = mockApiResponses.notes(topic);
      setNotes(response.notes);
      setIsGenerating(false);
      toast({
        title: "Notes Generated!",
        description: `Comprehensive notes for "${topic}" have been created.`,
      });
    }, 2000);
  };

  const downloadPDF = () => {
    if (!notes) {
      toast({
        title: "No Notes Available",
        description: "Please generate notes first before downloading.",
        variant: "destructive",
      });
      return;
    }

    // Simple text download (in real implementation, use jsPDF)
    const element = document.createElement('a');
    const file = new Blob([notes], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${topic.replace(/\s+/g, '_')}_notes.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download Started",
      description: "Your notes are being downloaded.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <FileText className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-slate-800">Notes Generator</h1>
        </div>
        <p className="text-slate-600">Create comprehensive study notes for any topic instantly</p>
      </div>

      {/* Input Section */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <span>Generate Notes</span>
          </CardTitle>
          <CardDescription>
            Enter a topic and get detailed, structured notes ready for your students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Photosynthesis, Algebra, World War II"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="text-lg"
              onKeyPress={(e) => e.key === 'Enter' && generateNotes()}
            />
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={generateNotes}
              disabled={isGenerating}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 flex-1"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Notes...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Notes
                </>
              )}
            </Button>
            
            {notes && (
              <Button 
                onClick={downloadPDF}
                variant="outline"
                size="lg"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes Display */}
      {notes && (
        <Card className="border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Notes: {topic}</span>
              <Button 
                onClick={downloadPDF}
                variant="outline"
                size="sm"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <Textarea
                value={notes}
                readOnly
                className="min-h-[400px] border-0 bg-transparent resize-none focus:ring-0 text-slate-700 leading-relaxed"
                style={{ 
                  fontSize: '14px',
                  lineHeight: '1.6',
                  fontFamily: 'ui-monospace, SFMono-Regular, monospace'
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="border-0 bg-gradient-to-r from-emerald-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">💡 Tips for Better Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <ul className="space-y-1">
            <li>• Be specific with your topic (e.g., "Quadratic Equations" vs "Math")</li>
            <li>• Include grade level for age-appropriate content</li>
            <li>• Try topics like "Introduction to Physics", "Grammar Rules", "Ancient History"</li>
            <li>• Generated notes include key concepts, examples, and practice tips</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesGenerator;