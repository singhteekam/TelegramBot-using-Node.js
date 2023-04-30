const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
// import './test.js'

const token = process.env.TOKEN;

const { Telegraf } = require("telegraf");
const bot = new Telegraf(token);
const dinoGame = process.env.GAMENAMEDINO;
const brainquizGame = process.env.GAMENAMEKBC;

bot.telegram.setMyCommands([
  {
    command: "/hi",
    description: "Hello message",
  },
  {
    command: "/game",
    description: "Play Games",
  },
  {
    command: "/chataction",
    description: "Ex: Typing...",
  },
  {
    command: "/senddice",
    description: "Animated dice",
  },
  {
    command: "/polling",
    description: "Poll",
  },
  {
    command: "/sendingcontact",
    description: "Sending dummy contact to user",
  },
  {
    command: "/venue",
    description: "Sending dummy venue to user",
  },
  {
    command: "/help",
    description: "Other help commands",
  },
]);

//HELP MESSAGE
bot.help((ctx) => {
  let msg = `
/hi - hello message
/picture - for photo
/gif - for gif
/mediagroup - multiple media items
/thumbnailitem - for thumbnail item
/location - my current location
/catfacts - random cat facts
/catpic - random cat picture
/gsheet - get fact from google sheet
/refreshgsheet - refresh g sheet
/languages - list of few computer languages
/inlinebuttons - inline buttons
/help - for more options
/websites - Click to see teekam's websites
/game - Play Games in telegram app
/webapp - Coming soon..
     `;
  // ctx.reply(msg);
  bot.telegram.sendMessage(ctx.chat.id, msg, {
    parse_mode: "markdown",
  });
});

// bot.use((ctx, next) => {
//   // ctx.state.value = 50;
//   // console.log(ctx.state.value);
// //   ctx.reply("Hi " + ctx.chat.first_name);
// //   ctx.reply("Hi " + ctx.chat.first_name);

//   let msg = `
//   Hi ${ctx.chat.first_name}
// /help - for more options
//     `;
//     ctx.reply(msg);
//   next(ctx);
// });

// bot.start((ctx)=>{
//     // ctx.reply(ctx.state.value)
//     console.log(ctx.state.value);

// });

// bot.help((ctx) => ctx.reply('Send me a sticker'))
// bot.on('sticker', (ctx) =>{
//     ctx.reply('👍')
// });

bot.hears(
  ["/hi", "/start", "hi", "Hi", "Hii", "hii", "hello", "Hello", "hey", "Hey"],
  (ctx) => {
    let msg = `
  Hello ${ctx.chat.first_name}
I'm bot made by Mr. Teekam.
Type /help - for more options
    `;
    ctx.reply(msg);
  }
);

// bot.command('getMe', (ctx)=>{
//     bot.telegram.getMe();
// })

// Media Files
bot.command("picture", (ctx) => {
  // bot.telegram.sendChatAction(ctx.chat.id, "upload_photo")

  bot.telegram.sendPhoto(
    ctx.chat.id,
    "https://media.geeksforgeeks.org/wp-content/uploads/20210224040124/JSBinCollaborativeJavaScriptDebugging6-300x160.png",
    {
      reply_to_message_id: ctx.message.message_id,
    }
  );

  // bot.telegram.sendPhoto(ctx.chat.id, {
  //     source: "LOCAL_PATH_OF_FILE"
  // });
});

//Sending GIFs
bot.command("gif", (ctx) => {
  // bot.telegram.sendChatAction(ctx.chat.id, "upload_photo")

  bot.telegram.sendAnimation(
    ctx.chat.id,
    "https://media.tenor.com/EEByypBESRkAAAAM/online.gif",
    {
      reply_to_message_id: ctx.message.message_id,
    }
  );
});

//GET DOWNLOAD LINK(for personal use only)
// bot.on("message", async ctx=>{
//     console.log(ctx);
//     if(true){
//         let link = await bot.telegram.getFileLink(ctx.message.document.file_id);
//         ctx.reply("Link: "+ link);
//     }
// });

//HELP and START
// bot.command(['start','help'], ctx=>{
//     let msg= `
// /hi - hello message
// /list- To send document
// /mediagroup- send media groups
//     `;
//     ctx.reply(msg);
// });

