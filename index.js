//  viber://pa?chatURI=desktopamm
'use strict';
const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
// other messgae type can be found here 'https://developers.viber.com/docs/api/nodejs-bot-api/#message-object'
// declaring message type
const TextMessage = require('viber-bot').Message.Text;
const RichMediaMessage = require('viber-bot').Message.RichMedia;
const KeyboardMessage = require('viber-bot').Message.Keyboard;

 // edit your server url here
const serverURL = 'https://ef5f8d84b150.ngrok.io';      // 'edit with your server url here';   
// edit your bot authToken here
const authToken = '49549e61b727d252-3877747e0b551145-97fe365e20449afc'; // 'edit with your bot token here';   

// create your bot at https://partners.viber.com/login
const bot = new ViberBot({
    authToken: authToken,
    name: "DesktopApp",
    avatar: "https://i.imgur.com/8eZks8i.png" // It is recommended to be 720x720, and no more than 100kb.
});

// middleware the bot with express end point
const port = process.env.PORT || 3000;
//const server = https.createServer(options, app);
app.listen(port, () => {     
    console.log(`Application running on port: ${port}`);
    bot.setWebhook(`${serverURL}/endPoint`).then(()=>{console.log("setWebhook Ok.")}).catch(err=>console.log("err setWebhook:",err))    
 })


app.get('/', (req, res) => { res.status(200).send('this is an secure server')  });
app.use("/endPoint", bot.middleware());


// when the user enter the link for the viber bot like viber://pa?chatURI=yourURI   // edit yourURI with the URI when create the viber bot account 
// CONVERSATION_STARTED event 
bot.on(BotEvents.CONVERSATION_STARTED, (userProfile, isSubscribed, context, onFinish) => {  
    bot.sendMessage(userProfile.userProfile, new TextMessage(`Hi! Nice to meet you. It is a CONVERSATION_STARTED event.`))
})


