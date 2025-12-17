const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setlogchannel")
    .setDescription("Set the channel where auto-kick logs will be posted")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send logs to")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");

    // Check if it's a text channel
    if (!channel.isTextBased()) {
      return interaction.reply({
        content: "❌ Please select a text channel!",
        flags: MessageFlags.Ephemeral,
      });
    }

    // Store the channel ID in the bot's memory
    interaction.client.guildLogChannels.set(interaction.guild.id, channel.id);

    await interaction.reply({
      content: `✅ Auto-kick logs will now be sent to ${channel}`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
