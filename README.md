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

The rest of this document guides you through the project step by step. To try out code at a particular step, checkout the relevant branch. For example, to checkout code of `br0.1` branch, run command `git checkout br0.1`. Branch names are mentioned in section headers.


# 1. Hello World Express App (br0.1)

Let's create a simple app with Express.js. We'll install `express` node module by typing `npm install express`.

Study the code in `app.js`. The request and response objects of Express are built on top of those of Node. Start the Express app by running `node app.js`. Go to your browser and access URL `http://localhost:3000/`

Congrats! You've just built your "Hello World" Express app!


# 2. Generate App Structure (br0.2)

**Express Generator** is an easy way to initialize an Express app since it provides the basic scaffolding. You can install it by running `npm install` since we've already recorded `express-generator` as a dev dependency. To learn more, visit the [Dependency Manager](https://devopedia.org/dependency-manager) article on Devopedia.

**Do not** run this command since app has already been created for you in advance: `express --view=hbs app`. This command creates the basic code for building an Express app. Option `--view=hbs` tells the generator that we'll be using Handlebars templating. Module `hbs` describes itself as "Express view engine wrapper for Handlebars".

We longer need Express Generator and other node modules at the top folder. We can therefore delete folder `node_modules/` and file `package_lock.json`.

To install Express and other modules within the `app/` folder, and start the server, run these commands:
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
* Note that server responds to static files from the folder `public/`. This is setup in `app.js` with the line `app.use(express.static(path.join(__dirname, 'public')));`.

Try the following URLs and see if you can trace the code flow:
* `http://localhost:3000/users`
* `http://localhost:3000/abcd`

Note the frequent use of `app.use()` in the code. Study the documentation of [app.use()](https://expressjs.com/en/4x/api.html#app.use). This is used to add middleware functions in the data flow path. In fact, it's been said, "An Express application is essentially a series of middleware function calls".

Middleware functions have access to request and response objects. It the request-response cycle is not terminated within a middleware function, it must call `next()` so that the next middleware function is called. You can see an example of this in file `app.js`. To know more, read [Using Middleware](http://expressjs.com/en/guide/using-middleware.html).


# 3. MongoDB & User Authentication (br0.3)

We need a database for storing app data. We'll use MongoDB. Install the following:
* [MongoDB Community Server](https://www.mongodb.com/download-center/community) (4.0.4): We'll use MongoDB as the database.
* [MongoDB Compass](https://www.mongodb.com/download-center/compass) (1.15.4): This is optional. It provides a GUI for MongoDB. Install the Community Edition.
* For _Object Document Model (ODM)_, we'll use `mongoose` module. This is dependent on `mongodb` and `mongodb-core`. The latter are MongoDB drivers for Node.

Our app will allow users to login and logout. Users need to be authenticated when they login. We'll store user data in the database. Since passwords need to be encrypted before storing them, we'll use `bcrypt` module for this purpose.

To manage user sessions, we'll use `express-session`. To store user sessions in MongoDB, we'll use `connect-mongo`. All new modules required in this section can be installed by going to `app/` folder and running `npm install`.

Do the following and later study the code:
* Visit `http://localhost:3000/` and `http://localhost:3000/users`. Explain why the styling is so different.
* Visit `http://localhost:3000/login`. Register a new user. When logged in, visit `http://localhost:3000/login`.
* Visit `http://localhost:3000/login/logout` to logout. Visit `http://localhost:3000/login/profile` after logging out.

Code used in this section was adapted from [DDCSLearning/authenticationIntro](https://github.com/DDCSLearning/authenticationIntro). To learn more, read [Sessions in Express.js](http://expressjs-book.com/index.html%3Fp=128.html).

By now you should know when to use these response methods: `send()`, `sendFile()`, `render()`, `redirect()`. For more information, study the [Express documentation for Response](https://expressjs.com/en/4x/api.html#res).
