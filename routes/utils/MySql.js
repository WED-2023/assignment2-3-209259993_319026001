var mysql = require('mysql2');
require("dotenv").config();


const config={
connectionLimit:4,
  host: process.env.host,//"localhost"
  user: process.env.user,//"root"
  password: process.env.pwd, //"123456",
  database: process.env.db //"recipes"
}
const pool = new mysql.createPool(config);

// test connection is established
// console.log('MySQL Config:', config);
// const testConnection = () => {
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error getting MySQL connection:', err);
//       return;
//     }
//     console.log("MySQL pool connected: threadId " + connection.threadId);
//     connection.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
//       if (err) {
//         console.error('Error executing query:', err);
//         return;
//       }
//       console.log('Query results:', results);
//       connection.release((err) => {
//         if (err) {
//           console.error('Error releasing MySQL connection:', err);
//           return;
//         }
//         console.log("MySQL pool released: threadId " + connection.threadId);
//       });
//     });
//   });
// };

// testConnection();

const connection =  () => {
  return new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) reject(err);
    console.log("MySQL pool connected: threadId " + connection.threadId);
    const query = (sql, binding) => {
      return new Promise((resolve, reject) => {
         connection.query(sql, binding, (err, result) => {
           if (err) reject(err);
           resolve(result);
           });
         });
       };
       const release = () => {
         return new Promise((resolve, reject) => {
           if (err) reject(err);
           console.log("MySQL pool released: threadId " + connection.threadId);
           resolve(connection.release());
         });
       };
       resolve({ query, release });
     });
   });
 };
const query = (sql, binding) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (err, result, fields) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
module.exports = { pool, connection, query };