// normal event for messageing to the bot will be displayed here
bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    console.log("message:", message);
    
    // the way to track message from user 1. messageType, 2. trackingData
    var messageType = message.requiredArguments; 
    var trackingData = message.trackingData;
    // response to the user
    if(message){
        // messageType is the type of message that the user make -> 1. text, 2. location, 3. contact share, 4. send URL
        if(messageType[0]=="text"){
            var userInput = message.text;
            var trackingData = message.trackingData[0];
            if(userInput=="hi" || userInput=="Hi"){
                var message = new TextMessage(`You just input Hi.`);
                trackingData = {action : "welcome"}
            }else if(userInput=="carousel"){
                // https://developers.viber.com/docs/tools/keyboards/
                // ActionType ->  'location-picker' and 'share-phone' only available in KeyboardMessage
                let SAMPLE_RICH_MEDIA = {
                    "ButtonsGroupColumns": 3,
                    "ButtonsGroupRows": 4,
                    "BgColor": "#FFFFFF",
                    "Buttons": [
                        {
                            "ActionBody": "input_words",
                            "ActionType": "reply",                                         
                            "BgColor": "#85bb65",
                            "Text": "Text Reply",
                            "TextOpacity": 60,
                            "Rows": 2,
                            "Columns": 3
                        }, {
                            "ActionBody": "some keyword",
                            "ActionType": "open-url",   
                            "BgMedia": "http://www.url.by/test.gif",
                            "OpenURLType": "internal",                          // default OpenURLType is "internal" browser
                            "InternalBrowser": {
                                "Mode": "fullscreen",
                                "CustomTitle": "Your Title"
                            },                       
                            "BgColor": "#85bb65",
                            "Text": "<font color='#ffffff'>Redirect to <br> url</font>",    // desired font color can be changed
                            "TextOpacity": 100,
                            "Rows": 2,
                            "Columns": 3
                        }, {
                            "ActionBody": "nothing",
                            "ActionType": "none",                          
                            "BgColor": "#85bb65",
                            "Text": "No Reply",
                            "TextOpacity": 100,
                            "Rows": 2,
                            "Columns": 3
                        }
                    ]
                };
                var message = [
                    new TextMessage(`Displaying carousel.`),
                    new RichMediaMessage(SAMPLE_RICH_MEDIA, "", "", "", 4)
                ]               
            }else if(userInput=="keyboard"){
                // https://developers.viber.com/docs/tools/keyboards/
                // https://developers.viber.com/docs/tools/keyboards/
                // ActionType ->  'location-picker' and 'share-phone' only available in KeyboardMessage
                let SAMPLE_KEYBOARD = {
                    "Type": "keyboard",
                    "DefaultHeight": false,                    
                    "Buttons": [
                        {
                            "ActionBody": "input_words",
                            "ActionType": "reply",                                         
                            "BgColor": "#ffffff",
                            "Text": "Text Reply",
                            "TextOpacity": 60,
                            "Rows": 1,
                            "Columns": 3
                        }, {
                            "ActionBody": "some keyword",
                            "ActionType": "open-url",   
                            "BgMedia": "http://www.url.by/test.gif",
                            "OpenURLType": "internal",                          // default OpenURLType is "internal" browser
                            "InternalBrowser": {
                                "Mode": "fullscreen",
                                "CustomTitle": "Your Title"
                            },                       
                            "BgColor": "#85bb65",
                            "Text": "<font color='#ffffff'>Redirect to <br> url</font>",    // desired font color can be changed
                            "TextOpacity": 100,
                            "Rows": 2,
                            "Columns": 3
                        }, {
                            "ActionBody": "some keyword",
                            "ActionType": "location-picker",            //   not working on desktop viber
                            "BgColor": "#85bb65",
                            "Text": "Tap to <br>share loc;",
                            "TextOpacity": 100,
                            "Rows": 1,
                            "Columns": 3
                        }, {
                            "ActionBody": "some keyword",
                            "ActionType": "share-phone",                          
                            "BgColor": "#85bb65",
                            "Text": "Share my phone;",
                            "TextOpacity": 100,
                            "Rows": 1,
                            "Columns": 3
                        }, {
                            "ActionBody": "",
                            "ActionType": "none",                          
                            "BgColor": "#85bb65",
                            "Text": "No Reply",
                            "TextOpacity": 100,
                            "Rows": 1,
                            "Columns": 3
                        }
                    ]
                };
                var message = [
                    new TextMessage(`Displaying Keyboard.`),
                    new KeyboardMessage(SAMPLE_KEYBOARD, "", "", "", 4)
                ]                
            }else{
                  var message = new TextMessage(`Sorry I dont understand!`)                  
            }
            bot.sendMessage(response.userProfile, message, [trackingData]).catch(err=>{console.log("err message:", err)})
        }
        if(messageType[0]=="latitude"){
            var trackingData = message.trackingData[0]
            bot.sendMessage(response.userProfile, new TextMessage(`You just input Location.`))    
        }
        if(messageType[0]=="contactName"){
            var trackingDataJSON = JSON.parse(message.keyboard)
            var trackingData = trackingDataJSON[0]
            bot.sendMessage(response.userProfile, new TextMessage(`You just share contact.`))    
        }
        if(messageType[0]=="url"){
            var trackingData = message.trackingData[0]
            bot.sendMessage(response.userProfile, new TextMessage(`You just input URL.`))    
        }
     
    }else{
        // this is the format to send
        // bot.sendMessage(userProfile, message)
        bot.sendMessage(response.userProfile, new TextMessage(`I dont understand other too.`), [trackingData])
        
        /*  // how to include the tracking data is shown here. It is used when the userInput is not enough, it can be called as a session value ? like using the session parameter for mobile topup/meter billing and others
            // bot.sendMessage(userProfile, message, [trackingData]);
            bot.sendMessage(response.userProfile, new TextMessage(`You just input URL.`), [action : "firstAction"])    
        */
    }
})

