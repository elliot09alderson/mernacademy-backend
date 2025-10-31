import express from 'express';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvent,
  getAllEvents,
  getUpcomingEvents,
  getPastEvents,
  getFeaturedEvents,
  registerForEvent,
  unregisterFromEvent,
  uploadEventImage
} from '../controllers/eventController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createEventSchema,
  updateEventSchema,
  eventIdParamSchema
} from '../validations/eventValidation.js';
import { uploadEventImage as uploadEventImageMiddleware } from '../config/cloudinary.js';

const router = express.Router();

router.get('/upcoming', getUpcomingEvents);
router.get('/past', getPastEvents);
router.get('/featured', getFeaturedEvents);
router.get('/', getAllEvents);
router.get('/:id', validateRequest(eventIdParamSchema), getEvent);

router.post('/', authenticate, isAdmin, uploadEventImageMiddleware.single('image'), createEvent);
router.put('/:id', authenticate, isAdmin, validateRequest(eventIdParamSchema), validateRequest(updateEventSchema), updateEvent);
router.delete('/:id', authenticate, isAdmin, validateRequest(eventIdParamSchema), deleteEvent);

router.post('/:id/register', authenticate, validateRequest(eventIdParamSchema), registerForEvent);
router.post('/:id/unregister', authenticate, validateRequest(eventIdParamSchema), unregisterFromEvent);
router.post('/:id/images', authenticate, isAdmin, validateRequest(eventIdParamSchema), uploadEventImageMiddleware.single('image'), uploadEventImage);

export default router;