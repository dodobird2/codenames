const {SlashCommandBuilder} = require('discord.js')
const { CodenamesGame } = require('./codenames');  // adjust the path as needed


module.exports = {
data: new SlashCommandBuilder()
        .setName('giveclue')
        .setDescription('Give a clue and a number')
        .addStringOption(option => option.setName('clue').setDescription('Your clue').setRequired(true))
        .addIntegerOption(option => option.setName('number').setDescription('The number of words related to your clue').setRequired(true)),
    async execute(interaction, client) {
        const game = client.games.get(interaction.channelId);
        if (game) {
            const clue = interaction.options.getString('clue');
            const number = interaction.options.getInteger('number');
            game.giveClue(interaction.user, clue, number);
            await interaction.reply(`Clue given: ${clue}, ${number}`);
        } else {
            await interaction.reply('No game in prIogress.');
        }
    },
}