require('dotenv').config();

var fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');



var TOKEN = process.env.TOKEN;
var GUILD_ID = process.env.GUILD_ID;
var CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN) {
	console.log('No token found. Please set TOKEN in .env');
	process.exit(1);
}

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


client.commands = new Collection();

// Reads commands from the commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}


// Load events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


// Login to Discord with your client's token
client.login(TOKEN);