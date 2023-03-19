const express = require('express');
const serinfoController = require('../controller/SerInfoController.js');


    var router=express.Router();
    console.log('hu');
    router.get('/', serinfoController.getAllservice_information);
    router.get('/:parm1', serinfoController.getAllWithParm);
    router.post('/', serinfoController.service_informationParm);
    router.delete('/', serinfoController.Deleteservice_information);
    router.put('/',serinfoController.Putservice_information);
    module.exports = router;