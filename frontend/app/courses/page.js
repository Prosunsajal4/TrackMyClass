'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import Layout from '../../components/common/Layout';
import { courseAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ courseName: '', sectionATotal: 30, sectionBTotal: 30 });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getCourses();
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCourse) {
        await courseAPI.updateCourse(editingCourse._id, formData);
        toast.success('Course updated successfully');
      } else {
        await courseAPI.createCourse(formData);
        toast.success('Course added successfully');
      }
      
      setShowModal(false);
      setEditingCourse(null);
      setFormData({ courseName: '', sectionATotal: 30, sectionBTotal: 30 });
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({ 
      courseName: course.courseName, 
      sectionATotal: course.sectionA.total, 
      sectionBTotal: course.sectionB.total 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await courseAPI.deleteCourse(id);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex">
       Lbyout <div className="mt-8 space-y-6">
          {/* Search andButton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
              
              <button
                onClick={() => {
                  setEditingCourse(null);
                  setFormData({ courseName: '', sectionATotal: 30, sectionBTotal: 30 });
                  setShowModal(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Course
              </button>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
              <div className="glass-card rounded-xl p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {searchTerm ? 'No courses found' : 'No courses yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm
                    ? 'Try a different search term'
                    : 'Add your first course to start tracking attendance'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Course
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course._id}
                    className="glass-card rounded-xl p-6 hover:shadow-2xl transition-all duration-300 animate-fadeIn"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                          {course.courseName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Section A: {course.sectionA.total} | Section B: {course.sectionB.total}
                        </p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          course.stats.riskLevel === 'high'
                            ? 'bg-red-500 animate-pulse-glow'
                            : course.stats.riskLevel === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                      />
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Section A</span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {course.stats.sectionAPercentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${course.stats.sectionAPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Section B</span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {course.stats.sectionBPercentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${course.stats.sectionBPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Overall</p>
                        <p className="text-xl font-bold text-gray-800 dark:text-white">
                          {course.stats.overallPercentage}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Marks</p>
                        <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                          {course.stats.totalMarks}/10
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => (window.location.href = `/courses/${course._id}`)}
                        className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
                      >
                        View <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(course)}
                        className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="glass-card rounded-xl p-6 w-full max-w-md animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={formData.courseName}
                      onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                      className="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      placeholder="e.g., Mathematics 101"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Section A Total Classes
                    </label>
                    <input
                      type="number"
                      value={formData.sectionATotal}
                      onChange={(e) => setFormData({ ...formData, sectionATotal: parseInt(e.target.value) })}
                      className="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      min="1"
                      max="100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Section B Total Classes
                    </label>
                    <input
                      type="number"
                      value={formData.sectionBTotal}
                      onChange={(e) => setFormData({ ...formData, sectionBTotal: parseInt(e.target.value) })}
                      className="glass-input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      min="1"
                      max="100"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingCourse(null);
                        setFormData({ courseName: '', sectionATotal: 30, sectionBTotal: 30 });
                      }}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 btn-primary">
                      {editingCourse ? 'Update' : 'Add'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}