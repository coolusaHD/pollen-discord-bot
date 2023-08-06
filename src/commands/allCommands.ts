import { PingCommand } from '@PollenBot/commands/ping';
import { ChatInputApplicationCommandData, Client, CommandInteraction } from 'discord.js';

export interface Command extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: CommandInteraction) => void;
}

export const Commands: Command[] = [PingCommand];
