import pg from 'pg';
import dotenv from "dotenv"
dotenv.config()
const {Pool}  = pg

const localPool = {
	user: process.env.USER,
	password: process.env.PASSWORD,
	host: process.env.HOST,
	database: process.env.DATABASE
}

const poolConfig = process.env.DATABASE_URL ? {connectionString: process.env.DATABASE_URL, ssl:{
	rejectUnathourized: false}} : localPool;
const pool = new Pool(poolConfig);
export default pool;