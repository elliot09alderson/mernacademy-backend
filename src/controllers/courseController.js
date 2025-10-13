import CourseService from '../services/CourseService.js';

export const createCourse = async (req, res) => {
  try {
    const course = await CourseService.createCourse(req.body);
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await CourseService.updateCourse(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await CourseService.deleteCourse(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getCourse = async (req, res) => {
  try {
    const course = await CourseService.getCourse(req.params.id);
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...query } = req.query;
    const options = { page: parseInt(page), limit: parseInt(limit) };
    const courses = await CourseService.getAllCourses(query, options);
    res.status(200).json({
      success: true,
      ...courses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getCoursesByBranch = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = { page: parseInt(page), limit: parseInt(limit) };
    const courses = await CourseService.getCoursesByBranch(req.params.branchId, options);
    res.status(200).json({
      success: true,
      ...courses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getCoursesBySemester = async (req, res) => {
  try {
    const { branchId } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const options = { page: parseInt(page), limit: parseInt(limit) };
    const courses = await CourseService.getCoursesBySemester(req.params.semester, branchId, options);
    res.status(200).json({
      success: true,
      ...courses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const assignFaculty = async (req, res) => {
  try {
    const { facultyId } = req.body;
    const course = await CourseService.assignFacultyToCourse(req.params.id, facultyId);
    res.status(200).json({
      success: true,
      message: 'Faculty assigned successfully',
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getActiveCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = { page: parseInt(page), limit: parseInt(limit) };
    const courses = await CourseService.getActiveCourses(options);
    res.status(200).json({
      success: true,
      ...courses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};