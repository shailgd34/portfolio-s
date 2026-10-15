export async function POST(request) {
  try {
    const data = await request.json().catch(() => ({}));
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Gracefully handle unconfigured credentials
    if (!botToken || !chatId || botToken === 'your_telegram_bot_token' || chatId === 'your_telegram_chat_id') {
      return Response.json({
        success: false,
        configured: false,
        message: 'Telegram BOT_TOKEN or CHAT_ID not set in .env.local'
      }, { status: 200 });
    }

    const {
      page = '/',
      city = 'Unknown City',
      country = 'Unknown Country',
      ip = '',
      referrer = 'Direct Visit',
      device = 'Desktop',
      timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    } = data;

    const message = `🚀 *New Visitor on Portfolio!*
━━━━━━━━━━━━━━━━━━
📍 *Location:* ${city}, ${country}
📄 *Page:* \`${page}\`
🔗 *Referrer:* ${referrer}
📱 *Device:* ${device}
⏰ *Time:* ${timestamp} (IST)
${ip ? `🌐 *IP:* \`${ip}\`` : ''}
━━━━━━━━━━━━━━━━━━`;

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const resJson = await res.json();
    return Response.json({ success: resJson.ok, result: resJson });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
