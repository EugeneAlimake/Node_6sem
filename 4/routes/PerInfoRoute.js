const express = require('express');
const PerInfoController = require('../controller/PerInfoController.js');

    var router=express.Router();
    console.log('hu');
    router.get('/PerInfo', PerInfoController.getAllpersonal_information);
    router.get('/PerInfo/:parm1', PerInfoController.getAllWithParm);
    router.post('/PerInfoPost', PerInfoController.personal_informationParm);
    router.delete('/PerInfoDel', PerInfoController.Deletepersonal_information);
    router.put('/PerInfo', PerInfoController.Putpersonal_information);
    module.exports =router;