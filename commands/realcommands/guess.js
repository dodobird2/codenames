const { SlashCommandBuilder, client } = require('discord.js');
const { CodenamesGame, guessWord } = require('./codenames');  // adjust the path as needed


module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Guess a word based on the clue')
        .addStringOption(option => option.setName('word').setDescription('Your guess').setRequired(true)),
    async execute(interaction, client) {
        const game = client.games.get(interaction.channelId);

        if (game) {
            const word = interaction.options.getString('word');
            const result = game.guessWord(interaction.user, word);
            await interaction.reply(result);
        } else {
            await interaction.reply('No game in progress.');
        }
    },
}