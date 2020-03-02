const sqlite = require('sqlite3');
const logger = require('../utils/logger');

class Database {
    constructor() {
        this.db = new sqlite.Database('./psv.db', (error) => {
            if (error) {
                logger.info(error);
            }
            logger.info('Connected to database');
        });
        this.createTables();
    }

    async createTables() {
        const warnings = `
            CREATE TABLE IF NOT EXISTS warnings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER NOT NULL,
                user TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                reason TEXT NOT NULL,
                FOREIGN KEY (client_id) REFERENCES users(client_id)
            )
            `;
        const kicks = `
            CREATE TABLE IF NOT EXISTS kicks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER NOT NULL,
                user TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                reason TEXT NOT NULL,
                FOREIGN KEY (client_id) REFERENCES users(client_id)
            )
            `;
        const bans = `
            CREATE TABLE IF NOT EXISTS bans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER NOT NULL,
                user TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                reason TEXT NOT NULL,
                FOREIGN KEY (client_id) REFERENCES users(client_id)
            )
            `;
        const users = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER NOT NULL,
                name TEXT NOT NULL)
            `;
        this.db.run(warnings, (error) => {
            if (error) {
                logger.info(error);
            }
            logger.info('Warnings tables loaded (1/4)');
        });
        this.db.run(kicks, (error) => {
            if (error) {
                logger.info(error);
            }
            logger.info('Kicks tables loaded (2/4)');
        });
        this.db.run(bans, (error) => {
            if (error) {
                logger.info(error);
            }
            logger.info('Bans tables loaded (3/4)');
        });
        this.db.run(users, (error) => {
            if (error) {
                logger.info(error);
            }
            logger.info('Users tables loaded (4/4)');
        });
    }
}

module.exports = Database;
