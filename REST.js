var mysql   = require("mysql");

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes = function(router,md5) {
    var self = this;
    var board=[[0,0]]
    var joueur1 = {idJoueur:null,nomJoueur:null,tenaille:0}
    var joueur2 = {idJoueur:null,nomJoueur:null,tenaille:0}
    var partie = {lap:0, lastCoup:{x:null,y:null},endOfGame:false, prolongation:false }


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
      if(req.params.idJoueur == joueur1.idJoueur && !req.params.idJoueur == joueur2.idJoueur)
      {
      res.status(401).send({code:401});
      }
      else {
        res.status(200).send({code:200});
      }
    });

    router.get("/turn/:idJoueur", function(req,res){
        res.status(200).send({status:0,tableau:board,nbTenaillesJ1:joueur1.tenaille,nbTenaillesJ2:joueur2.tenaille,dernierCoupX:partie.lastCoup.x,dernierCoupY:partie.lastCoup.y,prolongation:partie.prolongation,finPartie:partie.endOfGame,detailFinPartie:"",numTour:partie.lap,code:200});
    });

    router.post("/localisation",function(req,res){
        var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
        var table = ["localisation","commune","code_postal","departement","insee",req.body.commune,req.body.code_postal,req.body.departement,req.body.insee];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Localisation Added !"});
            }
        });
    });


    router.put("/localisation",function(req,res){
        var query = "UPDATE localisation SET commune = ?,code_postal = ?,departement = ?,insee = ? WHERE id = ?";
        var table = [req.body.commune,req.body.code_postal,req.body.departement,req.body.insee,req.body.id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Updated localisation "+req.body.id});
            }
        });
    });


    router.delete("/localisation/:localisation_id",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["localisation","id",req.params.localisation_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Deleted the user with id "+req.params.localisation_id});
            }
        });
    });
}

module.exports = REST_ROUTER;
