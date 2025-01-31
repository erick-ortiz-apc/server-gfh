import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DBNAME || 'db_gfh',
    process.env.DBUSER || 'root',
    process.env.DBPASSWORD || '$$160Erick5$$',
    {
        host: process.env.DBHOST || 'localhost',
        dialect: 'mysql'
    }
);

export default sequelize;