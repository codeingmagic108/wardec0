import { Sequelize, DataTypes } from 'sequelize';
import { Client } from 'pg';

const defaultHost = process.env.DB_HOST || 'localhost';
const defaultPort = process.env.DB_PORT || '5432';
const defaultUser = process.env.DB_USER || 'postgres';
const defaultPass = process.env.DB_PASS || 'postgres';
const defaultName = process.env.DB_NAME || 'dheerajkumar';

export const DATABASE_URL = process.env.DATABASE_URL ||
  `postgres://${defaultUser}:${defaultPass}@${defaultHost}:${defaultPort}/${defaultName}`;

const useSsl = DATABASE_URL?.includes('sslmode=require') || process.env.NODE_ENV === 'production';

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

const url = new URL(DATABASE_URL);
const targetDbName = url.pathname.slice(1) || defaultName;

export async function initDatabase() {
  if (targetDbName === 'postgres') {
    return;
  }

  const adminUrl = new URL(DATABASE_URL);
  adminUrl.pathname = '/postgres';

  const client = new Client({
    host: adminUrl.hostname,
    port: adminUrl.port || 5432,
    user: adminUrl.username || defaultUser,
    password: adminUrl.password || defaultPass,
    database: adminUrl.pathname.slice(1) || 'postgres',
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  try {
    const exists = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDbName]
    );

    if (exists.rowCount === 0) {
      await client.query(`CREATE DATABASE "${targetDbName}"`);
      console.log(`PostgreSQL database created: ${targetDbName}`);
    }
  } finally {
    await client.end();
  }
}

const Data = sequelize.define('Data', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rollno: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  marks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'data',
  timestamps: false,
});

export default Data;

