const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseName: {
    type: String,
    required: [true, 'Please add a course name'],
    trim: true,
  },
  totalClasses: {
    type: Number,
    default: 30,
  },
  sectionA: {
    total: {
      type: Number,
      default: 30,
    },
    attended: {
      type: Number,
      default: 0,
    },
    attendance: [{
      classNumber: {
        type: Number,
        required: true,
      },
      attended: {
        type: Boolean,
        default: false,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  sectionB: {
    total: {
      type: Number,
      default: 30,
    },
    attended: {
      type: Number,
      default: 0,
    },
    attendance: [{
      classNumber: {
        type: Number,
        required: true,
      },
      attended: {
        type: Boolean,
        default: false,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
courseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate attendance statistics
courseSchema.methods.calculateStats = function () {
  const sectionAPercentage = this.sectionA.total > 0 
    ? (this.sectionA.attended / this.sectionA.total) * 100 
    : 0;
  const sectionBPercentage = this.sectionB.total > 0 
    ? (this.sectionB.attended / this.sectionB.total) * 100 
    : 0;
  
  const overallPercentage = (sectionAPercentage + sectionBPercentage) / 2;
  
  // Calculate marks (5 marks for each section, total 10)
  const sectionAMarks = (sectionAPercentage / 100) * 5;
  const sectionBMarks = (sectionBPercentage / 100) * 5;
  const totalMarks = sectionAMarks + sectionBMarks;
  
  const totalAttended = this.sectionA.attended + this.sectionB.attended;
  const totalMissed = (this.sectionA.total - this.sectionA.attended) + 
                      (this.sectionB.total - this.sectionB.attended);
  const totalClasses = this.sectionA.total + this.sectionB.total;
  
  // Calculate safe absences (can miss while staying above 75%)
  const requiredAttendedFor75 = Math.ceil(totalClasses * 0.75);
  const safeAbsences = totalAttended - requiredAttendedFor75;
  
  // Determine risk level
  let riskLevel = 'low';
  if (overallPercentage < 60) {
    riskLevel = 'high';
  } else if (overallPercentage < 75) {
    riskLevel = 'medium';
  }
  
  return {
    sectionAPercentage: Math.round(sectionAPercentage * 10) / 10,
    sectionBPercentage: Math.round(sectionBPercentage * 10) / 10,
    overallPercentage: Math.round(overallPercentage * 10) / 10,
    sectionAMarks: Math.round(sectionAMarks * 10) / 10,
    sectionBMarks: Math.round(sectionBMarks * 10) / 10,
    totalMarks: Math.round(totalMarks * 10) / 10,
    totalAttended,
    totalMissed,
    totalClasses,
    safeAbsences,
    riskLevel,
  };
};

module.exports = mongoose.model('Course', courseSchema);
