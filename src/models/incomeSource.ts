import { DataTypes } from "sequelize";
import db from "../db/connection";

const IncomeSource = db.define('IncomeSource', {
    inSoId: {
        type: DataTypes.INTEGER,
        field: 'in_so_id',
        primaryKey: true,
        autoIncrement: true,
    },
    inSoPeriod: {
        type: DataTypes.INTEGER,
        field: 'in_so_period',
        allowNull: false,
    },
    inSoName: {
        type: DataTypes.STRING,
        field: 'in_so_name',
        allowNull: false,
    },
    inSoTotalSum: {
        type: DataTypes.INTEGER,
        field: 'in_so_total_sum',
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'income_sources',
    timestamps: false,
});

export default IncomeSource;