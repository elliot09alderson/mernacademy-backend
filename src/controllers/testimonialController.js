import Testimonial from '../models/Testimonial.js';
import { deleteCloudinaryImage } from '../config/cloudinary.js';

// Create testimonial
export const createTestimonial = async (req, res) => {
  try {
    const { name, title, role, description, rating, order } = req.body;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Testimonial image is required'
      });
    }

    // Create new testimonial
    const testimonial = new Testimonial({
      name,
      title,
      role,
      description,
      rating: rating || 5,
      image: {
        url: req.file.path,
        publicId: req.file.filename
      },
      order: order || 0
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial',
      error: error.message
    });
  }
};

// Get all testimonials
export const getAllTestimonials = async (req, res) => {
  try {
    const { isActive, limit } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    let query = Testimonial.find(filter).sort({ order: 1, createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const testimonials = await query;

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
      error: error.message
    });
  }
};

// Get single testimonial
export const getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonial',
      error: error.message
    });
  }
};

// Update testimonial
export const updateTestimonial = async (req, res) => {
  try {
    const { name, title, role, description, rating, order, isActive } = req.body;

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    // Update fields
    if (name) testimonial.name = name;
    if (title) testimonial.title = title;
    if (role) testimonial.role = role;
    if (description) testimonial.description = description;
    if (rating) testimonial.rating = rating;
    if (order !== undefined) testimonial.order = order;
    if (isActive !== undefined) testimonial.isActive = isActive;

    // Update image if new one is uploaded
    if (req.file) {
      // Delete old image from cloudinary
      if (testimonial.image.publicId) {
        await deleteCloudinaryImage(testimonial.image.publicId);
      }

      testimonial.image = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial',
      error: error.message
    });
  }
};

// Delete testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    // Delete image from cloudinary
    if (testimonial.image.publicId) {
      await deleteCloudinaryImage(testimonial.image.publicId);
    }

    await Testimonial.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial',
      error: error.message
    });
  }
};

// Toggle testimonial active status
export const toggleTestimonialStatus = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: `Testimonial ${testimonial.isActive ? 'activated' : 'deactivated'} successfully`,
      data: testimonial
    });
  } catch (error) {
    console.error('Error toggling testimonial status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle testimonial status',
      error: error.message
    });
  }
};
