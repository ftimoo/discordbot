// index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const ytdl = require('ytdl-core');
// If you were using @discordjs/opus

// Change to this if using opusscript
const { AudioPlayer, createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { OpusEncoder } = require('opusscript');  // Add this line



const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const player = createAudioPlayer();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!play')) {
        const args = message.content.split(' ');
        const url = args[1];

        if (!url) {
            return message.channel.send('Please provide a YouTube URL.');
        }

        // Join voice channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send('You need to be in a voice channel to play music!');
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        const resource = createAudioResource(ytdl(url, { filter: 'audioonly' }));
        player.play(resource);
        connection.subscribe(player);

        message.channel.send(`Now playing: ${url}`);
    }
});

client.login(process.env.DISCORD_TOKEN);
