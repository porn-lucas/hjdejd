require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN tidak ditemukan di .env");
  process.exit(1); // stop bot kalau token tidak ada
}

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(BOT_TOKEN, { polling: true });


// ===== DATA STORAGE SEMENTARA =====
const userState = new Map() // Menyimpan state per user
const tokenStore = new Map() // Menyimpan token PAP: token => { ownerId, mediaMsgId, caption }

/* ===== UTILITIES ===== */

// Generate token 4 digit untuk PAP
function genToken() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Ambil username Telegram, fallback jika tidak ada
function getUsername(user) {
  return user.username ? '@' + user.username : '(no_username)'
}

// Reset state user
function reset(chatId) {
  userState.delete(chatId)
}

// Keyboard "Kembali"
function backKeyboard() {
  return {
    reply_markup: {
      keyboard: [['⬅️ Kembali']],
      resize_keyboard: true
    }
  }
}

// Menu utama
function mainMenu(chatId) {
  reset(chatId)
  bot.sendMessage(chatId, '📋 Menu Utama', {
    reply_markup: {
      keyboard: [
        ['⭐ Rate PAP', '📤 Kirim PAP'],
        ['💌 Menfes', '❓ Help'],
        ['🔞 VIP Video']
      ],
      resize_keyboard: true
    }
  })
}

/* ===== COMMAND /start ===== */
bot.onText(/\/start/, (msg) => mainMenu(msg.chat.id))

