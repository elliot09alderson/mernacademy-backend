import { EventModel } from "./eventModel.js";

export const createEvent = async (req, res) => {
  try {
    const event = new EventModel(req.body);
    await event.save();
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating event",
      error: error.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find();
    res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving events",
      error: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving event",
      error: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await EventModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating event",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await EventModel.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message,
    });
  }
};