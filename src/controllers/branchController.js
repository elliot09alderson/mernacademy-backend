import BranchService from '../services/BranchService.js';

export const createBranch = async (req, res) => {
  try {
    const branch = await BranchService.createBranch(req.body);
    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: branch
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const branch = await BranchService.updateBranch(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Branch updated successfully',
      data: branch
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    await BranchService.deleteBranch(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getBranch = async (req, res) => {
  try {
    const branch = await BranchService.getBranch(req.params.id);
    res.status(200).json({
      success: true,
      data: branch
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllBranches = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...query } = req.query;
    const options = { page: parseInt(page), limit: parseInt(limit) };
    const branches = await BranchService.getAllBranches(query, options);
    res.status(200).json({
      success: true,
      ...branches
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getActiveBranches = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = { page: parseInt(page), limit: parseInt(limit) };
    const branches = await BranchService.getActiveBranches(options);
    res.status(200).json({
      success: true,
      ...branches
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getBranchStatistics = async (req, res) => {
  try {
    const stats = await BranchService.getBranchStatistics(req.params.id);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const assignDepartmentHead = async (req, res) => {
  try {
    const { facultyId } = req.body;
    const branch = await BranchService.assignDepartmentHead(req.params.id, facultyId);
    res.status(200).json({
      success: true,
      message: 'Department head assigned successfully',
      data: branch
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};