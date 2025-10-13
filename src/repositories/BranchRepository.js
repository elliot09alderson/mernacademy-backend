import BaseRepository from './BaseRepository.js';
import Branch from '../models/Branch.js';

class BranchRepository extends BaseRepository {
  constructor() {
    super(Branch);
  }

  async findByBranchCode(branchCode) {
    return await this.model.findOne({ branchCode });
  }

  async findActiveBranches(options = {}) {
    return await this.find({ isActive: true }, options);
  }

  async updateAvailableSeats(branchId, change) {
    return await this.model.findByIdAndUpdate(
      branchId,
      { $inc: { availableSeats: change } },
      { new: true }
    );
  }

  async assignDepartmentHead(branchId, userId) {
    return await this.model.findByIdAndUpdate(
      branchId,
      { departmentHead: userId },
      { new: true }
    ).populate('departmentHead');
  }

  async findWithDetails(id) {
    return await this.model.findById(id)
      .populate('departmentHead');
  }

  async getBranchStatistics(branchId) {
    const branch = await this.model.findById(branchId);
    if (!branch) return null;

    const occupiedSeats = branch.totalSeats - branch.availableSeats;
    const occupancyRate = (occupiedSeats / branch.totalSeats) * 100;

    return {
      ...branch.toObject(),
      occupiedSeats,
      occupancyRate: occupancyRate.toFixed(2)
    };
  }
}

export default new BranchRepository();