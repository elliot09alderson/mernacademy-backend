import BranchRepository from '../repositories/BranchRepository.js';
import UserRepository from '../repositories/UserRepository.js';

class BranchService {
  async createBranch(branchData) {
    const { branchCode } = branchData;

    const existingBranch = await BranchRepository.findByBranchCode(branchCode);
    if (existingBranch) {
      throw new Error('Branch code already exists');
    }

    if (!branchData.availableSeats) {
      branchData.availableSeats = branchData.totalSeats;
    }

    const branch = await BranchRepository.create(branchData);
    return branch;
  }

  async updateBranch(branchId, updateData) {
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