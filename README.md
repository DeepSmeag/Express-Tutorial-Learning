# Express js full course following tutorial

Link is here: https://www.youtube.com/watch?v=nH9E25nkk3I  
Project is just an exemplification of what goes on in the tutorial to have hands-on practice.

## Notes

### Project start

- nodemon seems to be the preferred method, though --watch is available now; any extra features for nodemon? a quick search shows that nodemon allows for more configuration, like ignoring some files in larger projects; --watch is ok for this purpose
- app = express() is the first step in creating an express app; initializing the object
- app.listen(port, callback) is the literal start of the server
- from there, app.get/post/put etc are the defining points of routes on which we listen; their callback are the handlers, what in NestJS we would call controllers

### Query parameters

- "localhost:3000/api/users?name=John" what comes after "?" in any link is a query param; helps with being able to share links and get the same results
- only using these with "GET" requests
- careful with lowercase/uppercase; browser might remember previous url with query param and automatically lower-case yours to match that and you'll be confused for a while

### POST/PUT/DELETE/PATCH

- never seen PATCH used;
