import express from 'express';
import multer from 'multer';
import path from 'path';
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

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.get('/upcoming', getUpcomingEvents);
router.get('/past', getPastEvents);
router.get('/featured', getFeaturedEvents);
router.get('/', getAllEvents);
router.get('/:id', validateRequest(eventIdParamSchema), getEvent);

router.post('/', authenticate, isAdmin, validateRequest(createEventSchema), createEvent);
router.put('/:id', authenticate, isAdmin, validateRequest(eventIdParamSchema), validateRequest(updateEventSchema), updateEvent);
router.delete('/:id', authenticate, isAdmin, validateRequest(eventIdParamSchema), deleteEvent);

router.post('/:id/register', authenticate, validateRequest(eventIdParamSchema), registerForEvent);
router.post('/:id/unregister', authenticate, validateRequest(eventIdParamSchema), unregisterFromEvent);
router.post('/:id/images', authenticate, isAdmin, validateRequest(eventIdParamSchema), upload.single('image'), uploadEventImage);

export default router;