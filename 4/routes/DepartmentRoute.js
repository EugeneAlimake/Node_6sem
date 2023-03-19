const express = require('express');
const departmentController = require('../controller/DepartmentController.js');


    var router=express.Router();
    console.log('hu');
    router.get('/Department', departmentController.getAllDepartment);
    router.get('/Department/:parm1', departmentController.getAllWithParm);
    router.post('/DepartmentPost', departmentController.DepartmentParm);
    router.delete('/DepartmentDel', departmentController.DeleteDepartment);
    router.put('/Department', departmentController.PutDepartment);
     module.exports = router;
