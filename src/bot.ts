import { Client, GatewayIntentBits } from 'discord.js';
import { interactionCreate } from 'src/events/interacrionCreate';
import ready from 'src/events/ready';
import { POLLEN_BOT_TOKEN } from 'src/utils';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

ready(client);
interactionCreate(client);

client.login(POLLEN_BOT_TOKEN);
