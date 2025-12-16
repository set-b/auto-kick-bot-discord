const { SlashCommandBuilder } = require("discord.js");

// exports the command to be used in other parts of the app
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
