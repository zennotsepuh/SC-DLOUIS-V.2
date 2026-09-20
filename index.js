// ==========================================
// BOT WA D-LOUIS V.1 - By DanzModss
// Support: QR Code + Pairing Code
// ==========================================

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import readline from 'readline';
import { config, timezone } from './config.js';

const logger = pino({ level: 'silent' });

// ==========================================
// MENU DATA (SAMA KAYAK SEBELUMNYA)
// ==========================================
const MENU_DATA = {
  GAME: [
    'asahotak','buylimit','caklontong','dare','family100','hint','math',
    'nyerah','redeem','siapakahaku','sloth','suit','susunkalimat',
    'susunkata','susunlirik','tebakbendera','tebakbom','tebakkata',
    'tekateki','tfbalance','tictactoe','truth','werewolf2'
  ],
  GENERAL: ['changelog','everyone','infobot','menu','owner','ping','resend','runtime','sender','version'],
  GROUP: [
    'absen','add','addwhitelist','afk','antibot','antidelete','antigroupsw',
    'antikudeta','antilink','antilinkchannel','antilinknokick','antilinkuniversal',
    'antiluar','antimentionsw','antisticker','antiviewonce','antiwame',
    'antiwamenokick','cekabsen','cekidgroup','cekwarn','delete','deleteabsen',
    'delwarn','delwhitelist','demote','demotedetector','descgc','groupadmin',
    'groupinfo','groupsetting','hidetag','kick','kickme','leavegc','left',
    'levelling','linkgc','listwarn','listwhitelist','mulaiabsen','mute',
    'pinmsg','promote','promotedetector','refreshgroup','reqjoin','resetwarn',
    'revokelink','setdescgc','setnamegc','setppgc','setppgcpanjang','setwarn',
    'tagall','totag','unpinmsg','vote','warn','welcome'
  ],
  INFO: [
    'balance','cekchannel','cekpremium','infocovid','infogempa','infounsur',
    'kodebahasa','limit','listban','listblock','listgroup','listpremium',
    'profile','report','status','topglobal','toplocal'
  ],
  OWNER: [
    'addbalance','addlevel','addlimit','addpremiumgroup','addrespon','addxp',
    'anticall','anticallnoblock','antideletepc','autonexara','autoread',
    'autotype','ban','bccancel','bcconfirm','bcgchidetag','bcgroup','bchidetag',
    'bcpc','bcstat','block','blockpc','broadcast','buttonmode','buttontojson',
    'callloop','callplay','callqueue','callskip','callstop','cekgroupcron',
    'cekgroupsewa','chatgroup','claimwibusoftredeem','cleangroupcron',
    'cleangroupsewa','clearchat','copythumbnail','createbutton','createfullbutton',
    'createlist','createredeem','createtemplate','createthumbnail','delbalance',
    'deleteredeem','dellevel','dellimit','delpremiumgroup','delrespon','delxp',
    'globalgamemode','golink','grabcontact','grouponlypremium','inforedeem',
    'inviteme','join','leaveall','leavegcbyid','leavenosewa','levellingpc',
    'listcommand','listgroupnosewa','listpremiumgroup','listredeem','listrespon',
    'mutebc','mutebyid','mycontacts','onlygroup','onlyindo','onlyprem',
    'pconlyprem','premiumgroup','promoteme','public','publicbyid','queue',
    'rawmessage','react','reactchannel','refreshgroupbyid','resetanonymous',
    'resetbalance','resetlevel','resetlimit','resetpremium','resetresponse',
    'resetxp','searchmessage','self','selfbyid','setbio','setcommand',
    'setdefaultweltype','setname','setopenaikey','setpp','setpppanjang',
    'setwrsuit','setwrttt','testbutton','unban','unblock','unreact',
    'unreactchannel','upres'
  ],
  RANDOM: [
    'alay','apakah','cekkhodam','faktaunik','jadian','kapankah','katabijak',
    'pantun','puisi','randomanime','randomnumber','randomtag','rate','siapakah'
  ],
  SEARCH: ['alkitab','alquranaudio','artinama','brainly','ipchecker','jadwalshalat','lirik'],
  STICKER: ['sticker','stickercircle','stickerwm','takesticker','toimg'],
  TOOLS: [
    'cekplatform','dbase64','dec','dhex','ebase64','ehex','enc','fakereply',
    'halah','hdsw','heleh','hilih','holoh','huluh','kirim','poll','qrcode',
    'readmore','readviewonce','shortlink','swhd','toquickvideo','toviewonce',
    'translate'
  ]
};

