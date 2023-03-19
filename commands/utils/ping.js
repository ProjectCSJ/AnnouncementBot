const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Test delay"),
	async execute(interaction) {
		const pongI18n = {
			"en-US": "Delay ",
			"zh-TW": "延遲",
			"ja": "遅れ",
		};
		const unitI18n = {
			"en-US": " ms.",
			"zh-TW": "毫秒。",
			"ja": "ミリ秒",
		};
		const defaultLocate = process.env.defaultLocate;
		const locale = interaction.locale ?? defaultLocate;
		const ping = new EmbedBuilder()
			.setColor("Random")
			.setAuthor({
				name: interaction.client.user.username,
				iconURL: interaction.client.user.avatarURL({ dynamic: true }),
				url: process.env.siteUrl,
			})
			.setTitle("Pong!")
			.setDescription([pongI18n[locale]] + Math.abs(Date.now() - interaction.createdTimestamp) + [unitI18n[locale]])
			.setFooter({
				text: process.env.copyright,
				iconURL: interaction.client.user.avatarURL({ dynamic: true }),
			});
		await interaction.reply({
			embeds: [ping],
			ephemeral: true,
		});
	},
};
