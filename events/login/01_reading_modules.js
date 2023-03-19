const { Events, Collection } = require("discord.js");
const fs = require("node:fs");
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
		logger.info("Start loading commands...");
		// Commands
		client.commands = new Collection();
		const commandRoot = path.join(__dirname, "commands");
		for (const commandPath of commandRoot) {
			const commandFile = fs.readdirSync(`${commandRoot}/${commandPath}`).filter((file) => file.endsWith(".js"));
			for (const commands of commandFile) {
				const command = require(`${commandRoot}/${commandPath}/${commands}`);
				if ("data" in command && "execute" in command) {
					client.commands.set(command.data.name, command);
					logger.info(`・${command.data.name} in command`);
				} else {
					logger.warn(`The command at ${commandRoot}/${commandPath}/${commands} is missing a required "data" or "execute" property`);
				}
			}
		}
	},
};
