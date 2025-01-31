import { Router } from 'express';
import { getExpenses, getExpense, deleteExpense, postExpense, putExpense } from '../controllers/expense';

const router = Router();

router.get('/', getExpenses);
router.get('/:id', getExpense);
router.delete('/:id', deleteExpense);
router.post('/', postExpense);
router.put('/:id', putExpense);

export default router;