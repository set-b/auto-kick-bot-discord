const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

// exports the command to be used in other parts of the app
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setlogchannel")
    .setDescription("sets where the bot will send the auto-kick/ban logs")
    .addChannelOption((option) =>
      option
        .setName(`channel`)
        .setDescription(`where the logs will be sent`)
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.options.getChannel(`channel`);

    if (!channel.isTextBased()) {
      return interaction.reply({
        content: "❌ Please select a text channel!",
        ephemeral: true,
      });
    }

    interaction.client.guildLogChannels.set(interaction.guild.id, channel.id);

    await interaction.reply({
      content: `✅ Auto-kick logs will now be sent to ${channel}`,
      ephemeral: true,
    });
  },
};
