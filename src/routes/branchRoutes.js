import express from 'express';
import {
  createBranch,
  updateBranch,
  deleteBranch,
  getBranch,
  getAllBranches,
  getActiveBranches,
  getBranchStatistics,
  assignDepartmentHead
} from '../controllers/branchController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createBranchSchema,
  updateBranchSchema,
  branchIdParamSchema
} from '../validations/branchValidation.js';
import { uploadBranchImages } from '../config/cloudinary.js';

const router = express.Router();

router.get('/active', getActiveBranches);
router.get('/', getAllBranches);
router.get('/:id', validateRequest(branchIdParamSchema), getBranch);
router.get('/:id/statistics', validateRequest(branchIdParamSchema), getBranchStatistics);

router.post('/', authenticate, isAdmin, uploadBranchImages.array('images', 10), validateRequest(createBranchSchema), createBranch);
router.put('/:id', authenticate, isAdmin, uploadBranchImages.array('images', 10), validateRequest(branchIdParamSchema), validateRequest(updateBranchSchema), updateBranch);
router.delete('/:id', authenticate, isAdmin, validateRequest(branchIdParamSchema), deleteBranch);
router.post('/:id/assign-head', authenticate, isAdmin, validateRequest(branchIdParamSchema), assignDepartmentHead);

export default router;