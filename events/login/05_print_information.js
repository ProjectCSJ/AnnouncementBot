const { Events } = require("discord.js");
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
		logger.info(`Logged in as ${client.user.tag}`);
	},
};
