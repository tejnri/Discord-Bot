const config = require("./config");
const mysql = require('mysql2/promise');

/**
 * This file will contain all the function to query the
 * database
 */

// Create mysql pool connection
const conn = mysql.createPool({
    host: config('DB_HOST'),
    user: config('DB_USER'),
    password: config('DB_PASS'),
    database: config('DB_NAME'),
    port: config('DB_PORT')? config('DB_PORT'):3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Function to save the search query in the history table
 *
 * @param user User who is sending the query
 * @param query Search query to be saved in history
 * @returns {void|PromiseLike<any>|Promise<any>}
 */
module.exports.saveQuery = (user, query) => {
    return conn.query("INSERT INTO search_history SET discord_user_id=?, query=?, created_at=now()",
        [user,query]).then(([rows]) => {
            if (!rows.insertId){
                throw new Error("Error in insert");
            }else{
                return true;
            }
    });
}

/**
 * This function will return the recent history of google search
 * queries done by the user
 *
 * @param user User who is asking for history
 * @param maxCount Max number of last history to be returned
 * @returns {void|PromiseLike<any>|Promise<any>}
 */
module.exports.getQueries = (user, maxCount=5) => {
    return conn.query("SELECT query from search_history where discord_user_id=? order by created_at desc LIMIT ?",
        [user,maxCount]).then(([rows]) => {
        return rows;
    });
}