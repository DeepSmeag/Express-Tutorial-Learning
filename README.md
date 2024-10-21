# Express js full course following tutorial

Link is here: https://www.youtube.com/watch?v=nH9E25nkk3I  
Project is just an exemplification of what goes on in the tutorial to have hands-on practice. 8h of video, some notes along the way. And also personal thoughts & other info.

## Notes

### Project start

- nodemon seems to be the preferred method, though --watch is available now; any extra features for nodemon? a quick search shows that nodemon allows for more configuration, like ignoring some files in larger projects; --watch is ok for this purpose
- app = express() is the first step in creating an express app; initializing the object
- app.listen(port, callback) is the literal start of the server
- from there, app.get/post/put etc are the defining points of routes on which we listen; their callback are the handlers, what in NestJS we would call controllers

### Query parameters

- "localhost:3000/api/users?name=John" what comes after "?" in any link is a query param; helps with being able to share links and get the same results
- only using these with "GET" requests
- careful with browser URL autocompletion; it might send you to a previously used URL and you'll be confused for a while (my case I was testing ?param=c and ?param=C and it was sending me to ?param=c)

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
- cookies are also the fundamental tool used by websites to track users; think e-commerce and social media learning what you're seeing and buying

### Sessions

- sessions are a way to keep track of a user's state (generally authentication); they're stored on the server, return a sessionID which is given to the browser; the browser sends the sessionID with every request; the server uses the sessionID to get the session data from its storage and verify the user; this way, a user can even be kept logged in after closing the browser
- an advantage on session authentication instead of JWTs is that we can invalidate them on the server side anytime; we can also store other data, like user roles
- using express-session here
- check routers/session.js for experiments;
- session and cookies are different, since session data is stored on the server; and that's important, since we don't want to let the client anything more than the bare necessity (which is the sessionID); session on server, cookie on the client
- an example I provide with a middleware is to count how many times the users visits anything on the /api/session route; this is an example of how we can track user behavior, like how many times they visit a page, which pages etc; analytics platforms make use of techniques like this
- it's common practice to store user data in the session, like user's ID, role, subscribed status etc; this way, we can keep track of the user's state and make decisions based on that; if a user is not subscribed, we can redirect them to the subscription page; or we could choose to show them different content, or prohibit access; keep in mind: everything must be done on the server;
- also common practice to have an in-memory database like Redis for session storage; writing and reading from traditional DBs is rather slow for our purpose (always checking against the db) and keeping data on-server, in its memory, will quickly lead to failure in case of server restarts or scaling when many users start coming in; we want some persistence in case we need to restart the server; users should not be asked to login every time, it's annoying
- common use-case for session besides auth - shopping carts; I've recently come upon a bug/missing feature on a popular fashion website; adding clothes to the cart while logged out, then logging in, caused the cart to become empty; so they did not consider transferring cart items from the logged out session to the logged in session (or they did not track the logged out session at all, which I highly doubt)

### Passport.js

