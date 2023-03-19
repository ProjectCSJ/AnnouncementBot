// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require("discord.js");
const Logger = require("node-color-log");
const dotenv = require("dotenv");
const path = require("node:path");

// Configuration Setup
const logger = Logger.createNamedLogger("HuskCat v1");
dotenv.config();
const token = process.env.token;
const logLevel = process.env.logLevel;
logger.setLevel(logLevel);

// Logger Configuration
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

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Events
const eventRoot = path.join(__dirname, "events");
for (const eventPath of eventRoot) {
	const eventFolder = path.join(eventRoot, eventPath);
	for (const eventFile of eventFolder) {
		const eventFiles = fs.readdirSync(eventFile).filter((file) => file.endsWith(".js"));
		const eventPath = path.join(eventFolder, eventFiles);
		const event = require(eventPath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
}

// Log in to Discord with your client's token
client.login(token);
