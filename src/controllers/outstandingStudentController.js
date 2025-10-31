import OutstandingStudent from '../models/OutstandingStudent.js';
import { deleteCloudinaryImage } from '../config/cloudinary.js';

// Create outstanding student
export const createOutstandingStudent = async (req, res) => {
  try {
    const { rank, name, college, company, role, packageAmount, skills, achievement } = req.body;

    // Check if rank already exists
    const existingStudent = await OutstandingStudent.findOne({ rank });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'A student with this rank already exists'
      });
    }

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Student image is required'
      });
    }

    // Parse skills if it's a string
    const skillsArray = typeof skills === 'string' ? JSON.parse(skills) : skills;

    // Create new outstanding student
    const outstandingStudent = new OutstandingStudent({
      rank,
      name,
      image: {
        url: req.file.path,
        publicId: req.file.filename
      },
      college,
      company,
      role,
      package: packageAmount,
      skills: skillsArray,
      achievement
    });

    await outstandingStudent.save();

    res.status(201).json({
      success: true,
      message: 'Outstanding student created successfully',
      data: outstandingStudent
    });
  } catch (error) {
    console.error('Error creating outstanding student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create outstanding student',
      error: error.message
    });
  }
};

// Get all outstanding students
export const getAllOutstandingStudents = async (req, res) => {
  try {
    const { isActive } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const students = await OutstandingStudent.find(filter).sort({ rank: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error fetching outstanding students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch outstanding students',
      error: error.message
    });
  }
};

// Get single outstanding student
export const getOutstandingStudent = async (req, res) => {
  try {
    const student = await OutstandingStudent.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Outstanding student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error fetching outstanding student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch outstanding student',
      error: error.message
    });
  }
};

// Update outstanding student
export const updateOutstandingStudent = async (req, res) => {
  try {
    const { rank, name, college, company, role, packageAmount, skills, achievement, isActive } = req.body;

    const student = await OutstandingStudent.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Outstanding student not found'
      });
    }

    // Check if rank is being changed and if new rank already exists
    if (rank && rank !== student.rank) {
      const existingStudent = await OutstandingStudent.findOne({ rank, _id: { $ne: req.params.id } });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'A student with this rank already exists'
        });
      }
    }

    // Update fields
    if (rank) student.rank = rank;
    if (name) student.name = name;
    if (college) student.college = college;
    if (company) student.company = company;
    if (role) student.role = role;
    if (packageAmount) student.package = packageAmount;
    if (skills) student.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    if (achievement) student.achievement = achievement;
    if (isActive !== undefined) student.isActive = isActive;

    // Update image if new one is uploaded
    if (req.file) {
      // Delete old image from cloudinary
      await deleteCloudinaryImage(student.image.publicId);

      student.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Outstanding student updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error updating outstanding student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update outstanding student',
      error: error.message
    });
  }
};

// Delete outstanding student
export const deleteOutstandingStudent = async (req, res) => {
  try {
    const student = await OutstandingStudent.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Outstanding student not found'
      });
    }

    // Delete image from cloudinary
    await deleteCloudinaryImage(student.image.publicId);

    await OutstandingStudent.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Outstanding student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting outstanding student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete outstanding student',
      error: error.message
    });
  }
};

// Toggle student active status
export const toggleStudentStatus = async (req, res) => {
  try {
    const student = await OutstandingStudent.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Outstanding student not found'
      });
    }

    student.isActive = !student.isActive;
    await student.save();

    res.status(200).json({
      success: true,
      message: `Student ${student.isActive ? 'activated' : 'deactivated'} successfully`,
      data: student
    });
  } catch (error) {
    console.error('Error toggling student status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle student status',
      error: error.message
    });
  }
};
