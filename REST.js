var mysql   = require("mysql");

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes = function(router,md5) {
    var self = this;
    // board
    var board = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
    var partie = {lap:getRandomInt(1,2),status:null, lastCoup:{x:null,y:null},endOfGame:false, prolongation:false }
    var time=0;


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
                else
                {
                  res.status(401).send({code:401});
                }
    });

    router.get("/play/:x/:y/:idJoueur",function(req,res){
      //Id du joueur ne correspond ni au md5 du joueur1, ni du joueur 2
        console.log(req.params.idJoueur+" : "+joueur2.idJoueur);
      if(req.params.idJoueur != joueur1.idJoueur && req.params.idJoueur != joueur2.idJoueur)
      {
      res.status(401).send({code:401});
      }
      else {
          //Les coordonnées sont acceptables
          if (isPositionInBound(req.params.x, req.params.y)) {
              //Le joueur 1 place un pion
              if (req.params.idJoueur == joueur1.idJoueur) {
                  board[req.params.x][req.params.y] = 1
                  res.status(200).send({code: 200});
              }
              //Le joueur 2 place un pion
              if (req.params.idJoueur == joueur2.idJoueur) {
                  board[req.params.x][req.params.y] = 2
                  res.status(200).send({code: 200});
              }
          }
          //Les coordonnées ne sont pas acceptables
          else {
              res.status(406).send({code: 406});
          }
      }
      });
        router.get("/turn/:idJoueur", function(req,res){

            res.status(200).send({status:0,tableau:board,nbTenaillesJ1:joueur1.tenaille,nbTenaillesJ2:joueur2.tenaille,dernierCoupX:partie.lastCoup.x,dernierCoupY:partie.lastCoup.y,prolongation:partie.prolongation,finPartie:partie.endOfGame,detailFinPartie:"",numTour:partie.lap,code:200});
        });
    
    // Les valeurs [x,y] sont dans la board et la position est disponible
    function isPositionInBound(coordX,coordY)
    {
      return((coordX >= 0 && coordX <= 18) && (coordY >=0 && coordY <= 18) && (board[coordX][coordY] == 0))
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = REST_ROUTER;
