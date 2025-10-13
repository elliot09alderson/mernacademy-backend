import { StudentModel } from "./studentModel.js";

export const createStudent = async (req, res) => {
  try {
    const student = new StudentModel(req.body);
    await student.save();
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating student",
      error: error.message,
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.status(200).json({
      success: true,
      message: "Students retrieved successfully",
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving students",
      error: error.message,
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await StudentModel.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving student",
      error: error.message,
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await StudentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating student",
      error: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await StudentModel.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting student",
      error: error.message,
    });
  }
};