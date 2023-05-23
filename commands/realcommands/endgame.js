const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('endgame')
        .setDescription('Ends the current game'),
    async execute(interaction, client) {
        const game = client.games.get(interaction.channelId);
        if (!game) {
            await interaction.reply('There is no game in progress in this channel.');
            return;
        }

        // You can add a check here to make sure the user has the authority to end the game
        if (!game.isSpymaster(interaction.user)) {
             await interaction.reply('Only a spymaster can end the game.');
            return;
         }

        const winningTeam = game.teams.red.score > game.teams.blue.score ? 'red' : 'blue';
        game.endGame(winningTeam);
        client.games.delete(interaction.channelId);
        await interaction.reply(`The game has been ended. The ${winningTeam} team wins!`);
    },
}
