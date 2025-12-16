const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

// exports the command to be used in other parts of the app
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setmode")
    .setDescription("sets the bot to auto kick or auto ban")
    .addChannelOption((option) =>
      option
        .setName(`mode`)
        .setDescription("kick or ban")
        .setRequired(true)
        .addChoices(
          { name: "Kick", value: "kick" },
          { name: "Ban", value: "ban" },
        ),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const mode = interaction.options.getString("mode");

    interaction.client.guildDaysSettings.set(interaction.guild.id, mode);

    await interaction.reply({
      content: `✅ Mode set to: **${mode}**`,
      ephemeral: true,
    });
  },
};