//AXIOS API

const axios = require("axios");
bot.command("catfacts", (ctx) => {
  axios
    .get("https://catfact.ninja/fact")
    .then((res) => {
      ctx.reply("Cat Fact: \n" + res.data.fact);
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
});

//Cat pic with some text
bot.command("catpic", async (ctx) => {
  let inp = ctx.message.text;
  let inpsplit = inp.split(" ");
  if (inpsplit.length == 1) {
    try {
      let res = await axios.get("https://aws.random.cat/meow");
      ctx.replyWithPhoto(res.data.file);
    } catch (error) {
      console.log(error);
    }
  } else {
    inpsplit.shift();
    inp = inpsplit.join(" ");
    ctx.replyWithPhoto(`https://cataas.com/cat/says/${inp}`);
  }
});

//Languages
const fs = require("fs");
bot.command("languages", (ctx) => {
  let x = fs.readFileSync("./languages.json", "utf8");
  let data = JSON.parse(x);
  console.log(data);
  let msg = "Languages:\n";
  data.forEach((element) => {
    msg += `-${element}\n`;
  });
  ctx.reply(msg);
});

// https://dog.ceo/dog-api/breeds-list  -- website
// https://dog.ceo/api/breed/:input/images/random

// bot.command("dog",async (ctx)=>{
//     let input= ctx.message.text.split(" ");
//     if(input.length!=2){
//         ctx.reply("Please type any word");
//         return;
//     }
//     let breedInput= input[1];
//     let rawdata= fs.readFileSync("./dogbreed.json", "utf8");
//     let data= JSON.parse(rawdata);

//     if(data.includes(breedInput)){
//         await axios.get(`https://dog.ceo/api/breed/${breedInput}/images/random`)
//         .then(res=>{
//             ctx.replyWithPhoto(res.data.message);
//         }).catch(err=>{
//             console.log(err);
//         })
//     }
// })

//GOOGLE SHEET
// https://docs.google.com/spreadsheets/d/e/2PACX-1vQFOouQS5N2lf_SeKlTgD9iIYGGDzb_wwXY4h-ftPSfS4zWwrvhTS5zqmMiKxX8gYsMqJZ7lEdu_PIZ/pubhtml
// https://docs.google.com/spreadsheets/d/1Dvqp7Emf1gwYPLWZSxgxdZZgxqx0nhQZQpe6PoB6RkU/edit?usp=sharing

// Ref: https://stackoverflow.com/questions/68854198/did-google-sheets-stop-allowing-json-access
//  https://sheets.googleapis.com/v4/spreadsheets/1Dvqp7Emf1gwYPLWZSxgxdZZgxqx0nhQZQpe6PoB6RkU/values/Sheet1?alt=json&key=AIzaSyAEHXSaRH2kTOsonv20su6zVjWWSr_FZc8

getData();
let dataOfGSheet;
async function getData() {
  try {
    res = await axios(
      `https://sheets.googleapis.com/v4/spreadsheets/1Dvqp7Emf1gwYPLWZSxgxdZZgxqx0nhQZQpe6PoB6RkU/values/Sheet1?alt=json&key=${process.env.GSHEETAPIKEY}`
    );
    // console.log(res.data.values);
    dataOfGSheet = res.data;
  } catch (error) {}
}

bot.command("gsheet", (ctx) => {
  let maxRows = dataOfGSheet.values[0][1];
  console.log(maxRows);
  let ran = Math.floor(Math.random() * maxRows) + 1;
  console.log(ran);
  ctx.reply("Random fact:\n" + dataOfGSheet.values[ran - 1][4]);
});

//Update Google Sheet
bot.command("refreshgsheet", async (ctx) => {
  await getData();
  //bot.telegram.sendMessage(ctx.chat.id,"Google sheet updated");
  // OR
  ctx.reply("Google Sheet updated");
});

// INLINE KEYBOARD

bot.command("inlinebuttons", (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, "Inline Menu", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Fruits list", callback_data: "fruitslist" },
          { text: "Vegetables list", callback_data: "vegetableslist" },
          { text: "Btn3", callback_data: "hii" },
        ],
        [
          { text: "Btn21", callback_data: "hii" },
          { text: "Reply Keyboard", callback_data: "replykeyboard" },
        ],
      ],
    },
  });
});

