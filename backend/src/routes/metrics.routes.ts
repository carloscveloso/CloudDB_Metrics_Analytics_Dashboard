import { Router } from 'express';
import {
  getMetrics,
  createMetric,
  createMetricsBatch,
  getLatestMetrics,
  deleteOldMetrics,
} from '../controllers/metricsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getMetrics);
router.get('/latest', getLatestMetrics);
router.post('/', createMetric);
router.post('/batch', createMetricsBatch);
router.delete('/old', deleteOldMetrics);

export default router;