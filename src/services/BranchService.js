import BranchRepository from '../repositories/BranchRepository.js';
import UserRepository from '../repositories/UserRepository.js';
import { deleteMultipleCloudinaryImages } from '../config/cloudinary.js';

class BranchService {
  async createBranch(branchData, files = []) {
    const { branchCode } = branchData;

    const existingBranch = await BranchRepository.findByBranchCode(branchCode);
    if (existingBranch) {
      throw new Error('Branch code already exists');
    }

    if (!branchData.availableSeats) {
      branchData.availableSeats = branchData.totalSeats;
    }

    // Parse JSON strings for nested objects if they exist
    if (typeof branchData.address === 'string') {
      try {
        branchData.address = JSON.parse(branchData.address);
      } catch (e) {
        // If parsing fails, keep it as is
      }
    }

    if (typeof branchData.contactInfo === 'string') {
      try {
        branchData.contactInfo = JSON.parse(branchData.contactInfo);
      } catch (e) {
        // If parsing fails, keep it as is
      }
    }

    if (typeof branchData.operatingHours === 'string') {
      try {
        branchData.operatingHours = JSON.parse(branchData.operatingHours);
      } catch (e) {
        // If parsing fails, keep it as is
      }
    }

    if (typeof branchData.facilities === 'string') {
      try {
        branchData.facilities = JSON.parse(branchData.facilities);
      } catch (e) {
        // If parsing fails, keep it as is
      }
    }

    // Convert isHeadquarters string to boolean if needed
    if (typeof branchData.isHeadquarters === 'string') {
      branchData.isHeadquarters = branchData.isHeadquarters === 'true';
    }

    // Add uploaded images to branch data
    if (files && files.length > 0) {
      branchData.images = files.map(file => ({
        url: file.path,
        publicId: file.filename
      }));
    }

    const branch = await BranchRepository.create(branchData);
    return branch;
  }

  async updateBranch(branchId, updateData, files = []) {
    const branch = await BranchRepository.findById(branchId);
    if (!branch) {
      throw new Error('Branch not found');
    }

    if (updateData.departmentHead) {
      const user = await UserRepository.findById(updateData.departmentHead);
      if (!user || user.role !== 'faculty') {
        throw new Error('Department head must be a valid faculty member');
      }
    }

    // Add new uploaded images to existing images
    if (files && files.length > 0) {
      const newImages = files.map(file => ({
        url: file.path,
        publicId: file.filename
      }));

      updateData.images = [...(branch.images || []), ...newImages];
    }

    const updatedBranch = await BranchRepository.update(branchId, updateData);
    return await BranchRepository.findWithDetails(updatedBranch._id);
  }

  async deleteBranch(branchId) {
    const branch = await BranchRepository.findById(branchId);
    if (!branch) {
      throw new Error('Branch not found');
    }

    const userCount = await UserRepository.count({ branchId });
    if (userCount > 0) {
      throw new Error('Cannot delete branch with associated users');
    }

    // Delete images from Cloudinary if they exist
    if (branch.images && branch.images.length > 0) {
      const publicIds = branch.images.map(img => img.publicId);
      await deleteMultipleCloudinaryImages(publicIds);
    }

    await BranchRepository.delete(branchId);
    return { message: 'Branch deleted successfully' };
  }

  async getBranch(branchId) {
    const branch = await BranchRepository.findWithDetails(branchId);
    if (!branch) {
      throw new Error('Branch not found');
    }
    return branch;
  }

  async getAllBranches(query = {}, options = {}) {
    return await BranchRepository.find(query, options);
  }

  async getActiveBranches(options = {}) {
    return await BranchRepository.findActiveBranches(options);
  }

  async getBranchStatistics(branchId) {
    const stats = await BranchRepository.getBranchStatistics(branchId);
    if (!stats) {
      throw new Error('Branch not found');
    }
    return stats;
  }

  async assignDepartmentHead(branchId, facultyId) {
    const branch = await BranchRepository.findById(branchId);
    if (!branch) {
      throw new Error('Branch not found');
    }

    const faculty = await UserRepository.findById(facultyId);
    if (!faculty || faculty.role !== 'faculty') {
      throw new Error('Invalid faculty member');
    }

    return await BranchRepository.assignDepartmentHead(branchId, facultyId);
  }

  async updateSeatsAvailability(branchId, seatChange) {
    const branch = await BranchRepository.findById(branchId);
    if (!branch) {
      throw new Error('Branch not found');
    }

    const newAvailableSeats = branch.availableSeats + seatChange;
    if (newAvailableSeats < 0) {
      throw new Error('Not enough available seats');
    }
    if (newAvailableSeats > branch.totalSeats) {
      throw new Error('Available seats cannot exceed total seats');
    }

    return await BranchRepository.updateAvailableSeats(branchId, seatChange);
  }
}

export default new BranchService();