/* ===== MESSAGE HANDLER ===== */
bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const text = msg.text
  const state = userState.get(chatId)

  // =====================
  // MENU UTAMA
  // =====================
  if (text === '⭐ Rate PAP') {
    userState.set(chatId, { step: 'rate_token' })
    return bot.sendMessage(chatId, '🔑 Kirim token PAP', backKeyboard())
  }

  if (text === '📤 Kirim PAP') {
    userState.set(chatId, { step: 'pap_mode' })
    return bot.sendMessage(chatId, 'Pilih mode PAP', {
      reply_markup: {
        keyboard: [
          ['🕶 Anonim', '🙍 Non Anonim'],
          ['⬅️ Kembali']
        ],
        resize_keyboard: true
      }
    })
  }

  if (text === '💌 Menfes') {
    userState.set(chatId, { step: 'menfes_mode' })
    return bot.sendMessage(chatId, 'Pilih mode Menfes', {
      reply_markup: {
        keyboard: [
          ['🕶 Anonim', '🙍 Non Anonim'],
          ['⬅️ Kembali']
        ],
        resize_keyboard: true
      }
    })
  }

  if (text === '❓ Help') {
    return bot.sendMessage(chatId,
`ℹ️ *Help Bot PAP & Menfes*

*⭐ Rate PAP*
- Kirim token PAP 4 digit yang diterima.
- Pilih emoji untuk rating.
- Bisa menambahkan komentar opsional.

*📤 Kirim PAP*
- Pilih mode: Anonim / Non Anonim.
- Kirim media (foto/video/document) + teks opsional.
- Bot akan memberikan token 4 digit untuk dibagikan.

*💌 Menfes*
- Pilih mode: Anonim / Non Anonim.
- Tulis pesan menfes.
- Pesan akan dikirim ke channel.

*🔞 VIP Video*
- Link menuju konten VIP (eksternal).

*⬅️ Kembali*
- Kembali ke menu utama.
`,
{
  parse_mode: 'Markdown',
  reply_markup: {
    keyboard: [['⬅️ Kembali']],
    resize_keyboard: true
  }
})
  }

  if (text === '🔞 VIP Video') {
    return bot.sendMessage(chatId, 'BELI VIDEO MURAH + UPDATE TIAP HARI DISINI @vvip_3_bot')
  }

  if (text === '⬅️ Kembali') {
    return mainMenu(chatId)
  }

  // Jika tidak ada state, hentikan
  if (!state) return

  // =====================
  // RATE PAP
  // =====================
  if (state.step === 'rate_token') {
    const data = tokenStore.get(text)
    if (!data) return bot.sendMessage(chatId, '❌ Token tidak valid')

    userState.set(chatId, {
      step: 'rate_emoji',
      targetUser: data.ownerId
    })

    // Salin media ke user yang ingin memberi rating
   await bot.copyMessage(
  chatId,           // penerima (yang ngerate)
  data.ownerId,     // pemilik PAP (asal media)
  data.mediaMsgId,
  {
    caption: data.caption,
    protect_content: true
  }
)


    return bot.sendMessage(chatId, 'Pilih rating:', {
      reply_markup: {
        keyboard: [
          ['😍', '🔥', '👍', '😐'],
          ['👎', '🤢', '💀', '🤡'],
          ['⬅️ Kembali']
        ],
        resize_keyboard: true
      }
    })
  }

  if (state.step === 'rate_emoji') {
    // Kirim rating ke pemilik PAP
    const raterUsername = getUsername(msg.from)
    await bot.sendMessage(state.targetUser, `⭐ Rating dari ${raterUsername}: ${text}`)


    // Minta komentar opsional
    userState.set(chatId, {
      step: 'rate_comment',
      targetUser: state.targetUser
    })

    return bot.sendMessage(chatId, 'Kirim komentar?', {
      reply_markup: {
        keyboard: [
          ['✍️ Kirim Komentar', '🚫 Tidak'],
          ['⬅️ Kembali']
        ],
        resize_keyboard: true
      }
    })
  }

  if (state.step === 'rate_comment') {
    if (text === '🚫 Tidak') {
      return mainMenu(chatId)
    }
    if (text === '✍️ Kirim Komentar') {
      userState.set(chatId, {
        step: 'rate_comment_text',
        targetUser: state.targetUser
      })
      return bot.sendMessage(chatId, '✍️ Tulis komentar')
    }
  }

  if (state.step === 'rate_comment_text') {
   const commenterUsername = getUsername(msg.from)
await bot.sendMessage(state.targetUser, `💬 Komentar dari ${commenterUsername}:\n${text}`)
    return mainMenu(chatId)
  }

  // =====================
  // KIRIM PAP
  // =====================
  if (state.step === 'pap_mode' && (text === '🕶 Anonim' || text === '🙍 Non Anonim')) {
    userState.set(chatId, {
      step: 'pap_media',
      anon: text === '🕶 Anonim'
    })
    return bot.sendMessage(chatId, '📎 Kirim PAP + teks (opsional)', backKeyboard())
  }

  if (state.step === 'pap_media' && (msg.photo || msg.video || msg.document)) {
    const token = genToken()
    const username = getUsername(msg.from)
    const caption = msg.caption || '—'

    tokenStore.set(token, {
      ownerId: chatId,
      mediaMsgId: msg.message_id,
      caption
    })

    // Kirim ke channel
    await bot.sendMessage(CHANNEL_ID,
`📥 PAP BARU
🔑 Token: <code>${token}</code>
👤 ${state.anon ? 'Anonim' : username}
➡️ Kirim token ke bot : @rate_seme_uke_bot`,
{
  parse_mode: 'HTML'
})

    // Notifikasi admin
    await bot.sendMessage(ADMIN_ID,
`📥 PAP
User: ${username}
Token: ${token}`
    )

    await bot.sendMessage(chatId, `✅ PAP terkirim\nToken: ${token}`)
    return mainMenu(chatId)
  }

  // =====================
  // MENFES
  // =====================
  if (state.step === 'menfes_mode' && (text === '🕶 Anonim' || text === '🙍 Non Anonim')) {
    userState.set(chatId, {
      step: 'menfes_text',
      anon: text === '🕶 Anonim'
    })
    return bot.sendMessage(chatId, '✍️ Tulis menfes', backKeyboard())
  }

  if (state.step === 'menfes_text') {
    const username = getUsername(msg.from)

   // Kirim Menfes ke channel dalam bentuk "blok"
await bot.sendMessage(
  CHANNEL_ID,
  `💌 MENFES
Mode: ${state.anon ? 'Anonim' : 'Non Anonim'}
${state.anon ? '' : 'User: ' + username}
Pesan:
${text}`
)


    // Notifikasi admin
    await bot.sendMessage(ADMIN_ID,
`📩 MENFES
User: ${username}
Isi:
${text}`
    )

    // Notifikasi ke user
    await bot.sendMessage(chatId, '✅ Menfes berhasil dikirim!')

    return mainMenu(chatId)
  }
})

bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message)
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
})

console.log('🤖 Bot aktif')
