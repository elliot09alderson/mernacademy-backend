import CourseRepository from '../repositories/CourseRepository.js';
import BranchRepository from '../repositories/BranchRepository.js';
import UserRepository from '../repositories/UserRepository.js';

class CourseService {
  async createCourse(courseData) {
    const { courseCode, branchId } = courseData;

    const existingCourse = await CourseRepository.findByCourseCode(courseCode);
    if (existingCourse) {
      throw new Error('Course code already exists');
    }

    // Only validate branch if branchId is provided
    if (branchId) {
      const branch = await BranchRepository.findById(branchId);
      if (!branch) {
        throw new Error('Branch not found');
      }
    }

    const course = await CourseRepository.create(courseData);
    return await CourseRepository.findWithDetails(course._id);
  }

  async updateCourse(courseId, updateData) {
    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (updateData.branchId) {
      const branch = await BranchRepository.findById(updateData.branchId);
      if (!branch) {
        throw new Error('Branch not found');
      }
    }

    const updatedCourse = await CourseRepository.update(courseId, updateData);
    return await CourseRepository.findWithDetails(updatedCourse._id);
  }

  async deleteCourse(courseId) {
    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    await CourseRepository.delete(courseId);
    return { message: 'Course deleted successfully' };
  }

  async getCourse(courseId) {
    const course = await CourseRepository.findWithDetails(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  async getAllCourses(query = {}, options = {}) {
    return await CourseRepository.find(query, options);
  }

  async getCoursesByBranch(branchId, options = {}) {
    return await CourseRepository.findByBranch(branchId, options);
  }

  async getCoursesBySemester(semester, branchId, options = {}) {
    return await CourseRepository.findBySemester(semester, branchId, options);
  }

  async assignFacultyToCourse(courseId, facultyId) {
    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const faculty = await UserRepository.findById(facultyId);
    if (!faculty || faculty.role !== 'faculty') {
      throw new Error('Faculty not found or invalid role');
    }

    return await CourseRepository.assignFaculty(courseId, facultyId);
  }

  async getActiveCourses(options = {}) {
    return await CourseRepository.findActiveCourses(options);
  }

  async manageCoursePrerequisites(courseId, prerequisiteIds, action = 'add') {
    const course = await CourseRepository.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    let updatedCourse;
    for (const prereqId of prerequisiteIds) {
      const prereqCourse = await CourseRepository.findById(prereqId);
      if (!prereqCourse) {
        throw new Error(`Prerequisite course ${prereqId} not found`);
      }

      if (action === 'add') {
        updatedCourse = await CourseRepository.addPrerequisite(courseId, prereqId);
      } else if (action === 'remove') {
        updatedCourse = await CourseRepository.removePrerequisite(courseId, prereqId);
      }
    }

    return await CourseRepository.findWithDetails(courseId);
  }
}

export default new CourseService();