const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { Colors } = require('../../Utils/enums/Colors');
const axios = require('axios');

const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("appemoji")
        .setDescription("Manage app emojis")
        .addSubcommand(subcommand => subcommand.setName("add").setDescription("Add an app emoji")
            .addAttachmentOption(option => option.setName("emoji").setDescription("The emoji to add").setRequired(true))
            .addStringOption(option => option.setName("name").setDescription("The name of the emoji to add").setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("remove").setDescription("Remove an app emoji")
            .addStringOption(option => option.setName("emoji-id").setDescription("The ID of the emoji to remove").setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("list").setDescription("List all of the app emojis")),
    async execute(interaction) {
        async function sendMessage(message) {
            const embed = new EmbedBuilder()
                .setTitle("App Emoji Manager")
                .setDescription(message)
                .setColor(Colors.GREEN)

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if(interaction.user.id !== "806169767891173438") return await sendMessage("You do not have permission to use this command.");

        const { options } = interaction;
        const subcommand = options.getSubcommand();

        const APP_ID = config.app_id;
        const TOKEN = config.token;

        async function apiCall(type, data) {
            if(type == 'add') {
                const response = await axios.post(`https://discord.com/api/v10/applications/${APP_ID}/emojis`, {
                    name: data.name,
                    image: data.emoji
                }, {
                    headers: {
                        'Authorization': `Bot ${TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }).catch(err => {
                    console.error(err);
                });

                if(!response) {
                    return false;
                } else return response;
            }

            if(type == 'remove') {
                const response = await axios.delete(`https://discord.com/api/v10/applications/${APP_ID}/emojis/${data}`, {
                    headers: {
                        'Authorization': `Bot ${TOKEN}`
                    }
                }).catch(err => {
                    console.error(err);
                });

                if(!response) {
                    return false;
                } else return response;
            }

            if(type == 'list') {
                const response = await axios.get(`https://discord.com/api/v10/applications/${APP_ID}/emojis`, {
                    headers: {
                        'Authorization': `Bot ${TOKEN}`
                    }
                }).catch(err => {
                    console.error(err);
                });

                if(!response) {
                    return false;
                } else return response;
            }
        }

        let output;
        switch(subcommand) {
            case 'add':
                const emoji = options.getAttachment('emoji');
                const name = options.getString('name');

                const response = await axios.get(emoji.url, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data, 'binary');
                const base64Image = buffer.toString('base64');

                const addData = {
                    name: name,
                    emoji: `data:image/png;base64,${base64Image}`
                }

                output = await apiCall('add', addData);

                if(!output) {
                    await sendMessage("An error occured while adding the emoji.");
                } else {
                    await sendMessage(`<:${output.data.name}:${output.data.id}> has been added to the app emojis.\nCopy \`<:${output.data.name}:${output.data.id}>\` in the code to use it.`);
                }
                break;

            case 'remove':
                const id = options.getString('emoji-id');
                output = await apiCall('remove', id);

                if(!output) {
                    await sendMessage("An error occured while removing the emoji.");
                } else {
                    await sendMessage(`The emoji \`${id}\` has been removed from the app emojis.`);
                }
                break;

            case 'list':
                output = await apiCall('list');
                let items = output.data.items;
                let formatString = ``;

                await items.forEach(async emoji => {
                    formatString += `<:${emoji.name}:${emoji.id}> - Name: \`${emoji.name}\`, ID: \`${emoji.id}\` \n`;
                });

                if(formatString.length == 0) formatString += `\`No app emojis found.\``;

                await sendMessage(`Here are the app emojis: \n\n${formatString}`);
                break;
            
        }
    }
}