const PhoneController = require('../controllers/PhoneController')
const express = require("express");

var router = express.Router();

router.get('/', PhoneController.GetAllPhone)
router.get('/add', PhoneController.returnViewAdd)
router.post('/add', PhoneController.addNumber)
router.get('/update/:name/:number', PhoneController.returnViewUpdate),
    router.put('/update', PhoneController.updateNumber),
    router.delete('/delete', PhoneController.deleteNumber)
module.exports = router;