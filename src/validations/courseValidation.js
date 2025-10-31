import { z } from 'zod';

export const createCourseSchema = z.object({
  body: z.object({
    courseName: z.string().min(2, 'Course name must be at least 2 characters'),
    courseCode: z.string().min(2, 'Course code is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    duration: z.string().min(1, 'Duration is required'),
    branchId: z.string().optional(),
    facultyId: z.string().optional(),
    credits: z.number().optional(),
    semester: z.number().optional(),
    syllabus: z.string().optional(),
    prerequisites: z.array(z.string()).optional(),
  })
});

export const updateCourseSchema = z.object({
  body: z.object({
    courseName: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    duration: z.string().optional(),
    branchId: z.string().optional(),
    facultyId: z.string().optional().nullable(),
    credits: z.number().min(1).optional(),
    semester: z.number().min(1).max(8).optional(),
    syllabus: z.string().optional(),
    prerequisites: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  })
});

export const courseIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Course ID is required'),
  })
});