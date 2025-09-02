import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { FileQuestion, Download, Eye, Sparkles, Loader2, BookOpen, Key, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const QuestionPaperGenerator = () => {
  const { selectedClass } = useAuth();
  const { toast } = useToast();
  const [examType, setExamType] = useState('');
  const [subject, setSubject] = useState('');
  const [topics, setTopics] = useState([]);
  const [duration, setDuration] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionTypes, setQuestionTypes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [generatedAnswerKey, setGeneratedAnswerKey] = useState(null);

  const examTypes = ['Unit Test', 'Mid-term Exam', 'Final Exam', 'Quiz', 'Practice Test'];
  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'History', 'Geography'];
  const availableTopics = {
    'Mathematics': ['Fractions', 'Geometry', 'Algebra', 'Statistics', 'Probability'],
    'Science': ['Plants', 'Animals', 'Weather', 'Simple Machines', 'Matter'],
    'English': ['Reading Comprehension', 'Grammar', 'Creative Writing', 'Vocabulary', 'Poetry'],
    'Social Studies': ['Community', 'Government', 'Geography', 'History', 'Economics'],
    'History': ['Ancient Civilizations', 'World Wars', 'Independence', 'Famous Leaders', 'Cultural Heritage'],
    'Geography': ['Maps', 'Climate', 'Landforms', 'Countries', 'Natural Resources']
  };
  const durations = ['30 minutes', '1 hour', '1.5 hours', '2 hours', '3 hours'];
  const markOptions = ['20', '25', '50', '75', '100'];
  const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Mixed'];
  const questionTypeOptions = ['Multiple Choice', 'Short Answer', 'Long Answer', 'Fill in Blanks', 'True/False', 'Match the Following'];

  const handleTopicToggle = (topic) => {
    setTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleQuestionTypeToggle = (type) => {
    setQuestionTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const generateQuestionPaper = async () => {
    if (!subject || topics.length === 0 || questionTypes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      const paper = generateMockQuestionPaper();
      const answerKey = generateMockAnswerKey(paper);
      
      setGeneratedPaper(paper);
      setGeneratedAnswerKey(answerKey);
      setIsGenerating(false);

      toast({
        title: "Question Paper Generated!",
        description: "Question paper and answer key created successfully.",
      });
    }, 3500);
  };

  const generateMockQuestionPaper = () => {
    const questions = [];
    let questionNumber = 1;
    let currentMarks = 0;
    const targetMarks = parseInt(totalMarks);

    questionTypes.forEach(type => {
      const questionsForType = generateQuestionsForType(type, questionNumber);
      questions.push(...questionsForType);
      questionNumber += questionsForType.length;
      currentMarks += questionsForType.reduce((sum, q) => sum + q.marks, 0);
    });

    return {
      id: Date.now(),
      examType,
      subject,
      grade: selectedClass?.grade || 'Grade 5',
      className: selectedClass?.className || 'A',
      topics: topics,
      duration,
      totalMarks: targetMarks,
      difficulty,
      questions,
      instructions: [
        'Read all questions carefully before answering.',
        'Answer all questions.',
        'Write clearly and legibly.',
        'Time management is important.',
        'Check your answers before submitting.'
      ],
      createdAt: new Date().toISOString()
    };
  };

  const generateQuestionsForType = (type, startNumber) => {
    const questionsPerType = Math.ceil(5 / questionTypes.length);
    const questions = [];

    for (let i = 0; i < questionsPerType; i++) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      questions.push({
        number: startNumber + i,
        type,
        topic: randomTopic,
        question: generateQuestionByType(type, randomTopic),
        marks: getMarksForQuestionType(type),
        options: type === 'Multiple Choice' ? generateMCQOptions() : null,
        answer: generateAnswerByType(type, randomTopic)
      });
    }

    return questions;
  };

  const generateQuestionByType = (type, topic) => {
    const templates = {
      'Multiple Choice': `Which of the following best describes ${topic}?`,
      'Short Answer': `Explain the key concepts of ${topic} in 2-3 sentences.`,
      'Long Answer': `Discuss ${topic} in detail with examples and applications.`,
      'Fill in Blanks': `${topic} is important because _______ and it helps in _______.`,
      'True/False': `${topic} is a fundamental concept in this subject.`,
      'Match the Following': `Match the terms related to ${topic} with their definitions.`
    };
    return templates[type] || `Answer the question about ${topic}.`;
  };

  const getMarksForQuestionType = (type) => {
    const markDistribution = {
      'Multiple Choice': 1,
      'True/False': 1,
      'Fill in Blanks': 2,
      'Short Answer': 3,
      'Match the Following': 4,
      'Long Answer': 5
    };
    return markDistribution[type] || 2;
  };

  const generateMCQOptions = () => [
    'Option A - First choice',
    'Option B - Second choice', 
    'Option C - Third choice',
    'Option D - Fourth choice'
  ];

  const generateAnswerByType = (type, topic) => {
    const answers = {
      'Multiple Choice': 'Option B - Second choice',
      'Short Answer': `${topic} involves understanding key principles and applying them in practical situations.`,
      'Long Answer': `${topic} is a comprehensive subject that requires detailed analysis and understanding...`,
      'Fill in Blanks': 'it provides foundation, understanding complex concepts',
      'True/False': 'True',
      'Match the Following': 'A-2, B-1, C-4, D-3'
    };
    return answers[type] || `Answer related to ${topic}`;
  };

  const generateMockAnswerKey = (paper) => ({
    id: paper.id + '_key',
    paperId: paper.id,
    answers: paper.questions.map(q => ({
      questionNumber: q.number,
      type: q.type,
      answer: q.answer,
      marks: q.marks,
      gradingCriteria: generateGradingCriteria(q.type)
    })),
    totalMarks: paper.questions.reduce((sum, q) => sum + q.marks, 0),
    createdAt: new Date().toISOString()
  });

  const generateGradingCriteria = (type) => {
    const criteria = {
      'Multiple Choice': 'Full marks for correct option, no partial marks.',
      'Short Answer': 'Full marks for complete answer, partial marks for incomplete but correct concepts.',
      'Long Answer': 'Marks distributed for: concept understanding (40%), examples (30%), presentation (30%).',
      'Fill in Blanks': 'Equal marks for each correct blank.',
      'True/False': 'Full marks for correct answer, no partial marks.',
      'Match the Following': 'Equal marks for each correct match.'
    };
    return criteria[type] || 'Award marks based on correctness and completeness.';
  };

  const downloadPaper = () => {
    if (!generatedPaper) return;

    const content = `${generatedPaper.examType.toUpperCase()}
Subject: ${generatedPaper.subject}
Grade: ${generatedPaper.grade} - Class ${generatedPaper.className}
Duration: ${generatedPaper.duration}
Total Marks: ${generatedPaper.totalMarks}

INSTRUCTIONS:
${generatedPaper.instructions.map(inst => `• ${inst}`).join('\n')}

QUESTIONS:

${generatedPaper.questions.map(q => `
Q${q.number}. ${q.question} (${q.marks} marks)
${q.options ? q.options.map((opt, i) => `   ${String.fromCharCode(97 + i)}) ${opt}`).join('\n') : ''}

`).join('')}

Topics Covered: ${generatedPaper.topics.join(', ')}
Generated on: ${new Date().toLocaleDateString()}
`;

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Question_Paper_${generatedPaper.subject}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Download Started",
      description: "Question paper is being downloaded.",
    });
  };

  const downloadAnswerKey = () => {
    if (!generatedAnswerKey) return;

    const content = `ANSWER KEY
Subject: ${generatedPaper.subject}
Grade: ${generatedPaper.grade} - Class ${generatedPaper.className}
Total Marks: ${generatedAnswerKey.totalMarks}

ANSWERS:

${generatedAnswerKey.answers.map(ans => `
Q${ans.questionNumber}. ${ans.answer} (${ans.marks} marks)
Grading Criteria: ${ans.gradingCriteria}

`).join('')}

Generated on: ${new Date().toLocaleDateString()}
`;

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Answer_Key_${generatedPaper.subject}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Download Started",
      description: "Answer key is being downloaded.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <FileQuestion className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-slate-800">Question Paper Generator</h1>
        </div>
        <p className="text-slate-600">Generate comprehensive question papers with automatic answer keys</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1 border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileQuestion className="h-5 w-5 text-indigo-600" />
              <span>Exam Configuration</span>
            </CardTitle>
            <CardDescription>
              Set up your question paper parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Settings */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Exam Type</Label>
                <Select value={examType} onValueChange={setExamType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subj => (
                      <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map(dur => (
                        <SelectItem key={dur} value={dur}>{dur}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Total Marks</Label>
                  <Select value={totalMarks} onValueChange={setTotalMarks}>
                    <SelectTrigger>
                      <SelectValue placeholder="Marks" />
                    </SelectTrigger>
                    <SelectContent>
                      {markOptions.map(mark => (
                        <SelectItem key={mark} value={mark}>{mark}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Topics Selection */}
            {subject && (
              <div className="space-y-2">
                <Label>Topics to Include</Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {availableTopics[subject]?.map(topic => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={topic}
                        checked={topics.includes(topic)}
                        onCheckedChange={() => handleTopicToggle(topic)}
                      />
                      <Label htmlFor={topic} className="text-sm">{topic}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Question Types */}
            <div className="space-y-2">
              <Label>Question Types</Label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {questionTypeOptions.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={questionTypes.includes(type)}
                      onCheckedChange={() => handleQuestionTypeToggle(type)}
                    />
                    <Label htmlFor={type} className="text-sm">{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={generateQuestionPaper}
              disabled={isGenerating || !subject || topics.length === 0}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Paper
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Paper Display */}
        <Card className="lg:col-span-2 border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <span>Generated Question Paper</span>
              </div>
              {generatedPaper && (
                <div className="flex space-x-2">
                  <Button 
                    onClick={downloadPaper}
                    variant="outline"
                    size="sm"
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Download Paper
                  </Button>
                  <Button 
                    onClick={downloadAnswerKey}
                    variant="outline"
                    size="sm"
                    className="border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <Key className="mr-2 h-3 w-3" />
                    Answer Key
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              AI-generated question paper with automatic answer key creation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileQuestion className="h-8 w-8 text-indigo-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Creating Question Paper</h3>
                <p className="text-slate-600 mb-4">Generating questions, organizing by difficulty, and creating answer key...</p>
                <Progress value={75} className="max-w-xs mx-auto" />
              </div>
            )}

            {generatedPaper && (
              <div className="space-y-6">
                {/* Paper Header */}
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                      <h3 className="font-semibold text-indigo-800">{generatedPaper.examType}</h3>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-800">
                      {generatedPaper.totalMarks} Marks
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-indigo-600 font-medium">Subject:</span>
                      <p className="text-slate-700">{generatedPaper.subject}</p>
                    </div>
                    <div>
                      <span className="text-indigo-600 font-medium">Grade:</span>
                      <p className="text-slate-700">{generatedPaper.grade} - {generatedPaper.className}</p>
                    </div>
                    <div>
                      <span className="text-indigo-600 font-medium">Duration:</span>
                      <p className="text-slate-700">{generatedPaper.duration}</p>
                    </div>
                    <div>
                      <span className="text-indigo-600 font-medium">Questions:</span>
                      <p className="text-slate-700">{generatedPaper.questions.length}</p>
                    </div>
                  </div>
                </div>

                {/* Questions Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700">Questions Preview</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedPaper.questions.slice(0, 5).map(question => (
                      <Card key={question.number} className="border border-slate-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">Q{question.number}</Badge>
                              <Badge className="bg-blue-100 text-blue-800">{question.type}</Badge>
                            </div>
                            <Badge className="bg-green-100 text-green-800">{question.marks} marks</Badge>
                          </div>
                          <p className="text-slate-700 mb-2">{question.question}</p>
                          {question.options && (
                            <div className="pl-4 space-y-1">
                              {question.options.map((option, index) => (
                                <p key={index} className="text-sm text-slate-600">{option}</p>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-slate-500 mt-2">Topic: {question.topic}</p>
                        </CardContent>
                      </Card>
                    ))}
                    {generatedPaper.questions.length > 5 && (
                      <div className="text-center text-sm text-slate-500">
                        ... and {generatedPaper.questions.length - 5} more questions
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!isGenerating && !generatedPaper && (
              <div className="text-center py-12">
                <FileQuestion className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">Ready to Generate</h3>
                <p className="text-slate-500">Configure your exam settings to generate a question paper</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Card */}
      <Card className="border-0 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">💡 Question Paper Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <ul className="space-y-1">
            <li>• AI balances question difficulty and ensures comprehensive topic coverage</li>
            <li>• Answer keys include grading criteria for consistent evaluation</li>
            <li>• Mixed difficulty levels provide appropriate challenge for all students</li>
            <li>• Question types can be customized based on learning objectives</li>
            <li>• Generated papers follow standard exam format and guidelines</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionPaperGenerator;