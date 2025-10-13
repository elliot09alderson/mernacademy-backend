import BaseRepository from './BaseRepository.js';
import User from '../models/User.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email });
  }

  async findByRole(role, options = {}) {
    return await this.find({ role }, options);
  }

  async findActiveUsers(options = {}) {
    return await this.find({ isActive: true }, options);
  }

  async findByBranch(branchId, options = {}) {
    return await this.find({ branchId }, options);
  }

  async updatePassword(userId, hashedPassword) {
    return await this.model.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    ).select('-password');
  }

  async enrollInCourse(userId, courseId) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    );
  }

  async unenrollFromCourse(userId, courseId) {
    return await this.model.findByIdAndUpdate(
      userId,
      { $pull: { enrolledCourses: courseId } },
      { new: true }
    );
  }

  async findWithPopulate(id, populate) {
    return await this.model.findById(id).populate(populate);
  }
}

export default new UserRepository();