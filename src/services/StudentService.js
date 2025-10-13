import StudentRepository from '../repositories/StudentRepository.js';
import UserRepository from '../repositories/UserRepository.js';

class StudentService {
  async getStudent(studentId) {
    const student = await StudentRepository.findWithUserDetails(studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  async getStudentByUserId(userId) {
    const student = await StudentRepository.findByUserId(userId);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  }

  async updateStudent(studentId, updateData) {
    const student = await StudentRepository.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const updatedStudent = await StudentRepository.update(studentId, updateData);
    return await StudentRepository.findWithUserDetails(updatedStudent._id);
  }

  async getAllStudents(query = {}, options = {}) {
    return await StudentRepository.find(query, options);
  }

  async getOutstandingStudents(options = {}) {
    return await StudentRepository.findOutstandingStudents(options);
  }

  async getStudentsBySemester(semester, options = {}) {
    return await StudentRepository.findBySemester(semester, options);
  }

  async updateGPA(studentId, gpa) {
    if (gpa < 0 || gpa > 10) {
      throw new Error('GPA must be between 0 and 10');
    }

    const student = await StudentRepository.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const updatedStudent = await StudentRepository.updateGPA(studentId, gpa);

    if (gpa >= 8.5 && !student.isOutstanding) {
      await StudentRepository.update(studentId, { isOutstanding: true });
    } else if (gpa < 8.5 && student.isOutstanding) {
      await StudentRepository.update(studentId, { isOutstanding: false });
    }

    return updatedStudent;
  }

  async updateAttendance(studentId, attendance) {
    if (attendance < 0 || attendance > 100) {
      throw new Error('Attendance must be between 0 and 100');
    }

    const student = await StudentRepository.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    return await StudentRepository.updateAttendance(studentId, attendance);
  }

  async promoteStudent(studentId) {
    const student = await StudentRepository.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    if (student.currentSemester >= 8) {
      throw new Error('Student is already in the final semester');
    }

    return await StudentRepository.promoteToNextSemester(studentId);
  }

  async addAchievement(studentId, achievement) {
    const student = await StudentRepository.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    return await StudentRepository.addAchievement(studentId, {
      ...achievement,
      date: achievement.date || new Date()
    });
  }

  async getTopPerformers(limit = 10, branchId = null) {
    return await StudentRepository.getTopPerformers(limit, branchId);
  }

  async enrollInCourse(studentId, courseId) {
    const student = await StudentRepository.findByUserId(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    return await UserRepository.enrollInCourse(student.userId, courseId);
  }

  async unenrollFromCourse(studentId, courseId) {
    const student = await StudentRepository.findByUserId(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    return await UserRepository.unenrollFromCourse(student.userId, courseId);
  }
}

export default new StudentService();