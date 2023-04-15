
bot.hears(["bye", "Bye"], (ctx) => {
  let msg = `
  Bye bye ${ctx.chat.first_name}
    `;
  ctx.reply(msg);
});