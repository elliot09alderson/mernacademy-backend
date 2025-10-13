class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

export const validateRequired = (fields) => {
  return (req, res, next) => {
    const errors = [];

    for (const field of fields) {
      if (
        !req.body[field] ||
        (typeof req.body[field] === "string" && req.body[field].trim() === "")
      ) {
        errors.push(`${field} is required`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    next();
  };
};

export const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }
  }

  next();
};

export const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (password) {
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
  }

  next();
};

export const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!objectIdRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`,
      });
    }

    next();
  };
};

export const validateBatchAction = (req, res, next) => {
  const { action } = req.body;
  const validActions = ["release", "hold", "reject", "resume"];

  if (!validActions.includes(action)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid action. Valid actions are: release, hold, reject, resume",
    });
  }

  next();
};

export const sanitizeInput = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        // Basic XSS prevention - remove script tags and javascript: protocols
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/javascript:/gi, "")
          .trim();
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) {
    sanitizeObject(req.body);
  }

  next();
};

export { ValidationError };
