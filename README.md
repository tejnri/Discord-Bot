# Discord-Bot

This bot will be used to respond to users with google search result and their resent search query history


**How to install it**

1. First setup your discord application and bot with the help of this [guide](https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/)
2. Create a mysql database and create a table by running this query
```
CREATE TABLE `search_history` (
  `id` int(10) UNSIGNED NOT NULL,
  `discord_user_id` varchar(255) NOT NULL,
  `query` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `search_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `discord_user_id` (`discord_user_id`),
  ADD KEY `query` (`query`);
ALTER TABLE `search_history`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
```
3. Create a Google API by following this [guide](https://developers.google.com/places/web-service/get-api-key) and save the api key
4. Create a google custom search by this [link](https://cse.google.com/cse/all) and save the search id
5. Clone this code in your local system and in the root run `npm install`
6. In the root forder of this app create a file .env and put following variables
```
# DB Credentials
DB_HOST=<mysql db host>
DB_USER=<mysql db user>
DB_PASS=<mysql db password>
DB_NAME=<mysql db name>
DB_PORT=<mysql db port>
# Discord Token
DISCORD_TOKEN=<discord bot token created in setp #1>
# Google Credentials
GOOGLE_API_KEY=<google api key created in step #3>
GOOFLE_SE=<google custom search id created in step #4>
```
7. At the end run `node index.js`

**How to use it**
1. In discord go to your server created in step #1 above.
2. You can see the bot as online in the user list
3. You can first check it by typing "Hi". It should respond with "Hello" and you should also see the log msgs in your console showing this interaction with the bot
4. To do google search type "!google \<search query\>". You would get the top 5 search results
5. To see your last 5 recent matching searches, Type "!recent \<search query\>" and to just return the last 5 queries just type "!recent" and enter.

**Live Demo**

To see a live demo click this invite link to join the bot https://discord.gg/vGHRDs9
