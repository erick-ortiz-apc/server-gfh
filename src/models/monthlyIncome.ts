import { DataTypes } from "sequelize";
import db from "../db/connection";
import IncomeSource from "./incomeSource";

const MonthlyIncome = db.define('MonthlyIncome', {
    moInId: {
        type: DataTypes.INTEGER,
        field: 'mo_in_id',
        primaryKey: true,
        autoIncrement: true,
    },
    inSoId: {
        type: DataTypes.INTEGER,
        field: 'in_so_id',
        allowNull: false,
        references: {
            model: IncomeSource,
            key: 'in_so_id',
        },
    },
    moInMonth: {
        type: DataTypes.STRING,
        field: 'mo_in_month',
        allowNull: false,
    },
    moInAmount: {
        type: DataTypes.INTEGER,
        field: 'mo_in_amount',
        allowNull: false,
        defaultValue: 0
    },
}, {
    tableName: 'monthly_income',
    timestamps: false,
    indexes: [
        {
            name: 'fk_income_sources_monthly_income_idx',
            unique: false,
            fields: ['in_so_id'],
        },
    ],
});

IncomeSource.hasMany(MonthlyIncome, { foreignKey: 'inSoId' });
MonthlyIncome.belongsTo(IncomeSource, { foreignKey: 'inSoId' });

export default MonthlyIncome;
