# Express js full course following tutorial

Link is here: https://www.youtube.com/watch?v=nH9E25nkk3I  
Project is just an exemplification of what goes on in the tutorial to have hands-on practice. 7h of video, some notes along the way.

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
- careful with using json for posts/put/del requests; app.use(express.json()) at the top; otherwise there's not body to be found in your controllers
- post requests are used to create new resources; put requests are used to update existing resources; delete requests are used to delete resources; patch requests are used to update parts of resources
- from what I've seen in the wild, put should be used to update parts & the entire resource; it's a bit more checking, but why introduce another method? there's usually just parts of a resource that are being updated anyway

### Middleware

- app.use(middlewarefunc); middlewarefunc = (req, res, next) => { ... }; next is a function that calls the next middleware in the chain
- middleware is often used for logging, authentication and authorization
- cool thing with express is that essentially everything is middleware, it's just a chain of functions that are being called; we can even put middleware after the route handler and they can be for error handling (in this case change app.get(route, callback); the callback becomes (req,res,next)=> {...})
- middleware can be configured for use for independent route handlers (like app.use('/api/users',middlefunc)) or for entire routes (like app.use('/api', routeHandler)); this allows for project scaling (defining folders/files to handle certain routes instead of manually putting everything in main file)

### Validation

- using express-validator; it's a middleware collection, essentially; used to validate body data, query params and more
- the way it calls itself is similar to how zod chains the function calls that validate the data; but it's way more verbose
- it attaches itself to the route as part of the request object; [express-validator#contexts]
- can chain the validations on a single route by calling more functions before the route handler, or group them up in a list with []; it does the same thing; still, way too verbose; better to abstract validations for objects themselves and call those functions instead; separate concerns
- can retrieve the matched data from the validator into an object that gives us quick access to creating / updating objects; so it's not just validation, but also formatting the data into an object for us; speeds up development a bit, since we can also only focus on using the data in the route handler
- can abstract the validation code via a "validation schema", which is a JSON object of a certain structure which can be checked against with checkSchema(); check validate/validationSchema.js for an example

### Routers

- has most of express()'s functions; can define route listeners and handlers just like with the basic app = express();
- functions as a middleware, first it checks the request against the routers, in the order they were called with app.use(router)
- allows us to clean up our code and separate concerns so that specialized modules can handle certain routes; in NestJS, simply declaring a controller is equivalent, though it forces a certain structure on the project; to do this, when doing app.use() put the path and the router so app.use('/api/products', productsRouter) any handler from productsRouter will start with that prefix of '/api/products'; this makes things clearer and it's easier to scale the code

### Cookies

- cookies' goal: to store data on the client's machine; can be used for authentication, session management, etc
- they're just pieces of data, key-value pairs; they're stored by the browser and sent with every request to the server
- can store stateful data in them; most common usage is for session management (so a sessionId or a JWT, but those are other subjects)
- can be tampered with so must always be validated on the server side; for that matter, anything the server ever gets should be validated; never trust the client
- check routers/cookies.js for experiments; see them in action in the browser developer tools
- we can even have signed cookies, which are not necessarily secret content-wise but they have a signature (using a secret key which only the server has); we can verify their authenticity this way (so that a client cannot impersonate someone else or get access to unintended data)
- there have been security issues over time with cookies, especially with authentication/authorization JWTs/sessionIDs; if someone steals your cookies, they can impersonate you on the internet since most websites don't check against a user/password combo on every request; they just check your cookies; this is how some YouTube channels were hacked in the past; but no one can get access to your cookies unless you have other security issues for them to be able to get to the browser
- cookies are website-bound; so stealingcookies.com won't be able to access your cookies from facebook.com
