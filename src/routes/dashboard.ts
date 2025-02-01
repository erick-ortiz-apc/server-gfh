import { Router } from 'express';
import { getAvailablePeriods, getDataDashboard } from '../controllers/dashboard';

const router = Router();

router.get('/', getAvailablePeriods);
router.get('/:period', getDataDashboard);

export default router;