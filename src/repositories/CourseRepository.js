import BaseRepository from './BaseRepository.js';
import Course from '../models/Course.js';

class CourseRepository extends BaseRepository {
  constructor() {
    super(Course);
  }

  async findByCourseCode(courseCode) {
    return await this.model.findOne({ courseCode });
  }

  async findByBranch(branchId, options = {}) {
    return await this.find({ branchId }, options);
  }

  async findByFaculty(facultyId, options = {}) {
    return await this.find({ facultyId }, options);
  }

  async findBySemester(semester, branchId, options = {}) {
    const query = { semester };
    if (branchId) query.branchId = branchId;
    return await this.find(query, options);
  }

  async findActiveCourses(options = {}) {
    return await this.find({ isActive: true }, options);
  }

  async assignFaculty(courseId, facultyId) {
    return await this.model.findByIdAndUpdate(
      courseId,
      { facultyId },
      { new: true }
    ).populate('facultyId branchId');
  }

  async addPrerequisite(courseId, prerequisiteId) {
    return await this.model.findByIdAndUpdate(
      courseId,
      { $addToSet: { prerequisites: prerequisiteId } },
      { new: true }
    );
  }

  async removePrerequisite(courseId, prerequisiteId) {
    return await this.model.findByIdAndUpdate(
      courseId,
      { $pull: { prerequisites: prerequisiteId } },
      { new: true }
    );
  }

  async findWithDetails(id) {
    return await this.model.findById(id)
      .populate('branchId')
      .populate('facultyId')
      .populate('prerequisites');
  }
}

export default new CourseRepository();