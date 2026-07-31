import { Router } from 'express';
import {
  getAllInstances,
  getInstanceById,
  createInstance,
  updateInstance,
  deleteInstance,
  updateInstanceStatus,
} from '../controllers/instancesController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getAllInstances);
router.get('/:id', getInstanceById);
router.post('/', createInstance);
router.put('/:id', updateInstance);
router.delete('/:id', deleteInstance);
router.patch('/:id/status', updateInstanceStatus);

export default router;