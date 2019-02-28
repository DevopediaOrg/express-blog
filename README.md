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

Let's create a simple app with Express.js. We'll install `express` node module by typing `npm install express`.

Study the code in `app.js`. The request and response objects of Express are built on top of those of Node. Start the Express app by running `node app.js`. Go to your browser and access URL `http://localhost:3000/`

Congrats! You've just built your "Hello World" Express app!
