// bot.js

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addbot')
        .setDescription('Add bot opponents to the game.')
        .addStringOption(option => 
            option.setName('team')
            .setDescription('The team for the bot to join.')
            .setRequired(true)
            .addChoices({ name: 'red', value: 'red' },
                        { name: 'blue', value: 'blue'},))
        .addIntegerOption(option => 
            option.setName('number')
            .setDescription('The number of bots to add.')
            .setRequired(true)
            .setMaxValue(10)),
    async execute(interaction, client) {
        const game = client.games.get(interaction.channelId);
        
        if (!game) {
            await interaction.reply('No game in progress.');
            return;
        }

        const team = interaction.options.getString('team');
        const number = interaction.options.getInteger('number');

        // Add the bots to the game
        // Add the bots to the game
        for (let i = 0; i < number; i++) {
            const botUser = game.createBotUser(team);
            game.addPlayer(botUser.id);
            console.log("Bot user created: ", botUser); // Debug line
            }

        

        await interaction.reply(`Added ${number} bot(s) to the ${team} team.`);
    }
};
