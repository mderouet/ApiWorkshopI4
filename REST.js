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
  init();

  function init() {
    //Gamers parameters
    joueur1 = {
      idJoueur: null,
      nomJoueur: null,
      tenaille: null,
      status: null
    }
    joueur2 = {
      idJoueur: null,
      nomJoueur: null,
      tenaille: null,
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

  router.get("/connect/:groupName", function(req, res) {
    if (joueur1.idJoueur == null) {
      joueur1.nomJoueur = req.params.groupName
      joueur1.idJoueur = md5(req.params.groupName)
      console.log("Connection Joueur1  [idJoueur : " + joueur1.idJoueur + " nomJoueur : " + joueur1.nomJoueur + "]")

      //On renvoi le md5 correspondant a groupName comme identifiant à l'utilisateur
      res.status(200).send({
        idJoueur: md5(req.params.groupName),
        code: 200,
        nomJoueur: req.params.groupName
      });
    } else if (joueur2.idJoueur == null) {
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
        nomJoueur: req.params.groupName
      });
    } else {
      //Retourné quand la partie est déjà en cours et que l'utilisateur n'est pas autorisé à joueur.
      res.status(401).send({
        code: 401
      });
    }
  });




  router.get("/play/:x/:y/:idJoueur", function(req, res) {
    var currentIdJoueur = joueur1.idJoueur
    if (joueur2.status == 1) {
      currentIdJoueur = joueur2.idJoueur
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
      erreur.isOnBoard = isPositionInBound(req.params.x, req.params.y);
      erreur.isPositionDisponible = isPositionAvailable(req.params.y, req.params.x);
      erreur.isEnd = partie.endOfGame;

      // Vérification si la pos est dans la board, egal a 0 et si un des joueurs a un statut qui permet de jouer et que ce n'est pas la fin de la partie
      if (isPositionInBound(req.params.x, req.params.y) && isPositionAvailable(req.params.y, req.params.x) && partie.endOfGame == false && ((joueur1.status == 1) || (joueur2.status == 1))) {
        //Le joueur 1 place un pion
        if (req.params.idJoueur == joueur1.idJoueur) {
          board[req.params.y][req.params.x] = 1;
          partie.lap = partie.lap + 1;
          partie.lastCoup.x = req.params.x;
          partie.lastCoup.y = req.params.y;
          if (partie.lap == 1) {
            startCount();
          } else {
            restartCount()
          }
          //Mise à jour du nombre de tenaille du joueur 1
          joueur1.nombreTenaille += tenailleNumber(req.params.y, req.params.x)
            //Verification de la victoire par 5 pions qui se suivent
            checkTheFiveWin(req.params.y, req.params.x)
            //On change le statut du joueur
          joueur1.status = 0
          joueur2.status = 1
            //Log de la partie
          console.log("Joueur1 place pion en [" + req.params.x + "," + req.params.y + "]")
          console.log("En attente du joueur 2...")
        }
        //Le joueur 2 place un pion
        if (req.params.idJoueur == joueur2.idJoueur) {
          board[req.params.y][req.params.x] = 2;
          partie.lap = partie.lap + 1;
          partie.lastCoup.x = req.params.x;
          partie.lastCoup.y = req.params.y;
          restartCount();
          //Mise à jour du nombre de tenaille du joueur 2
          joueur2.nombreTenaille += tenailleNumber(req.params.y, req.params.x)
            //Verification de la victoire par 5 pions qui se suivent
            checkTheFiveWin(req.params.y, req.params.x)
            //On change le statut du joueur
          joueur1.status = 1
          joueur2.status = 0
            //Log de la partie
          console.log("Joueur2 place pion en [" + req.params.x + "," + req.params.y + "]")
          console.log("En attente du joueur 1...")
        }
        res.status(200).send({
          code: 200
        });
      }
      //Les coordonnées ne sont pas acceptables
      else {
        // Tentative de placement de point raté
        console.log("Demande de placement de :" + currentIdJoueur + "en" + "[" + req.params.x + "," + req.params.y + "]");
        console.log(erreur);
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
        dernierCoupX: partie.lastCoup.x,
        dernierCoupY: partie.lastCoup.y,
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
        dernierCoupX: partie.lastCoup.x,
        dernierCoupY: partie.lastCoup.y,
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

  function tenailleNumber(y,x) {
    y = parseInt(y)
    x = parseInt(x)
    var nombreTenaille = 0
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
          nombreTenaille++
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

          nombreTenaille++
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

          nombreTenaille++
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

          nombreTenaille++
        }
      }
    }

    //Diagonale bas droite
    //Position possible
    if (isPositionInBound(y + 3, x + 3)) {
      //Présence d'une tenaille suite au coup joué
      console.log(board[y + 3][x + 3])
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
      //Présence d'une tenaille suite au coup joué
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
      //Présence d'une tenaille suite au coup joué
      if (board[y + 3][x - 3] == value) {
        //Si les positions existent on vérifie la valeur des cases
        if (board[y + 1][x - 1] == inverse && board[y + 2][x - 2] == inverse) {
          board[y + 1][x - 1] = 0
          board[y + 2][x - 2] = 0

          nombreTenaille++
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

          nombreTenaille++
        }
      }
    }

    return nombreTenaille
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
    //Logging timer
    if (joueur1.status != null || joueur2.status != null) {
      console.log(timerManche);
    }
    checkC();
    checkGameTime();
    t = setTimeout(function() {
      timedCount()
    }, 1000);
  }
    //Verification du temps du round
  function checkC() {
    if (timerManche > 60) {
      partie.endOfGame = true;
      partie.detailFinPartie = "Temps dépassé";

      var messageFin = "Temps dépasse, le joueur : " + joueur1.nomJoueur + " gagne !"
      if (joueur2.status == 1) {
        messageFin = "Temps dépasse, le joueur2 : " + joueur2.nomJoueur + " gagne !"
      }
      console.log(messageFin);
      stopCount();
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
    function checkTheFiveWin(x, y){
      y = parseInt(y)
      x = parseInt(x)

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

        /// Tableal Diago Gauche /// ex : /
        var tabDiagoHautGauche = []
        var tabDiagoBasGauche = []
        var taSchemaDiagoGauche = []
        //ligne
        for(var i = 1 ; i < 6; i++){
            if(isPositionInBound(x+i,y)){
                tabLigneDroite.push(board[x + i][y])
            }
        }
        for(var z = 1 ; z < 6 ; z++){
            if(isPositionInBound(x-z,y)){
                tabLigneGauche.push(board[x - z][y])
            }
        }

        for(var e = tabLigneGauche.length -1; e != -1; e--){
            tabSchemaLigne.push(tabLigneGauche[e])
        }
        tabSchemaLigne.push(1)
        for(var r = 0; r < tabLigneDroite.length; r++){
            tabSchemaLigne.push(tabLigneDroite[r])
        }

        //// Colonne ////

        for(var i = 1 ; i < 6; i++){
            if(isPositionInBound(x,y+i) ){
                tabColonneHaut.push(board[x][y + i])
            }
        }
        for(var z = 1 ; z < 6 ; z++){
            if(isPositionInBound(x,y-z)){
                tabColonneBas.push(board[x][y - z])
            }
        }

        for(var e = tabColonneHaut.length -1; e != -1; e--){
            tabSchemaColonne.push(tabColonneHaut[e])
        }
        tabSchemaColonne.push(1)
        for(var r = 0; r < tabColonneBas.length; r++){
            tabSchemaColonne.push(tabColonneBas[r])
        }

        //// Diagonal Droite ////
        for(var i = 1 ; i < 6; i++){
            if(isPositionInBound(x+i,y+i)){
                tabDiagoHautDroite.push(board[x + i][y + i])
            }
        }
        for(var z = 1 ; z < 6 ; z++){

            if(isPositionInBound(x-z,y-z)){
                tabDiagoBasDroite.push(board[x - z][y - z])
            }
        }

        for(var e = tabDiagoBasDroite.length -1; e != -1; e--){
            tabSchemaDiagoDroite.push(tabDiagoBasDroite[e])
        }
        tabSchemaDiagoDroite.push(1)
        for(var r = 0; r < tabDiagoHautDroite.length; r++){
            tabSchemaDiagoDroite.push(tabDiagoHautDroite[r])
        }


        //// Diagonal Gauche ////
        for(var i = 1 ; i < 6; i++){
            if(isPositionInBound(x+i,y+i)){
                tabDiagoHautGauche.push(board[x + i][y + i])
            }
        }
        for(var z = 1 ; z < 6 ; z++){
            if(isPositionInBound(x-z,y-z)){
                tabDiagoBasGauche.push(board[x - z][y - z])
            }
        }

        for(var e = tabDiagoBasGauche.length -1; e != -1; e--){
            taSchemaDiagoGauche.push(tabDiagoBasGauche[e])
        }
        taSchemaDiagoGauche.push(1)
        for(var r = 0; r < tabDiagoHautGauche.length; r++){
            taSchemaDiagoGauche.push(tabDiagoHautGauche[r])
        }

        var fiveAlignement=0;
        //check 5 ligne
        for(var e=0;e<tabSchemaLigne.length;e++){
            if(fiveAlignement!=5){
                if(tabSchemaLigne[e] == board[x][y]){
                    fiveAlignement++;
                }else{
                    fiveAlignement=0;
                }
            }
        }
        //check 5 colonne
        if(fiveAlignement!=5){
            for(var e=0;e<tabSchemaColonne.length;e++){
                if(fiveAlignement!=5){
                    if(tabSchemaColonne[e] == board[x][y]){
                        fiveAlignement++;
                    }else{
                        fiveAlignement=0;
                    }
                }
            }
        }
        //check 5 diagoDroite
        if(fiveAlignement!=5){
            for(var e=0;e<tabSchemaDiagoDroite.length;e++){
                if(fiveAlignement!=5){
                    if(tabSchemaDiagoDroite[e] == board[x][y]){
                        fiveAlignement++;
                    }else{
                        fiveAlignement=0;
                    }
                }
            }
        }
        //check 5 diagoGauche
        if(fiveAlignement!=5){
            for(var e=0;e<taSchemaDiagoGauche.length;e++){
                if(fiveAlignement!=5){
                    if(taSchemaDiagoGauche[e] == board[x][y]){
                        fiveAlignement++;
                    }else{
                        fiveAlignement=0;
                    }
                }
            }
        }
        if(fiveAlignement==5){
            //appel fonction victoire
            var currentIdJoueur = joueur1.idJoueur
            var currentJoueurName = joueur1.nomJoueur
            if (joueur2.status == 1) {
                currentIdJoueur = joueur2.idJoueur
                currentJoueurName = joueur2.nomJoueur
            }
            partie.endOfGame=true;
            partie.detailFinPartie="Victoire par 5 : "+currentJoueurName +" avec id : " + currentIdJoueur;
            console.log(partie.detailFinPartie);

            console.log('WIN');
        }
    }


}

module.exports = REST_ROUTER;