- passport is a library helping with authentication (middleware); it uses strategies = ways to authenticate users (Google, Apple, Facebook, Twitter, local, etc); for strategies based on 3rd party services, you'll need to register with them and get an API key
- passport and passport-local are the packages we're working with
- setup is more boilerplate than actually doing something; it's all about properly configuring strategies and then using the middleware on routes to
- follow the code in strategies/local-strategy.js and routers/passport.js for a simple example (can only do it with postman/thunder, since we don't have a form to POST using the browser)
- the mechanism is similar to cookies - we login using the right credentials (or we get an error); from there on, the user is saved to session (if we configured it as such) and we introduce a cookie on the client-side; this cookie can be used on subsequent requests to authorize the user against the session; we did a similar process before, manually, with cookies and sessions; passport just abstracts the process and makes it easier to use

### Database & MongoDB

- using mongoose ORM for mongodb as a nosql database offering; can download it and use locally or use a managed instance, which can be deployed both from their website or from CLI with atlas [link](https://www.mongodb.com/try/download/community); I ended up installing atlas since it's easy via CLI; I'd recommend downloading the server and running it locally for practice and quick removal afterwards

#### From this point on, the server throws an error and doesn't start if there's no .env file configured with the MONGO\_\* variables; if you want to play around without the db stuff, comment out the connection code and don't use the db route

- there's not much to say, except for any ORM (mongoose) some syntax needs to be learned; in-depth knowledge would require a specific DB course, not an express (backend) one; we just integrate mongoose a bit here

- the video integrates db records with passport to show logging in and storing data in the db; the way I structured my routes would require writing passport code, though it's pretty straightforward

### Hashing passwords

- integrating hashing code within the db route; also check utils/helpers.js for the hashing and comparing function
- **never ever** do we store passwords in plain text in reality; Nodejs offers the crypto module; there's also the bcrypt package, this is what we use here
- we'll store hashed password in the db, along the plain text ones
- the way hashing works (at an incredibly high level) is that we use a function that takes a string and returns a fixed-length string, which is our hashed password; in this process, there's also a "salt" being used, which is a secret string that only we should know and it's used to make the hash unique, so hackers can't reverse engineer the hash and get the password;
- in bcrypt, the salt is incorporated in the password, so we don't need to store it and we can extract the salt, hash the plain text password, then compare the results; we do this by using the compare function from bcrypt
- I saw a comment on the internet saying that 10 salt rounds are not enough and they'd recommend 12 or more; I don't know enough to give an opinion on this; more rounds, more time taken, but increased security; decide on your trade-offs

### Session Store

- a session store is used to persist session data when a user logs in;
- the tutorial uses connect-mongo, which connects express-session with mongodb; it's a middleware that stores session data in the db; the package directly integrates with express-session and we just configure it my mentioning store: _mongoose.connection.getClient()_ when we call the session middleware in main.js
- by simply doing this integration, if we do a POST on /api/session/auth with any of the 3 configured users, a new collection "sessions" appears, and we have our data stored there; this way, even if the server restarts, the user's session (what they have in their browser's cookies) is still valid;
- now, even if we restart the server, if we GET /api/session/auth/admin-dashboard, we'll get the correct message
- we can combine this with passport to get a robust auth system; extra steps would include using Redis or other in-memory db systems for faster session storage
- we could now change _saveUnitialized: true_ in the config, meaning even a logged out user gets a session; we can use this to track them and then transfer this session to a logged in instance; important here: if we create sessions for any logged out user, if they clean their cookies and visit the website, we'll create a new session; this leads to a lot of data being stored in the db over time; so we need a cleanup mechanism
- using _resave: true_ in the config will save session changes; the session's expiration date will update on every request for example; this might be useful, though such situations are rare

### OAuth2 with Passportjs

- if we want to use 3rd party providers for authentication, we use OAuth2; it's a protocol that 3rd party providers implement; Discord & Github are one of the easier ones to use (though I've had some trouble with Discord Apps disappearing randomly)
- I'm not going to implement this part; it starts in the video at 5:11:58
- passport has separate packages for all their strategy; _passport-discord_ would be required to follow the video
- a _client_secret_ and _client_id_ are needed; there's also a few configuration steps on the provider's website, mainly setting a _redirect_url_; the way it works is that we let the user press a button that directs them to a Discord page (or Google or other) where they can login; then Discord redirects them to a URL we tell it to use, where we handle the data; what we get from a provider is a short-lived access token (it's valid for hours/days), and occasionally a refresh token (longer time frame); Facebook offers a separate mechanism, where the short-lived token is exchanged for a long-lived one through separate requests
- once obtained, an access token enables us to get data about the user from the provider (Discord for example); this generally includes a name, email, profile picture URL; some also offer a _validated_email_ field, since not all providers require email validation; careful with choices here
- in the video, instead of implementing a button to redirect us, we implement that via the route handler; by just doing app.get('/api/auth/discord', passport.authenticate('discord')); we get redirected to the Discord login page; then Discord redirects back to our server, where we can handle the login;
- the data we get from Discord should be stored in the session so we know who the user is;

### Unit Testing

- using Jest; it's the most popular framework for testing in Nodejs; made by Meta
- don't forget to add the test script in package.json if jest did not override the file
- apparently Jest is built to work with CommonJS, not ESM; to solve this, we have a few options: convert entire project to CommonJS (nope, the way forward is ESM), use an experimental flag to enable ESM support (people say there are some bugs), or use Babel as a transpiler; we go with babel here
- we add some packages (see the video), then we configure _.babelrc_ and create a _jest.config.js_ file via _npm init jest@latest_ (or _pnpm create jest@latest_ in my case); there are some questions, the order in the video is y/n/node/n/v8/y
- there's also configuration inside jest.config.js to enable transpiling with babel
- industry-standard: placing all tests inside a \_\_tests\_\_ folder in src/
- also industry-standard: placing all test files with the same name as the file they're testing, but with .test.js at the end
- we are now forced to refactor our code since the tutorial so far did not follow best practices (it's a tutorial after all) and separate the routes from their handlers; in the video, he creates separate files; this would be confusing if someone where to check my code and not see the handlers, since I'm talking about them in the previous sections; so I'm creating separate functions as well but keeping them in the same file, right above the route definition
- since our initial function (see products.spec.js) uses _res.send(products)_, we need to have a mock function for what .send() does; so we use a mockResponse object which we can define however we like; we define these mockRequest and mockResponse objects based on what we use inside the function (they become the function's req and res)
- an issue with testing comes when we need to test a function that expects validation to have occured in middleware before (like our products POST route); there is a solution for this - mocking the module: _jest.mock('express-validator')_; this way, we can define the behavior of the module and the function will work as expected;
- !one thing that I get differently from the video is errors with jest.mock for 'express-validator'; somehow, running the test tries to call checkSchema from the route handler; the solution I found was to mock the function I need (validationResult), but require the actual package for the rest; weird behaviour, I don't know enough about Jest to explain it; I can only say it's a version issue, since the video doesn't have it
- it's great to be able to mock everything and test line by line, but if at any point the implementation changes (for other, more complex, functions), the tests will start failing; I'd rather black-box test the routes based on input; the issue comes with routes which have middleware applied, cause then you have to know what the middleware did and again, if at any point the implementation changes (like having a different format for an object or calling a different function), tests start failing;
- the way jest mocks work is similar to dependency injection in OOP-based frameworks (like NestJS or Java's Spring)
- I'd say jest requires a whole course onto itself, since it has so many ways of mocking stuff; files become too big rather quickly with so many dependencies and there is need for a structure;
- we can also provide mock implementations; see hashPassword's implementation in the test file
- I get the sense that the unit testing section of the video would not be practiced in the real world, at the very least because we're testing other functions, besides the one we're actually describing in the test case; might be wrong, haven't seen testing with jest done in a production environment (when there's limited time and a lot to do as well)

### E2E testing

- end-to-end testing is essential for the development process; in a highly dynamic environment, when the application changes and some functionalities might be dropped, there's little point in testing every single line; it makes more sense to test from the perspective of the user and see how things go; I endorse this type of testing as 1st choice, and unit testing if there's time or a special requirement
- we're using supertest; also creating a separate (p)npm run script "test:e2e" to separate testing types
- we've separated the app setup into a function so we can use it in our e2e test; there's also an issue with mongoose doing the db connection, the video offers a solution; looks good for integrating async into a non-async situation like running the tests
- overall, testing is indeed an entire discipline onto itself if we want to do it properly; so learning proper patterns of injecting dependencies and setting up our main project (the development part, not the test part) so that we can easily extend it and also test it is essential;

## Overall thoughts

- long video, doesn't go into more general web subjects, but keeps to express; if anything seems weird, it might be you're lacking some other knowledge, like how requests to servers work;
- first half is more basic, but the 2nd half took me a while to figure out in writing code, especially since my code diverged early from that in the video;
- I like the examples of integrating session management with authentication and db persistence; nice example, and anyone should be able to further extend it now to make it into a real app study-case
- testing is tough unless some other structure information is provided; it's nice to be able to granularly test every single line of code, though in practice we'd avoid that due to time constraints I guess
- I came to this video having seen (and taken notes) of another video on express ([link](https://www.youtube.com/watch?v=CnH3kAXSrmU); while you're there also check the Nodejs tutorial for even more fundamental stuff), which was shorter but still covered most aspects, at least on an intuitive level; this one handled the practical aspect of getting to write code;
- I also came to this video having NestJS as a reference points; indeed, anything that's in express can be manually structured in a way to create NestJS's rules; I like the structure an opinionated framework such as Nest provides, especially since they force the programmer to adhere to SOLID principles and whatnot; Express is customizable indeed, but it can lead to messy codebases; It's a tradeoff; I'd also have a hard time figuring out how to implement persistent queue listeners for RabbitMQ and other job queues in naked Express, since they need to run async before the server is started and we'd still need to be able to reference the queue's functions to send stuff; Nest abstracts this away and it's way easier
- I'd personally choose Nest for a project I expect would take more than a few features, since it keeps me organized; I guess some people wouldn't like being forced to do things Nest's way
