const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

module.exports = {

    getAllservice_information: async (req, res) => {
        await prisma.service_information.findMany().then((service_information) => {
            res.render("SerInfo.hbs", {data:service_information})
            //res.writeHead(200, {"Content-Type": "application/json"});
            //res.end(JSON.stringify(service_information));
        });
    },
    getAllWithParm: async (req, res) => {
        await prisma.service_information.findMany({
            where: {
                Employee_Patronymic: decodeURI(`${req.params.parm1}`)
            }
        }).then((post) => {
            res.writeHead(200, {"Content-Type": "application/json"});
           res.end(JSON.stringify(post));
        });
    },
    service_informationParm: async (req, res) => {

            prisma.service_information.create({
                data: {
                    Employee_Surname: `${req.body.Employee_Surname}`,
                    Employee_Name: `${req.body.Employee_Name}`,
                    Employee_Patronymic: `${req.body.Employee_Patronymic}`,
                    Post_id: parseInt(`${req.body.Post_id}`),
                    Department_id:parseInt(`${req.body.Department_id}`),
                    Education:`${req.body.Education}`,
                    Specialization_id:parseInt(`${req.body.Specialization_id}`),
                }
            }).then(
                (task) => {
                    console.log(task);
                    prisma.service_information.findMany().then((service_information) => {
                        res.render("SerInfo.hbs", {data:service_information})
                    });
                    //res.writeHead(200, {'Content-Type': 'application/json'});
                   // res.end(`{"Employee_Surname":"${req.body.Employee_Surname}", "Employee_Name":"${req.body.Employee_Name}","Employee_Patronymic":"${req.body.Employee_Patronymic}"`);
                }
            ).catch(err => {
                console.log(err);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в SerInfo"}`);
            });

    },
    Deleteservice_information: async (req, res) => {
        prisma.service_information.delete({where: {Employee_id: parseInt(req.body.Employee_id)}}).then(task => {
            console.log(task);
            prisma.service_information.findMany().then((service_information) => {
                res.render("SerInfo.hbs", {data:service_information})
            });
           // res.end(`{"Employee_id":"${decodeURI(`${req.params.parm1}`)}"}`);

        }).catch(err => {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(err));
        });
    },
    Putservice_information: async (req, res) => {
            prisma.service_information.update({
                    where: {Employee_id:parseInt(`${req.body.Employee_id}`)},
                    data: {
                        Employee_Surname: `${req.body.Employee_Surname}`,
                        Employee_Name: `${req.body.Employee_Name}`,
                        Employee_Patronymic: `${req.body.Employee_Patronymic}`,
                        Post_id: parseInt(`${req.body.Post_id}`),
                        Department_id:parseInt(`${req.body.Department_id}`),
                        Education:`${req.body.Education}`,
                        Specialization_id:parseInt(`${req.body.Specialization_id}`),
                    }
                }
            ).then(task => {
                console.log(task);
                if (task) {
                    prisma.service_information.findMany().then((service_information) => {
                        res.render("SerInfo.hbs", {data:service_information})
                    });
                    //res.writeHead(200, {'Content-Type': 'application/json'});
                   // res.end(`{"Employee_id":"${o.Employee_id}", "Employee_Surname":"${o.Employee_Surname}","Employee_Name":"${o.Employee_Name}"}`);
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(`{"error":2,"message":"Такого кода SerInfo для обновления не существует"}`);
                }
            })
                .catch(err => {
                    console.log(err);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(err));
                });
    },
}