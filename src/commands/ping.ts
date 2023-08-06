import { ApplicationCommandType } from 'discord-api-types/payloads';
import { Client, CommandInteraction } from 'discord.js';
import { Command } from 'src/commands/commands';

export const PingCommand: Command = {
  name: 'ping',
  description: 'Returns a pong',
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = 'Pong!';

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
