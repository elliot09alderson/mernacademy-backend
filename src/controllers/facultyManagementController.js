import Faculty from '../models/Faculty.js';
import { deleteCloudinaryImage } from '../config/cloudinary.js';

// Create Faculty (Admin)
export const createFaculty = async (req, res) => {
  try {
    // Check if image file is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Faculty image is required'
      });
    }

    // Prepare faculty data with image
    const facultyData = {
      ...req.body,
      image: {
        url: req.file.path,
        publicId: req.file.filename
      }
    };

    // Parse expertise array if it's a string
    if (typeof facultyData.expertise === 'string') {
      facultyData.expertise = facultyData.expertise.split(',').map(item => item.trim());
    }

    const faculty = await Faculty.create(facultyData);

    res.status(201).json({
      success: true,
      message: 'Faculty created successfully',
      data: faculty
    });
  } catch (error) {
    // Delete uploaded image if faculty creation fails
    if (req.file) {
      await deleteCloudinaryImage(req.file.filename);
    }

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all faculty
export const getAllFaculty = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const faculty = await Faculty.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Faculty.countDocuments(query);

    res.status(200).json({
      success: true,
      data: faculty,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get active faculty (for public display)
export const getActiveFaculty = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const faculty = await Faculty.find({ isActive: true })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Faculty.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: faculty,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get single faculty
export const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    res.status(200).json({
      success: true,
      data: faculty
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Update faculty
export const updateFaculty = async (req, res) => {
  try {
    // Parse expertise array if it's a string
    if (req.body.expertise && typeof req.body.expertise === 'string') {
      req.body.expertise = req.body.expertise.split(',').map(item => item.trim());
    }

    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Faculty updated successfully',
      data: faculty
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete faculty
export const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    // Delete image from Cloudinary
    if (faculty.image && faculty.image.publicId) {
      await deleteCloudinaryImage(faculty.image.publicId);
    }

    await Faculty.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Faculty deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle faculty status
export const toggleFacultyStatus = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    faculty.isActive = !faculty.isActive;
    await faculty.save();

    res.status(200).json({
      success: true,
      message: `Faculty ${faculty.isActive ? 'activated' : 'deactivated'} successfully`,
      data: faculty
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
