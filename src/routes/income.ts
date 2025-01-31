import { Router } from 'express';
import { getIncomes, getIncome, deleteIncome, postIncome, putIncome } from '../controllers/income';

const router = Router();

router.get('/', getIncomes);
router.get('/:id', getIncome);
router.delete('/:id', deleteIncome);
router.post('/', postIncome);
router.put('/:id', putIncome);

export default router;