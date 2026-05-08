"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import Layout from "../../components/common/Layout";
import { userAPI } from "../../services/api";
import {
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await userAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
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

  const doughnutData = {
    labels: ["High Risk", "Medium Risk", "Low Risk"],
    datasets: [
      {
        data: [
          stats.highRiskCourses,
          stats.mediumRiskCourses,
          stats.lowRiskCourses,
        ],
        backgroundColor: ["#ef4444", "#f59e0b", "#22c55e"],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: stats.recentCourses.map((c) => c.courseName),
    datasets: [
      {
        label: "Attendance %",
        data: stats.recentCourses.map((c) => c.stats.overallPercentage),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#6b7280",
          padding: 20,
        },
      },
    },
  };

  return (
    <ProtectedRoute>
      <Layout title="Dashboard">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-xl p-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Courses
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                    {stats.totalCourses}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div
              className="glass-card rounded-xl p-6 animate-fadeIn"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Overall Attendance
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                    {stats.overallPercentage}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div
              className="glass-card rounded-xl p-6 animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Marks
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                    {stats.totalMarks}/10
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div
              className="glass-card rounded-xl p-6 animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Risk Courses
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                    {stats.highRiskCourses + stats.mediumRiskCourses}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Risk Distribution
              </h3>
              <div className="h-64" aria-label="Doughnut chart showing attendance risk levels: High Risk, Medium Risk, Low Risk">
                <Doughnut data={doughnutData} options={chartOptions} />
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Course Attendance
              </h3>
              <div className="h-64" aria-label="Bar chart showing attendance percentages for recent courses">
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Prediction Card */}
          <div className="glass-card rounded-xl p-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              AI Prediction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Predicted Attendance
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                  {stats.prediction.predictedPercentage}%
                </p>
                <div className="flex items-center mt-2">
                  {stats.prediction.trend === "stable" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : stats.prediction.trend === "declining" ? (
                    <ArrowDown className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm ml-2 capitalize">
                    {stats.prediction.trend}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Attended
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {stats.totalAttended}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  out of {stats.totalClasses} classes
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Next 5 Classes
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                  ~{stats.prediction.predictedAttended}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  predicted attendance
                </p>
              </div>
            </div>
          </div>

          {/* Recent Courses */}
          <div className="glass-card rounded-xl p-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Recent Courses
            </h3>
            {stats.recentCourses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No courses yet. Add your first course to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {course.courseName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {course.stats.totalAttended}/{course.stats.totalClasses}{" "}
                        classes attended
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800 dark:text-white">
                          {course.stats.overallPercentage}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {course.stats.totalMarks}/10 marks
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          course.stats.riskLevel === "high"
                            ? "bg-red-500"
                            : course.stats.riskLevel === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
