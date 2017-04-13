function REST_ROUTER(router, connection, md5) {
  var self = this;
  self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, md5) {
  var self = this;
  // board
  var board

  //Gamers parameters
  var joueur1
  var joueur2
  var partie
  var timerManche;
  var timerGame;
  var t;
  var timer_is_on;
  var timeByTurn;
  init();

  function init() {
    //Gamers parameters
    joueur1 = {
      idJoueur: null,
      nomJoueur: null,
      tenaille: 0,
      status: null
    }
    joueur2 = {
      idJoueur: null,
      nomJoueur: null,
      tenaille: 0,
      status: null
    }
    partie = {
      lap: 0,
      lastCoup: {
        x: null,
        y: null
      },
      endOfGame: false,
      detailFinPartie: null,
      prolongation: false
    }
    timerManche = 0;
    timerGame = 0;
    timer_is_on = 0;
    timeByTurn = 120;

    //Init board
    board = [
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
    console.log("Built by gamers for gamers, waiting for players...")
  }

  router.get("/", function(req, res) {
    res.json({
      "Message": "Hello World !"
    });
  });

  router.get("/joueurs/", function(req, res) {
    res.json({
      //On renvoi nom des joueurs actuellement connecte a la partie
        nomJoueur1: joueur1.nomJoueur,
        idJoueur1:joueur1.idJoueur,
        nomJoueur2: joueur2.nomJoueur,
        idJoueur2:joueur2.idJoueur
      });
  });

  router.get("/connect/:groupName", function(req, res) {
    if (joueur1.idJoueur == null) {
      joueur1.nomJoueur = req.params.groupName
      joueur1.idJoueur = md5(req.params.groupName)
      console.log("Connection Joueur1  [idJoueur : " + joueur1.idJoueur + " nomJoueur : " + joueur1.nomJoueur + "]")

      //On renvoi le md5 correspondant a groupName comme identifiant à l'utilisateur
      res.status(200).send({
        idJoueur: md5(req.params.groupName),
        code: 200,
        nomJoueur: req.params.groupName,
        numJoueur:1
      });
    } else if (joueur2.idJoueur == null && req.params.groupName != joueur1.nomJoueur) {
      joueur2.nomJoueur = req.params.groupName;
      joueur2.idJoueur = md5(req.params.groupName);
      console.log("Connection Joueur2  [idJoueur : " + joueur2.idJoueur + " nomJoueur : " + joueur2.nomJoueur + "]")

      //Le joueur 1 commence à jouer
      joueur1.status = 1
      joueur2.status = 0

      console.log("Debut de la partie : " + "En attente du joueur1 ")
        //On renvoi le md5 correspondant a groupName comme identifiant à l'utilisateur
      res.status(200).send({
        idJoueur: md5(req.params.groupName),
        code: 200,
        nomJoueur: req.params.groupName,
        numJoueur:2
      });
    } else {
      //Retourné quand la partie est déjà en cours et que l'utilisateur n'est pas autorisé à joueur ou le joueur existe déja
      res.status(401).send({
        code: 401
      });
    }
  });




  router.get("/play/:x/:y/:idJoueur", function(req, res) {
    //Coords
    var coordX = req.params.y
    var coordY = req.params.x

    var currentIdJoueur = joueur1.idJoueur
    var currentNomJoueur = joueur1.nomJoueur
    if (joueur2.status == 1) {
      currentIdJoueur = joueur2.idJoueur
      currentNomJoueur = joueur2.nomJoueur
    }
    //Id du joueur ne correspond ni au md5 du joueur1, ni du joueur 2
    if (((req.params.idJoueur != joueur1.idJoueur) && (req.params.idJoueur != joueur2.idJoueur)) || req.params.idJoueur != currentIdJoueur) {
      //Retourné quand le joueur n'est pas autorisé (nom du joueur non valide pour la partie)
      res.status(401).send({
        code: 401
      });
    } else {
      //Remontée d'erreur
      var erreur = {
        isOnBoard: null,
        isPositionDisponible: null,
        isEnd: null
      };
      erreur.isOnBoard = isPositionInBound(coordX, coordY);
      erreur.isPositionDisponible = isPositionAvailable(coordY, coordX);
      erreur.isEnd = partie.endOfGame;

      // Vérification si la pos est dans la board, egal a 0 et si un des joueurs a un statut qui permet de jouer et que ce n'est pas la fin de la partie
      if (isPositionInBound(coordX, coordX) && isPositionAvailable(coordY, coordX) && partie.endOfGame == false && ((joueur1.status == 1) || (joueur2.status == 1))) {
        //Le joueur 1 place un pion
        if (req.params.idJoueur == joueur1.idJoueur) {
                if(checkPostionLapTwo(coordX,coordY,partie.lap)){
                    partie.endOfGame = true;
                    partie.detailFinPartie = "Placement éronné lors du tour "+ (parseInt(partie.lap)+1)+ " de " + joueur1.nomJoueur + " Victoire du joueur "+joueur2.nomJoueur+" avec id : " + joueur2.idJoueur;

                    console.log(partie.detailFinPartie);
                }
              board[coordY][coordX] = 1;
              partie.lap = partie.lap + 1;
              partie.lastCoup.x = coordY;
              partie.lastCoup.y = coordX;
              if (partie.lap == 1) {
                startCount();
              } else {
                restartCount()
              }
              //Mise à jour du nombre de tenaille du joueur 1
              joueur1.tenaille += tenailleNumber(coordY, coordX)
              if(joueur1.tenaille == 5)
              {
                partie.endOfGame = true;
                partie.detailFinPartie = "Victoire par 5 tenailles obtenues: " + joueur1.nomJoueur + " avec id : " + joueur1.idJoueur;
                console.log(partie.detailFinPartie);
              }
                //Verification de la victoire par 5 pions qui se suivent
              checkTheFiveWin(coordY, coordX)
                //On change le statut du joueur
              joueur1.status = 0
              joueur2.status = 1
                //Log de la partie
              console.log("   Joueur1 place pion en [" + coordX + "," + coordY + "]")
              if(!partie.endOfGame)
              {
              console.log("En attente du joueur 2...")
            }
        }
        //Le joueur 2 place un pion
        if (req.params.idJoueur == joueur2.idJoueur) {
          board[coordY][coordX] = 2;
          partie.lap = partie.lap + 1;
          partie.lastCoup.x = coordY;
          partie.lastCoup.y = coordX;
          restartCount();
          //Mise à jour du nombre de tenaille du joueur 2
          joueur2.tenaille += tenailleNumber(coordY, coordX)

          if(joueur2.tenaille == 5)
          {
          partie.endOfGame = true;
          partie.detailFinPartie = "Victoire par 5 tenailles obtenues: " + joueur2.nomJoueur + " avec id : " + joueur2.idJoueur;
          console.log(partie.detailFinPartie);
          }

            //Verification de la victoire par 5 pions qui se suivent
          checkTheFiveWin(coordY, coordX)
            //On change le statut du joueur
          joueur1.status = 1
          joueur2.status = 0
            //Log de la partie
          console.log("   Joueur2 place pion en [" + coordY + "," + coordX + "]")
          if(!partie.endOfGame)
          {
          console.log("En attente du joueur 1...")
          }
        }
        res.status(200).send({
          code: 200
        });
      }
      //Les coordonnées ne sont pas acceptables
      else {
        // Tentative de placement de point raté
        console.log("Demande de placement de :" + currentIdJoueur + "en" + "[" + coordY + "," + coordX + "]");
        console.log(erreur);

        //Fin de la partie on update les informations
        partie.endOfGame = true;
        partie.detailFinPartie = "Tentative de placement de point raté en " + "[" + coordY + "," + coordX + "]" + ", le joueur : " + "[" + currentNomJoueur +"," + currentIdJoueur + "] perd la partie";


        //Retourné quand le coup n'est pas valide
        res.status(406).send({
          code: 406
        });
      }
    }
  });

  router.get("/turn/:idJoueur", function(req, res) {
    if (req.params.idJoueur == joueur1.idJoueur) {

      res.status(200).send({
        status: joueur1.status,
        tableau: board,
        nbTenaillesJ1: joueur1.tenaille,
        nbTenaillesJ2: joueur2.tenaille,
        dernierCoupX: parseInt(partie.lastCoup.y),
        dernierCoupY: parseInt(partie.lastCoup.x),
        prolongation: partie.prolongation,
        finPartie: partie.endOfGame,
        detailFinPartie: partie.detailFinPartie,
        numTour: partie.lap,
        code: 200
      });

    } else if (req.params.idJoueur == joueur2.idJoueur) {
      res.status(200).send({

        status: joueur2.status,
        tableau: board,
        nbTenaillesJ1: joueur1.tenaille,
        nbTenaillesJ2: joueur2.tenaille,
        dernierCoupX: parseInt(partie.lastCoup.y),
        dernierCoupY: parseInt(partie.lastCoup.x),
        prolongation: partie.prolongation,
        finPartie: partie.endOfGame,
        detailFinPartie: partie.detailFinPartie,
        numTour: partie.lap,
        code: 200
      });

    } else {
      //Retourné quand le joueur n'est pas autorisé (nom du joueur non valide pour la partie)
      res.status(401).send({
        code: 401
      });
    }
  });

  function tenailleNumber(y, x) {
    y = parseInt(y)
    x = parseInt(x)
    var nbrTenaille = 0
    var value = board[y][x]
    var inverse = 1
    if (value == 1) {
      inverse = 2
    }

    //Diagonale haut gauche
    //Position possible
    if (isPositionInBound(y - 3, x - 3)) {
      //Présence d'une tenaille suite au coup joué
      if (board[y - 3][x - 3] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y - 1][x - 1] == inverse && board[y - 2][x - 2] == inverse) {
          board[y - 1][x - 1] = 0
          board[y - 2][x - 2] = 0
          nbrTenaille++
        }
      }
    }

    //Haut
    //Position possible
    if (isPositionInBound(y - 3, x)) {
      //Présence d'une tenaille suite au coup joué
      if (board[y - 3][x] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y - 1][x] == inverse && board[y - 2][x] == inverse) {
          board[y - 1][x] = 0
          board[y - 2][x] = 0

          nbrTenaille++
        }
      }
    }

    //Diagonale haut droite
    //Position possible
    if (isPositionInBound(y - 3, x + 3)) {
      //Présence d'une tenaille suite au coup joué
      if (board[y - 3][x + 3] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y - 1][x + 1] == inverse && board[y - 2][x + 2] == inverse) {
          board[y - 1][x + 1] = 0
          board[y - 2][x + 2] = 0

          nbrTenaille++
        }
      }
    }

    //Droite
    //Position possible
    if (isPositionInBound(y, x + 3)) {
      //Présence d'une tenaille suite au coup joué
      if (board[y][x + 3] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y][x + 1] == inverse && board[y][x + 2] == inverse) {
          board[y][x + 1] = 0
          board[y][x + 2] = 0

          nbrTenaille++
        }
      }
    }

    //Diagonale bas droite
    //Position possible
    if (isPositionInBound(y + 3, x + 3)) {
      //Présence d'une tenaille suite au coup joué
      if (board[y + 3][x + 3] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y + 1][x + 1] == inverse && board[y + 2][x + 2] == inverse) {
          board[y + 1][x + 1] = 0
          board[y + 2][x + 2] = 0

          nbrTenaille++
        }
      }
    }

    //Bas
    //Position possible
    if (isPositionInBound(y + 3, x)) {
      //Présence d'une tenaille suite au coup joué
      if (board[y + 3][x] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y + 1][x] == inverse && board[y + 2][x] == inverse) {
          board[y + 1][x] = 0
          board[y + 2][x] = 0

          nbrTenaille++
        }
      }
    }


    //Diagonale bas gauche
    //Position possible
    if (isPositionInBound(y + 3, x - 3)) {
      //Présence d'une tenaille suite au coup joué
      if (board[y + 3][x - 3] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y + 1][x - 1] == inverse && board[y + 2][x - 2] == inverse) {
          board[y + 1][x - 1] = 0
          board[y + 2][x - 2] = 0

          nbrTenaille++
        }
      }
    }

    //Gauche
    //Position possible
    if (isPositionInBound(y, x - 3)) {
      //Présence d'une tenaille suite au coup joué
      if (board[y][x - 3] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y][x - 1] == inverse && board[y][x - 2] == inverse) {
          board[y][x - 1] = 0
          board[y][x - 2] = 0

          nbrTenaille++
        }
      }
    }
    return nbrTenaille
  }

  // Les valeurs [x,y] sont dans la board
  function isPositionInBound(coordY, coordX) {
    return ((coordX >= 0 && coordX <= 18) && (coordY >= 0 && coordY <= 18))
  }

  //la position est disponible (symbolisé par un 0 sur le board)
  function isPositionAvailable(coordY, coordX) {
    if (isPositionInBound(coordX, coordY)) {
      return (board[coordY][coordX] == 0);
    }
    return false;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function timedCount() {
    timerManche = timerManche + 1;
    timerGame = timerGame + 1;

    checkC();
    checkGameTime();
    t = setTimeout(function() {
      timedCount()
    }, 1000);
  }
  //Verification du temps du round
  function checkC() {
    if (timerManche > timeByTurn) {
      if(!partie.endOfGame)
      {
      var messageFin = "Temps écoulé, le joueur : " + "[" + joueur1.nomJoueur +"," +joueur1.idJoueur + "] perd" + " et [" +joueur2.nomJoueur + ","+ joueur2.idJoueur+"] gagne"
      if (joueur2.status == 1) {
         messageFin = "Temps écoulé, le joueur2 : " + "[" +joueur2.nomJoueur + ","+ joueur2.idJoueur + "] perd" + " et [" +joueur1.nomJoueur + ","+ joueur1.idJoueur+"] gagne"
      }
      console.log(messageFin);

      //Fin de la partie on update les informations
      partie.endOfGame = true;
      partie.detailFinPartie = messageFin;
      stopCount();
    }
    }
  }
  //Verification du temps de la partie et déclenchement de la mort subite
  function checkGameTime() {
    if (timerGame == 602) {
      partie.prolongation = true;
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

  function restartCount() {
    stopCount();
    timerManche = 0;
    startCount();
  }

  function checkTheFiveWin(x, y) {
    y = parseInt(y)
    x = parseInt(x)
      var currentIdJoueur = joueur1.idJoueur
      if (joueur2.status == 1) {
          currentIdJoueur = joueur2.idJoueur
      }
      var joueurVariable;
    if(currentIdJoueur==joueur1.idJoueur){
        joueurVariable=1;
    }else{
        joueurVariable=2;
    }

    /// Tableau Ligne ///
    var tabLigneDroite = []
    var tabLigneGauche = []
    var tabSchemaLigne = []

    /// Tableau Colonne ///
    var tabColonneHaut = []
    var tabColonneBas = []
    var tabSchemaColonne = []

    /// Tableau Diago droite ///   ex : \
    var tabDiagoHautDroite = []
    var tabDiagoBasDroite = []
    var tabSchemaDiagoDroite = []

    /// Tableau Diago Gauche /// ex : /
    var tabDiagoHautGauche = []
    var tabDiagoBasGauche = []
    var taSchemaDiagoGauche = []
      //ligne
    for (var i = 1; i < 6; i++) {
      if (isPositionInBound(x + i, y)) {
        tabLigneDroite.push(board[x + i][y])
      }
    }
    for (var z = 1; z < 6; z++) {
      if (isPositionInBound(x - z, y)) {
        tabLigneGauche.push(board[x - z][y])
      }
    }

    for (var e = tabLigneGauche.length - 1; e != -1; e--) {
      tabSchemaLigne.push(tabLigneGauche[e])
    }
    tabSchemaLigne.push(joueurVariable)
    for (var r = 0; r < tabLigneDroite.length; r++) {
      tabSchemaLigne.push(tabLigneDroite[r])
    }

    //// Colonne ////

    for (var i = 1; i < 6; i++) {
      if (isPositionInBound(x, y + i)) {
        tabColonneHaut.push(board[x][y + i])
      }
    }
    for (var z = 1; z < 6; z++) {
      if (isPositionInBound(x, y - z)) {
        tabColonneBas.push(board[x][y - z])
      }
    }

    for (var e = tabColonneHaut.length - 1; e != -1; e--) {
      tabSchemaColonne.push(tabColonneHaut[e])
    }
    tabSchemaColonne.push(joueurVariable)
    for (var r = 0; r < tabColonneBas.length; r++) {
      tabSchemaColonne.push(tabColonneBas[r])
    }

    //// Diagonal Droite ////
    for (var i = 1; i < 6; i++) {
      if (isPositionInBound(x + i, y + i)) {
        tabDiagoHautDroite.push(board[x + i][y + i])
      }
    }
    for (var z = 1; z < 6; z++) {

      if (isPositionInBound(x - z, y - z)) {
        tabDiagoBasDroite.push(board[x - z][y - z])
      }
    }

    for (var e = tabDiagoBasDroite.length - 1; e != -1; e--) {
      tabSchemaDiagoDroite.push(tabDiagoBasDroite[e])
    }
    tabSchemaDiagoDroite.push(joueurVariable)
    for (var r = 0; r < tabDiagoHautDroite.length; r++) {
      tabSchemaDiagoDroite.push(tabDiagoHautDroite[r])
    }


    //// Diagonal Gauche ////
    for (var i = 1; i < 6; i++) {
      if (isPositionInBound(x - i, y + i)) {
        tabDiagoHautGauche.push(board[x - i][y + i])
      }
    }
    for (var z = 1; z < 6; z++) {
      if (isPositionInBound(x + z, y - z)) {
        tabDiagoBasGauche.push(board[x + z][y - z])
      }
    }

    for (var e = tabDiagoBasGauche.length - 1; e != -1; e--) {
      taSchemaDiagoGauche.push(tabDiagoBasGauche[e])
    }
    taSchemaDiagoGauche.push(joueurVariable)
    for (var r = 0; r < tabDiagoHautGauche.length; r++) {
      taSchemaDiagoGauche.push(tabDiagoHautGauche[r])
    }

    var fiveAlignement = 0;
    //check 5 ligne
    for (var e = 0; e < tabSchemaLigne.length; e++) {
      if (fiveAlignement != 5) {
        if (tabSchemaLigne[e] == board[x][y]) {
          fiveAlignement++;
        } else {
          fiveAlignement = 0;
        }
      }
    }
    //check 5 colonne
    if (fiveAlignement != 5) {
      for (var e = 0; e < tabSchemaColonne.length; e++) {
        if (fiveAlignement != 5) {
          if (tabSchemaColonne[e] == board[x][y]) {
            fiveAlignement++;
          } else {
            fiveAlignement = 0;
          }
        }
      }
    }
    //check 5 diagoDroite
    if (fiveAlignement != 5) {
      for (var e = 0; e < tabSchemaDiagoDroite.length; e++) {
        if (fiveAlignement != 5) {
          if (tabSchemaDiagoDroite[e] == board[x][y]) {
            fiveAlignement++;
          } else {
            fiveAlignement = 0;
          }
        }
      }
    }
    //check 5 diagoGauche
    if (fiveAlignement != 5) {
      for (var e = 0; e < taSchemaDiagoGauche.length; e++) {
        if (fiveAlignement != 5) {
          if (taSchemaDiagoGauche[e] == board[x][y]) {
            fiveAlignement++;
          } else {
            fiveAlignement = 0;
          }
        }
      }
    }
    if (fiveAlignement == 5) {
      //appel fonction victoire
      var currentIdJoueur = joueur1.idJoueur
      var currentJoueurName = joueur1.nomJoueur
      if (joueur2.status == 1) {
        currentIdJoueur = joueur2.idJoueur
        currentJoueurName = joueur2.nomJoueur
      }
      partie.endOfGame = true;
      partie.detailFinPartie = "Victoire par 5 pions dans le même alignement : " + currentJoueurName + " avec id : " + currentIdJoueur;
      console.log(partie.detailFinPartie);
    }
  }
    function checkPostionLapTwo(x, y, lap) {
        y = parseInt(y)
        x = parseInt(x)

        if(lap==2){
            var lapTwoLimit=[]
            lapTwoLimit.push({x:9,y:9})
            lapTwoLimit.push({x:9,y:10})
            lapTwoLimit.push({x:9,y:11})
            lapTwoLimit.push({x:10,y:10})
            lapTwoLimit.push({x:11,y:11})
            lapTwoLimit.push({x:10,y:9})
            lapTwoLimit.push({x:11,y:9})
            lapTwoLimit.push({x:10,y:8})
            lapTwoLimit.push({x:11,y:7})
            lapTwoLimit.push({x:9,y:8})
            lapTwoLimit.push({x:9,y:7})
            lapTwoLimit.push({x:8,y:8})
            lapTwoLimit.push({x:7,y:7})
            lapTwoLimit.push({x:8,y:9})
            lapTwoLimit.push({x:7,y:9})
            lapTwoLimit.push({x:8,y:10})
            lapTwoLimit.push({x:7,y:11})

            var found = false;
            for(var i = 0; i < lapTwoLimit.length; i++) {
                if (lapTwoLimit[i].x == x && lapTwoLimit[i].y==y) {
                    found = true;
                }
            }
            return found
        }else if(lap==0){
            if(x==9 && y==9){
                return false
            }else{
                return true
            }
        }
        else{
            return false;
        }
    }
  }


module.exports = REST_ROUTER;
