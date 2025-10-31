import EventService from '../services/EventService.js';
import { deleteCloudinaryImage } from '../config/cloudinary.js';

export const createEvent = async (req, res) => {
  try {
    // Check if image file is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Event image is required'
      });
    }

    // Prepare event data with image
    const eventData = {
      ...req.body,
      image: {
        url: req.file.path,
        publicId: req.file.filename
      }
    };

    const event = await EventService.createEvent(eventData, req.userId);
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    // Delete uploaded image if event creation fails
    if (req.file) {
      await deleteCloudinaryImage(req.file.filename);
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await EventService.updateEvent(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await EventService.getEvent(req.params.id);

    // Delete the event
    await EventService.deleteEvent(req.params.id);

    // Delete image from Cloudinary
    if (event.image && event.image.publicId) {
      await deleteCloudinaryImage(event.image.publicId);
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await EventService.getEvent(req.params.id);
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...query } = req.query;
    const options = { page: parseInt(page), limit: parseInt(limit) };
    const events = await EventService.getAllEvents(query, options);
    res.status(200).json({
      success: true,
      ...events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = { page: parseInt(page), limit: parseInt(limit) };
    const events = await EventService.getUpcomingEvents(options);
    res.status(200).json({
      success: true,
      ...events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getPastEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = { page: parseInt(page), limit: parseInt(limit) };
    const events = await EventService.getPastEvents(options);
    res.status(200).json({
      success: true,
      ...events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getFeaturedEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = { page: parseInt(page), limit: parseInt(limit) };
    const events = await EventService.getFeaturedEvents(options);
    res.status(200).json({
      success: true,
      ...events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const event = await EventService.registerForEvent(req.params.id, req.userId);
    res.status(200).json({
      success: true,
      message: 'Registered for event successfully',
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const unregisterFromEvent = async (req, res) => {
  try {
    const event = await EventService.unregisterFromEvent(req.params.id, req.userId);
    res.status(200).json({
      success: true,
      message: 'Unregistered from event successfully',
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const uploadEventImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const imageData = {
      url: `/uploads/${req.file.filename}`,
      caption: req.body.caption || ''
    };

    const event = await EventService.addEventImage(req.params.id, imageData);
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};