// bot.action("fruits", (ctx)=>{
//     ctx.answerCbQuery("button 1");
//     ctx.reply("You clicked button 1");
// });

bot.action("fruitslist", (ctx) => {
  ctx.deleteMessage();
  bot.telegram.sendMessage(
    ctx.chat.id,
    "List of Fruits:\n-Apple\n-Orange\n-Banana",
    {
      reply_markup: {
        inline_keyboard: [[{ text: "Back to menu", callback_data: "menu" }]],
      },
    }
  );
});

bot.action("vegetableslist", (ctx) => {
  ctx.deleteMessage();
  bot.telegram.sendMessage(
    ctx.chat.id,
    "List of Vegetables:\n-Potato\n-Tomato\n-Onion",
    {
      reply_markup: {
        inline_keyboard: [[{ text: "Back to menu", callback_data: "menu" }]],
      },
    }
  );
});

bot.action("menu", (ctx) => {
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, "Inline Menu", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Fruits list", callback_data: "fruitslist" },
          { text: "Vegetables list", callback_data: "vegetableslist" },
          { text: "Hello", callback_data: "hi" },
        ],
        [
          { text: "Help", callback_data: "/help" },
          { text: "Reply Keyboard", callback_data: "replykeyboard" },
        ],
      ],
    },
  });
});

// ReplyKeyboardMarkup
bot.action("replykeyboard", (ctx) => {
  //   ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, "Reply Menu", {
    reply_markup: {
      keyboard: [[{ text: "Hi" }], [{ text: "Hey" }], [{ text: "Hello" }]],
    },
  });
});

bot.command("websites", (ctx) => {
  let msg = `
Personal website - https://www.singhteekam.in/
Kaun banega crorepati game - brainquiz.singhteekam.in
Diary app - mydiary.singhteekam.in
Tic Tac Toe game - zerocrossgame.singhteekam.in
/help - for more options
     `;
  // ctx.reply(msg);
  bot.telegram.sendMessage(ctx.chat.id, msg, {
    parse_mode: "markdown",
  });
});

//////////////////////////////////////////////////////////////////////////////////////////

// Sending document - sendDocument() method
bot.command("thumbnailitem", (ctx) => {
  bot.telegram.sendDocument(
    ctx.chat.id,
    // {
    //     source: "LOCAL-PATH"
    // }
    "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    {
      thumbnail:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    }
  );
});

//Sending multiple files
bot.command("mediagroup", (ctx) => {
  bot.telegram.sendChatAction(ctx.chat.id, "upload_document");

  // bot.telegram.sendMediaGroup(ctx.chat.id,
  //     [
  //         {
  //             type:"photo",
  //             media: "https://media.geeksforgeeks.org/wp-content/uploads/20210224040124/JSBinCollaborativeJavaScriptDebugging6-300x160.png"
  //         },
  //         {
  //             type:"photo",
  //             media: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png"
  //         }
  //     ],
  // );

  // OR
  let photos = [
    "https://media.geeksforgeeks.org/wp-content/uploads/20210224040124/JSBinCollaborativeJavaScriptDebugging6-300x160.png",
    "https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png",
  ];
  let allpics = photos.map((photo) => {
    return {
      type: "photo",
      media: photo,
    };
  });
  bot.telegram.sendMediaGroup(ctx.chat.id, allpics);
});

// Location - sendLocation() method
bot.command("location", (ctx) => {
  bot.telegram.sendLocation(ctx.chat.id, 28.459497, 77.026634);
});

// Venue - sendVenue() method
bot.command("venue", (ctx) => {
  bot.telegram.sendVenue(
    ctx.chat.id,
    28.459497,
    77.026634,
    "This is venue function",
    "AVL, Gurgaon"
  );
});

// Sending Contact - sendContact() method
bot.command("sendingcontact", (ctx) => {
  bot.telegram.sendContact(ctx.chat.id, "9999999999", "Antique");
});

//POLLING - sendPoll() METHOD
bot.command("polling", (ctx) => {
  bot.telegram.sendPoll(
    ctx.chat.id,
    "This is question",
    ["first", "second", "third"],
    {
      type: "quiz",
      correct_option_id: 1,
      explanation: "Just testing",
    }
  );
});

