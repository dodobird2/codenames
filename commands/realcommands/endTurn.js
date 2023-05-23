const { SlashCommandBuilder } = require('discord.js');
const { CodenamesGame } = require('./codenames');  // adjust the path as needed

module.exports = {
    data: new SlashCommandBuilder()
        .setName('endturn')
        .setDescription('End your team\'s turn'),
    async execute(interaction, client) {
        const game = client.games.get(interaction.channelId);

        if (game) {
            const user = interaction.user;
            const team = game.getTeamOfPlayer(user);
            const isSpymaster = game.isSpymaster(user);

            // Check if it's the correct team's turn and the user is not a spymaster
            if (team === game.turn && !isSpymaster) {
                game.endTurn();
                await interaction.reply(`Turn ended. It's now ${game.turn === 'Red' ? 'Blue' : 'Red'} team's turn.`);
            } else {
                await interaction.reply('You cannot end your turn right now.');
            }
        } else {
            await interaction.reply('No game in progress.');
        }
    },
};
