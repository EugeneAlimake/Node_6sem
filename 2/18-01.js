const Sequelize = require('sequelize');
var randomstring = require("randomstring");
const Model = Sequelize.Model;
const sequelize = new Sequelize('node_14', 'sa', '12345', {host: '127.0.0.1', dialect: 'mssql'});

const http = require('http');
const url = require('url');
const fs = require('fs');


const {Faculty, Pulpit, Teacher, Subject, Auditorium_type, Auditorium} = require('./18-01-model').ORM(sequelize);
Auditorium.addScope('count', {
    where: {
        auditorium_capacity: {
            [Sequelize.Op.between]: [10, 90]
        }
    }

})//используются для того, чтобы помочь вам повторно использовать код
Faculty.addHook('beforeCreate', () => {
    console.log('----beforecreate---')
})//функции, которые вызываются до и после выполнения вызовов в sequelize
Faculty.addHook('afterCreate', () => {
    console.log('----aftercreate---')
})
let http_handler = async (req, res) => {
    if (req.method == 'GET') {
        if (url.parse(req.url).pathname === '/') {

            let html = fs.readFileSync('./18.html');
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(html);
        } else if (url.parse(req.url).pathname === '/api/faculties') {
            Faculty.findAll().then(faculties => {

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(faculties));
            });
        } else if (url.parse(req.url).pathname === '/api/teachers') {
            Teacher.findAll().then(teachers => {
                console.log('he');
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(teachers));
            });
        } else if (url.parse(req.url).pathname === '/api/pulpits') {
            Pulpit.findAll().then(pulpits => {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(pulpits));
            });
        } else if (url.parse(req.url).pathname === '/api/subjects') {
            Subject.findAll().then(subjects => {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(subjects));
            });
        } else if (url.parse(req.url).pathname === '/api/auditoriumstypes') {
            console.log('hiiii');
            Auditorium_type.findAll().then(auditorium_types => {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(auditorium_types));
            });
        } else if (url.parse(req.url).pathname === '/api/auditoriums') {
            Auditorium.scope('count').findAll().then(auditoriums => {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(auditoriums));
            });
        } else if ((url.parse(req.url).pathname.startsWith('/api/auditoriumtypes/')) && (decodeURI(url.parse(req.url).pathname.split('/')[4]) === 'auditoriums')) {
            let auditorium_type = decodeURI(url.parse(req.url).pathname.split('/')[3]);
            const pse = randomstring.generate();
            res.writeHead(200, {'Content-Type': 'application/json'});
            console.log(auditorium_type);
            Auditorium_type.hasMany(Auditorium, {
                as: `${pse}`,
                foreignKey: 'auditorium_type',
                sourceKey: 'auditorium_type'
            });
            Auditorium_type.findAll({
                include: [
                    {model: Auditorium, as: `${pse}`, required: true, where: {auditorium_type: auditorium_type}}
                ]
            }).then(auditorium_type => {
                auditorium_type.forEach(audit => {
                    console.log(audit.dataValues.auditorium_type, audit.dataValues.auditorium_typename);
                    audit.dataValues[pse].forEach(au => {
                        console.log('--', au.dataValues.auditorium, au.dataValues.auditorium_name, au.dataValues.auditorium_type);
                        res.write(JSON.stringify(au));
                    })
                    res.end();
                })
            })

        } else if ((url.parse(req.url).pathname.startsWith('/api/faculties/')) && (decodeURI(url.parse(req.url).pathname.split('/')[4]) === 'subjects')) {
            const pse = randomstring.generate();
            let faculty = decodeURI(url.parse(req.url).pathname.split('/')[3]);
            console.log(faculty);
            Faculty.hasMany(Pulpit, {as: `${pse}`, foreignKey: 'faculty', sourceKey: 'faculty'});//отношения один-ко-многим, внешний ключ определяется в целевой модели
            Faculty.findAll({
                include: [
                    {model: Pulpit, as: `${pse}`, required: true, where: {faculty: faculty}}
                ]
            }).then(faculties => {
                faculties.forEach(faculty => {
                        console.log(faculty.dataValues.faculty, faculty.dataValues.faculty_name);
                        faculty.dataValues[pse].forEach(pulpit => {
                            console.log('--', pulpit.dataValues.pulpit, pulpit.dataValues.pulpit_name);
                            Subject.findAll({where: {pulpit: pulpit.dataValues.pulpit}}).then(subjects => {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(JSON.stringify(subjects));
                            })
                        })
                    }
                )
            })
        }
    } else if (req.method == 'POST') {
        if (url.parse(req.url).pathname === '/api/faculties') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let o = JSON.parse(body);

                Faculty.create({faculty: o.faculty, faculty_name: o.faculty_name}).then(
                    (task) => {
                        console.log(task);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(`{"Faculty":"${o.faculty}","Faculty_name":"${o.faculty_name}"}`);
                    }
                ).catch(err => {
                    console.log(err);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в факультет"}`);
                });
            });
        } else if (url.parse(req.url).pathname === '/api/teachers') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let o = JSON.parse(body);
                Teacher.create({teacher: o.teacher, teacher_name: o.teacher_name, pulpit: o.pulpit}).then
                (task => {
                    console.log(task);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(`{"Teacher":"${o.teacher}","teacher_name":"${o.teacher_name}","Pulpit:"${o.pulpit}"}`);
                })
                    .catch(err => {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в кафедру"}`);
                        console.log(err);
                    })
            });
        } else if (url.parse(req.url).pathname === '/api/pulpits') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let o = JSON.parse(body);
                Pulpit.create({pulpit: o.pulpit, pulpit_name: o.pulpit_name, faculty: o.faculty}).then
                (task => {
                    console.log(task);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(`{"Pulpit":"${o.pulpit}","Pulpit_name":"${o.pulpit_name}","Faculty":"${o.faculty}"}`);
                })
                    .catch(err => {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в кафедру"}`);
                        console.log(err);
                    })
            });
        } else if (url.parse(req.url).pathname === '/api/subjects') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                let o = JSON.parse(body);
                Subject.create({subject: o.subject, subject_name: o.subject_name, pulpit: o.pulpit}).then
                (task => {
                    console.log(task);
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(`{"Subject":"${o.subject}","Subject_name":"${o.subject_name}","Pulpit":"${o.pulpit}"}`);
                })
                    .catch(err => {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в предмет"}`);
                        console.log(err);
                    })
            });
        } else if (url.parse(req.url).pathname === '/api/auditoriumstypes') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let o = JSON.parse(body);
                Auditorium_type.create({auditorium_type: o.auditorium_type, auditorium_typename: o.auditorium_typename})
                    .then(task => {
                        console.log(task);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(`{"Audtiorium_type":"${o.auditorium_type}","Auditorium_typename":"${o.auditorium_typename}"}`);
                    })
                    .catch(err => {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в тип аудитории"}`);
                        console.log(err);
                    })
            });
        } else if (url.parse(req.url).pathname === '/api/auditoriums') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let o = JSON.parse(body);
                Auditorium.create({
                    auditorium: o.auditorium, auditorium_name: o.auditorium_name,
                    auditorium_capacity: o.auditorium_capacity, auditorium_type: o.auditorium_type
                }).then(task => {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(`{"Auditorium":"${o.auditorium}","Auditorium_name":"${o.auditorium_name}","Auditorium_capacity":${o.auditorium_capacity}, "Auditorium_type":${o.auditorium_type}}`);
                    console.log(task);
                }).catch(err => {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в аудиторию"}`);
                    console.log(err);
                })

            });
        } else if (url.parse(req.url).pathname === '/api/transact') {


            const result = await sequelize.transaction().then(async t => {
                // Auditorium.findAll().then( async(auditoriums) => {
                    // auditoriums.forEach(async(auditorium) => {
                       await Auditorium.update(
                            {
                                auditorium_capacity: 1
                            },
                            {
                                where: {},
                                transaction: t
                            }
                        )
                    // })
                    // let audit = await Auditorium.findAll({}, {transaction: t});
                    // console.log(audit);

                // })



                setTimeout(async () => {
                    await t.rollback();
                }, 20000)
            })
            res.end();

        }
    } else if (req.method == 'PUT') {
        if (url.parse(req.url).pathname === '/api/faculties') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let o = JSON.parse(body);
                Faculty.update(
                    {faculty_name: o.faculty_name},
                    {where: {faculty: o.faculty}}
                ).then(task => {
                    console.log(task);
                    if (task > 0) {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(`{"Faculty":"${o.faculty}","Faculty_name":"${o.faculty_name}"}`);
                    } else {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(`{"error":2,"message":"Такого кода факультета для обновления не существует"}`);
                    }
                })
                    .catch(err => {
                        console.log(err);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(err));
                    });
            });
        } else if (url.parse(req.url).pathname === '/api/pulpits') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let o = JSON.parse(body);
                Pulpit.update(
                    {
                        pulpit_name: o.pulpit_name,
                        faculty: o.faculty
                    },
                    {where: {pulpit: o.pulpit}}
                ).then(task => {
                    console.log(task);
                    if (task > 0) {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(`{"Pulpit":"${o.pulpit}","Pulpit_name":"${o.pulpit_name}","Faculty":"${o.faculty}"}`);
                    } else {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(`{"error":2,"message":"Такого кода кафедры для обновления не существует"}`);
                    }
                })
                    .catch(err => {
                        console.log(err);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(err));
                    })
            });
        } else if (url.parse(req.url).pathname === '/api/subjects') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let o = JSON.parse(body);
                Subject.update(
                    {
                        subject_name: o.subject_name,
                        pulpit: o.pulpit
                    },
                    {where: {subject: o.subject}}
                )
                    .then(task => {
                        console.log(task);
                        if (task > 0) {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(`{"Subject":"${o.subject}","Subject_name":"${o.subject_name}","Pulpit":"${o.pulpit}"}`);
                        } else {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(`{"error":2,"message":"Такого предмета для обновления не существует"}`);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(err));
                    });
            });
        } else if (url.parse(req.url).pathname === '/api/teachers') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let o = JSON.parse(body);
                Teacher.update(
                    {
                        teacher_name: o.teacher_name,
                        pulpit: o.pulpit
                    },
                    {where: {teacher: o.teacher}}
                )
                    .then(task => {
                        console.log(task);
                        if (task > 0) {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(`{"Teacher":"${o.teacher}","Teacher_name":"${o.teacher_name}","Pulpit":"${o.pulpit}"}`);
                        } else {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(`{"error":2,"message":"Такого преподавателя для обновления не существует"}`);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(err));
                    });
            });
        } else if (url.parse(req.url).pathname === '/api/auditoriumstypes') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let o = JSON.parse(body);
                Auditorium_type.update(
                    {auditorium_typename: o.auditorium_typename},
                    {where: {auditorium_type: o.auditorium_type}}
                )
                    .then(task => {
                        console.log(task);
                        if (task > 0) {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(`{"Audtiorium_type":"${o.auditorium_type}","Auditorium_typename":"${o.auditorium_typename}"}`);
                        } else {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(`{"error":2,"message":"Такого типа аудитории для обновления не существует"}`);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(err));
                    });
            });
        } else if (url.parse(req.url).pathname === '/api/auditoriums') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let o = JSON.parse(body);
                Auditorium.update(
                    {
                        auditorium_name: o.auditorium_name,
                        auditorium_capacity: o.auditorium_capacity,
                        auditorium_type: o.auditorium_type
                    },
                    {where: {auditorium: o.auditorium}}
                )
                    .then(task => {
                        console.log(task);
                        if (task > 0) {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(`{"Auditorium":"${o.auditorium}","Auditorium_name":"${o.auditorium_name}","Auditorium_capacity":${o.auditorium_capacity}, "Auditorium_type":${o.auditorium_type}}`);
                        } else {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(`{"error":2,"message":"Такой аудитории для обновления не существует"}`);
                        }
                    })
                    .catch(err => {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(err));
                        console.log(err);
                    });
            });
        }
    } else if (req.method == 'DELETE') {
        console.log(url.parse(req.url).pathname);
        if (url.parse(req.url).pathname.search('\/api\/faculties\/[%-я]+') != (-1)) {
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let o = r[3];
            sequelize.query("SELECT FACULTY,FACULTY_NAME FROM FACULTY where FACULTY='" + o + "'")
                .then(result => {
                    Faculty.destroy({where: {faculty: o}}).then(task => {
                        console.log(task);
                        if (task > 0) {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(`{"Faculty":"${result[0][0].FACULTY}","Faculty_name":"${result[0][0].FACULTY_NAME}"}`);
                        } else {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(`{"error":"1","messsage":"Такого факультета для удаления не существует"}`);
                        }
                    })
                        .catch(err => {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(err));
                        });
                });
        } else if (url.parse(req.url).pathname.search('\/api\/pulpits\/[%-я]+') != (-1)) {
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let o = r[3];
            sequelize.query("SELECT PULPIT,PULPIT_NAME,FACULTY FROM PULPIT where PULPIT='" + o + "'")
                .then(result => {
                    Pulpit.destroy({where: {pulpit: o}})
                        .then(task => {
                            console.log(task);
                            if (task > 0) {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(`{"Pulpit":"${result[0][0].PULPIT}","Pulpit_name":"${result[0][0].PULPIT_NAME}","Faculty":"${result[0][0].FACULTY}"}`);
                            } else {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(`{"error":"1","messsage":"Такого кода кафедры для удаления не существует"}`);
                            }
                        })
                        .catch(err => {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(err));
                        });
                });
        } else if (url.parse(req.url).pathname.search('\/api\/teachers\/[%-я]+') != (-1)) {
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let o = r[3];
            sequelize.query("SELECT TEACHER,TEACHER_NAME,PULPIT FROM TEACHER where TEACHER='" + o + "'")
                .then(result => {
                    Teacher.destroy({where: {teacher: o}})
                        .then(task => {
                            console.log(task);
                            if (task > 0) {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(`{"Pulpit":"${result[0][0].TEACHER}","Pulpit_name":"${result[0][0].TEACHER_NAME}","Faculty":"${result[0][0].PULPIT}"}`);
                            } else {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(`{"error":"1","messsage":"Такого препода нет для удаления не существует"}`);
                            }
                        })
                        .catch(err => {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(err));
                        });
                });
        } else if (url.parse(req.url).pathname.search('\/api\/subjects\/[%-я]+') != (-1)) {
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let o = r[3];
            sequelize.query("SELECT SUBJECT,SUBJECT_NAME,PULPIT FROM SUBJECT where SUBJECT='" + o + "'")
                .then(result => {
                    Subject.destroy({where: {subject: o}})
                        .then(task => {
                            if (task > 0) {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(`{"Subject":"${result[0][0].SUBJECT}","Subject_name":"${result[0][0].SUBJECT_NAME}","Pulpit":"${result[0][0].PULPIT}"}`);
                            } else {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(`{"error":"1","messsage":"Такого предмета для удаления не существует"}`);
                            }
                        })
                        .catch(err => {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(err));
                        });
                });
        } else if (url.parse(req.url).pathname.search('\/api\/auditoriumstypes\/[%-я]+') != (-1)) {
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let o = r[3];
            sequelize.query("SELECT AUDITORIUM_TYPE,AUDITORIUM_TYPENAME FROM AUDITORIUM_TYPE where AUDITORIUM_TYPE='" + o + "'")
                .then(result => {
                    Auditorium_type.destroy({where: {auditorium_type: o}})
                        .then(task => {
                            if (task > 0) {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(`{"Audtiorium_type":"${result[0][0].AUDITORIUM_TYPE}","Auditorium_typename":"${result[0][0].AUDITORIUM_TYPENAME}"}`);
                            } else {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(`{"error":1,"message":"Такого типа аудитории для удаления не существует"}`);
                            }
                        })
                        .catch(err => {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(err));
                        });
                });
        } else if (url.parse(req.url).pathname.search('\/api\/auditoriums\/[%-я]+') != (-1)) {
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let o = r[3];
            sequelize.query("SELECT AUDITORIUM,AUDITORIUM_NAME,AUDITORIUM_CAPACITY,AUDITORIUM_TYPE FROM AUDITORIUM where AUDITORIUM='" + o + "'")
                .then(result => {
                    Auditorium.destroy({where: {auditorium: o}})
                        .then(task => {
                            console.log(task);
                            if (task > 0) {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(`{"Auditorium":"${result[0][0].AUDITORIUM}","Auditorium_name":"${result[0][0].AUDITORIUM_NAME}","Auditorium_capacity":${result[0][0].AUDITORIUM_CAPACITY}, "Auditorium_type":${result[0][0].AUDITORIUM_TYPE}}`);
                            } else {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(`{"error":1,"message":"Такой аудитории для удаления не существует"}`);
                            }
                        })
                        .catch(err => {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(err));
                        });
                });
        }
    }
}
var server = http.createServer(function (req, res) {
    try {
        sequelize.authenticate().   //проверка соединения
            then(() => {
                http_handler(req, res);
            }).catch(err => {
            console.log('Ошибка при соединении с базой данных ', err);
        });
    } catch (e) {
        console.error(e);
    }

}).listen(5000);
