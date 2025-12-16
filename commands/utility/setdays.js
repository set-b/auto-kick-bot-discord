const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

// exports the command to be used in other parts of the app
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setdays")
    .setDescription("sets the minimum allowed account age in days")
    .addChannelOption((option) =>
      option
        .setName(`days`)
        .setDescription("Minimum age in days (e.g. 14)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(365),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const days = interaction.options.getInteger("days");

    interaction.client.guildDaysSettings.set(interaction.guild.id, days);
    // const channel = interaction.options.getChannel(`channel`);

    await interaction.reply({
      content: `✅ Minimum account age set to: **${days} days**`,
      ephemeral: true,
    });
  },
};
