import { Request, Response } from 'express';
import IncomeSource from "../models/incomeSource";
import ExpenseSource from '../models/expenseSource';
import MonthlyExpense from '../models/monthlyExpense';
import MonthlyIncome from '../models/monthlyIncome';

export const getAvailablePeriods = async (req: Request, res: Response): Promise<any> => {
    const listIncomes = await IncomeSource.findAll({
        attributes: ['inSoPeriod'],
        order: [['inSoPeriod', 'DESC']]
    });

    const listExpenses = await ExpenseSource.findAll({
        attributes: ['exSoPeriod'],
        order: [['exSoPeriod', 'DESC']]
    });

    const allPeriods = [
        ...listIncomes.map((income: any) => income.inSoPeriod),
        ...listExpenses.map((expense: any) => expense.exSoPeriod)
    ];

    const uniquePeriods = [...new Set(allPeriods)];

    res.status(200).json(uniquePeriods);
};

export const getDataDashboard = async (req: Request, res: Response): Promise<any> => {
    const { period } = req.params;
    const prevPeriod = Number(period) - 1;

    try {
        const monthsList = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const incomes = await MonthlyIncome.findAll({
            include: [{ model: IncomeSource, where: { inSoPeriod: [prevPeriod, period] } }]
        });

        const expenses = await MonthlyExpense.findAll({
            include: [{ 
                model: ExpenseSource, 
                where: { exSoPeriod: [prevPeriod, period] }
            }]
        });

        console.log("Incomes:", incomes);
        console.log("Expenses:", expenses);

        const getMonthData = (month: string, period: number) => {
            const totalIncomes = incomes
                .filter((income: any) => income.moInMonth === month && income.IncomeSource.inSoPeriod === period)
                .reduce((sum: number, income: any) => sum + income.moInAmount, 0);

            const totalEssentialExpenses = expenses
                .filter((expense: any) => 
                    expense.moExMonth === month && 
                    expense.ExpenseSource?.exSoEssential && 
                    expense.ExpenseSource?.exSoPeriod === period
                )
                .reduce((sum: number, expense: any) => sum + expense.moExAmount, 0);

            const totalNotEssentialExpenses = expenses
                .filter((expense: any) => 
                    expense.moExMonth === month && 
                    !expense.ExpenseSource?.exSoEssential && 
                    expense.ExpenseSource?.exSoPeriod === period
                )
                .reduce((sum: number, expense: any) => sum + expense.moExAmount, 0);

            return {
                month,
                totalIncomes,
                totalEssentialExpenses,
                totalNotEssentialExpenses
            };
        };

        const prevDecemberData = getMonthData("Diciembre", prevPeriod);

        const dataDashboard = {
            period: Number(period),
            months: [
                prevDecemberData,
                ...monthsList.map(month => getMonthData(month, Number(period)))
            ]
        };

        return res.status(200).json(dataDashboard);

    } catch (error) {
        console.error("Error obteniendo datos del dashboard:", error);
        return res.status(500).json({ msg: "Error al obtener los datos del dashboard" });
    }
};

