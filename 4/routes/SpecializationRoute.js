const express = require('express');
const specializationController = require('../controller/SpecializationController.js');
const router = express.Router();

console.log('Specialization');
router.get('/specialization', specializationController.getAllSpecialization);
router.get('/specialization/:parm1', specializationController.getAllWithParm);
router.post('/specialization', specializationController.SpecializationParm);
router.delete('/specialization', specializationController.DeleteSpecialization);
router.put('/specialization', specializationController.PutSpecialization);

module.exports = router;