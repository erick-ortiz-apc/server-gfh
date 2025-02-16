import { Request, Response } from 'express';
import IncomeSource from "../models/incomeSource";
import MonthlyIncome from "../models/monthlyIncome";

export const getIncomes = async (req: Request, res: Response): Promise<any> => {
    const listIncomes = await IncomeSource.findAll({
        include: [{
            model: MonthlyIncome,
            as: 'MonthlyIncomes',
            attributes: ['moInId', 'moInMonth', 'moInAmount']
        }],
        order: [['inSoPeriod', 'DESC']]
    });
    res.status(200).json(listIncomes);
};

export const getIncome = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const income = await IncomeSource.findOne({
        include: [{
            model: MonthlyIncome,
            as: 'MonthlyIncomes',
            attributes: ['moInId', 'moInMonth', 'moInAmount']
        }],
        where: { inSoId: id }
    });

    if (!income) {
        res.status(404).json({
            msg: `No existe un ingreso con el id ${id}`
        });
    } else {
        res.status(200).json(income);
    }
}

export const deleteIncome = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const income = await IncomeSource.findByPk(id);

    if (!income) {
        res.status(404).json({
            msg: `No existe un ingreso con el id ${id}`
        });
    } else {
        const monthlyIncomes = await MonthlyIncome.findAll({
            where: { inSoId: id }
        });

        if (monthlyIncomes.length > 0) {
            monthlyIncomes.forEach(async (item: any) => {
                await item.destroy();
            });
        }

        await income.destroy();

        res.status(200).json({
            msg: 'ingreso eliminado correctamente'
        });
    }
}

export const postIncome = async (req: Request, res: Response): Promise<any> => {
    const { body } = req;
    const newIncome: any = await IncomeSource.create({
        inSoPeriod: body.inSoPeriod,
        inSoName: body.inSoName
    });

    if (!newIncome) {
        res.status(400).json({
            msg: 'No se pudo crear el ingreso'
        });
    }

    const newsMonthlyIncome = body.MonthlyIncomes.map((item: any) => {
        return {
            inSoId: newIncome.inSoId,
            moInMonth: item.moInMonth,
            moInAmount: item.moInAmount || 0
        }
    });

    const monthlyIncome = await MonthlyIncome.bulkCreate(newsMonthlyIncome);

    if (!monthlyIncome) {
        res.status(400).json({
            msg: 'No se pudo crear el ingreso'
        });
    }

    newIncome.MonthlyIncomes = monthlyIncome;

    res.status(201).json({
        msg: 'Ingreso creado correctamente',
        newIncome
    });
}

export const putIncome = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { body } = req;

    const income: any = await IncomeSource.findByPk(id, {
        include: MonthlyIncome
    });

    if (!income) {
        return res.status(404).json({
            msg: `No existe un ingreso con el id ${id}`
        });
    }

    await income.update(body);

    if (body.MonthlyIncomes && Array.isArray(body.MonthlyIncomes)) {
        for (const monthlyData of body.MonthlyIncomes) {
            const { moInId, moInAmount, moInMonth } = monthlyData;

            const monthlyIncome = await MonthlyIncome.findByPk(moInId);

            if (monthlyIncome) {
                await monthlyIncome.update({ moInAmount, moInMonth });
            } else {
                await MonthlyIncome.create({
                    inSoId: income.inSoId,
                    moInAmount,
                    moInMonth
                });
            }
        }
    }

    return res.status(200).json({
        msg: 'Ingreso y los ingresos mensuales actualizados correctamente'
    });
};