const fs = require("fs");

module.exports = {
    GetAllPhone: async (req, res) => {
        fs.readFile("./phonebook.json", (e, data) => {
            if (e) console.log(e);
            else {
                let os = JSON.parse(data);
                res.render("phonebook", {
                    numbers: os
                })
            }
        })
    },

    returnViewAdd: async (req, res) => {
        fs.readFile("./phonebook.json", (e, data) => {
            if (e) console.log(e);
            else {
                let os = JSON.parse(data);
                res.render("Add", {

                    numbers: os,
                });
            }
        })
    },

    returnViewUpdate: async (req, res) => {
        fs.readFile("./phonebook.json", (e, data) => {
            if (e) console.log(e);
            else {
                let os = JSON.parse(data);
                res.render("Update", {
                    layout: false,
                    numbers: os,
                    oldname: req.params.name,
                    oldnumber: req.params.number,
                    name: req.params.name,
                    number: req.params.number,
                })
            }
        });
    },

    addNumber(req, res) {
        let name = req.body.name;
        let number = req.body.number;
        let phoneno = /^\+?([0-9]{3})\)? ([0-9]{2}) ([0-9]{7})$/;
        if ((name.length == 0) || (number.length == 0) || (!number.match(phoneno))) {
            console.log("Data legth must be more than 0");
            return false;
        } else {
            let phoneBook = new Array();
            fs.readFile("./phonebook.json", async (e, data) => {
                if (e) console.log(e);
                else {
                    phoneBook = JSON.parse(data);
                    console.log(`add:${name}`)
                    const chckedNumber = phoneBook.find((obj) => obj.number == number)
                    console.log(chckedNumber);
                    if(!chckedNumber){
                    phoneBook.push(req.body);
                    fs.writeFile( `./phoneBook.json`, JSON.stringify(phoneBook, null, '  '),err=>{
                        if (err) {
                            throw err;
                        }
                    });}
                    res.redirect("/");
                    return;
                }
            })
        }
    },

    updateNumber(req, res) {

        console.log(req.body);
        let name = req.body.name;
        let number = req.body.number;
        let oldname = req.body.oldname;
        let oldnumber = req.body.oldnumber;

        let phoneno = /^\+?([0-9]{3})\)? ([0-9]{2}) ([0-9]{7})$/;
        if ((name.length == 0) || (number.length == 0) || (!number.match(phoneno))) {
            console.log("Data legth must be more than 0");
            fs.readFile("./phonebook.json", (e, data) => {
                if (e) console.log(e);
                else {
                    let os = JSON.parse(data);
                    res.render("Update", {
                        layout: false,
                        numbers: os,
                        oldnumber: req.body.oldnumber,
                        oldname: req.body.oldname,
                        name: req.body.name,
                        number: req.body.number,
                    })
                }
            });
        } else {
            fs.readFile("./phonebook.json", async (e, data) => {
                if (e) console.log(e);
                else {
                    let os = JSON.parse(data);

                    const chckedNumber = os.find((obj) => obj.number == number)
                    console.log(chckedNumber);
                    if(chckedNumber.name==oldname) {
                        const index = os.findIndex(
                            (obj) => obj.name == oldname
                        );

                        os[index] = {
                            name: `${name}`,
                            number: `${number}`,
                        }
                        console.log(`add:${req.body.name}`)
                        fs.writeFile(`./phoneBook.json`, JSON.stringify(os, null, '  '), err => {
                            if (err) {
                                throw err;
                            }
                        });
                    }
                    res.redirect("/");
                    return;
                }
            })
        }

    },

    deleteNumber(req, res) {
        console.log("delete");
        let oldname = req.body.oldname;
        let oldnumber = req.body.oldnumber;
        fs.readFile("./phonebook.json", (e, data) => {
            if (e) console.log(e);
            else {
                let os = JSON.parse(data);
                const index = os.findIndex(
                    (obj) => obj.name == oldname
                );

                if (os.splice(index, 1)) {
                    fs.writeFileSync("./phonebook.json", JSON.stringify(os));
                    res.redirect("/");
                    return;
                }
                res.sendStatus(400);
            }
        })
    }
};