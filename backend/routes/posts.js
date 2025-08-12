// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/upload'); 

router.get('/', postController.getAllPosts);

router.get('/:id', postController.getPostById);


router.post('/', upload.array('images', 10), postController.createPost);


router.put('/:id', upload.array('images', 10), postController.updatePost);

router.delete('/:id', postController.deletePost);

module.exports = router;