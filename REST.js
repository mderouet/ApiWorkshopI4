function REST_ROUTER(router, connection, md5) {
  var self = this;
  self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, md5) {
  var self = this;
  // board
  var board = [
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]

  //Gamers parameters
  var joueur1 = {idJoueur:null,nomJoueur:null,tenaille:null}
  var joueur2 = {idJoueur:null,nomJoueur:null,tenaille:null}
  var partie = {lap:0,status:null, lastCoup:{x:null,y:null},endOfGame:false,detailFinPartie:null, prolongation:false }
  var whoPlay=null;
  var timerManche = 0;
  var timerGame=0;
  var t;
  var timer_is_on = 0;

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
                    joueur2.nomJoueur = req.params.groupName;
                    joueur2.idJoueur = md5(req.params.groupName);
                    whoPlay=1;
                    res.status(200).send({idjoueur:md5(req.params.groupName),code:200,nomJoueur:req.params.groupName});
                }
                else
                {
                  res.status(401).send({code:401});
                }
    });




    router.get("/play/:x/:y/:idJoueur",function(req,res){
      //Id du joueur ne correspond ni au md5 du joueur1, ni du joueur 2
      if(req.params.idJoueur != joueur1.idJoueur && req.params.idJoueur != joueur2.idJoueur)
      {
      res.status(401).send({code:401});
      }
      else {
          //Les coordonnées sont acceptables
          if (isPositionInBound(req.params.x, req.params.y)  && isPositionAvailable(req.params.y, req.params.x)) {
              //Le joueur 1 place un pion
              if (req.params.idJoueur == joueur1.idJoueur) {
                  board[req.params.x][req.params.y] = 1;
                  partie.lap=partie.lap+1;
                  partie.lastCoup.x=req.params.y;
                  partie.lastCoup.y=req.params.x;
                  if(partie.lap==1){
                      startCount();
                  }else{
                      restartCount()
                  }
                  res.status(200).send({code: 200});
              }
              //Le joueur 2 place un pion
              if (req.params.idJoueur == joueur2.idJoueur) {
                  board[req.params.x][req.params.y] = 2;
                  partie.lap=partie.lap+1;
                  partie.lastCoup.x=req.params.y;
                  partie.lastCoup.y=req.params.x;
                  restartCount();

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
            console.log(timerManche+" : "+timerGame);
            if(req.params.idJoueur == joueur1.idJoueur){
                if(whoPlay==1){
                    partie.status=1;
                }else{
                    partie.status=0;
                }
                res.status(200).send({status:partie.status,tableau:board,nbTenaillesJ1:joueur1.tenaille,nbTenaillesJ2:joueur2.tenaille,dernierCoupX:partie.lastCoup.x,dernierCoupY:partie.lastCoup.y,prolongation:partie.prolongation,finPartie:partie.endOfGame,detailFinPartie:partie.detailFinPartie,numTour:partie.lap,code:200});

            }else if(req.params.idJoueur == joueur2.idJoueur){
                if(whoPlay==2){
                    partie.status=1;
                }else{
                    partie.status=0;
                }
                res.status(200).send({status:partie.status,tableau:board,nbTenaillesJ1:joueur1.tenaille,nbTenaillesJ2:joueur2.tenaille,dernierCoupX:partie.lastCoup.x,dernierCoupY:partie.lastCoup.y,prolongation:partie.prolongation,finPartie:partie.endOfGame,detailFinPartie:partie.detailFinPartie,numTour:partie.lap,code:200});

            }else{
                res.status(401).send({code:401});
              }
          });




  function tenailleNumber(y, x) {
    var nombreTenaille = 0
    var value = board[y][x]
    var inverse = 1
    if (value == 1) {
      inverse = 2
    }

    //Diagonale haut gauche
    //Position possible
    if (isPositionInBound(y - 3, x - 3)) {
      //Présence d'un encadrement
      if (board[y - 3][x - 3] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y - 1][x - 1] == inverse && board[y - 2][x - 2] == inverse) {
          board[y - 1][x - 1] = 0
          board[y - 2][x - 2] = 0

          nombreTenaille++
        }
      }
    }

    //Haut
    //Position possible
    if (isPositionInBound(y - 3, x)) {
      //Présence d'un encadrement
      if (board[y - 3][x] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y - 1][x] == inverse && board[y - 2][x] == inverse) {
          board[y - 1][x] = 0
          board[y - 2][x] = 0

          nombreTenaille++
        }
      }
    }

    //Diagonale haut droite
    //Position possible
    if (isPositionInBound(y - 3, x + 3)) {
      //Présence d'un encadrement
      if (board[y - 3][x + 3] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y - 1][x + 1] == inverse && board[y - 2][x + 2] == inverse) {
          board[y - 1][x + 1] = 0
          board[y - 2][x + 2] = 0

          nombreTenaille++
        }
      }
    }

    //Droite
    //Position possible
    if (isPositionInBound(y, x + 3)) {
      //Présence d'un encadrement
      if (board[y][x + 3] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y][x + 1] == inverse && board[y][x + 2] == inverse) {
          board[y][x - 1] = 0
          board[y][x - 2] = 0

          nombreTenaille++
        }
      }
    }

    //Diagonale bas droite
    //Position possible
    if (isPositionInBound(y + 3, x + 3)) {
      //Présence d'un encadrement
      if (board[y + 3][x + 3] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y + 1][x + 1] == inverse && board[y + 2][x + 2] == inverse) {
          board[y + 1][x + 1] = 0
          board[y + 2][x + 2] = 0

          nombreTenaille++
        }
      }
    }

    //Bas
    //Position possible
    if (isPositionInBound(y + 3, x)) {
      //Présence d'un encadrement
      if (board[y + 3][x] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y + 1][x] == inverse && board[y + 2][x] == inverse) {
          board[y + 1][x] = 0
          board[y + 2][x] = 0

          nombreTenaille++
        }
      }
    }


    //Diagonale bas gauche
    //Position possible
    if (isPositionInBound(y + 3, x - 3)) {
      //Présence d'un encadrement
      if (board[y + 3][x - 3] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y + 1][x - 1] == inverse && board[y + 2][x - 2] == inverse) {
          board[y + 1][x - 1] = 0
          board[y + 2][x - 2] = 0

          nombreTenaille++
        }
      }
    }

    //Diagonale gauche
    //Position possible
    if (isPositionInBound(y, x - 3)) {
      //Présence d'un encadrement
      if (board[y][x - 3] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y][x - 1] == inverse && board[y][x - 2] == inverse) {
          board[y][x - 1] = 0
          board[y][x - 2] = 0

          nombreTenaille++
        }
      }
    }

    return nombreTenaille
  }
  // Les valeurs [x,y] sont dans la board
  function isPositionInBound(coordX, coordY) {
    return ((coordX >= 0 && coordX <= 18) && (coordY >= 0 && coordY <= 18))
  }

  //la position est disponible (symbolisé par un 0)
  function isPositionAvailable(coordX, coordY) {
    return (board[coordX][coordY] == 0)
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
    function timedCount() {
        timerManche = timerManche+ 1;
        timerGame= timerGame +1;
        checkC();
        checkGameTime();
        t = setTimeout(function(){timedCount()}, 1000);
    }
    function checkC(){
        if(timerManche==12){
            partie.endOfGame=true;
            partie.detailFinPartie="Temps dépassé"
            console.log('loose');
            stopCount();
        }
    }
    function checkGameTime(){
        if(timerGame==602){
            partie.prolongation=true;
            console.log("Mort Subite");
        }
    }
    function startCount() {
        if (!timer_is_on) {
            timer_is_on = 1;
            timedCount();
        }
    }

    function stopCount() {
        clearTimeout(t);
        timer_is_on = 0;
    }
    function restartCount(){
        stopCount();
        timerManche=0;
        startCount();
    }
}

module.exports = REST_ROUTER;
