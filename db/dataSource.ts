import { DataSource } from "typeorm";
import { Application } from "./entities/Application.js";
import { CompanyProfile } from "./entities/CompanyProfile.js";
import { EmployeeProfile } from "./entities/EmployeeProfile.js";
import { Job } from "./entities/Job.js";
import { User } from "./entities/User.js";
import dotenv from 'dotenv'

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Application,
    CompanyProfile,
    EmployeeProfile,
    Job,
    User
  ],
  migrations: ['./**/migration/*.ts'],
  synchronize: true,
  logging: false
});
export const initDB = async () =>
  dataSource.initialize().then(() => {
    console.log("Connected to DB!");
  }).catch(err => {
    console.error('Failed to connect to DB: ' + err);
  });

export default dataSource;