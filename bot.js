// Require the necessary discord.js classes
require('dotenv').config();

const { Client, Events, GatewayIntentBits } = require('discord.js');


// Create a new client instancen
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ] 
});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// kick script
client.on(Events.GuildMemberAdd, async (member) => {
    const accountAgeMs = Date.now() - member.user.createdAt.getTime();
    const daysOld = Math.floor(accountAgeMs / (24 * 60 * 60 * 1000)); // ms per day
  
    console.log(`${member.user.tag} account is ${daysOld} days old`);
  
    if (daysOld < 14) {

        try {
            console.log(`${member.user.displayName} should be banned - too new (${daysOld} days)`);
            await member.kick({reason: "Account is too new. Get outta here"});
        // await member.ban({ reason: `Account only ${daysOld} days old` });

        const logChannel = member.guild.channels.cache.get('YOUR_LOG_CHANNEL_ID_HERE');
      if (logChannel) {
        await logChannel.send(`✅ Auto-banned ${member.user.tag} - account only ${daysOld} days old`);
      }

        } catch (error) {
            console.log(`kick or ban failed ${error}`);
            const logChannel = member.guild.channels.cache.get('YOUR_LOG_CHANNEL_ID_HERE');
      if (logChannel) {
        await logChannel.send(`❌ Failed to auto-ban ${member.user.tag}: ${error.message}`);
        }
    }
})

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);