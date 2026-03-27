import mysql from "mysql2";
import process from "process";
import dotenv from "dotenv";
dotenv.config(); //Loading environment variables

const dataBaseConnection = mysql.createConnection({
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB_NAME,
});

dataBaseConnection.connect((err) => {
  if (err) {
    console.error("Database connection error: ", err);
    throw err;
  } else {
    console.log("Database connected successfully");
  }
});

export default dataBaseConnection;
