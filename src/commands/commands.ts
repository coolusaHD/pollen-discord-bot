import { ChatInputApplicationCommandData, Client, CommandInteraction } from 'discord.js';
import { PingCommand } from 'src/commands/ping';

export interface Command extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: CommandInteraction) => void;
}



export const Commands: Command[] = [PingCommand];
