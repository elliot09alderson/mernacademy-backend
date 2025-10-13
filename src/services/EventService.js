import EventRepository from '../repositories/EventRepository.js';
import UserRepository from '../repositories/UserRepository.js';

class EventService {
  async createEvent(eventData, createdBy) {
    const event = await EventRepository.create({
      ...eventData,
      createdBy
    });
    return await EventRepository.findWithDetails(event._id);
  }

  async updateEvent(eventId, updateData) {
    const event = await EventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const updatedEvent = await EventRepository.update(eventId, updateData);
    return await EventRepository.findWithDetails(updatedEvent._id);
  }

  async deleteEvent(eventId) {
    const event = await EventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    await EventRepository.delete(eventId);
    return { message: 'Event deleted successfully' };
  }

  async getEvent(eventId) {
    const event = await EventRepository.findWithDetails(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }

  async getAllEvents(query = {}, options = {}) {
    return await EventRepository.find(query, options);
  }

  async getUpcomingEvents(options = {}) {
    return await EventRepository.findUpcomingEvents(options);
  }

  async getPastEvents(options = {}) {
    return await EventRepository.findPastEvents(options);
  }

  async getFeaturedEvents(options = {}) {
    return await EventRepository.findFeaturedEvents(options);
  }

  async getEventsByType(eventType, options = {}) {
    return await EventRepository.findByEventType(eventType, options);
  }

  async registerForEvent(eventId, userId) {
    const event = await EventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.endDate < new Date()) {
      throw new Error('Event has already ended');
    }

    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { registered, spotsLeft } = await EventRepository.checkRegistrationStatus(eventId, userId);
    if (registered) {
      throw new Error('Already registered for this event');
    }

    if (event.maxParticipants && spotsLeft <= 0) {
      throw new Error('Event is full');
    }

    return await EventRepository.registerParticipant(eventId, userId);
  }

  async unregisterFromEvent(eventId, userId) {
    const event = await EventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const { registered } = await EventRepository.checkRegistrationStatus(eventId, userId);
    if (!registered) {
      throw new Error('Not registered for this event');
    }

    return await EventRepository.unregisterParticipant(eventId, userId);
  }

  async addEventImage(eventId, imageData) {
    const event = await EventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    return await EventRepository.addImage(eventId, imageData);
  }

  async removeEventImage(eventId, imageUrl) {
    const event = await EventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    return await EventRepository.removeImage(eventId, imageUrl);
  }

  async getRegistrationStatus(eventId, userId) {
    return await EventRepository.checkRegistrationStatus(eventId, userId);
  }
}

export default new EventService();