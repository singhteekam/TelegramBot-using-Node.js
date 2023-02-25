const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const options= {
    webHook:{
        port: process.env.PORT || 3000
    }
};
const url = "https://telebotapptest.onrender.com";
const token= process.env.TOKEN;

const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.TOKEN, options);

bot.setWebHook(`${url}/bot${token}`);

//HELP MESSAGE
bot.help(ctx => {
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
/fruitslist - list of fruits
/vegetableslist - list of vegetables
/menu - for menu items
/help - for more options
     `;
    // ctx.reply(msg);
    bot.telegram.sendMessage(ctx.chat.id, msg, {
        parse_mode: "markdown"
    })
})


bot.use((ctx, next) => {
  // ctx.state.value = 50;
  // console.log(ctx.state.value);
//   ctx.reply("Hi " + ctx.chat.first_name);
//   ctx.reply("Hi " + ctx.chat.first_name);

  let msg = `
  Hi ${ctx.chat.first_name}
/help - for more options
    `;
    ctx.reply(msg);
  next(ctx);
});

// bot.start((ctx)=>{ 
//     // ctx.reply(ctx.state.value)
//     console.log(ctx.state.value);

// });

// bot.help((ctx) => ctx.reply('Send me a sticker'))
// bot.on('sticker', (ctx) =>{ 
//     ctx.reply('👍')
// });

// bot.hears('hi', (ctx)=>{ 
//     ctx.reply('Hey there')
//     console.log(ctx);
// });


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
bot.command('gif', (ctx) => {
    // bot.telegram.sendChatAction(ctx.chat.id, "upload_photo")

    bot.telegram.sendAnimation(ctx.chat.id,
        "https://media.tenor.com/EEByypBESRkAAAAM/online.gif",
        {
            reply_to_message_id: ctx.message.message_id
        }
    );
})

//Sending multiple files
bot.command('mediagroup', (ctx) => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_document")

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
        "https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png"
    ];
    let allpics = photos.map(photo => {
        return {
            type: "photo",
            media: photo
        }
    })
    bot.telegram.sendMediaGroup(ctx.chat.id, allpics);
})

// List command
bot.command("thumbnailitem", ctx => {
    bot.telegram.sendDocument(
        ctx.chat.id,
        // {
        //     source: "LOCAL-PATH"
        // }
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
        ,
        {
            thumb: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
        }

    )
});

bot.command("location", ctx => {
    bot.telegram.sendLocation(
        ctx.chat.id,
        28.459497,
        77.026634
    )
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

const axios = require('axios');
bot.command('catfacts', (ctx) => {
    axios.get('https://catfact.ninja/fact')
        .then(res => {
            ctx.reply("Cat Fact: \n" + res.data.fact)
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
})

//Cat pic with some text
bot.command('catpic', async (ctx) => {
    let inp = ctx.message.text;
    let inpsplit = inp.split(" ");
    if (inpsplit.length == 1) {
        try {
            let res = await axios.get('https://aws.random.cat/meow');
            ctx.replyWithPhoto(res.data.file);
        } catch (error) {
            console.log(error);
        }
    }
    else {
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
    data.forEach(element => {
        msg += `-${element}\n`
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
        res = await axios(`https://sheets.googleapis.com/v4/spreadsheets/1Dvqp7Emf1gwYPLWZSxgxdZZgxqx0nhQZQpe6PoB6RkU/values/Sheet1?alt=json&key=${process.env.GSHEETAPIKEY}`);
        // console.log(res.data.values);
        dataOfGSheet = res.data;
    } catch (error) {

    }
};

bot.command('gsheet', (ctx) => {
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
            { text: "Btn22", callback_data: "hii" },
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
    bot.telegram.sendMessage(ctx.chat.id, "List of Fruits:\n-Apple\n-Orange\n-Banana",
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Back to menu", callback_data: "menu" },

                    ],
                ]
            }
        }
    )
});

bot.action("vegetableslist", (ctx) => {
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, "List of Vegetables:\n-Potato\n-Tomato\n-Onion",
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Back to menu", callback_data: "menu" },

                    ],
                ]
            }
        }
    )
});

bot.action("menu", (ctx) => {
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, "Inline Menu", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Fruits list", callback_data: "fruitslist" },
            { text: "Vegetables list", callback_data: "vegetableslist" },
            { text: "Btn", callback_data: "hii" },
          ],
          [
            { text: "Help", callback_data: "/help" },
            { text: "Btn22", callback_data: "hii" },
          ],
        ],
      },
    });
});



bot.launch()
