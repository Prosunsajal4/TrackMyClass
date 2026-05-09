"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "../../../components/common/ProtectedRoute";
import Header from "../../../components/common/Header";
import Sidebar from "../../../components/common/Sidebar";
import { courseAPI } from "../../../services/api";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Check,
  X,
  TrendingUp,
  AlertTriangle,
  Download,
  Lightbulb,
} from "lucide-react";
import jsPDF from "jspdf";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("A");

  useEffect(() => {
    fetchCourse();
  }, [params.id]);

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getCourseById(params.id);
      setCourse(response.data);
    } catch (error) {
      toast.error("Failed to fetch course details");
      router.push("/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceToggle = async (
    section,
    classNumber,
    currentStatus,
  ) => {
    try {
      await courseAPI.updateAttendance(params.id, {
        section,
        classNumber,
        attended: !currentStatus,
      });

      const response = await courseAPI.getCourseById(params.id);
      setCourse(response.data);

      toast.success("Attendance updated");
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text(course.courseName, 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Overall Attendance: ${course.stats.overallPercentage}%`, 20, 35);
    doc.text(`Total Marks: ${course.stats.totalMarks}/10`, 20, 45);
    doc.text(
      `Section A: ${course.stats.sectionAPercentage}% (${course.stats.sectionAMarks}/5)`,
      20,
      55,
    );
    doc.text(
      `Section B: ${course.stats.sectionBPercentage}% (${course.stats.sectionBMarks}/5)`,
      20,
      65,
    );

    doc.text("Section A Attendance:", 20, 80);
    let yPos = 90;
    course.sectionA.attendance.forEach((item) => {
      doc.text(
        `Class ${item.classNumber}: ${item.attended ? "Present" : "Absent"}`,
        25,
        yPos,
      );
      yPos += 7;
    });

    doc.addPage();
    doc.text("Section B Attendance:", 20, 20);
    yPos = 30;
    course.sectionB.attendance.forEach((item) => {
      doc.text(
        `Class ${item.classNumber}: ${item.attended ? "Present" : "Absent"}`,
        25,
        yPos,
      );
      yPos += 7;
    });

    doc.save(`${course.courseName}_attendance.pdf`);
    toast.success("PDF exported successfully");
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentSection =
    activeSection === "A" ? course.sectionA : course.sectionB;
  const currentPercentage =
    activeSection === "A"
      ? course.stats.sectionAPercentage
      : course.stats.sectionBPercentage;
  const currentMarks =
    activeSection === "A"
      ? course.stats.sectionAMarks
      : course.stats.sectionBMarks;

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <Header title={course.courseName} />

          <div className="mt-8 space-y-6">
            {/* Back Button and Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push("/courses")}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Courses
              </button>

              <button
                onClick={exportToPDF}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export PDF
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-card rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Overall Attendance
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {course.stats.overallPercentage}%
                </p>
              </div>

              <div className="glass-card rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Marks
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                  {course.stats.totalMarks}/10
                </p>
              </div>

              <div className="glass-card rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Attended
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {course.stats.totalAttended}
                </p>
              </div>

              <div className="glass-card rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Risk Level
                </p>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    course.stats.riskLevel === "high"
                      ? "text-red-600 dark:text-red-400"
                      : course.stats.riskLevel === "medium"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {course.stats.riskLevel}
                </p>
              </div>
            </div>

            {/* Section Tabs */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveSection("A")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    activeSection === "A"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                  }`}
                >
                  Section A
                </button>
                <button
                  onClick={() => setActiveSection("B")}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    activeSection === "B"
                      ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                  }`}
                >
                  Section B
                </button>
              </div>
            </div>

            {/* Section Stats */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Section {activeSection} Statistics
                </h3>
                <div
                  className={`px-4 py-2 rounded-full font-semibold ${
                    currentPercentage >= 75
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : currentPercentage >= 60
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  }`}
                >
                  {currentPercentage}% - {currentMarks}/5 marks
                </div>
              </div>

              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    activeSection === "A"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : "bg-gradient-to-r from-indigo-500 to-indigo-600"
                  }`}
                  style={{ width: `${currentPercentage}%` }}
                />
              </div>

              <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{currentSection.attended} attended</span>
                <span>
                  {currentSection.total - currentSection.attended} missed
                </span>
              </div>
            </div>

            {/* AI Suggestions */}
            {course.suggestions && course.suggestions.length > 0 && (
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    AI Suggestions
                  </h3>
                </div>
                <div className="space-y-3">
                  {course.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        suggestion.type === "danger"
                          ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                          : suggestion.type === "warning"
                            ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                            : suggestion.type === "success"
                              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                              : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      <p className="text-gray-800 dark:text-white">
                        {suggestion.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendance Grid */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Section {activeSection} Attendance
              </h3>

              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {currentSection.attendance.map((item) => (
                  <button
                    key={item.classNumber}
                    onClick={() =>
                      handleAttendanceToggle(
                        activeSection,
                        item.classNumber,
                        item.attended,
                      )
                    }
                    aria-label={`Class ${item.classNumber} in Section ${activeSection}: ${item.attended ? "Attended" : "Absent"}. Click to toggle.`}
                    className={`relative aspect-square rounded-lg flex items-center justify-center font-semibold text-lg transition-all duration-300 transform hover:scale-110 ${
                      item.attended
                        ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {item.attended ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <X className="w-6 h-6" />
                    )}
                    <span className="absolute bottom-1 right-1 text-xs opacity-50">
                      {item.classNumber}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-green-600" />
                  <span>Attended</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-200 dark:bg-slate-700" />
                  <span>Absent</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
