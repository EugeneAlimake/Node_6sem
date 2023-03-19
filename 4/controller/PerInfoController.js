const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

module.exports = {

    getAllpersonal_information: async (req, res) => {
        console.log('hu1');
        await prisma.personal_information.findMany().then((personal_information) => {
            res.render("PerInfo.hbs", {data:personal_information})
            //res.writeHead(200, {"Content-Type": "application/json"});
            //res.end(JSON.stringify(personal_information));
            //2002-12-23T00:00:00.000Z
        });
    },
    getAllWithParm: async (req, res) => {
        console.log('hu1');
        await prisma.personal_information.findMany({
            where: {
                marital_status: decodeURI(`${req.params.parm1}`)
            }
        }).then((post) => {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(post));
        });
    },
    personal_informationParm: async (req, res) => {
            prisma.personal_information.create({
                data: {
                    Employee_id:parseInt(`${req.body.Employee_id}`),
                    birthdate: `${req.body.birthdate}`,
                    Passport_identification_number: `${req.body.Passport_identification_number}`,
                    Registration_address: `${req.body.Registration_address}`,
                    marital_status: `${req.body.marital_status}`,
                }
            }).then(
                (task) => {
                    console.log(task);
                    prisma.personal_information.findMany().then((personal_information) => {
                        res.render("PerInfo.hbs", {data:personal_information})
                        //2002-12-23T00:00:00.000Z
                    });
                   // res.writeHead(200, {'Content-Type': 'application/json'});
                   // res.end(`{"Employee_id":"${req.body.Employee_id}", "birthdate":"${req.body.birthdate}","Passport_identification_number":"${req.body.Passport_identification_number}"`);
                }
            ).catch(err => {
                console.log(err);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в personal_information"}`);
            });


    },
    Deletepersonal_information: async (req, res) => {
        console.log('hus');
        let o = parseInt(req.body.Employee_id);
        prisma.personal_information.delete({where: {Employee_id: parseInt(req.body.Employee_id)}}).then(task => {
            console.log(task);
            prisma.personal_information.findMany().then((personal_information) => {
                res.render("PerInfo.hbs", {data:personal_information})
                //2002-12-23T00:00:00.000Z
            });
            //res.end(`{"Employee_id":"${decodeURI(`${req.params.parm1}`)}"}`);

        }).catch(err => {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(err));
        });
    },
    Putpersonal_information: async (req, res) => {
            prisma.personal_information.update({
                    where: {Employee_id:parseInt(`${req.body.Employee_id}`)},
                    data: {
                        birthdate: `${req.body.birthdate}`,
                        Passport_identification_number: `${req.body.Passport_identification_number}`,
                        Registration_address: `${req.body.Registration_address}`,
                        marital_status: `${req.body.marital_status}`
                    }
                }
            ).then(task => {
                console.log(task);
                if (task) {
                    prisma.personal_information.findMany().then((personal_information) => {
                        res.render("PerInfo.hbs", {data:personal_information})
                        //2002-12-23T00:00:00.000Z
                    });
                    //res.writeHead(200, {'Content-Type': 'application/json'});
                   // res.end(`{"Employee_id":"${req.body.Employee_id}", "birthdate":"${.birthdate}","Passport_identification_number":"${o.Passport_identification_number}"}`);
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(`{"error":2,"message":"Такого кода PerInfo для обновления не существует"}`);
                }
            })
                .catch(err => {
                    console.log(err);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(err));
                });
    },
}