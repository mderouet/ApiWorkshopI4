var mysql   = require("mysql");

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes = function(router,md5) {
    var self = this;
    // board, tableau d'entier a deux dimensions
    var grades = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

    //Gamers parameters
    var joueur1 = {idJoueur:null,nomJoueur:null,tenaille:null}
    var joueur2 = {idJoueur:null,nomJoueur:null,tenaille:null}

    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });

    router.get("/connect/:groupName",function(req,res){
                if(joueur1.idJoueur == null)
                {
                  joueur1.nomJoueur = req.params.groupName
                  joueur1.idJoueur = md5(req.params.groupName)
                  res.status(200).send({idjoueur:md5(req.params.groupName),code:200,nomJoueur:req.params.groupName});
                }
                else if(joueur2.idJoueur == null)
                {
                  joueur2.nomJoueur = req.params.groupName
                  joueur2.idJoueur = md5(req.params.groupName)
                  res.status(200).send({idjoueur:md5(req.params.groupName),code:200,nomJoueur:req.params.groupName});
                }
                else {
                  res.status(401).send({code:401});
                }
    });

    router.get("/play/:x/:y/:idJoueur",function(req,res){
      //Id du joueur ne correspond ni au md5 du joueur1, ni du joueur 2
      if(req.params.idJoueur != joueur1.idJoueur && !req.params.idJoueur != joueur2.idJoueur)
      {
      res.status(401).send({code:401});
      }
      else {
        //Le joueur 1 place un pion
        if(req.params.idJoueur == joueur1.idJoueur)
        {
          grades[req.params.x][req.params.y] = 1
          res.status(200).send({code:200});
        }
        //Le joueur 2 place un pion
        if(req.params.idJoueur == joueur2.idJoueur)
        {
          grades[req.params.x][req.params.y] = 2
          res.status(200).send({code:200});
        }
      }
    });

}

module.exports = REST_ROUTER;
