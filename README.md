# 0. Overview

This is a sample project for beginners who wish to learn Express.js. We will build a web app for blogging. To learn the concepts step by step, we suggest you clone this code repository and checkout relevant checkpoints identified by branch names.

To start learning, you will need to install some essential tools. Versions mentioned below were used on Windows 10 when preparing this project but you may use more recent versions. Install the following:
* [Git](https://git-scm.com/download) (2.19.1): Used to clone repo and checkout code of a specific branch.
* [Node](https://nodejs.org/) (10.13.0 LTS): JavaScript runtime to run Node.js apps.
* [npm](https://www.npmjs.com/get-npm) (6.4.1): Used To install and manage node modules. This is automatically installed as part of Node installation.
* [VS Code](https://code.visualstudio.com/) (1.28.2): Any code editor or IDE would do but we'll use Visual Studio Code for this project. 

To validate that correct versions are installed, you can type the following commands on a terminal:
```
git --version
node -v
npm -v
code -v
```

To get a high-level overview, read [Node.js](https://devopedia.org/node-js) and [Express.js](https://devopedia.org/express-js) articles on Devopedia. Although optional, you can also study Devopedia's [basic tutorial on Node.js](https://github.com/DevopediaOrg/nodejs-basic).

The rest of this document guides you through the project step by step. To try out code at a particular step, checkout the relevant branch. For example, to checkout code of `br0.1` branch, run command `git checkout br0.1`. Branch names are mentioned in section headers. With the command `git branch -a` you can list all branches.


# 1. Hello World Express App (br0.1)

Let's create a simple app with Express.js. First we need to create a Node.js project. More specifically, we need to create the `package.json` file. Create this with the command `npm init` with the following inputs (just enter to accept default value):
```
package name: (express-blog)
version: (1.0.0)
description: Simple blogging app implemented in Express
entry point: (.eslintrc.js) app.js
test command:
git repository: (https://github.com/DevopediaOrg/express-blog.git)
keywords: blog express
author: Devopedia
license: (ISC) MIT
```

Let's run node with this command: `node app.js`. We'll get an error. This is because we have not installed Express yet.

We can install Express by typing `npm install express --save`. The version of Express installed will be recorded in file `package.json`. Moreover, exact versions of Express and all its dependencies are recorded in file `package-lock.json`. Ideally, these two JSON files must be committed to project's code repository. We'll skip this step since we'll replace this sample app in the next exercise. You can delete these files if you wish.

Study the code in `app.js`. The request and response objects of Express are built on top of those of Node. Start the Express app by running `node app.js`. Go to your browser and access URL `http://localhost:3000/`

Congrats! You've just built your "Hello World" Express app!


# 2. Generate App Structure (br0.2)

In a real-world app, code will be organized in a modular way so that it's easy to maintain. While Express does not recommended any folder structure, **Express Generator** is an easy way to initialize an Express app. The generator provides the basic scaffolding. This generator provides the `express` command-line tool.

For this exercise, we don't really need to install the generator since the folder structure is already created using the command `express --view=hbs app`. **Do not** run this command. This is only for your information. This command creates the basic code for building an Express app. Option `--view=hbs` tells the generator that we'll be using Handlebars templating. Module `hbs` describes itself as "Express view engine wrapper for Handlebars".

Note that we have organized the app within the `app/` folder. To install Express and other modules within the `app/` folder, and start the server, run these commands:
```
cd app
npm install
SET DEBUG=app:* & npm start
```

You can access you Express web app at `http://localhost:3000/` from your browser.

Let's note the following points about this app:
* Entry point of this app is `app/bin/www`. This is specified in file `app/package.json`.
* Express app is created in module `app.js` and invoked by `app/bin/www`.
* If `PORT` is defined as an environment variable, the server will listen at that port. If not, 3000 is used as the default port.
* The server has two callbacks, one for errors and one when it [starts listening](https://nodejs.org/api/net.html#net_server_listen).
* When homepage is requested, the app routes it to `routes/index.js`. This route is setup in `app.js`. The corresponding view is served from `views/index.hbs`.
* Verify that Express does hot reloading when views are changed but not when router code is changed.
* Note that server responds with 404 error when `/favicon.ico` is requested.
* Note that server responds to static files from the folder `public/`. This is setup in `app.js` with the line `app.use(express.static(path.join(__dirname, 'public')));`. Try accessing the following and explain the results: `http://localhost:3000/public/stylesheets/style.css` and `http://localhost:3000/stylesheets/style.css`

Try the following URLs and see if you can trace the code flow:
* `http://localhost:3000/users`
* `http://localhost:3000/abcd`

Note the frequent use of `app.use()` in the code. Study the documentation of [app.use()](https://expressjs.com/en/4x/api.html#app.use). This is used to add middleware functions in the data flow path. In fact, it's been said, "An Express application is essentially a series of middleware function calls".

Middleware functions have access to request and response objects. It the request-response cycle is not terminated within a middleware function, it must call `next()` so that the next middleware function is called. You can see an example of this in file `app.js`. To know more, read [Using Middleware](http://expressjs.com/en/guide/using-middleware.html).


# 3. Experiments with Middleware (br0.3)

Let's do a few experiments to understand the call flow of Express middleware.

## 3.1 Basics

Start the node server as before. You will see that we have slightly modified the `app.js` file. Access the following URLs and explain the logging that happens:
* `http://localhost:3000/`
* `http://localhost:3000/users`
* `http://localhost:3000/abcd`

What happens when you remove `next()` call from `Middleware A` in our example? You can also see what's happening on the console log.

How is `Middleware A` different from `timeLogger()` inside `routes/users.js`? The former is an app-level middleware. The latter is specific to the users router instance. It's a router-level middleware. In fact, both `routes/index.js` and `routes/users.js` implement what we call "modular, mountable route handlers".

What's interesting is that the two routers are added to `app.use()`. This means that Express router instances are also used as middleware. In fact, we can also have another Express application and use that as a middleware within our main app! This is documented in the [API of app.use()](https://expressjs.com/en/api.html#app.use).

## 3.2 Custom Middleware

We've added a custom middleware called `hello-url` stored in folder `middleware`. This example shows how middleware can be configured. Let's invoke this in `app.js` with the following code:
```
var hurl = require('./middleware/hello-url');
app.use(hurl({ upper: true }));
```

## 3.3 Chaining Middleware

We can chain middleware calls. Replace `app.use('/users', usersRouter);` with the following code:
```
const middlewareC = (req, res, next) => { console.log(req.url, 'Middleware C'); next(); };
const middlewareD = (req, res, next) => { console.log(req.url, 'Middleware D'); next(); };
app.use('/users', [middlewareC, middlewareD], usersRouter);
```

Access the URL `http://localhost:3000/users`. Can you explain the call flow? Why is `req.url` different when logged from middleware C and D?

## 3.4 Parsing Route Paths

Change the code above to the following:
```
const middlewareD = (req, res, next) => { console.log(req.params, 'Middleware D'); next(); };
app.use('/users/?(:id)?', [middlewareC, middlewareD], usersRouter);
```

Access URL paths `/users`, `/users/`, `/users/123`. The routing for these are defined using a string with metacharacter `?`. Metacharacters that we can use are `?`, `+`, `*`, and `()`. These have similar meaning as in regular expressions. For more details read the [Express routing guide](https://expressjs.com/en/guide/routing.html).

## 3.5 app.use() vs app.get()

Try the following code (before calling `indexRouter`) and see if you can explain the difference between `app.use()` and `app.get()`:
```
const middlewareC = (req, res, next) => { console.log(req.url, 'Middleware C'); next('route'); };
const middlewareD = (req, res, next) => { console.log(req.url, 'Middleware D'); next(); };
app.use('/', [middlewareC, middlewareD]);
app.get('/', [middlewareC, middlewareD]);
```

Basically, `app.use()` is to set up middleware calls whereas `app.get()` is to set up route handlers. We can see in the above example, the use of `next('route')`. When this is part of a route handler, it tells express to skip handlers that follow.

## 3.6 Multiple Handlers

We know from the above examples that multiple middleware can be chained together. Likewise, we can have multiple handlers for the same route. As an example, modify the code in `routes/users.js` as follows:
```
router.get('/', 
  function (req, res, next) {
    console.log('First handler');
    next();
  },
  function (req, res, next) {
    console.log('Second handler');
    res.send('List all users');
  });
```


# 4. Error Handling (br0.4)

Error handling is an important aspect of Express. Express Generator has imported `http-errors` module to throw an error. Access an invalid URL path such as `/abcd` and understand how the error is handled.

What happens if you delete the error handler given by the code `app.use(function (err, req, res, next) { ...`? In fact, Express will automatically an handle error that's not handled explicitly by our app code.

Let's code our own implementation (add to `app.js`) without making use of `http-errors`:
```
app.use(function(req, res, next) {
  throw Error('Unable to handle your request!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.message);
});
```

Note that a error-handling middleware has four arguments. First argument contains the error. Also note that error status is fixed to 500. This is where `http-errors` module helps in throwing errors with suitable status codes.

A more modular approach is to split the processing:
```
app.use(
  function (err, req, res, next) {
    console.error(err.stack);
    next(err);
  },
  function (err, req, res, next) {
    res.status(500).send(err.message);
  }
);
```

The above in ES6 syntax would be as follows:
```
const errLogger = (err, req, res, next) => { console.error(err.stack); next(err); };
const errReplier = (err, req, res, next) => res.status(500).send(err.message);
app.use(errLogger, errReplier);
```

Let's try to create a real error: read a file that doesn't exist. We'll use the `fs` built-in Node module. The code is given below:
```
const fs = require('fs');

app.get('/readfile', function (req, res, next) {
  fs.readFile('/somefile.txt', function (err, data) {
    if (err) {
      throw Error('Unable to read file!');
    }
    else {
      res.send(data);
    }
  });
});
```

Why is this not working? In fact, the Node server terminates. Even if we add our own custom error-handling middleware it won't work. The reason is error is thrown from inside a callback to an asynchronous function. This error bubbles all the way up to the event loop. Let's correct the code by replacing `throw ...` with `next(err)`. This is the correct way to pass errors in Express.


# 5. MongoDB & User Authentication (br0.5)

We need a database for storing app data. We'll use MongoDB. Install the following:
* [MongoDB Community Server](https://www.mongodb.com/download-center/community) (4.0.4): We'll use MongoDB as the database.
* [MongoDB Compass](https://www.mongodb.com/download-center/compass) (1.15.4): This is optional. It provides a GUI for MongoDB. Install the Community Edition.
* For _Object Document Model (ODM)_, we'll use `mongoose` module. This is dependent on `mongodb` and `mongodb-core`. The latter are MongoDB drivers for Node.

Our app will allow users to login and logout. Users need to be authenticated when they login. We'll store user data in the database. Since passwords need to be encrypted before storing them, we'll use `bcrypt` module for this purpose. To manage user sessions, we'll use `express-session`. To store user sessions in MongoDB, we'll use `connect-mongo`. MongoDB stores data as collections. We have two collections: `users` and `sessions`. Typically, DB and its collections

During development, every time we change the code, we need to restart the server. We'll make use of `nodemon` module to watch for changes and automatically restart the server. The `start` script in `app/package.json` is modified for this purpose.

All new modules required in this section can be installed by going to `app/` folder and running `npm install`.

Do the following and later study the code:
* Visit `http://localhost:3000/` and `http://localhost:3000/users`. Explain why the styling is so different. Handlebars uses `layout.hbs` as the default layout file. This can be changed per view (`res.render('view', { layout: 'other' });`) or for the entire app (`app.set('view options', { layout: 'other' });`).
* Visit `http://localhost:3000/login`. Register a new user. At this point, the DB and its collections will be created. When logged in, visit `http://localhost:3000/login`. How does the redirection happen?
* Visit `http://localhost:3000/login/logout` to logout. Visit `http://localhost:3000/login/profile` after logging out.

Code used in this section was adapted from [DDCSLearning/authenticationIntro](https://github.com/DDCSLearning/authenticationIntro). To learn more, read [Sessions in Express.js](http://expressjs-book.com/index.html%3Fp=128.html).

There are many ways to send responses:
* Study the code to understand these response methods: `send()`, `sendFile()`, `render()`, `redirect()`.
* To respond without any data, use `end()`. For example, `res.status(404).end()` or `res.end()`.
* To send JSON response, use `json()`. For example, `res.json({ user: 'alice' })`
* For more information, study the [Express documentation for Response](https://expressjs.com/en/4x/api.html#res).

Since we have created some users in the database, let's display them. In `app/routes/user.js`, import `User` model (`var user = require('../models/user');`) and update user listing code:
```
user.find({}, function (err, docs) {
  res.send(JSON.stringify(docs));
});
```


# 6. Design the Blog (br0.6)

It's time to build our blog app. We want the following features:
* Display list of published articles from most recent to the oldest
* Display list of authors
* An author can login and add/edit/delete/publish own articles
* Each article has a teaser image
* Each article can belong to one or more topics
* Visitors can clap for an article
* Each topic will have an image and a description
* Display published articles by author
* Display published articles by topic
* Each author has a profile page, including an avatar picture
* Visitors can comment on an article

In addition to our User model, our app will require the following models: Article, Topic. These are available in `models/` folder. Module `mongoose-timestamp` will automatically add `createdAt` and `updatedAt` fields to a schema. Why is that we use this for Topic but not for Article?

Our app will require the following views and associated routes:
* Home: combines parts of other views, login and logout
* Article:
    * listing: default, by author (published or unpublished), by tag
    * view
    * edit
* Author Profile:
    * view
    * edit
    * articles: implemented as part of article listing
* 404: to handle missing pages

`express-handlebars`
We've implemented some of these. Try navigating through the app. 
Try sending the response as `res.json(docs)`. Can you explain why the browser (Firefox) displays the response differently? If browser does caching, you will not see any change. You can disable caching by customizing the response header:
`res.append('Cache-Control', 'private, no-cache, no-store, must-revalidate');`
