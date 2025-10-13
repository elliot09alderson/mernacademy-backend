import { z } from "zod";

// Student signup validation schema
export const studentSignupSchema = z.object({
  fullname: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .trim()
    .refine((name) => name.length > 0, "Full name is required"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),

  phonenumber: z
    .string()
    .regex(/^[\+]?[1-9][\d]{9,14}$/, "Please enter a valid phone number")
    .trim(),

  qualification: z
    .string()
    .min(2, "Qualification must be at least 2 characters")
    .max(100, "Qualification cannot exceed 100 characters")
    .trim()
    .refine((qual) => qual.length > 0, "Qualification is required"),

  hereaboutus: z
    .string()
    .min(5, "Please provide at least 5 characters about how you heard about us")
    .max(500, "Description cannot exceed 500 characters")
    .trim()
    .refine((desc) => desc.length > 0, "This field is required"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password cannot exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
});

// Student login validation schema
export const studentLoginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, "Password is required")
});

// Student profile update validation schema
export const studentUpdateSchema = z.object({
  fullname: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .trim()
    .optional(),

  phonenumber: z
    .string()
    .regex(/^[\+]?[1-9][\d]{9,14}$/, "Please enter a valid phone number")
    .trim()
    .optional(),

  qualification: z
    .string()
    .min(2, "Qualification must be at least 2 characters")
    .max(100, "Qualification cannot exceed 100 characters")
    .trim()
    .optional(),

  hereaboutus: z
    .string()
    .min(5, "Please provide at least 5 characters about how you heard about us")
    .max(500, "Description cannot exceed 500 characters")
    .trim()
    .optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  "At least one field must be provided for update"
);

// Password change validation schema
export const studentChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required"),

  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(128, "New password cannot exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  confirmPassword: z
    .string()
    .min(1, "Please confirm your new password")
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  }
);

// Validation middleware function
export const validateStudent = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json({
          status: 'fail',
          message: 'Validation Error',
          errors
        });
      }

      // Replace req.body with validated and transformed data
      req.body = result.data;
      next();
    } catch (error) {
      console.error('Validation Error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal validation error'
      });
    }
  };
};