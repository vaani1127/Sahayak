import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Upload, Brain, CheckCircle, AlertCircle, Star, TrendingUp, FileText, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const StudentEvaluation = () => {
  const { selectedClass } = useAuth();
  const { toast } = useToast();
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState([]);

  // Mock assignments
  const assignments = [
    { id: 1, title: 'Mathematics Quiz - Fractions', type: 'quiz', totalMarks: 20, dueDate: '2024-02-15' },
    { id: 2, title: 'Science Worksheet - Plant Life', type: 'worksheet', totalMarks: 25, dueDate: '2024-02-18' },
    { id: 3, title: 'English Essay - My School', type: 'essay', totalMarks: 30, dueDate: '2024-02-20' }
  ];

  // Mock student submissions
  const mockSubmissions = [
    {
      id: 1,
      studentId: 'S001',
      studentName: 'Emma Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face',
      submittedAt: '2024-02-14T10:30:00Z',
      answers: [
        { questionId: 1, answer: '3/4', type: 'objective' },
        { questionId: 2, answer: '0.75', type: 'objective' },
        { questionId: 3, answer: 'To find equivalent fractions, multiply both numerator and denominator by the same number.', type: 'subjective' }
      ],
      status: 'submitted'
    },
    {
      id: 2,
      studentId: 'S002',
      studentName: 'Liam Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      submittedAt: '2024-02-14T11:15:00Z',
      answers: [
        { questionId: 1, answer: '2/3', type: 'objective' },
        { questionId: 2, answer: '0.67', type: 'objective' },
        { questionId: 3, answer: 'You can find equivalent fractions by multiplying top and bottom by same number.', type: 'subjective' }
      ],
      status: 'submitted'
    },
    {
      id: 3,
      studentId: 'S003',
      studentName: 'Olivia Brown',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      submittedAt: '2024-02-14T09:45:00Z',
      answers: [
        { questionId: 1, answer: '3/4', type: 'objective' },
        { questionId: 2, answer: '0.75', type: 'objective' },
        { questionId: 3, answer: 'Equivalent fractions are different fractions that represent the same value. You create them by multiplying or dividing both parts by the same number.', type: 'subjective' }
      ],
      status: 'submitted'
    }
  ];

  const loadSubmissions = (assignmentId) => {
    if (assignmentId) {
      setSubmissions(mockSubmissions);
      toast({
        title: "Submissions Loaded",
        description: `Found ${mockSubmissions.length} submissions for this assignment.`,
      });
    } else {
      setSubmissions([]);
    }
  };

  const evaluateSubmissions = async () => {
    if (submissions.length === 0) {
      toast({
        title: "No Submissions",
        description: "Please select an assignment with submissions first.",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);

    // Simulate AI evaluation
    setTimeout(() => {
      const results = submissions.map(submission => ({
        ...submission,
        evaluation: {
          totalScore: Math.floor(Math.random() * 6) + 15, // 15-20 for 20 marks
          maxScore: 20,
          percentage: Math.floor(((Math.floor(Math.random() * 6) + 15) / 20) * 100),
          feedback: generateFeedback(submission.studentName),
          questionScores: submission.answers.map(answer => ({
            questionId: answer.questionId,
            score: answer.type === 'objective' ? (Math.random() > 0.3 ? 3 : 2) : Math.floor(Math.random() * 3) + 3,
            maxScore: answer.type === 'objective' ? 3 : 5,
            feedback: generateQuestionFeedback(answer.type)
          })),
          strengths: generateStrengths(),
          improvements: generateImprovements(),
          evaluatedAt: new Date().toISOString()
        }
      }));

      setEvaluationResults(results);
      setIsEvaluating(false);

      toast({
        title: "Evaluation Complete!",
        description: `AI has evaluated ${results.length} submissions with detailed feedback.`,
      });
    }, 3000);
  };

  const generateFeedback = (studentName) => {
    const feedbacks = [
      `${studentName} shows good understanding of the concepts. Keep up the excellent work!`,
      `${studentName} demonstrates solid grasp of the material with room for improvement in explanation clarity.`,
      `${studentName} has done well overall. Practice more word problems to strengthen application skills.`,
      `${studentName} shows promising progress. Focus on showing detailed working for better marks.`
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  const generateQuestionFeedback = (type) => {
    if (type === 'objective') {
      return Math.random() > 0.3 ? 'Correct answer!' : 'Close, but check calculation.';
    } else {
      const subjective = [
        'Well explained with good examples.',
        'Good concept understanding, add more detail.',
        'Correct but needs clearer explanation.',
        'Excellent detailed response!'
      ];
      return subjective[Math.floor(Math.random() * subjective.length)];
    }
  };

  const generateStrengths = () => [
    'Strong conceptual understanding',
    'Clear problem-solving approach',
    'Good attention to detail'
  ];

  const generateImprovements = () => [
    'Show more detailed working',
    'Practice explaining steps clearly',
    'Review calculation accuracy'
  ];

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-slate-800">AI Student Evaluation System</h1>
        </div>
        <p className="text-slate-600">Automated grading and feedback generation for student submissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Assignment Selection */}
        <Card className="lg:col-span-1 border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span>Select Assignment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Assignment</Label>
              <Select value={selectedAssignment} onValueChange={(value) => {
                setSelectedAssignment(value);
                loadSubmissions(value);
                setEvaluationResults([]);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment" />
                </SelectTrigger>
                <SelectContent>
                  {assignments.map(assignment => (
                    <SelectItem key={assignment.id} value={assignment.id.toString()}>
                      {assignment.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedAssignment && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2">
                <div className="text-sm">
                  <span className="font-medium text-purple-700">Type:</span>
                  <p className="text-slate-700 capitalize">{assignments.find(a => a.id.toString() === selectedAssignment)?.type}</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-purple-700">Total Marks:</span>
                  <p className="text-slate-700">{assignments.find(a => a.id.toString() === selectedAssignment)?.totalMarks}</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-purple-700">Submissions:</span>
                  <p className="text-slate-700">{submissions.length}</p>
                </div>
              </div>
            )}

            <Button 
              onClick={evaluateSubmissions}
              disabled={isEvaluating || submissions.length === 0}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              {isEvaluating ? (
                <>
                  <Brain className="mr-2 h-4 w-4 animate-pulse" />
                  AI Evaluating...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Evaluate All
                </>
              )}
            </Button>

            {evaluationResults.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Class Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Score:</span>
                    <span className="font-medium">
                      {Math.round(evaluationResults.reduce((sum, r) => sum + r.evaluation.percentage, 0) / evaluationResults.length)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Highest Score:</span>
                    <span className="font-medium text-green-600">
                      {Math.max(...evaluationResults.map(r => r.evaluation.percentage))}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Lowest Score:</span>
                    <span className="font-medium text-red-600">
                      {Math.min(...evaluationResults.map(r => r.evaluation.percentage))}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evaluation Results */}
        <Card className="lg:col-span-3 border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Evaluation Results</span>
              </div>
              {evaluationResults.length > 0 && (
                <Badge className="bg-green-100 text-green-800">
                  {evaluationResults.length} Evaluated
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              AI-powered grading with detailed feedback and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEvaluating && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-purple-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">AI Evaluation in Progress</h3>
                <p className="text-slate-600 mb-4">Analyzing answers, checking accuracy, and generating personalized feedback...</p>
                <Progress value={66} className="max-w-xs mx-auto" />
              </div>
            )}

            {evaluationResults.length > 0 && (
              <div className="space-y-6">
                {evaluationResults.map(result => (
                  <Card key={result.id} className="border border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={result.avatar} alt={result.studentName} />
                            <AvatarFallback>{result.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-slate-800">{result.studentName}</h3>
                            <p className="text-sm text-slate-600">Submitted: {new Date(result.submittedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Badge className={`text-lg font-bold ${getScoreColor(result.evaluation.percentage)} bg-transparent border-0`}>
                              {result.evaluation.totalScore}/{result.evaluation.maxScore}
                            </Badge>
                            <Badge className={`${result.evaluation.percentage >= 75 ? 'bg-green-100 text-green-800' : result.evaluation.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              Grade {getGrade(result.evaluation.percentage)}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">{result.evaluation.percentage}%</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Score Breakdown */}
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <h4 className="font-medium text-slate-700 mb-2">Question-wise Scores</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {result.evaluation.questionScores.map(qScore => (
                            <div key={qScore.questionId} className="flex items-center justify-between">
                              <span className="text-sm text-slate-600">Q{qScore.questionId}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{qScore.score}/{qScore.maxScore}</span>
                                {qScore.score === qScore.maxScore && <Star className="h-3 w-3 text-yellow-500" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Feedback */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Strengths
                          </h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            {result.evaluation.strengths.map((strength, index) => (
                              <li key={index}>• {strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Areas for Improvement
                          </h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            {result.evaluation.improvements.map((improvement, index) => (
                              <li key={index}>• {improvement}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Overall Feedback */}
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <h4 className="font-medium text-purple-800 mb-2">Teacher's AI-Generated Feedback</h4>
                        <p className="text-sm text-purple-700">{result.evaluation.feedback}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isEvaluating && evaluationResults.length === 0 && submissions.length === 0 && (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">Ready to Evaluate</h3>
                <p className="text-slate-500">Select an assignment to load student submissions for AI evaluation</p>
              </div>
            )}

            {submissions.length > 0 && evaluationResults.length === 0 && !isEvaluating && (
              <div className="text-center py-8">
                <Upload className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">{submissions.length} Submissions Ready</h3>
                <p className="text-slate-500 mb-4">Click "Evaluate All" to start AI-powered assessment</p>
                <Button 
                  onClick={evaluateSubmissions}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Start Evaluation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Card */}
      <Card className="border-0 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">🤖 AI Evaluation Features</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <ul className="space-y-1">
            <li>• Automatic grading for both objective and subjective questions</li>
            <li>• Personalized feedback highlighting strengths and improvement areas</li>
            <li>• Question-wise score breakdown for detailed analysis</li>
            <li>• Class performance statistics and trends</li>
            <li>• Consistent grading standards across all submissions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentEvaluation;