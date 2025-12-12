// Require the necessary discord.js classes
require('dotenv').config();

const { Client, Events, GatewayIntentBits } = require('discord.js');


// Create a new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ] 
});

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

          await systemChannel.send(`✅ Auto-banned new account: ${member.user.tag}`);
      }

     catch (error) {
            console.log(`kick or ban failed ${error}`);
           await systemChannel.send(`❌ Failed to auto-ban ${member.user.tag}: ${error.message}`);
        }
    }
})

client.login(process.env.DISCORD_TOKEN);