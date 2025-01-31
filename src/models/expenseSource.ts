import { DataTypes } from "sequelize";
import db from "../db/connection";

const ExpenseSource = db.define('ExpenseSource', {
    exSoId: {
        type: DataTypes.INTEGER,
        field: 'ex_so_id',
        primaryKey: true,
        autoIncrement: true,
    },
    exSoPeriod: {
        type: DataTypes.INTEGER,
        field: 'ex_so_period',
        allowNull: false,
    },
    exSoName: {
        type: DataTypes.STRING,
        field: 'ex_so_name',
        allowNull: false,
    },
    exSoEssential: {
        type: DataTypes.BOOLEAN,
        field: 'ex_so_essential',
        allowNull: false,
    },
    exSoTotalSum: {
        type: DataTypes.INTEGER,
        field: 'ex_so_total_sum',
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'expense_sources',
    timestamps: false,
});

export default ExpenseSource;