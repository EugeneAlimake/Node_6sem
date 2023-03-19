const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

module.exports = {

    getAllDepartment: async (req, res) => {
        console.log('hu1');
        await prisma.Department.findMany().then((Department) => {
            res.render("Department.hbs", {data:Department})
            //res.writeHead(200, {"Content-Type": "application/json"});
            //res.end(JSON.stringify(Department));
        });
    },
    getAllWithParm: async (req, res) => {
        console.log('hu1');
        await prisma.Department.findMany({
            where: {
                Department_name: decodeURI(`${req.params.parm1}`)
            }
        }).then((post) => {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(post));
        });
    },
    DepartmentParm: async (req, res) => {
        console.log('hu1');

            prisma.Department.create({
                data: {
                    Department_name: `${req.body.Department_name}`,
                    Department_chief: `${req.body.Department_chief}`,
                    telephone: `${req.body.telephone}`
                }
            }).then(
                (task) => {
                    console.log(task);
                    prisma.Department.findMany().then((Department) => {
                        res.render("Department.hbs", {data:Department})
                    });
                    //res.writeHead(200, {'Content-Type': 'application/json'});
                    //res.end(`{"Department_name":"${req.body.Department_name}", "Department_chief":"${req.body.Department_chief}","telephone":"${req.body.telephone}"`);
                }
            ).catch(err => {
                console.log(err);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в Department"}`);
            });



    },
    DeleteDepartment: async (req, res) => {
        console.log('hus');
        console.log(req.body.Department_id);
        prisma.Department.delete({where: {Department_id: parseInt(req.body.Department_id)}}).then(task => {
            console.log(task);
            prisma.Department.findMany().then((Department) => {
                res.render("Department.hbs", {data:Department})
            });
            //res.end(`{"Department_id":"${decodeURI(`${req.params.parm1}`)}"}`);

        }).catch(err => {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(err));
        });
    },
    PutDepartment: async (req, res) => {
           // let o = JSON.parse(body);
            prisma.Department.update({
                    where: {Department_id: parseInt(req.body.Department_id)},
                    data: {
                        Department_name: `${req.body.Department_name}`,
                        Department_chief: `${req.body.Department_chief}`,
                        telephone: `${req.body.telephone}`
                    }
                }
            ).then(task => {
                console.log(task);
                if (task) {
                    prisma.Department.findMany().then((Department) => {
                        res.render("Department.hbs", {data:Department})
                    });
                  //  res.writeHead(200, {'Content-Type': 'application/json'});
                   // res.end(`{"Department_id":"${o.Department_id}","Department_name":"${o.Department_name}"}`);
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(`{"error":2,"message":"Такого кода пост для обновления не существует"}`);
                }
            })
                .catch(err => {
                    console.log(err);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(err));
                });
    },
}