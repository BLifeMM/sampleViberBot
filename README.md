# sample Viber bot

## How to run? 

Navigate to this foler
> npm install         
> npm start 


**Note**
If a viber bot deployement is not success,
1. check if not exist, add a script @ package.json -> 
                                "start" : "node index.js"

### Library Prerequisites
1.	Node >= 5.0.0
2.	An Active Viber account on a platform which supports bots (iOS/Android). This account will automatically be set as the account administrator during the account creation process.
3.	Active bot - Create an account here.
4.	Account authentication token - unique account identifier used to validate your account in all API requests. Once your account is created your authentication token will appear in the account’s “edit info” screen (for admins only). Each request posted to Viber by the account will need to contain the token.
5.	Webhook - Please use a server endpoint URL that supports HTTPS. If you deploy on your own custom server, you’ll need a trusted (ca.pem) certificate, not self-signed. Read our blog post on how to test your bot locally.
Express
If you are already using express or equivalent, you can do the following: app.use("/frontend", bot.middleware()); 

Please revisit app.use() documentation. For more information see ViberBot.middleware().


The viber bot server contains two bots, bot(individul) and botOps(operation). As soon as the viber bot server is listening, the setWebhook for each bot will be needed to middleware. 

Insert these in the code. “
    var serverURL = "" // your server url here
    app.use('/frontend', bot.middleware());
    app.use('/backend', botOps.middleware()); 
    app.listen(3000 || process.env.PORT, () => { 
        console.log('Application running on port: 3000'); 
        bot.setWebhook(`${serverURL}/frontend`) 
        botOps.setWebhook(`${serverURL}/backend`) 
    });
”


In the middle ware, each bot used only two events,
CONVERSATION_STARTED event,  when a user get to the link or first time use, this event will work.
MESSAGE_RECEIVED, for the normal messaging process and function are below here. 
The official viber bot events has 5 events. We only use two events here, https://developers.viber.com/docs/api/nodejs-bot-api/#onEvent.


## How we track the request, response?

viber bot response in this format, https://developers.viber.com/docs/api/nodejs-bot-api/#botsendmessageuserprofile-messages-optionaltrackingdata –> 

 “ bot.sendMessage(userProfile, messages, [optionalTrackingData]) ”, 

where userProfile means the user who sent the message to the viber bot and this can be used to response message back to the user which can be form from the request of CONVERSATION_STARTED / MESSAGE_RECEIVED parameters.
We track the request from the logs or user Input, whcih can be text message ( text, number), input text from ActionBody of RichMediaMessage (carousel), or somethimes with  optionalTrackingData. 


## More Info;

Available message in viber bot can be from on this link, https://developers.viber.com/docs/api/nodejs-bot-api/#message-object. 
For other example creation of viber-bots can be seen at this link, https://github.com/Viber/sample-bot-isitup.
 For more details with more structured, please follow this link, https://developers.viber.com/docs/api/nodejs-bot-api/.



