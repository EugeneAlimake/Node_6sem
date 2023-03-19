const PhoneController = require('../controllers/PhoneController')

module.exports = app => {
    app.get('/', PhoneController.GetAllPhone)
    app.get('/add', PhoneController.returnViewAdd)
    app.post('/add', PhoneController.addNumber)
    app.get('/update/:name/:number', PhoneController.returnViewUpdate),
    app.put('/update', PhoneController.updateNumber),
        app.delete('/delete', PhoneController.deleteNumber)
}