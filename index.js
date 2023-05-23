const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, InteractionCreate } = require('discord.js');
const { token } = require('dotenv').config();
const CodenamesGame = require('./commands/realcommands/codenames.js');



const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.games = new Map();
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands',);
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
};

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (command) {
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else if (interaction.commandName === 'codenames') {
            const game = new CodenamesGame();
            client.games.set(interaction.channelId, game);
            await interaction.reply('New Codenames game started!');
        }
    } else if (interaction.isStringSelectMenu()) {
        const game = client.games.get(interaction.channelId);
        if (game && interaction.customId === 'role') {
            const role = interaction.values[0];
        game.addPlayer(interaction.user, role);
        const team = game.getTeamOfPlayer(interaction.user)
        await interaction.reply(`You joined the game as an ${role}! Your team is ${team}.`);        }
    }
});


			  

			client.once(Events.ClientReady, () => {
				console.log('Ready!');
			});



			
client.login(process.env.token);