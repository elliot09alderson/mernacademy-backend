import StudentService from '../services/StudentService.js';

export const getStudent = async (req, res) => {
  try {
    const student = await StudentService.getStudent(req.params.id);
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const getStudentByUserId = async (req, res) => {
  try {
    const student = await StudentService.getStudentByUserId(req.params.userId);
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, semester, ...query } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: 'userId'
    };

    if (semester) {
      query.currentSemester = parseInt(semester);
    }

    const students = await StudentService.getAllStudents(query, options);
    res.status(200).json({
      success: true,
      ...students
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getOutstandingStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: 'userId'
    };
    const students = await StudentService.getOutstandingStudents(options);
    res.status(200).json({
      success: true,
      ...students
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getStudentsBySemester = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: 'userId'
    };
    const students = await StudentService.getStudentsBySemester(req.params.semester, options);
    res.status(200).json({
      success: true,
      ...students
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await StudentService.updateStudent(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateGPA = async (req, res) => {
  try {
    const { gpa } = req.body;
    const student = await StudentService.updateGPA(req.params.id, gpa);
    res.status(200).json({
      success: true,
      message: 'GPA updated successfully',
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { attendance } = req.body;
    const student = await StudentService.updateAttendance(req.params.id, attendance);
    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const promoteStudent = async (req, res) => {
  try {
    const student = await StudentService.promoteStudent(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Student promoted successfully',
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const addAchievement = async (req, res) => {
  try {
    const student = await StudentService.addAchievement(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Achievement added successfully',
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getTopPerformers = async (req, res) => {
  try {
    const { limit = 10, branchId } = req.query;
    const students = await StudentService.getTopPerformers(parseInt(limit), branchId);
    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};