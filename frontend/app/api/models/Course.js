import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseName: {
    type: String,
    required: [true, "Please add a course name"],
    trim: true,
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
    attendance: [
      {
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
      },
    ],
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
    attendance: [
      {
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
      },
    ],
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

CourseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

CourseSchema.methods.calculateStats = function () {
  const sectionAAttended = this.sectionA.attendance.filter(
    (a) => a.attended,
  ).length;
  const sectionBAttended = this.sectionB.attendance.filter(
    (a) => a.attended,
  ).length;

  const sectionAPercentage =
    this.sectionA.total > 0
      ? (sectionAAttended / this.sectionA.total) * 100
      : 0;
  const sectionBPercentage =
    this.sectionB.total > 0
      ? (sectionBAttended / this.sectionB.total) * 100
      : 0;

  const overallPercentage = (sectionAPercentage + sectionBPercentage) / 2;

  const sectionAMarks =
    sectionAPercentage >= 50 ? (sectionAPercentage / 100) * 5 : 0;
  const sectionBMarks =
    sectionBPercentage >= 50 ? (sectionBPercentage / 100) * 5 : 0;
  const totalMarks = sectionAMarks + sectionBMarks;

  const totalAttended = sectionAAttended + sectionBAttended;
  const totalMissed =
    this.sectionA.total -
    sectionAAttended +
    (this.sectionB.total - sectionBAttended);
  const totalClasses = this.sectionA.total + this.sectionB.total;

  const requiredAttendedFor50 = Math.ceil(totalClasses * 0.5);
  const safeAbsences = totalAttended - requiredAttendedFor50;

  let riskLevel = "low";
  if (overallPercentage < 50) {
    riskLevel = "high";
  } else if (overallPercentage < 75) {
    riskLevel = "medium";
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

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
