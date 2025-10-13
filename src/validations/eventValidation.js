import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    eventName: z.string().min(2, 'Event name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    eventType: z.enum(['academic', 'cultural', 'sports', 'technical', 'workshop', 'seminar', 'other']),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    venue: z.string().min(2, 'Venue is required'),
    organizer: z.string().min(2, 'Organizer is required'),
    registrationLink: z.string().url().optional(),
    maxParticipants: z.number().min(1).optional(),
    isFeatured: z.boolean().optional(),
  })
});

export const updateEventSchema = z.object({
  body: z.object({
    eventName: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    eventType: z.enum(['academic', 'cultural', 'sports', 'technical', 'workshop', 'seminar', 'other']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    venue: z.string().min(2).optional(),
    organizer: z.string().min(2).optional(),
    registrationLink: z.string().url().optional().nullable(),
    maxParticipants: z.number().min(1).optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  })
});

export const eventIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Event ID is required'),
  })
});

export const uploadEventImageSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Event ID is required'),
  }),
  body: z.object({
    caption: z.string().optional(),
  })
});