const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

// exports the command to be used in other parts of the app
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setdays")
    .setDescription("sets the minimum allowed account age in days")
    .addIntegerOption((option) =>
      option
        .setName("days")
        .setDescription("Minimum age in days (e.g. 14)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const days = interaction.options.getInteger("days");

    if (days < 1 || days > 365) {
      return interaction.reply({
        content: "❌ Please enter a number between 1 and 365 days.",
        flags: MessageFlags.Ephemeral,
      });
    }

    interaction.client.guildDaysSettings.set(interaction.guild.id, days);

    await interaction.reply({
      content: `✅ Minimum account age set to: **${days} days**`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
