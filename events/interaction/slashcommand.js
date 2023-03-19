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
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			logger.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			logger.error(`Error executing ${interaction.commandName}`);
			logger.error(error.toString());
		}
	},
};