//  sendDice method
bot.command("senddice", (ctx) => {
  bot.telegram.sendDice(ctx.chat.id, {
    emoji: "🎲",
  });
});

// Chat action - sendChatAction() method
bot.command("chataction", (ctx) => {
  bot.telegram.sendChatAction(ctx.chat.id, "typing");
});

/////////////////////////////////////////////////////////////////////////////////////////

// TELEGRAM GAMES

bot.command("game", (ctx) => {
  let msg = `
/DinoGame - Play Dino game
/BrainQuiz - Play KBC Game
/help - for more options
     `;
  // ctx.reply(msg);
  bot.telegram.sendMessage(ctx.chat.id, msg, {
    parse_mode: "markdown",
  });
});

const queries = {};

bot.command("DinoGame", (msg) => {
  // bot.telegram.sendGame(msg.from.id, gameName);
  bot.telegram.sendGame(msg.from.id, dinoGame);
});

bot.command("BrainQuiz", (msg) => {
  bot.telegram.sendGame(msg.from.id, brainquizGame);
});

bot.on("callback_query", async (ctx) => {
  console.log("Callback: " + ctx.callbackQuery.game_short_name);
  // await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
  // console.log(ctx.callbackQuery.id);

  if (ctx.callbackQuery.game_short_name === dinoGame) {
    queries[ctx.callbackQuery.id] = ctx.callbackQuery;
    let gameURL =
      // "http://localhost:5000/index.html?id=" + ctx.callbackQuery.id;
      "https://app.singhteekam.in/DinoGame/index.html?id=" +
      ctx.callbackQuery.id;
    await ctx.answerCbQuery(ctx.callbackQuery.id, {
      url: gameURL,
    });
    console.log("Queries: " + queries);
  } else if (ctx.callbackQuery.game_short_name === brainquizGame) {
    queries[ctx.callbackQuery.id] = ctx.callbackQuery;
    let gameURL =
      // "http://localhost:5000/index.html?id=" + ctx.callbackQuery.id;
      "https://brainquiz.singhteekam.in/index.html?id=" + ctx.callbackQuery.id;
    await ctx.answerCbQuery(ctx.callbackQuery.id, {
      url: gameURL,
    });
    console.log("Queries kbc: " + queries);
  } else {
    ctx.answerCbQuery(
      ctx.callbackQuery.id,
      "Sorry, '" + callbackQuery.game_short_name + "' is not available."
    );
  }
});

// bot.on("callback_query", async (ctx) => {
//   console.log("Callback: " + ctx.callbackQuery.game_short_name);
//   // await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
//   // console.log(ctx.callbackQuery.id);
//   if (ctx.callbackQuery.game_short_name !== gameName) {
//     // console.log(ctx.callbackQuery.id);
//     ctx.answerCbQuery(
//       ctx.callbackQuery.id,
//       "Sorry, '" + callbackQuery.game_short_name + "' is not available."
//     );
//   } else {
//     queries[ctx.callbackQuery.id] = ctx.callbackQuery;
//     let gameURL =
//       // "http://localhost:5000/index.html?id=" + ctx.callbackQuery.id;
//       "https://app.singhteekam.in/DinoGame/index.html?id=" +
//       ctx.callbackQuery.id;
//     await ctx.answerCbQuery(ctx.callbackQuery.id, {
//       url: gameURL,
//     });
//     console.log("Queries: "+queries);
//   }
// });

// bot.on("inline_query", async (ctx) => {
//   console.log("Inline query: "+ctx.inlineQuery);
//   await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, [
//     { type: "game", id: "0", game_short_name: gameName },
//   ]);
// });

/////////////////////////////////////////////////////////////////////////////////////////

// WEB APPS

bot.command("webapp", (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, "Web App", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "WebApp",
            web_app: { url: "https://www.singhteekam.in/" },
          },
        ],
      ],
    },
  });
});

//////////////////////////////////////////////////////////////////////////////////////////

// bot.launch();

bot.launch({
  webhook: {
    domain: "https://wide-eyed-sweatshirt-bee.cyclic.app",
    port: 5000,
  },
});
