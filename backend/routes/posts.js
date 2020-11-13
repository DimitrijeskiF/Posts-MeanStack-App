const express = require('express');
const router = express.Router();
const authCheck = require('../middleware/check-auth');
const extractFile = require('../middleware/file')

const postController = require('../controllers/posts');


router.post('', authCheck, extractFile, postController.createPost )

router.put(
  "/:id",
  authCheck,
  extractFile
  ,
  postController.updatePost
);

router.get("", postController.getPosts);

router.get('/:id', postController.getPost)

router.delete('/:id',authCheck, postController.deletePost)


module.exports = router;


