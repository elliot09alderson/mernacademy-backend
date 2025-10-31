import AuthService from '../services/AuthService.js';

export const register = async (req, res) => {
  try {
    const result = await AuthService.register(req.body);

    // Set secure HTTP-only cookie
    // secure: false - for local development (http://localhost)
    // sameSite: 'none' - allows cross-origin requests with credentials
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Remove token from response body - cookies only
    const { token, ...dataWithoutToken } = result;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: dataWithoutToken
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    // Set secure HTTP-only cookie
    // secure: false - for local development (http://localhost)
    // sameSite: 'none' - allows cross-origin requests with credentials
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Remove token from response body - cookies only
    const { token, ...dataWithoutToken } = result;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: dataWithoutToken
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

export const logout = async (req, res) => {
  // Clear secure cookie
  res.cookie('token', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
    expires: new Date(0)
  });

  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};

export const getProfile = async (req, res) => {
  try {
    const profile = await AuthService.getUserProfile(req.userId);
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await AuthService.updateProfile(req.userId, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await AuthService.changePassword(req.userId, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};