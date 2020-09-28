'use strict';
const express = require('express');
const app = express();
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
// other messgae type can be found here 'https://developers.viber.com/docs/api/nodejs-bot-api/#message-object'
const TextMessage = require('viber-bot').Message.Text;


 // edit your server url here
const serverURL = 'edit with your server url here'   || 'http://localhost:3000';

// create your bot at https://partners.viber.com/login
// replace the authToken with your bot token
const bot = new ViberBot({
    authToken: 'edit with your token here',
    name: "BLife_UAT",
    avatar: "https://i.imgur.com/8eZks8i.png" // It is recommended to be 720x720, and no more than 100kb.
});

// middleware the bot with express end point
const port = process.env.PORT || 3000;
app.use("/endPoint", bot.middleware());
app.listen(port, () => {
    console.log(`Application running on port: ${port}`);
    bot.setWebhook(`${serverURL}/endPoint`)    
});


// when the user enter the link for the viber bot like viber://pa?chatURI=yourURI   // edit yourURI with the URI when create the viber bot account 
// CONVERSATION_STARTED event 
bot.on(BotEvents.CONVERSATION_STARTED, (userProfile, isSubscribed, context, onFinish) => {
    // response to the user
    onFinish(new TextMessage(`Hi! Nice to meet you.`) ); 
}) 
// OR can be also write this 
/*
bot.on(BotEvents.CONVERSATION_STARTED, (userProfile, isSubscribed, context, onFinish) => {  
    bot.sendMessage(userProfile.userProfile, new TextMessage(`Hi! Nice to meet you.`))
})
*/ 

// normal event for messageing to the bot will be displayed here
bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    console.log("message:", message);
    
    // the way to track message from user 1. messageType, 2. trackingData
    var messageType = message.requiredArguments; 

    // response to the user
    if(message){
        // messageType is the type of message that the user make -> 1. text, 2. location, 3. contact share, 4. send URL
        if(messageType[0]=="text"){
            var trackingData = message.trackingData[0];
            bot.sendMessage(response.userProfile, new TextMessage(`You just input Text.`))    
            // other process ...
        }
        if(messageType[0]=="latitude"){
            var trackingData = message.trackingData[0]
            bot.sendMessage(response.userProfile, new TextMessage(`You just input Location.`))    
            // other process ...
        }
        if(messageType[0]=="contactName"){
            var trackingDataJSON = JSON.parse(message.keyboard)
            var trackingData = trackingDataJSON[0]
            bot.sendMessage(response.userProfile, new TextMessage(`You just share contact.`))    
            // other process ...
        }
        if(messageType[0]=="url"){
            var trackingData = message.trackingData[0]
            bot.sendMessage(response.userProfile, new TextMessage(`You just input URL.`))    
            // other process ...
        }
        if(trackingData){
            bot.sendMessage(response.userProfile, new TextMessage(`Your tracking data is:`, trackingData))  
            // other process ...  
        }
     
    }else{
        // this is the format to send
        // bot.sendMessage(userProfile, message)
        bot.sendMessage(response.userProfile, new TextMessage(`I dont understand other.`))
        
        /*  // how to include the tracking data is shown here. It is used when the userInput is not enough, it can be called as a session value ? like using the session parameter for mobile topup/meter billing and others
            // bot.sendMessage(userProfile, message, [trackingData]);
            bot.sendMessage(response.userProfile, new TextMessage(`You just input URL.`), [action : "firstAction"])    
        */
    }
})

