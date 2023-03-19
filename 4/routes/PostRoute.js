const express = require('express');
const postController = require('../controller/PostController.js');


    var router=express.Router();
    router.get('/Post', postController.getAll);
    router.get('/Post/:parm1', postController.getAllWithParm);
    router.post('/PostPost', postController.PostParm);
    router.delete('/PostDel',postController.DeletePost);
    router.put('/Posts', postController.PutPost);
module.exports = router;