const express = require('express');
const Post = require('../../data/db');

const router = express.Router();

// 🌕   GET /api/posts
router.get('/', async (req, res) => {
	// 1 pull from req
	const { query } = req;
	try {
		// 2 interact with db
		const posts = await Post.find(query);
		// 3a respond happy
		res.status(200).json(posts);
	} catch (err) {
		// 3b respond sad
		console.log(err.message);
		res
			.status(500)
			.json({ error: 'The posts information could not be retrieved.' });
	}
});

// 🌕   GET /api/posts/:id
router.get('/:id', async (req, res) => {
	// 1 pull from req
	const { id } = req.params;
	try {
		// 2 interact with db
		const post = await Post.findById(id);
		// 3a respond happy
		if (post) {
			res.status(200).json(post);
		} else
			res
				.status(404)
				.json({ message: 'The post with the specified ID does not exist.' });
	} catch (err) {
		// 3b respond sad
		console.log(err.message);
		res
			.status(500)
			.json({ error: 'The post information could not be retrieved.' });
	}
});

// 🌕   GET /api/posts/:id/comments
router.get('/:id/comments', async (req, res) => {
	// 1 pull from req
	const { id } = req.params;
	try {
		// 2 interact with db
		const comments = await Post.findPostComments(id);
		// 3a respond happy
		if (comments) res.status(200).json(comments);
		else
			res
				.status(404)
				.json({ message: 'The post with the specified ID does not exist.' });
	} catch (err) {
		// 3b respond sad
		console.log(err.message);
		res
			.status(500)
			.json({ error: 'The comments information could not be retrieved.' });
	}
});

// 🌕   POST /api/posts
router.post('/', async (req, res) => {
	// 1 pull from req
	const { title, contents } = req.body;
	try {
		// 2 interact with db
		await Post.insert(req.body);
		// 3a respond happy
		if (title && contents) res.status(201).json(req.body);
		else
			res.status(400).json({
				errorMessage: 'Please provide title and contents for the post.',
			});
	} catch (err) {
		// 3b respond sad
		console.log(err.message);
		res.status(500).json({
			error: 'There was an error while saving the post to the database',
		});
	}
});

// 🌕   POST /api/posts/:id/comments
router.post('/:id/comments', async (req, res) => {
	// 1 pull from req
	const { id } = req.params;
	const post = await Post.findById(id);
	try {
		// 2 interact with db
		const { text } = req.body;
		// 3a respond happy
		if (!post) {
			res
				.status(404)
				.json({ message: 'The post with the specified ID does not exist.' });
		} else if (!text) {
			res
				.status(400)
				.json({ errorMessage: 'Please provide text for the comment.' });
		} else {
			res.status(201).json(req.body);
		}
	} catch (err) {
		// 3b respond sad
		console.log(err.message);
		res.status({
			error: 'There was an error while saving the comment to the database',
		});
	}
});

// 🌕   DELETE /api/posts/:id
router.delete('/:id', async (req, res) => {
	// 1 pull from req
	const { id } = req.params;
	const post = await Post.findById(id);
	try {
		if (!post)
			res
				.status(404)
				.json({ message: 'The post with the specified ID does not exist.' });
		// 2 interact with db
		// 3a respond happy
		else await Post.remove(id);
	} catch (err) {
		// 3a respond sad
		console.log(err.message);
		res.status();
	}
});

// 🌕   PUT /api/posts/:id
router.put('/:id', async (req, res) => {
	// 1 pull from req
	const { id } = req.params;
	const { title, contents } = req.body;
	const post = await Post.findById(id);
	try {
		if (!post)
			res
				.status(404)
				.json({ message: 'The post with the specified ID does not exist.' });
		else if (!title || !contents) {
			res.status(400).json({
				errorMessage: 'Please provide title and contents for the post.',
			});
		}
		// 2 db
		// 3a happy
	} catch (err) {
		// 3b sad
		console.log(err);
		res
			.status(500)
			.json({ error: 'The post information could not be modified.' });
	}
});

module.exports = router;
