import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import OnboardingFlow from "./components/OnboardingFlow";
import Layout from "./components/Layout";
import EnhancedDashboard from "./components/EnhancedDashboard";
import ContentUpload from "./components/ContentUpload";
import LessonPlanner from "./components/LessonPlanner";
import QuestionPaperGenerator from "./components/QuestionPaperGenerator";
import StudentEvaluation from "./components/StudentEvaluation";
import ReportsAnalytics from "./components/ReportsAnalytics";
import ParentCommunication from "./components/ParentCommunication";
import NotesGenerator from "./components/NotesGenerator";
import QuizGenerator from "./components/QuizGenerator";
import Attendance from "./components/Attendance";
import Reminders from "./components/Reminders";
import { Toaster } from "./components/ui/toaster";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <p className="text-slate-600">Loading Sahayak...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <LoginPage />;
  }

  // Logged in but not onboarded
  if (!user.isOnboarded) {
    return <OnboardingFlow />;
  }

  // Fully authenticated and onboarded
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<EnhancedDashboard />} />
        <Route path="/content-upload" element={<ContentUpload />} />
        <Route path="/lesson-planner" element={<LessonPlanner />} />
        <Route path="/question-papers" element={<QuestionPaperGenerator />} />
        <Route path="/evaluation" element={<StudentEvaluation />} />
        <Route path="/reports" element={<ReportsAnalytics />} />
        <Route path="/communication" element={<ParentCommunication />} />
        <Route path="/notes" element={<NotesGenerator />} />
        <Route path="/quiz" element={<QuizGenerator />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/reminders" element={<Reminders />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;