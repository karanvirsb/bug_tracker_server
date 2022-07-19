# Bugasaur

A web app for tracking bugs of a company. Allows users to create groups, create projects and add members. Along with having tickets per project to track the issues or features.

## Run Locally

### Clone the project
Also Clone the front end [here](https://github.com/karanvirsb/bug_tracker_client). <br/>

Also be sure to have MongoDb can be downloaded [here]() or create an account on MongoDb Atlas [here]().

```bash
  git clone https://github.com/karanvirsb/bug_tracker_server.git
```

Go to the project directory

```bash
  cd bug_tracker_server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node server.ts 
```
OR 

```bash
  nodemon server.ts
```

The server will start on default http://localhost:8000

## Tech Stack
**Front-End:** React, Redux Toolkit, Vite, TailwindCSS, TypeScript, Socket.io <br />
**Back-End:** Express, Mongo DB, Node JS, Socket.io, Typescript, Jest

## Features
1. Uses the MVC Model.
2. Uses Jest to test out routes.
3. Uses sockets to allow real time data.
4. Has Authentication, Authorization, Roles based handlers.
