import { Command } from '@PollenBot/commands/allCommands';
import { ApplicationCommandType } from 'discord-api-types/payloads';
import { Client, CommandInteraction } from 'discord.js';

export const PingCommand: Command = {
  name: 'ping',
  description: 'Returns a pong',
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = 'Pong!';

    console.log('Pong!');

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
