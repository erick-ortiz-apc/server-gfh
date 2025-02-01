import { Request, Response } from 'express';
import ExpenseSource from '../models/expenseSource';
import MonthlyExpense from '../models/monthlyExpense';

export const getExpenses = async (req: Request, res: Response): Promise<any> => {
    const listExpenses = await ExpenseSource.findAll({
        include: [{
            model: MonthlyExpense,
            as: 'MonthlyExpenses',
            attributes: ['moExId', 'moExMonth', 'moExAmount']
        }],
        order: [['exSoPeriod', 'DESC']]
    });
    res.status(200).json(listExpenses);
};

export const getExpense = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const expense = await ExpenseSource.findOne({
        include: [{
            model: MonthlyExpense,
            as: 'MonthlyExpenses',
            attributes: ['moExId', 'moExMonth', 'moExAmount']
        }],
        where: { exSoId: id }
    });

    if (!expense) {
        res.status(404).json({
            msg: `No existe un ingreso con el id ${id}`
        });
    } else {
        res.status(200).json(expense);
    }
}

export const deleteExpense = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const expense = await ExpenseSource.findByPk(id);

    if (!expense) {
        res.status(404).json({
            msg: `No existe un ingreso con el id ${id}`
        });
    } else {
        const monthlyExpenses = await MonthlyExpense.findAll({
            where: { exSoId: id }
        });

        if (monthlyExpenses.length > 0) {
            monthlyExpenses.forEach(async (item: any) => {
                await item.destroy();
            });
        }

        await expense.destroy();

        res.status(200).json({
            msg: 'ingreso eliminado correctamente'
        });
    }
}

export const postExpense = async (req: Request, res: Response): Promise<any> => {
    const { body } = req;
    const newExpense: any = await ExpenseSource.create({
        exSoPeriod: body.exSoPeriod,
        exSoName: body.exSoName,
        exSoEssential: body.exSoEssential
    });

    if (!newExpense) {
        res.status(400).json({
            msg: 'No se pudo crear el ingreso'
        });
    }

    const newsMonthlyExpense = body.MonthlyExpenses.map((item: any) => {
        return {
            exSoId: newExpense.exSoId,
            moExMonth: item.moExMonth,
            moExAmount: item.moExAmount || 0
        }
    });

    const monthlyExpense = await MonthlyExpense.bulkCreate(newsMonthlyExpense);

    if (!monthlyExpense) {
        res.status(400).json({
            msg: 'No se pudo crear el ingreso'
        });
    }

    newExpense.MonthlyExpenses = monthlyExpense;

    res.status(201).json({
        msg: 'Ingreso creado correctamente',
        newExpense
    });
}

export const putExpense = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { body } = req;

    const expense: any = await ExpenseSource.findByPk(id, {
        include: MonthlyExpense
    });

    if (!expense) {
        return res.status(404).json({
            msg: `No existe un gasto con el id ${id}`
        });
    }

    await expense.update(body);

    if (body.MonthlyExpenses && Array.isArray(body.MonthlyExpenses)) {
        for (const monthlyData of body.MonthlyExpenses) {
            const { moExId, moExAmount, moExMonth } = monthlyData;

            const monthlyExpense = await MonthlyExpense.findByPk(moExId);

            if (monthlyExpense) {
                await monthlyExpense.update({ moExAmount, moExMonth });
            } else {
                await MonthlyExpense.create({
                    exSoId: expense.exSoId,
                    moExAmount,
                    moExMonth
                });
            }
        }
    }

    return res.status(200).json({
        msg: 'Gasto y los gastos mensuales actualizados correctamente'
    });
};
