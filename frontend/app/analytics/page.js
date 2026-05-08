'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { userAPI } from '../../services/api';
import { Bar, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await userAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
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

  const sectionComparisonData = {
    labels: analytics.courses.map((c) => c.courseName),
    datasets: [
      {
        label: 'Section A',
        data: analytics.courses.map((c) => c.sectionAPercentage),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Section B',
        data: analytics.courses.map((c) => c.sectionBPercentage),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const marksVisualizationData = {
    labels: analytics.courses.map((c) => c.courseName),
    datasets: [
      {
        label: 'Total Marks',
        data: analytics.courses.map((c) => c.totalMarks),
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Section A Marks',
        data: analytics.courses.map((c) => c.sectionAMarks),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Section B Marks',
        data: analytics.courses.map((c) => c.sectionBMarks),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const radarData = {
    labels: analytics.courses.map((c) => c.courseName),
    datasets: [
      {
        label: 'Overall Attendance',
        data: analytics.courses.map((c) => c.overallPercentage),
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(34, 197, 94, 1)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6b7280',
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#6b7280',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#6b7280',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6b7280',
          padding: 20,
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#6b7280',
          backdropColor: 'transparent',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        pointLabels: {
          color: '#6b7280',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <Header title="Analytics" />
          
          <div className="mt-8 space-y-6">
            {/* Average Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card rounded-xl p-6 animate-fadeIn">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Average Section A</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {analytics.averages.sectionA}%
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Average Section B</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {analytics.averages.sectionB}%
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Overall Average</h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {analytics.averages.overall}%
                </p>
              </div>
            </div>

            {/* Section Comparison Chart */}
            <div className="glass-card rounded-xl p-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Section Comparison
              </h3>
              <div className="h-80">
                <Bar data={sectionComparisonData} options={chartOptions} />
              </div>
            </div>

            {/* Marks Visualization */}
            <div className="glass-card rounded-xl p-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Marks Distribution
              </h3>
              <div className="h-80">
                <Bar data={marksVisualizationData} options={chartOptions} />
              </div>
            </div>

            {/* Radar Chart */}
            {analytics.courses.length > 0 && (
              <div className="glass-card rounded-xl p-6 animate-fadeIn">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Attendance Overview
                </h3>
                <div className="h-80 flex items-center justify-center">
                  <Radar data={radarData} options={radarOptions} />
                </div>
              </div>
            )}

            {/* Course-wise Analytics Table */}
            <div className="glass-card rounded-xl p-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Course-wise Analytics
              </h3>
              
              {analytics.courses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No courses to analyze</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                          Course
                        </th>
                        <th className="text-center py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                          Section A
                        </th>
                        <th className="text-center py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                          Section B
                        </th>
                        <th className="text-center py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                          Overall
                        </th>
                        <th className="text-center py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                          Marks
                        </th>
                        <th className="text-center py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                          Risk
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.courses.map((course) => (
                        <tr
                          key={course.courseName}
                          className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                            {course.courseName}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-300">
                            {course.sectionAPercentage}%
                          </td>
                          <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-300">
                            {course.sectionBPercentage}%
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-gray-800 dark:text-white">
                            {course.overallPercentage}%
                          </td>
                          <td className="py-3 px-4 text-center font-semibold text-purple-600 dark:text-purple-400">
                            {course.totalMarks}/10
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                course.riskLevel === 'high'
                                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                  : course.riskLevel === 'medium'
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                  : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              }`}
                            >
                              {course.riskLevel}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
