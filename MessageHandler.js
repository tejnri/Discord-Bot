const _ = require('lodash');
const {getQueries, saveQuery} = require("./db");
const googleSearch = require('./googleSearch');

/**
 * This class will deal with all the messages that is incoming
 * to the message bot
 */
class MessageHandler{

    static that = null;
    /**
     * Return a new instance of Msg Handler
     *
     * @param logger Logger instance to log the msgs in console
     * @returns {MessageHandler}
     */
    static get(logger){
        if(MessageHandler.that){
            return MessageHandler.that;
        }else{
            MessageHandler.that = new MessageHandler(logger);
        }
        return MessageHandler.that;
    }

    /**
     * Constructor function for MessageHandler
     *
     * @param logger Logger instance to log the msgs in console
     */
    constructor(logger){
        this.logger = logger;
    }
    /**
     * Msg handler for msg coming from discord
     *
     * @param discordMessage
     */
    handleMessage(discordMessage) {
        /**
         * If the msg is coming from any other user
         */
        if (!discordMessage.author.bot) {
            const discord_user = discordMessage.author.username;
            // Check if the incoming msg has a command in it
            if (discordMessage.content.substring(0, 1) == '!') {
                const msg_args = discordMessage.content.substring(1).split(' ');
                switch (msg_args[0]) {

                    case "google":
                        // For google msg command
                        this._handleSearch(discordMessage);
                        break;
                    case "recent":
                        // For recent msg command
                        this._getRecent(discordMessage);
                        break;
                    default:
                        this.logger.warn(`Invalid command ${msg_args[0]} sent by user:${discord_user}`);
                        // If the command is an invalid one
                        discordMessage.channel.send("Invalid command. Please use only !google or !recent commands");

                }
            }
            // If the user just said 'Hi'
            else if(discordMessage.content.toLowerCase() === 'hi'){
                // Answer it with 'Hello'
                this.logger.info(`User:${discord_user} says Hi`);
                discordMessage.channel.send("Hello!");
            }
            // If there is no other way to handle the msg
            else{
                this.logger.warn(`User:${discord_user} says "${discordMessage.content}" which we cannot handle`);
                discordMessage.channel.send("I dont know how to respond to this. " +
                    "You can ask me to search google by !google " +
                    "or you can look into your search history by !recent. Thanks!");
            }
        } else {
            // Ignore it!
        }
    }

    /**
     * This function will handle the search command
     *
     * @param message
     * @private
     */
    _handleSearch(message){
        // Get incoming user Id and query
        const discord_user_id = message.author.id;
        const discord_user = message.author.username;
        const content = message.content;
        const query = _.join(_.slice(content.substring(1).split(' '),1), " ");

        // CHeck if there is indeed a query string coming
        if(!query){
            this.logger.warn(`User ${discord_user} sent an empty search query`);
            message.channel.send("Please include a search query after !google");
        }else{
            this.logger.info(`User ${discord_user} sent a search query "${query}"`);
            // If yes, first save the query in db
            saveQuery(discord_user_id,query).then((rows) => {
                // If the query is saved in history
                // then search it in google custom search
                googleSearch(query).then((results) => {
                    // Send each result in separate replies
                    this.logger.info(`User ${discord_user} successfully replied with search results`);
                    results.forEach((result) => {
                        message.channel.send({
                            embed:{
                                title: result.title,
                                url: result.link,
                                description: result.snippet
                            }
                        })
                    })
                }).catch(() => {
                    this.logger.error(`Error in doing google search for User ${discord_user}`);
                    // If there is any error in search then send an error msg
                    this._sendSimpleErrorMsg(message);
                })
            }).catch(() => {
                this.logger.error(`Error in saving history for User ${discord_user}`);
                // If there is an error in saving then send an error msg
                this._sendSimpleErrorMsg(message);
            })
        }

    }

    /**
     * This function will handle the 'recent' command in msg
     *
     * @param message
     * @private
     */
    _getRecent(message){
        // Get the user id who is sending
        const discord_user_id = message.author.id;
        const discord_user = message.author.username;
        const content = message.content;
        const query = _.join(_.slice(content.substring(1).split(' '),1), " ");
        this.logger.info(`User ${discord_user} asked for search history` + (query? ` for query "${query}"`:""));
        // Get the search history from db
        getQueries(discord_user_id,query).then((rows) => {
            // Check if there is any result
            if(rows.length === 0){
                this.logger.info(`User ${discord_user} is returned with empty saved search history`);
                message.channel.send("Sorry, no result.");
            }else{
                // Combine the search queries in a single string
                let search_queries = _.map(rows, (row, index) => {
                    return `${index + 1}. ${row.query}`;
                }).join("\n");
                // Send it back to the user
                this.logger.info(`User ${discord_user} successfully replied with his/her search history`);
                message.channel.send({
                    embed:{
                        title: `History search result:`,
                        description: search_queries
                    }
                })
            }
        }).catch((e) => {
            // If there is an error in getting the history then send an error msg
            this.logger.error(`Error in fetching history for User ${discord_user}`);
            console.log(e);
            this._sendSimpleErrorMsg(message);
        })
    }

    /**
     * This function will send a default error msg to the user
     *
     * @param message
     * @private
     */
    _sendSimpleErrorMsg(message){
        message.channel.send("Facing some issues right now. Please try after sometime");
    }
}

module.exports = MessageHandler;