require("dotenv").config();
const { REST, Routes } = require("discord.js");

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Deleting all commands...");

    // Delete all guild commands
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      { body: [] },
    );

    // Delete all global commands
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [],
    });

    console.log("Successfully deleted all commands!");
  } catch (error) {
    console.error(error);
  }
})();
