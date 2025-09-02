import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Upload, FileText, Sparkles, Download, Eye, Loader2, BookOpen, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const ContentUpload = () => {
  const { selectedClass } = useAuth();
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [worksheetType, setWorksheetType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheets, setGeneratedWorksheets] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const availableGrades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
  const worksheetTypes = ['Practice Exercises', 'Homework Assignment', 'Quiz Questions', 'Review Sheet', 'Assessment'];
  const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Mixed'];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      simulateUpload();
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully.`,
      });
    }
  };

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleGradeToggle = (grade) => {
    setSelectedGrades(prev => 
      prev.includes(grade) 
        ? prev.filter(g => g !== grade)
        : [...prev, grade]
    );
  };

  const generateWorksheets = async () => {
    if (!uploadedFile) {
      toast({
        title: "No File Uploaded",
        description: "Please upload a textbook page or content first.",
        variant: "destructive",
      });
      return;
    }

    if (selectedGrades.length === 0) {
      toast({
        title: "No Grades Selected",
        description: "Please select at least one grade level.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      const mockWorksheets = selectedGrades.map(grade => ({
        id: Date.now() + Math.random(),
        grade,
        type: worksheetType,
        difficulty,
        title: `${worksheetType} - ${grade}`,
        questions: generateMockQuestions(grade),
        createdAt: new Date().toISOString(),
        status: 'ready'
      }));

      setGeneratedWorksheets(mockWorksheets);
      setIsGenerating(false);

      toast({
        title: "Worksheets Generated!",
        description: `${mockWorksheets.length} worksheets created successfully.`,
      });
    }, 3000);
  };

  const generateMockQuestions = (grade) => {
    const gradeLevel = parseInt(grade.split(' ')[1]);
    const baseQuestions = [
      `Solve the following problem appropriate for ${grade} students.`,
      `Complete the sentence with the correct word for ${grade} level.`,
      `Draw and label the diagram as taught in ${grade}.`,
      `Calculate the answer using ${grade} level mathematics.`,
      `Explain in your own words (${grade} appropriate language).`
    ];

    return baseQuestions.map((q, index) => ({
      id: index + 1,
      question: q,
      type: index % 2 === 0 ? 'objective' : 'subjective',
      points: Math.floor(Math.random() * 5) + 1
    }));
  };

  const downloadWorksheet = (worksheet) => {
    // Simulate download
    const content = `WORKSHEET: ${worksheet.title}\nGrade: ${worksheet.grade}\nType: ${worksheet.type}\nDifficulty: ${worksheet.difficulty}\n\nQuestions:\n${worksheet.questions.map((q, i) => `${i + 1}. ${q.question}`).join('\n\n')}`;
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${worksheet.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Download Started",
      description: `${worksheet.title} is being downloaded.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Upload className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-800">Content Upload & Worksheet Generator</h1>
        </div>
        <p className="text-slate-600">Upload textbook content and generate customized worksheets for multiple grade levels</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="lg:col-span-1 border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span>Upload Content</span>
            </CardTitle>
            <CardDescription>
              Upload textbook pages, chapters, or any educational content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select File</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, DOC, TXT, or Images</p>
                </label>
              </div>
            </div>

            {uploadedFile && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">{uploadedFile.name}</span>
                </div>
                <Progress value={uploadProgress} className="mt-2 h-2" />
              </div>
            )}

            {/* Worksheet Configuration */}
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Worksheet Type</Label>
                <Select value={worksheetType} onValueChange={setWorksheetType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select worksheet type" />
                  </SelectTrigger>
                  <SelectContent>
                    {worksheetTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              <div className="space-y-2">
                <Label>Target Grades</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableGrades.map(grade => (
                    <div key={grade} className="flex items-center space-x-2">
                      <Checkbox
                        id={grade}
                        checked={selectedGrades.includes(grade)}
                        onCheckedChange={() => handleGradeToggle(grade)}
                      />
                      <Label htmlFor={grade} className="text-sm">{grade}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generation Section */}
        <Card className="lg:col-span-2 border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span>AI Worksheet Generation</span>
              </div>
              <Button 
                onClick={generateWorksheets}
                disabled={isGenerating || !uploadedFile}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Worksheets
                  </>
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              AI will analyze your content and create customized worksheets for each selected grade
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">AI Processing Content</h3>
                <p className="text-slate-600 mb-4">Analyzing content and generating grade-appropriate worksheets...</p>
                <Progress value={66} className="max-w-xs mx-auto" />
              </div>
            )}

            {generatedWorksheets.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Generated Worksheets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedWorksheets.map(worksheet => (
                    <Card key={worksheet.id} className="border border-slate-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-blue-100 text-blue-800">
                            {worksheet.grade}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            {worksheet.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-base">{worksheet.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {worksheet.difficulty} • {worksheet.questions.length} questions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => {
                              toast({
                                title: "Preview",
                                description: `Opening preview for ${worksheet.title}`,
                              });
                            }}
                          >
                            <Eye className="mr-2 h-3 w-3" />
                            Preview
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => downloadWorksheet(worksheet)}
                          >
                            <Download className="mr-2 h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!isGenerating && generatedWorksheets.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">Ready to Generate</h3>
                <p className="text-slate-500">Upload content and configure settings to generate worksheets</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Card */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-lg text-slate-700">💡 Content Upload Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <ul className="space-y-1">
            <li>• Upload clear, high-quality images of textbook pages for best results</li>
            <li>• PDF files work great for multi-page content</li>
            <li>• Select multiple grades to create differentiated worksheets automatically</li>
            <li>• Mixed difficulty creates varied questions for diverse learning needs</li>
            <li>• Generated worksheets can be customized and edited before distribution</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentUpload;