const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  updateAttendance,
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getCourses).post(protect, createCourse);
router
  .route('/:id')
  .get(protect, getCourseById)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);
router.put('/:id/attendance', protect, updateAttendance);

module.exports = router;
