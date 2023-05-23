const { SlashCommandBuilder, Client } = require('discord.js');
const { CodenamesGame } = require('./codenames');  // adjust the path as needed

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changerole')
        .setDescription('Change your role in the current game of Codenames')
        .addStringOption(option => option.setName('role')
            .setDescription('Choose your new role')
            .setRequired(true)
            .addChoices(
            {name: 'Spy Master', value: 'spymaster'},
            {name: 'Operator', value: 'operator'})),
    async execute(interaction, client) {
        const game = client.games.get(interaction.channelId);
        if (game) {
            const role = interaction.options.getString('role');
            const team = game.getTeamOfPlayer(interaction.user); // This is a new method you need to add to the CodenamesGame class
            game.removePlayer(interaction.user); // This is a new method you need to add to the CodenamesGame class
            game.addPlayer(interaction.user, role, team);
            await interaction.reply(`Your role has been changed to ${role} and you are on the ${team} team.`);
        } else {
            await interaction.reply('No game in progress.');
        }
    },
}