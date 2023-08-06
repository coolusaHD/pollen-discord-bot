import { interactionCreate } from '@PollenBot/events/interacrionCreate';
import { ready } from '@PollenBot/events/ready';
import { POLLEN_BOT_TOKEN } from '@PollenBot/utils/constants';
import { Client, GatewayIntentBits } from 'discord.js';

import dotenv from 'dotenv';
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });


ready(client);
interactionCreate(client);

client.login(POLLEN_BOT_TOKEN);
