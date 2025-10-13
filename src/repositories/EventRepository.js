import BaseRepository from './BaseRepository.js';
import Event from '../models/Event.js';

class EventRepository extends BaseRepository {
  constructor() {
    super(Event);
  }

  async findUpcomingEvents(options = {}) {
    return await this.find(
      {
        startDate: { $gte: new Date() },
        isActive: true
      },
      { ...options, sort: 'startDate' }
    );
  }

  async findPastEvents(options = {}) {
    return await this.find(
      {
        endDate: { $lt: new Date() },
        isActive: true
      },
      { ...options, sort: '-endDate' }
    );
  }

  async findFeaturedEvents(options = {}) {
    return await this.find(
      {
        isFeatured: true,
        isActive: true
      },
      options
    );
  }

  async findByEventType(eventType, options = {}) {
    return await this.find({ eventType, isActive: true }, options);
  }

  async registerParticipant(eventId, userId) {
    return await this.model.findByIdAndUpdate(
      eventId,
      { $addToSet: { registeredParticipants: userId } },
      { new: true }
    );
  }

  async unregisterParticipant(eventId, userId) {
    return await this.model.findByIdAndUpdate(
      eventId,
      { $pull: { registeredParticipants: userId } },
      { new: true }
    );
  }

  async addImage(eventId, imageData) {
    return await this.model.findByIdAndUpdate(
      eventId,
      { $push: { images: imageData } },
      { new: true }
    );
  }

  async removeImage(eventId, imageUrl) {
    return await this.model.findByIdAndUpdate(
      eventId,
      { $pull: { images: { url: imageUrl } } },
      { new: true }
    );
  }

  async findWithDetails(id) {
    return await this.model.findById(id)
      .populate('createdBy', 'name email')
      .populate('registeredParticipants', 'name email');
  }

  async checkRegistrationStatus(eventId, userId) {
    const event = await this.model.findById(eventId);
    if (!event) return { registered: false, event: null };

    const isRegistered = event.registeredParticipants.includes(userId);
    const spotsLeft = event.maxParticipants ?
      event.maxParticipants - event.registeredParticipants.length : null;

    return {
      registered: isRegistered,
      spotsLeft,
      event
    };
  }
}

export default new EventRepository();