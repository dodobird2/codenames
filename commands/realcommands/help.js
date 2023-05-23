// at the top of your file
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { execute } = require('./role');

module.exports = {
data:  new SlashCommandBuilder()
.setName('help')
.setDescription('List of commands and what they do.'),
async execute(interaction) {
const helpEmbed = new EmbedBuilder()
	.setColor(0xFF0099)
	.setTitle('Bot Commands')
	.setAuthor({ name: 'Crow', iconURL: 'https://cdn.discordapp.com/avatars/1099120349309845565/bba7fb7ab972d8fba46e6d1072323cd9.png'})
	.setDescription('How to play:')
	.addFields(
		{ name: '/start', value: 'This starts the game. From here, you can start the inital game and choose from the dropdown choices of either a Spy Master or Operator. This will always assign you the red team.' },
		{ name: '/join', value: 'This allows you to join a game after it has been started.'},
        { name: '/changerole', value: 'Whoops! Did you mean to pick Spy Master or Operator instead? Use /changerole to change the role to what you wanted.'},
		{ name: '/showboard (for Spy Masters)', value: 'For Spy Masters who chose this command, you will see all the titles that correspond with each team, and the neutral items and assassin. Please note this is only visible to you.', inline: true},
        { name: '/showboard (for Operators)', value: 'If you are an Operator, you will only be able to view the tiles with words with no team/color association. As you guess words either correctly or incorrectly (so long as you do not get assassinated) you will see the board update with the colors of the words guessed.', inline: true},
        { name: '/clue (for Spy Masters)', value: 'When it is time to give a clue, you will be presented with a box to add your clue that matches your team\'s word(s). You will also need to add the number of words the clue goes with. Example: chicken 3'},
        { name: '/guess (for Operators)', value: 'Operators can use /guess to guess a word. If the word is guessed correctly, it will show the number of guesses left. (based on the number the Spymaster provided)'},
        { name: '/endturn (for Operators)', value: 'At a loss, or just want to stop guessing? Use /endturn to finish up the round for your team.'},
        { name: '/endgame (for Spy Masters)', value: 'Everyone ditch you, or just don\'t feel like playing anymore? This ends the entire game.'}
	)
    await interaction.reply({ embeds: [helpEmbed] });

}

} 
    




