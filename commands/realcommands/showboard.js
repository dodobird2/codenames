const { SlashCommandBuilder,  AttachmentBuilder } = require('discord.js');
        
        module.exports = {
            data: new SlashCommandBuilder()
                .setName('showboard')
                .setDescription('Show the game board to the spymaster'),
            async execute(interaction, client) {
                const game = client.games.get(interaction.channelId);
                if (game && game.isSpymaster(interaction.user)) {
                    const buffer = game.getBoardForSpymaster();
                    const attachment = new AttachmentBuilder(buffer, {name: 'board.png'});
                    await interaction.reply({ files: [attachment], ephemeral: true });
                } else {
                    const buffer = game.getBoardForOperator();
                    const attachment = new AttachmentBuilder(buffer, {name: 'board.png'});
                    await interaction.reply({ files: [attachment] });
                    
                    
                }
            },
        };