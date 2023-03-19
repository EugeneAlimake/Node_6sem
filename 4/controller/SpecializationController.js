const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

module.exports = {

    getAllSpecialization: async (req, res) => {
        console.log('get');
        await prisma.Specialization.findMany().then((Specialization) => {
            res.render("Specialization.hbs", {data:Specialization})
            //res.writeHead(200, {"Content-Type": "application/json"});
            //res.end(JSON.stringify(personal_information));
        });
    },
    getAllWithParm: async (req, res) => {
        console.log('hu1');
        await prisma.Specialization.findMany({
            where: {
                Specialization_name: decodeURI(`${req.params.parm1}`)
            }
        }).then((post) => {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(post));
        });
    },
    SpecializationParm: async (req, res) => {
            prisma.Specialization.create({
                data: {
                    Specialization_name: `${req.body.Specialization_name}`,
                }
            }).then(
                (task) => {
                    console.log(task);
                     prisma.Specialization.findMany().then((Specialization) => {
                        res.render("Specialization.hbs", {data:Specialization})

                    });
                    //res.writeHead(200, {'Content-Type': 'application/json'});
                    //res.end(`{"Specialization_name":"${req.body.Specialization_name}"}"`);
                }
            ).catch(err => {
                console.log(err);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в Specialization"}`);
            });

    },
    DeleteSpecialization: async (req, res) => {
        console.log('hus');
        console.log(req.body.Specialization_id);
        prisma.Specialization.delete({where:{Specialization_id :parseInt(req.body.Specialization_id)}}).then(task => {
            console.log(task);
            prisma.Specialization.findMany().then((Specialization) => {
                res.render("Specialization.hbs", {data:Specialization})

            });
            //res.end(`{"Specialization_id":"${decodeURI(`${req.params.parm1}`)}"}`);

        }).catch(err => {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(err));
        });
    },
    PutSpecialization: (req, res) => {
        console.log('hihiih');
            prisma.Specialization.update({
                    where: {Specialization_id:parseInt(`${req.body.Specialization_id}`)},
                    data: {
                        Specialization_name: `${req.body.Specialization_name}`
                    }
                }
            ).then(task => {
                console.log(task);
                if (task) {
                    prisma.Specialization.findMany().then((personal_information) => {
                        res.render("Specialization.hbs", {data:personal_information})

                    });
                    //res.writeHead(200, {'Content-Type': 'application/json'});
                    //res.end(`{"Specialization_name":"${req.body.Specialization_name}"}`);
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