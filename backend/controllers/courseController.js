const Course = require('../models/Course');
const { generateSuggestions, predictMarks } = require('../utils/prediction');

// @desc    Get all courses for a user
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    // Calculate stats for each course
    const coursesWithStats = courses.map(course => {
      const stats = course.calculateStats();
      return {
        ...course._doc,
        stats,
      };
    });
    
    res.json(coursesWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check ownership
    if (course.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const stats = course.calculateStats();
    const suggestions = generateSuggestions(stats);
    const marks = predictMarks(stats.sectionAPercentage, stats.sectionBPercentage);
    
    res.json({
      ...course._doc,
      stats,
      suggestions,
      marks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private
const createCourse = async (req, res) => {
  try {
    const { courseName, totalClasses = 30 } = req.body;
    
    if (!courseName) {
      return res.status(400).json({ message: 'Please provide a course name' });
    }
    
    // Initialize attendance arrays for both sections
    const sectionAAttendance = [];
    const sectionBAttendance = [];
    
    for (let i = 1; i <= totalClasses; i++) {
      sectionAAttendance.push({
        classNumber: i,
        attended: false,
      });
      sectionBAttendance.push({
        classNumber: i,
        attended: false,
      });
    }
    
    const course = await Course.create({
      user: req.user.id,
      courseName,
      totalClasses,
      sectionA: {
        total: totalClasses,
        attended: 0,
        attendance: sectionAAttendance,
      },
      sectionB: {
        total: totalClasses,
        attended: 0,
        attendance: sectionBAttendance,
      },
    });
    
    const stats = course.calculateStats();
    
    res.status(201).json({
      ...course._doc,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check ownership
    if (course.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { courseName, totalClasses } = req.body;
    
    if (courseName) course.courseName = courseName;
    
    res.json(await course.save());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check ownership
    if (course.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await course.deleteOne();
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update attendance for a course
// @route   PUT /api/courses/:id/attendance
// @access  Private
const updateAttendance = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check ownership
    if (course.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { section, classNumber, attended } = req.body;
    
    if (!section || !['A', 'B'].includes(section)) {
      return res.status(400).json({ message: 'Invalid section' });
    }
    
    if (typeof classNumber !== 'number' || classNumber < 1) {
      return res.status(400).json({ message: 'Invalid class number' });
    }
    
    const sectionKey = section === 'A' ? 'sectionA' : 'sectionB';
    const attendanceArray = course[sectionKey].attendance;
    
    // Find and update the specific class
    const classIndex = attendanceArray.findIndex(
      (item) => item.classNumber === classNumber
    );
    
    if (classIndex === -1) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Update attendance status
    const wasAttended = attendanceArray[classIndex].attended;
    attendanceArray[classIndex].attended = attended;
    attendanceArray[classIndex].date = Date.now();
    
    // Update attended count
    if (attended && !wasAttended) {
      course[sectionKey].attended += 1;
    } else if (!attended && wasAttended) {
      course[sectionKey].attended -= 1;
    }
    
    await course.save();
    
    const stats = course.calculateStats();
    const suggestions = generateSuggestions(stats);
    
    res.json({
      ...course._doc,
      stats,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  updateAttendance,
};
