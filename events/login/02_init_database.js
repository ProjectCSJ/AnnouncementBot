const { Events } = require("discord.js");
const Sequelize = require("sequelize");
const Logger = require("node-color-log");
const logger = Logger.createNamedLogger("HuskCat v1");
dotenv.config();
const logLevel = process.env.logLevel;
logger.setLevel(logLevel);
logger.setDate(() =>
	new Date()
		.toLocaleString(undefined, {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			hour12: false,
			minute: "2-digit",
			second: "2-digit",
		})
		.replace(/\//g, "-"),
);

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		logger.info("Checking DB status");
		if (!fs.existsSync("database.sqlite")) {
			logger.debug("Can't find out DB file.");
			logger.debug("Creating...");
			logger.info("Initalize database...");
			// SQLite Configuration
			const sequelize = new Sequelize("database", "user", "password", {
				host: "localhost",
				dialect: "sqlite",
				logging: false,
				storage: "database.sqlite",
			});

			const force = process.argv.includes("--force") || process.argv.includes("-f");

			sequelize
				.sync({ force })
				.then(() => {
					console.log("Database synced");
					sequelize.close();
				})
				.catch(console.error);

			logger.debug("Create complete!");
		}
		logger.info("DB checked!");
	},
};
