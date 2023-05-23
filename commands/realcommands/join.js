const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join the current game of Codenames'),
        async execute(interaction, client) {
            console.log("Join command received");

            const game = client.games.get(interaction.channelId);
            if (!game) {
                await interaction.reply('No game in progress. Start a game before joining.');
                return;
            }
            if (game.hasPlayer(interaction.user)) {
                await interaction.reply('You are already in the game.');
                return;
            }

            game.addPlayer(interaction.user);

            const spyMasterOption = new StringSelectMenuOptionBuilder()
                .setLabel('Spy Master')
                .setDescription('You will give clues to your team')
                .setValue('spymaster');

            const operatorOption = new StringSelectMenuOptionBuilder()
                .setLabel('Operator')
                .setDescription('You will guess based on the clues given by your Spy Master') 
                .setValue('operator');

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('role')
                        .setPlaceholder('Select your role')
                        .addOptions([spyMasterOption, operatorOption])
                );
            console.log("Options created");

            await interaction.reply({
                content: 'Join the game of Codenames! Please select your role:',
                components: [row],
            });
            console.log("Message sent");
        },
}
