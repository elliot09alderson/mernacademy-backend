import BaseRepository from './BaseRepository.js';
import Student from '../models/Student.js';

class StudentRepository extends BaseRepository {
  constructor() {
    super(Student);
  }

  async findByUserId(userId) {
    return await this.model.findOne({ userId }).populate('userId');
  }

  async findByStudentId(studentId) {
    return await this.model.findOne({ studentId });
  }

  async findOutstandingStudents(options = {}) {
    return await this.find({ isOutstanding: true }, options);
  }

  async findBySemester(semester, options = {}) {
    return await this.find({ currentSemester: semester }, options);
  }

  async updateGPA(studentId, gpa) {
    return await this.model.findByIdAndUpdate(
      studentId,
      { gpa },
      { new: true }
    );
  }

  async updateAttendance(studentId, attendance) {
    return await this.model.findByIdAndUpdate(
      studentId,
      { attendance },
      { new: true }
    );
  }

  async promoteToNextSemester(studentId) {
    return await this.model.findByIdAndUpdate(
      studentId,
      { $inc: { currentSemester: 1 } },
      { new: true }
    );
  }

  async addAchievement(studentId, achievement) {
    return await this.model.findByIdAndUpdate(
      studentId,
      { $push: { achievements: achievement } },
      { new: true }
    );
  }

  async findWithUserDetails(id) {
    return await this.model.findById(id)
      .populate('userId', 'name email phone address branchId');
  }

  async getTopPerformers(limit = 10, branchId = null) {
    const query = {};
    if (branchId) {
      const students = await this.model.find().populate('userId');
      const branchStudentIds = students
        .filter(s => s.userId?.branchId?.toString() === branchId)
        .map(s => s._id);
      query._id = { $in: branchStudentIds };
    }

    return await this.model.find(query)
      .sort('-gpa')
      .limit(limit)
      .populate('userId', 'name email branchId');
  }
}

export default new StudentRepository();