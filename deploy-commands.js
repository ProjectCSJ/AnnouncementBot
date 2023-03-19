const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");
dotenv.config();
const clientId = process.env.clientId;
const token = process.env.token;
const logLevel = process.env.logLevel;

const Logger = require("node-color-log");
const logger = Logger.createNamedLogger("HuskCat v1");
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
logger.setLevel(logLevel);

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandRoot = path.join(__dirname, "commands");
for (const commandPath of commandRoot) {
	const commandFile = fs.readdirSync(`${commandRoot}/${commandPath}`).filter((file) => file.endsWith(".js"));
	for (const commands of commandFile) {
		const command = require(`${commandRoot}/${commandPath}/${commands}`);
		commands.push(command.data.toJSON());
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		logger.info("Reseting application (/) commands...");

		rest
			.put(Routes.applicationCommands(clientId), { body: [] })
			.then(() => logger.success("Successfully deleted all application commands."))
			.catch((error) => logger.error(error.toString()));

		logger.info("Successfully reset application (/) commands!");

		logger.info(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(Routes.applicationCommands(clientId), { body: commands });

		logger.success(`Successfully reloaded ${data.length} application (/) commands!`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		logger.error(error.toString());
	}
})();
