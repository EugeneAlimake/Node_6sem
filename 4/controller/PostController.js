const {PrismaClient} = require('@prisma/client');
const {Json} = require("sequelize/lib/utils");
const prisma = new PrismaClient()

module.exports = {
  
    getAll: async(req, res)=>{
       await prisma.Post.findMany().then((post) => {
           res.render("Post.hbs", {data:post})
           // res.writeHead(200, { "Content-Type": "application/json" });
           //res.end(JSON.stringify(post));
          });
    },
    getAllWithParm: async(req, res)=>{

        console.log("parm");
       let parm=req.params.parm1;
       console.log(parm);
       await prisma.Post.findMany({where: {
            Post_name: parm}}).then((post) => {
          // res.render("Post.hbs", {dataforparm:post})
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(post));
          });
    },
    PostParm: async(req, res)=>{
              prisma.Post.create({
                  data: {
                      Post_name: `${req.body.Post_name}`
                  }
              }).then(
                  (task) => {
                      console.log(task);
                      prisma.Post.findMany().then((post) => {
                          res.render("Post.hbs", {data:post})
                      });
                      //res.writeHead(200, {'Content-Type': 'application/json'});
                      //res.end(`{"Post_name":"${req.body.Post_name}"}`);
                  }
              ).catch(err => {
                  console.log(err);
                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в TEACHER"}`);
              });


       
    },
    DeletePost: async(req, res)=>{
      console.log('hus');
      console.log(req.body.Post_id);
          prisma.Post.delete({where: {Post_id:parseInt(req.body.Post_id)}}).then(task => {
              console.log(task);
                   prisma.Post.findMany().then((post) => {
                      res.render("Post.hbs", {data:post})})
          }).catch(err => {
              res.writeHead(200, {'Content-Type': 'application/json'});
              res.end(JSON.stringify(err));
          });
    },
    PutPost: async(req, res)=>{

            prisma.Post.update({
                    where: {Post_id:parseInt(req.body.Post_id)},
                    data: {
                        Post_name: `${req.body.Post_name}`
                    }
                }
            ).then(task => {
                console.log(task);
                if (task) {
                    prisma.Post.findMany().then((post) => {
                        res.render("Post.hbs", {data:post})})
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