// ==========================================
// HELPER
// ==========================================
const now = () => moment().tz(timezone).format('DD/MM/YYYY HH:mm:ss');
const nowShort = () => moment().tz(timezone).format('DD/MM/YYYY HH:mm');
const isOwner = (nomor) => config.ownerNumbers.some(o => nomor.includes(o.replace(/\D/g, '')));
const fileExists = (p) => p && fs.existsSync(p);

const runtime = (s) => {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  return `${d}d ${h}h ${m}m ${ss}s`;
};

// ==========================================
// GENERATE MENU TEXT
// ==========================================
const generateMenuText = (pushName, senderNumber, isOwnerUser = false) => {
  let text = `${config.menuHeader}\n\n`;
  text += `╭━━━━━━━━━━━━━━━━━━━━╮\n`;
  text += `│ 👤 *Nama:* ${pushName}\n`;
  text += `│ 📱 *Nomor:* ${senderNumber}\n`;
  text += `│ 💎 *Role:* ${isOwnerUser ? '👑 Owner' : 'User'}\n`;
  text += `│ ⏰ *Waktu:* ${nowShort()}\n`;
  text += `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`;

  for (const [category, commands] of Object.entries(MENU_DATA)) {
    text += `╭╾──────⪻𒆜${category}𒆜⪼──────╾╮\n`;
    for (const cmd of commands) text += `┃ ${config.prefix}${cmd}\n`;
    text += `╰╾──────────────────────╾╯\n`;
  }
  text += `\n${config.footer}`;
  return text;
};

