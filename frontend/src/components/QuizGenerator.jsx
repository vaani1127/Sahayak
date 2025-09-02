import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BookOpen, Download, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { mockApiResponses } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';

const QuizGenerator = () => {
  const [chapter, setChapter] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQuiz = async () => {
    if (!chapter.trim()) {
      toast({
        title: "Chapter Required",
        description: "Please enter a chapter name to generate quiz questions.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const response = mockApiResponses.quiz(chapter);
      setQuestions(response.questions);
      setIsGenerating(false);
      toast({
        title: "Quiz Generated!",
        description: `${response.questions.length} questions created for "${chapter}".`,
      });
    }, 2500);
  };

  const exportToPDF = () => {
    if (!questions.length) {
      toast({
        title: "No Questions Available",
        description: "Please generate quiz questions first before exporting.",
        variant: "destructive",
      });
      return;
    }

    // Format questions for download
    const quizContent = `QUIZ: ${chapter}\n\n${questions.map((q, index) => 
      `${index + 1}. ${q}\n\nAnswer: ________________________\n\n`
    ).join('')}`;

    const element = document.createElement('a');
    const file = new Blob([quizContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${chapter.replace(/\s+/g, '_')}_quiz.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Export Started",
      description: "Your quiz is being downloaded.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-800">Quiz Generator</h1>
        </div>
        <p className="text-slate-600">Create engaging quiz questions for any chapter or topic</p>
      </div>

      {/* Input Section */}
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span>Generate Quiz</span>
          </CardTitle>
          <CardDescription>
            Enter a chapter name and get ready-to-use quiz questions for your students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chapter">Chapter/Topic</Label>
            <Input
              id="chapter"
              placeholder="e.g., Photosynthesis, Algebra, World History"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="text-lg"
              onKeyPress={(e) => e.key === 'Enter' && generateQuiz()}
            />
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={generateQuiz}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex-1"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Quiz
                </>
              )}
            </Button>
            
            {questions.length > 0 && (
              <Button 
                onClick={exportToPDF}
                variant="outline"
                size="lg"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions Display */}
      {questions.length > 0 && (
        <Card className="border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Quiz Questions: {chapter}</span>
              </span>
              <Button 
                onClick={exportToPDF}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardTitle>
            <CardDescription>
              {questions.length} questions generated • Ready for classroom use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div 
                  key={index}
                  className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:bg-slate-100 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-700 leading-relaxed">{question}</p>
                      <div className="mt-3 h-8 border-b border-dashed border-slate-300"></div>
                      <p className="text-xs text-slate-500 mt-2">Answer space</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">💡 Quiz Generation Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <ul className="space-y-1">
            <li>• Be specific with chapter names for targeted questions</li>
            <li>• Include difficulty level (e.g., "Basic Algebra", "Advanced Physics")</li>
            <li>• Try subjects like "Cell Biology", "Shakespeare", "World War I"</li>
            <li>• Questions are designed to test understanding and application</li>
            <li>• Export includes answer spaces for student responses</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizGenerator;