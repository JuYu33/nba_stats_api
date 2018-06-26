# nba_stats_api

This api currently pairs with my NBAfantasy front end. 

This api uses two different sources for stats during the 2017-2018 NBA regular and post season.

After a select date is chosen, this backend will check my MongoAtlasDB for games on that date, then respond with the game data.

If no game data was available on the MongoAtlasDB, data is instead fetched from an external API.

Once data is received from external API, it is served to the front end AND saved to the MongoAtlasDB for future requests.