// ==========================================
// INPUT PAIRING NUMBER (kalo mode pairing & belum diisi)
// ==========================================
async function askPairingNumber() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(chalk.yellow('📱 Masukkan nomor WA bot (contoh: 62812xxxxxxx): '), (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ==========================================
// BOT START
// ==========================================
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
  const { version } = await fetchLatestBaileysVersion();

  // Cek kalo udah pernah login, langsung connect tanpa prompt
  const isRegistered = state.creds.registered;
  
  // Tentukan mode
  const authMode = isRegistered ? 'resume' : config.authMode;

  console.log(chalk.cyan(`\n🔐 Auth Mode: ${isRegistered ? 'RESUME SESSION' : authMode.toUpperCase()}`));

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger)
    },
    browser: Browsers.ubuntu('Chrome'),
    getMessage: async () => ({ conversation: 'D-LOUIS Bot Active' })
  });

  // ==========================================
  // PAIRING CODE MODE
  // ==========================================
  if (!isRegistered && authMode === 'pairing') {
    let pairingNumber = config.pairingNumber;
    
    // Validasi nomor
    if (!pairingNumber || pairingNumber === '62812xxxxxxx') {
      console.log(chalk.yellow('\n⚠️ Nomor pairing belum diisi di config.js!'));
      pairingNumber = await askPairingNumber();
    }

    // Bersihin nomor dari karakter aneh
    pairingNumber = pairingNumber.replace(/\D/g, '');
    
    // Validasi panjang
    if (pairingNumber.length < 10) {
      console.log(chalk.red('❌ Nomor gak valid bos! Minimal 10 digit.'));
      process.exit(1);
    }

    // Delay dikit biar socket ready
    setTimeout(async () => {
      try {
        console.log(chalk.yellow(`\n⏳ Request pairing code untuk ${pairingNumber}...`));
        const code = await sock.requestPairingCode(pairingNumber);
        const formatted = code?.match(/.{1,4}/g)?.join('-') || code;
        
        console.log(chalk.green('\n╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮'));
        console.log(chalk.green('│    🔑 PAIRING CODE KAMU    │'));
        console.log(chalk.green('╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n'));
        console.log(chalk.bgGreen.black(`         ${formatted}         \n`));
        console.log(chalk.cyan('📋 CARA PAKE:'));
        console.log(chalk.white('  1. Buka WhatsApp di HP'));
        console.log(chalk.white('  2. Masuk ke *Perangkat Tertaut*'));
        console.log(chalk.white('  3. Tap *Tautkan Perangkat*'));
        console.log(chalk.white('  4. Pilih *Tautkan dengan nomor telepon*'));
        console.log(chalk.white(`  5. Masukkan kode: ${chalk.bgGreen.black(formatted)}`));
        console.log(chalk.yellow('\n⏰ Kode expired dalam 60 detik!\n'));
      } catch (err) {
        console.log(chalk.red('❌ Gagal request pairing code:'), err.message);
      }
    }, 3000);
  }

  // ==========================================
  // CONNECTION UPDATE
  // ==========================================
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    // ==========================================
    // QR MODE
    // ==========================================
    if (qr && !isRegistered && authMode === 'qr') {
      console.clear();
      console.log(chalk.cyan(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│     📱 SCAN QR CODE        │
│     BOT D-LOUIS V.1        │
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
      `));
      qrcode.generate(qr, { small: true });
      console.log(chalk.yellow('\n📋 CARA PAKE:'));
      console.log(chalk.white('  1. Buka WhatsApp di HP'));
      console.log(chalk.white('  2. Masuk ke *Perangkat Tertaut*'));
      console.log(chalk.white('  3. Tap *Tautkan Perangkat*'));
      console.log(chalk.white('  4. Scan QR di atas\n'));
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error instanceof Boom)
        ? lastDisconnect.error.output.statusCode
        : 0;
      
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      
      console.log(chalk.red(`\n❌ Koneksi terputus! (Code: ${statusCode})`));
      
      if (shouldReconnect) {
        console.log(chalk.yellow('🔄 Reconnect dalam 3 detik...\n'));
        setTimeout(() => startBot(), 3000);
      } else {
        console.log(chalk.red('🚪 Logged out! Hapus folder session & scan ulang.'));
      }
    } else if (connection === 'open') {
      console.clear();
      console.log(chalk.green(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│  ✅ BOT BERHASIL TERHUBUNG │
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
      `));
      console.log(chalk.cyan(`📛 Bot: ${config.botName}`));
      console.log(chalk.cyan(`👑 Owner: ${config.ownerNumbers.join(', ')}`));
      console.log(chalk.cyan(`🔐 Auth: ${isRegistered ? 'Session Resume' : authMode.toUpperCase()}`));
      console.log(chalk.cyan(`⏰ Waktu: ${now()}\n`));
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // ==========================================
  // MESSAGE HANDLER
  // ==========================================
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    const msg = messages[0];
    if (!msg.message) return;
    if (msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNumber = sender.split('@')[0].split(':')[0];
    const isGroup = from.endsWith('@g.us');
    const pushName = msg.pushName || 'Kak';
    const isOwnerUser = isOwner(senderNumber);

    const text = msg.message.conversation
      || msg.message.extendedTextMessage?.text
      || msg.message.imageMessage?.caption
      || msg.message.videoMessage?.caption
      || '';

    if (!text) return;

    const isCommand = text.startsWith(config.prefix);
    const isReplyToBot = msg.message.extendedTextMessage?.contextInfo?.participant === sock.user?.id;

    console.log(chalk.gray(`[${now()}] ${pushName} (${senderNumber}) → ${text.slice(0, 50)}`));

    // Audio auto reply
    if (config.enableAudioReply && isReplyToBot && !isCommand) {
      if (fileExists(config.media.replyAudio)) {
        try {
          await sock.sendMessage(from, {
            audio: fs.readFileSync(config.media.replyAudio),
            mimetype: 'audio/mp4',
            pttv: false
          }, { quoted: msg });
          return;
        } catch (e) {}
      }
    }

    if (!isCommand) return;

    const args = text.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const reply = (teks) => sock.sendMessage(from, { text: teks }, { quoted: msg });

    // ==========================================
    // .menu
    // ==========================================
    if (['menu','help','start'].includes(command)) {
      const menuText = generateMenuText(pushName, senderNumber, isOwnerUser);
      try {
        const useVideo = config.enableVideoMenu && fileExists(config.media.menuVideo);
        const useImage = !useVideo && config.enableImageMenu && fileExists(config.media.menuImage);

        if (useVideo) {
          await sock.sendMessage(from, {
            video: fs.readFileSync(config.media.menuVideo),
            caption: menuText,
            mimetype: 'video/mp4'
          }, { quoted: msg });
        } else if (useImage) {
          await sock.sendMessage(from, {
            image: fs.readFileSync(config.media.menuImage),
            caption: menuText,
            mimetype: 'image/jpeg'
          }, { quoted: msg });
        } else {
          await reply(menuText);
        }

        if (fileExists(config.media.menuAudio)) {
          await sock.sendMessage(from, {
            audio: fs.readFileSync(config.media.menuAudio),
            mimetype: 'audio/mp4',
            pttv: false
          }, { quoted: msg });
        }
      } catch (e) {
        console.log(chalk.red('❌ Error menu:'), e.message);
        await reply(menuText);
      }
    }

    // ==========================================
    // .ping
    // ==========================================
    if (command === 'ping') {
      const start = Date.now();
      reply(`🏓 *PONG!*\n\n⚡ Speed: ${Date.now() - start}ms\n⏰ Time: ${nowShort()}\n🤖 Bot: ${config.botName}`);
    }

    // ==========================================
    // .runtime
    // ==========================================
    if (command === 'runtime') {
      reply(`⏱️ *RUNTIME BOT*\n\n🤖 Bot: ${config.botName}\n⏰ Aktif: ${runtime(process.uptime())}\n📅 Sekarang: ${nowShort()}`);
    }

    // ==========================================
    // .owner
    // ==========================================
    if (command === 'owner') {
      const list = config.ownerNumbers.map(o => `📞 wa.me/${o}`).join('\n');
      reply(`👑 *OWNER ${config.botName}*\n\n${list}\n\n_Kontak kalo ada masalah_`);
    }

    // ==========================================
    // .infobot
    // ==========================================
    if (command === 'infobot') {
      reply(`
╭━━━「 *INFO BOT* 」━━━╮
│ 🤖 Nama: ${config.botName}
│ 📛 Owner: ${config.ownerName}
│ 📱 Prefix: ${config.prefix}
│ ⏰ Runtime: ${runtime(process.uptime())}
│ 💾 Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
│ 🖥️ Platform: ${process.platform}
│ 📅 Waktu: ${now()}
╰━━━━━━━━━━━━━━━━━━━━╯

_Powered by Zenxy.sexx_
      `.trim());
    }

    // ==========================================
    // .sender
    // ==========================================
    if (command === 'sender') {
      reply(`📱 *PENGIRIM*\n\n👤 Nama: ${pushName}\n📞 Nomor: ${senderNumber}\n💎 Role: ${isOwnerUser ? '👑 Owner' : 'User'}\n📊 Chat: ${isGroup ? 'Grup' : 'Private'}`);
    }

    // ==========================================
    // .version
    // ==========================================
    if (command === 'version') {
      reply(`📦 *VERSION INFO*\n\n🤖 Bot: ${config.botName}\n🔢 Version: V.1\n📅 Build: ${nowShort()}\n⚡ Engine: Baileys v6.7`);
    }

    // ==========================================
    // .changelog
    // ==========================================
    if (command === 'changelog') {
      reply(`📝 *CHANGELOG*\n\n*V.1.1 (Latest)*\n✅ Support QR Code\n✅ Support Pairing Code\n✅ Menu foto/video + audio\n✅ Audio reply auto\n\n_© By D - Louis - Zenxy.sexx_`);
    }

    // ==========================================
    // .tagall / .everyone
    // ==========================================
    if ((command === 'tagall' || command === 'everyone') && isGroup) {
      if (!isOwnerUser) return reply('❌ *Owner only!*');
      try {
        const gMeta = await sock.groupMetadata(from);
        const mentions = gMeta.participants.map(p => p.id);
        let txt = `📢 *TAG ALL*\n\n${args.join(' ') || 'Halo semua!'}\n\n`;
        for (const m of mentions) txt += `@${m.split('@')[0]}\n`;
        await sock.sendMessage(from, { text: txt, mentions }, { quoted: msg });
      } catch (e) {
        reply('❌ Gagal tag all');
      }
    }

    // ==========================================
    // .hidetag
    // ==========================================
    if (command === 'hidetag' && isGroup) {
      if (!isOwnerUser) return reply('❌ *Owner only!*');
      try {
        const gMeta = await sock.groupMetadata(from);
        const mentions = gMeta.participants.map(p => p.id);
        await sock.sendMessage(from, { text: args.join(' ') || '👋 Halo!', mentions });
      } catch (e) { reply('❌ Gagal'); }
    }

    // ==========================================
    // .sticker
    // ==========================================
    if (command === 'sticker' || command === 's') {
      const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
      const target = quoted || msg.message;
      if (!target?.imageMessage && !target?.videoMessage) {
        return reply(`❌ Reply foto/video dengan caption ${config.prefix}sticker`);
      }
      reply('⏳ *Membuat sticker...* (butuh setup ffmpeg)');
    }

    // Command yang ada di menu tapi belum diimplementasi
    const allCmds = Object.values(MENU_DATA).flat();
    if (allCmds.includes(command)) {
      reply(`⚙️ *Command ${config.prefix}${command}* masih dalam pengembangan bos!`);
    }
  });
}

// ==========================================
// RUN
// ==========================================
console.log(chalk.cyan(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│   🤖 ${config.botName}    🤖
│    ® by Zenxy.sexx V5.0
│
│   🔐 Auth: ${config.authMode.toUpperCase()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`));

startBot().catch(err => console.log(chalk.red('❌ Error: ', err)));

process.on('uncaughtException', (err) => console.log(chalk.red('⚠️ Uncaught:'), err.message));
process.on('unhandledRejection', (err) => console.log(chalk.red('⚠️ Unhandled:'), err));
