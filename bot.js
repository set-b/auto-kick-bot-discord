// Require the necessary discord.js classes
require("dotenv").config();
client.commands = new Collection(); // property to store commands as iterable in bot
client.guildLogChannels = new Map();
client.guildModeSettings = new Map();
client.guildDaysSettings = new Map();

const fs = require("node:fs"); // fs is for filesystem. reads files
const path = require("node:path"); // native node path utility module for adjoining file path strings
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags,
} = require("discord.js");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // roles and server information
    GatewayIntentBits.GuildMembers, // member details and join/leave events
    GatewayIntentBits.GuildMessages, // receive messages
    GatewayIntentBits.MessageContent, // read message content
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const foldersPath = path.join(__dirname, "commands"); // path to commands
const commandFolders = fs.readdirSync(foldersPath); // reads the path

for (const folder of commandFolders) {
  // iterates through subfolders of commandFolders
  const commandsPath = path.join(foldersPath, folder); // creates path
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  // reads subfolder and filters for .js file, assigned to commandFiles string[]
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file); // gets path to .js as string
    const command = require(filePath); // imports .js code as command

    if ("data" in command && "execute" in command) {
      // check if it has 'data' and 'execute' properties
      client.commands.set(command.data.name, command); // sets it to commands if it is legitimate
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing required "data" or "execute" property`
      );
    }
  }
}

// Event handling for commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return; // returns if not a chat input command

  // gets command with same name from commands collection of the client
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    // if the command does not exist in the collection -> error and return
    console.error(`no command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    // executes command if command is found
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    // interaction.replied - bot responded reply()
    // interaction.deferred - bot is deferring reply deferReply() to process
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        //followUp used because reply can only be used once
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      // bot hasn't responded, but error
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

// kick script
client.on(Events.GuildMemberAdd, async (member) => {
  const accountAgeMs = Date.now() - member.user.createdAt.getTime();
  const daysOld = Math.floor(accountAgeMs / (24 * 60 * 60 * 1000)); // ms per day

  const minDays = client.guildDaysSettings.get(member.guild.id) || 14;
  const mode = client.guildModeSettings.get(member.client.id) || "kick";
  const logChannelId = client.guildLogChannels.get(member.guild.id);
  const logChannel = logChannelId
    ? member.guild.id.channels.cache.get(logChannelId)
    : member.guild.systemChannel;

  console.log(`${member.user.tag} account is ${daysOld} days old`);

  if (daysOld < minDays) {
    try {
      console.log(
        `${member.user.displayName} should be kicked - too new (${daysOld} days)`
      );

      if (logChannel?.isTextBased()) {
        await systemChannel.send(
          `✅ Auto-kicked new account: ${member.user.tag}`
        );

        if (mode === "ban") {
          await member.ban({ reason: "Account is too new. Get outta here" });
        } else {
          await member.kick({ reason: "Account is too new. Get outta here" });
        }
      }
    } catch (error) {
      console.log(`kick or ban failed ${error}`);
      if (logChannel?.isTextBased()) {
        await logChannel.send(
          `❌ Failed to auto-kick ${member.user.tag}: ${error.message}`
        );
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN); // bot connects to discord through client login
