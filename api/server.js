const express = require('express');
const server = express();

// routers
const postsRouter = require('./posts/posts-router');

// could need cors here

server.use(express.json());

server.use('/api/posts', postsRouter);

// base url endpoint
server.get('/', (req, res) => {
	res.send(`<p>U4M2 posts api</p>`);
});

module.exports = server;
