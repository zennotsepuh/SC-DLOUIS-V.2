// ==========================================
// CONFIG BOT D-LOUIS V.1 - By Zenxy.sexx
// ==========================================

export const config = {
  botName: '𝐁𝐎𝐓 𝐃-𝐋𝐎𝐔𝐈𝐒 𝐕.𝟏',
  ownerNumbers: ['6282122997137'],
  ownerName: '𝐓𝐔𝐀𝐍 𝐙𝐄𝐍 𝐕.𝟏',
  sessionName: 'dlouis-session',
  prefix: '.',
  
  // ==========================================
  // AUTH MODE
  // ==========================================
  // Pilihan: 'qr' atau 'pairing'
  // - 'qr'      → scan QR pake WA
  // - 'pairing' → masukin 8 digit pairing code
  authMode: 'qr', // Ganti jadi 'pairing' kalo mau pake pairing code
  
  // Nomor WA bot buat pairing (wajib kalo authMode: 'pairing')
  // Format: 62812xxxxxxx (tanpa +, tanpa 0 di depan)
  pairingNumber: '6285922803109',
  
  // ==========================================
  // MEDIA ASSETS
  // ==========================================
  media: {
    menuImage: './assets/menu.jpg',
    menuVideo: './assets/menu.mp4',
    introAudio: './assets/intro.mp3',
    menuAudio: './assets/menu.mp3',
    replyAudio: './assets/reply.mp3'
  },
  
  menuHeader: 'hi 𝐁𝐎𝐓 𝐃-𝐋𝐎𝐔𝐈𝐒 𝐕.𝟏 siap membantu anda silahkan pilih fitur-fitur di bawa ya kontol',
  footer: '© By DLouis - Zenxy.sexx',
  
  enableAudioReply: true,
  enableImageMenu: true,
  enableVideoMenu: false
};

export const timezone = 'Asia/Jakarta';
