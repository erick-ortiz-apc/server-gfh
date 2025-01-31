import { DataTypes } from "sequelize";
import db from "../db/connection";
import ExpenseSource from "./expenseSource";

const MonthlyExpense = db.define('MonthlyExpense', {
    moExId: {
        type: DataTypes.INTEGER,
        field: 'mo_ex_id',
        primaryKey: true,
        autoIncrement: true,
    },
    exSoId: {
        type: DataTypes.INTEGER,
        field: 'ex_so_id',
        allowNull: false,
        references: {
            model: ExpenseSource,
            key: 'ex_so_id',
        },
    },
    moExMonth: {
        type: DataTypes.STRING,
        field: 'mo_ex_month',
        allowNull: false,
    },
    moExAmount: {
        type: DataTypes.INTEGER,
        field: 'mo_ex_amount',
        allowNull: false,
        defaultValue: 0
    },
}, {
    tableName: 'monthly_expense',
    timestamps: false,
    indexes: [
        {
            name: 'fk_expense_sources_monthly_expense_idx',
            unique: false,
            fields: ['ex_so_id'],
        },
    ],
});

ExpenseSource.hasMany(MonthlyExpense, { foreignKey: 'exSoId' });
MonthlyExpense.belongsTo(ExpenseSource, { foreignKey: 'exSoId' });

export default MonthlyExpense;
