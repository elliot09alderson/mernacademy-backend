import { z } from 'zod';

export const createBranchSchema = z.object({
  body: z.object({
    branchName: z.string().min(2, 'Branch name must be at least 2 characters'),
    branchCode: z.string().min(2, 'Branch code is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    departmentHead: z.string().optional(),
    totalSeats: z.number().min(1, 'Total seats must be at least 1'),
    availableSeats: z.number().min(0, 'Available seats cannot be negative'),
    establishedYear: z.number().optional(),
  })
});

export const updateBranchSchema = z.object({
  body: z.object({
    branchName: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    departmentHead: z.string().optional().nullable(),
    totalSeats: z.number().min(1).optional(),
    availableSeats: z.number().min(0).optional(),
    establishedYear: z.number().optional(),
    isActive: z.boolean().optional(),
  })
});

export const branchIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Branch ID is required'),
  })
});