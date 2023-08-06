const { SlashCommandBuilder, hideLinkEmbed, time } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { default: axios } = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pollen')
		.setDescription('Main command for pollen feautures')
		.addSubcommand(subcommand =>
			subcommand
				.setName('help')
				.setDescription('Shows this help message'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('Lists all (sub-) regions where you can get the pollen forecast for'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('forecast')
				.setDescription('Shows the pollen forecast for a specific region')
				.addNumberOption(option =>
					option
						.setName('id')
						.setDescription('id of the (sub-) region'))),

	async execute(interaction) {
		await switchExecute(interaction);
	},
};

// Subcommand executor
async function switchExecute(interaction) {
	switch (interaction.options.getSubcommand()) {
		case 'help':
			await helpExecute(interaction);
			break;
		case 'list':
			await listExecute(interaction);
			break;
		case 'forecast':
			await forecastExecute(interaction);
			break;
		default:
			await interaction.reply('Invalid subcommand');
			break;
	}
}


// Help command
async function helpExecute(interaction) {
	const zls = '\u200B';
	let commands = [
		'`/pollen list`',
		'`/pollen forecast <id>`',
		'`/pollen help`'
	];
	let commandsDescriptions = [
		'Auflistung aller möglichen Regionen, für welche Vorhersagen gemacht werden können',
		'Abfrage des pollen-Forecasts für eine bestimmte Region',
		'Hilfe zum pollenBot'
	];

	let commandFields = [];
	for (let i = 0; i < commands.length; i++) {
		commandFields.push({name: zls, value: commands[i], inline: true});
		commandFields.push({name: zls, value: commandsDescriptions[i], inline: true});
		commandFields.push({name: zls, value: zls, inline: false});
	}

	
	const helpWebsite = 'https://coolusahd.github.io/pollen-discord-bot/';
	const DWDLink = 'https://www.dwd.de/';

	let replyEmbed = new MessageEmbed()
		.setTitle('PollenBot :sunflower: - Hilfe')
		.setDescription('Hilfe Nachricht für den PollenBot \n Für weitere Hilfe: ' + hideLinkEmbed(helpWebsite) + '\n\n  Quelle: Deutscher Wetterdienst ' + hideLinkEmbed(DWDLink))
		.addField('Befehle', zls, true)
		.addField('Beschreibung', zls, true)
		.addField(zls, zls, true)
		.addFields(...commandFields)
		.setColor('#0099ff')
		.setTimestamp()
		.setFooter({ text: 'PollenBot by Philipp Alber' });


	await interaction.reply({ embeds: [replyEmbed] });

}

// List command
async function listExecute(interaction) {

	const regions = await getRegions();

	let availableRegionsID = '';
	let availableRegionsName = '';

	for (let i = 0; i < regions.length; i++) {
		availableRegionsID += '# ' + regions[i]['id'] + '\n';
		availableRegionsName += regions[i]['name'] + '\n';
	}
	const DWDLink = 'https://www.dwd.de/';

	let replyEmbed = new MessageEmbed()
		.setTitle('PollenBot :sunflower: - Liste aller Regionen')
		.setDescription('Auflistung aller möglichen Regionen, welche mit \n `/pollen forecast <id>` verwendet werden können \n\n  Quelle: Deutscher Wetterdienst ' + hideLinkEmbed(DWDLink))
		.addField('RegionID', availableRegionsID, true)
		.addField('Name', availableRegionsName, true)
		.setColor('#0099ff')
		.setTimestamp()
		.setFooter({ text: 'PollenBot by Philipp Alber' });


	await interaction.reply({ embeds: [replyEmbed] });
}

// Forecast command
async function forecastExecute(interaction) {

	const data = await getDataFromAPI();
	const pollenData = data.content;
	const id = interaction.options.getNumber('id');

	if (id == null) {
		await interaction.reply('Please specify a region id');
		return;
	}

	const regionData = pollenData.find(element => element.region_id === id || element.partregion_id === id);

	if (regionData == null) {
		await interaction.reply('No region with id ' + id + ' found');
		return;
	}

	const replyEmbed = await genrateForecastEmbed(id)

	await interaction.reply({ embeds: [replyEmbed] });
}

async function getDataFromAPI() {
	const data = await axios.get('https://opendata.dwd.de/climate_environment/health/alerts/s31fg.json');
	return data.data;
}

// Get regions
async function getRegions() {

	//get data from API
	const data = await getDataFromAPI();

	let regions = [];
	const pollenData = data.content;

	for (let i = 0; i < pollenData.length; i++) {
		//push region id and name as dict
		//seperate region and subregion
		if (pollenData[i]['partregion_id'] === -1) {
			//main region
			regions.push({
				id: pollenData[i]['region_id'],
				name: pollenData[i]['region_name']
			});
		} else {
			//subregion
			regions.push({
				id: pollenData[i]['partregion_id'],
				name: pollenData[i]['partregion_name']
			});
		}
	}

	return regions;
}

function fromLoadLevelToMardown(loadLevel) {
	switch (loadLevel) {
		case '0':
			return ':green_circle: (' + loadLevel + ')';
		case '0-1':
			return ':green_circle::orange_circle: (' + loadLevel + ')';
		case '1':
			return ':orange_circle: (' + loadLevel + ')';
		case '1-2':
			return ':orange_circle::red_circle: (' + loadLevel + ')';
		case '2':
			return ':red_circle: (' + loadLevel + ')';
		case '2-3':
			return ':warning: (' + loadLevel + ')';
		case '3':
			return ':no_entry_sign: (' + loadLevel + ')';
		default:
			return '';
	}
}

async function genrateForecastEmbed(id) {


	const data = await getDataFromAPI();
	const timestamp = data.last_update;
	let dataTimestamp = timestamp.split(' ');
	dataTimestamp = new Date(dataTimestamp[0] + ' ' + dataTimestamp[1]);
	dataTimestamp = dataTimestamp.toLocaleString();
	const pollenData = data.content;

	const regionData = pollenData.find(element => element.region_id === id || element.partregion_id === id);

	let dayafter_to_bool = regionData.Pollen['Birke'].dayafter_to === -1;

	let pollenTypeFields = generatePollenTypesFields();
	let pollenForecastFields = generateForecastFieldForEmbend(regionData, dayafter_to_bool);

	let days = getForecastDays(dayafter_to_bool);

	let description = getDescription(regionData, dataTimestamp);

	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('PollenBot :sunflower: - Forecast')
		.setDescription(description)
		.addFields(
			{ name: 'Pollentyp \t\t\t', value: pollenTypeFields, inline: true },
			{ name: days, value: pollenForecastFields, inline: true },
		)
		.setTimestamp()
		.setFooter({ text: 'PollenBot by Philipp Alber' });

	return embed
}

function getForecastDays(dayafter_to_bool) {
	if (dayafter_to_bool) {
		return 'Heute \t\t\t Morgen \t\t\t Übermorgen';
	}
	else {
		return 'Heute \t\t\t Morgen';
	}
}

function getDescription(regionData, dataTimestamp) {
	let regionString = regionData.partregion_name === "" ? regionData.region_name : regionData.partregion_name;
	const DWDLink = 'https://www.dwd.de/';
	return 'Pollenflug-Gefahrenindex für Region: ' + regionString + '\n' + 'Stand: ' + dataTimestamp + '\n\n  Quelle: Deutscher Wetterdienst ' + hideLinkEmbed(DWDLink);
}

function generateForecastFieldForEmbend(regionData, dayafter_to_bool) {

	const pollenType = ['Hasel', 'Erle', 'Esche', 'Birke', 'Graeser', 'Roggen', 'Beifuss', 'Ambrosia'];
	const zls = '\u200B';

	let replyText = '';

	for (let i = 0; i < pollenType.length; i++) {

		const pollen = regionData.Pollen[pollenType[i]];

		replyText += fromLoadLevelToMardown(pollen.today);
		replyText += addSpacer(pollen.today) + fromLoadLevelToMardown(pollen.tomorrow);

		if (dayafter_to_bool) {
			replyText += addSpacer(pollen.tomorrow) + fromLoadLevelToMardown(pollen.today) + '\n';
		}
		else {
			replyText += '\n';
		}

	}

	return replyText;
}

function generatePollenTypesFields() {

	const pollenType = ['Hasel', 'Erle', 'Esche', 'Birke', 'Graeser', 'Roggen', 'Beifuss', 'Ambrosia'];

	let fields = '';

	for (let i = 0; i < pollenType.length; i++) {
		fields += pollenType[i] + '\n';
	}

	return fields;

}

function addSpacer(text) {
	let length = text.length;
	let spacer = '';
	let spacerNeeded = 10 - length;

	for (let i = 0; i < spacerNeeded; i++) {
		spacer += '-';
	}

	return spacer;
}
