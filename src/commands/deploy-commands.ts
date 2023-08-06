import { POLLEN_BOT_CLIENT_ID, POLLEN_BOT_TOKEN } from '@PollenBot/utils/constants';
import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];

const rest = new REST({ version: '10' }).setToken(POLLEN_BOT_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  rest.put(Routes.applicationCommands(POLLEN_BOT_CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
