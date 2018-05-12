//var app = require('express')();
var express = require('express'); // Get the module
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
__dirname='/Users/laurenmihalik/Desktop/demo'

//sets up to serve image files
app.use(express.static('public'));
app.use('/poker-cards', express.static(__dirname + '/poker-cards'));

//Home Page
app.get('/', function(req, res) {
    __dirname='/Users/laurenmihalik/Desktop/demo'
    res.render('home.ejs');
    res.end();
});

//Instructions for playing
app.get('/howTo', function(req, res) {
    res.render('howTo.ejs');
    res.end();
});

//Playing game vs other players
app.get('/pokerTable', function(req, res) {
    res.render('pokerGame.ejs');
    res.end();
});

//Play game vs computer
app.get('/pokerSim', function(req, res) {
    res.render('pokerSim.ejs');
    res.end();
});

/**/
/*
 callDealCards(()
NAME

    callDealCards()

SYNOPSIS
     callDealCards() 
DESCRIPTION
        this function handles dealing the cards, and emitting a message of what is hanppening
        also removes player if they quit
RETURNS
    
AUTHOR

        Lauren Mihalik

DATE

        4/14/2018

*/
/**/
//function to control deal cards flow
function callDealCards(){
    //deal cards
    var deal = pokerTable.dealCards();
    var messageStr= "Dealing Cards!";
    io.sockets.emit('updateMessage', {message: messageStr});
    if(deal == false){
        for(var i=0;i<pokerTable.players.length;i++){
            pokerTable.players[i].ready=false;
        }
        io.sockets.emit('updateTable', {pokerTable: pokerTable, showCards:true});
        console.log("Game Complete!");
        //send a message
        var messageStr= pokerTable.winningString;
        io.sockets.emit('updateMessage', {message: messageStr});
        
        pokerTable.activeGame=false;
        for(var i = 0;i<quitGame.length;i++){
            pokerTable.removePlayer(quitGame[i]);
        }
        quitGame = [];

        if(players.length < 5){
            if(waitRoom.length>0){
                var newPlayerId=waitRoom[0];
                waitRoom.slice(0, 1);
                //create plater add to table
                const Player=require('./Player')
                var newPlayer= new Player(newPlayerId);
                pokerTable.setPlayers(newPlayer);
                //tell client to go to that readt view
                io.sockets.connected[newPlayerId].emit('leaveRoom', {});
            }
        }
    }else{
        io.sockets.emit('updateTable', {pokerTable: pokerTable, showCards:false});
        //setting small blind to active or next active player if small folded
        if(pokerTable.players[pokerTable.activePlayerIndex].playerId.substring(0,4) != "comp" ){
            io.sockets.connected[players[pokerTable.activePlayerIndex].playerId].emit('activeTurn', {});
            io.sockets.connected[players[pokerTable.activePlayerIndex].playerId].emit('noCallControls', {});
        }
        else{
            //MOVE Computer
            while(pokerTable.players[pokerTable.activePlayerIndex].playerId.substring(0,4) == "comp"){
                console.log("PLAYER");
                console.log(pokerTable.players[pokerTable.activePlayerIndex].playerId);
                console.log(players[pokerTable.activePlayerIndex].playerId);
                playerCall({playerId:players[pokerTable.activePlayerIndex].playerId});
            }
            io.sockets.connected[players[pokerTable.activePlayerIndex].playerId].emit('activeTurn', {});
        }
    }
}

/**/
/*
 playerFold(()
NAME

    playerFold()

SYNOPSIS
     playerFold(data) 
     data --> the object that is emited to the server 
DESCRIPTION
     handling the case if players are folding.
RETURNS
    
AUTHOR

        Lauren Mihalik

DATE

        4/12/2018

*/
/**/
function playerFold(data){
    onePlayer=pokerTable.getPlayer(data.playerId);
    onePlayer.folded=true;
    
    if(pokerTable.endGame() == true){
        callDealCards();
        return;
    }
    
    var playerInd = pokerTable.getPlayerIndex(data.playerId);
    var nextPlayerIndex=pokerTable.setActivePlayer();
    
    if(pokerTable.checkBettingComplete(nextPlayerIndex) == true){
        callDealCards();
    }
    else{
        var tableDone = pokerTable.dealEndGame();
        if(tableDone==true){
            callDealCards();
        }
        else{
            if(pokerTable.players[nextPlayerIndex].playerId.substring(0,4) != "comp" ){
                console.log("PLAYER TURN")
                io.sockets.connected[pokerTable.players[nextPlayerIndex].playerId].emit('activeTurn', {});
            }else{
                console.log("Computer Turn");
                simGame();
            }
        }
    }
}

/**/
/*
 playerCall(()
NAME

    playerCall()

SYNOPSIS
     playerCall(data) 
     data --> the object that is emited to the server 
DESCRIPTION
     handling the case if players are calling. emits message to say who did what. 
RETURNS
    
AUTHOR

        Lauren Mihalik

DATE

        4/12/2018

*/
/**/
function playerCall(data){
    onePlayer=pokerTable.getPlayer(data.playerId);
    onePlayer.didBet = true;

    var callAmount=(pokerTable.minBet-onePlayer.roundBet);
    if(callAmount >= onePlayer.chipCount){
        pokerTable.pot+=onePlayer.chipCount;
        onePlayer.roundBet+=onePlayer.chipCount;
        onePlayer.chipCount=0;
        onePlayer.allIn = true;
    }else{
        onePlayer.chipCount-=callAmount;
        pokerTable.pot+=callAmount;
        onePlayer.roundBet+=callAmount;
    }

    var nextPlayerIndex=pokerTable.setActivePlayer();

    if(pokerTable.checkBettingComplete(nextPlayerIndex) == true){
        callDealCards();
    }
    else{
        var messageStr= onePlayer.playerName + " called!";
        io.sockets.emit('updateMessage', {message: messageStr});

        io.sockets.emit('updateTable', {pokerTable: pokerTable, showCards:false});

        if(pokerTable.players[nextPlayerIndex].playerId.substring(0,4) != "comp" ){
            console.log("PLAYER TURN")
            io.sockets.connected[pokerTable.players[nextPlayerIndex].playerId].emit('activeTurn', {});
            io.sockets.connected[players[nextPlayerIndex].playerId].emit('noCheckControls', {});
        }else{
            console.log("Computer Turn");
            simGame();
        }
    }
}

/**/
/*
 playerRaise(()
NAME

    playerRaise()

SYNOPSIS
     playerRaise(data) 
     data --> the object that is emited to the server 
DESCRIPTION
     handling the case if players are raises. emits message to say who did what. 
RETURNS
    
AUTHOR

        Lauren Mihalik

DATE

        4/12/2018

*/
/**/
function playerRaise(data){
    onePlayer=pokerTable.getPlayer(data.playerId);
    pokerTable.resetBetting();
    onePlayer.didBet = true;

    var raiseAmount=(pokerTable.minBet-onePlayer.roundBet+parseInt(data.chipAmount));

    onePlayer.chipCount-=raiseAmount;
    pokerTable.pot+=raiseAmount;

    onePlayer.roundBet+=raiseAmount;
    
    pokerTable.setBetIndex(data.playerId);

    pokerTable.minBet+=parseInt(data.chipAmount);

    var messageStr= onePlayer.playerName + " raised " + raiseAmount + "!";
    io.sockets.emit('updateMessage', {message: messageStr});

    io.sockets.emit('updateTable', {pokerTable: pokerTable, showCards:false});
    var nextPlayerIndex=pokerTable.setActivePlayer();
    if(pokerTable.players[nextPlayerIndex].playerId.substring(0,4) != "comp" ){
        io.sockets.connected[pokerTable.players[nextPlayerIndex].playerId].emit('activeTurn', {});
        io.sockets.connected[players[nextPlayerIndex].playerId].emit('noCheckControls', {});
    }else{
        simGame();
    }
}

/**/
/*
 playerCheck(()
NAME

    playerCheck()

SYNOPSIS
     playerCheck(data) 
     data --> the object that is emited to the server 
DESCRIPTION
     handling the case if players are checking. emits message to say who did what. 
RETURNS
    
AUTHOR

        Lauren Mihalik

DATE

        4/12/2018

*/
/**/
function playerCheck(data){
    onePlayer=pokerTable.getPlayer(data.playerId);
    onePlayer.didBet = true;

    var messageStr= pokerTable.players[pokerTable.activePlayerIndex].playerName + " checked!";
    var nextPlayerIndex=pokerTable.setActivePlayer();

    if(pokerTable.checkBettingComplete(nextPlayerIndex) == true){
        callDealCards();
    }
    else{
        io.sockets.emit('updateTable', {pokerTable: pokerTable, showCards:false});
        io.sockets.emit('updateMessage', {message: messageStr});

        if(pokerTable.players[nextPlayerIndex].playerId.substring(0,4) != "comp" ){
            console.log("PLAYER TURN")
            io.sockets.connected[pokerTable.players[nextPlayerIndex].playerId].emit('activeTurn', {});
            io.sockets.connected[players[pokerTable.activePlayerIndex].playerId].emit('noCallControls', {});
        }else{
            console.log("WE GOTTA SIM");
            simGame();
        }
    }
}


/**/
/*
 simGame(()
NAME

    simGame()

SYNOPSIS
     simGame()  
DESCRIPTION
     handling the case for the computer simulator. gives them an id 
     logic for what they are doing is handled here
RETURNS
    
AUTHOR

        Lauren Mihalik

DATE

        4/12/2018

*/
/**/
function simGame(){
    //add player logic with eval
    if(pokerTable.flop == true){
        var compId = pokerTable.players[pokerTable.activePlayerIndex].playerId;
        console.log('Computer Playing Id');
        console.log(compId);
        var compHand = pokerTable.evaluateHand(compId);
        console.log(compHand);
        if(compHand.handScore < 300){
            var randNum = Math.floor(Math.random() * 11);
            if(randNum <= 8){
                playerCall({playerId:pokerTable.players[pokerTable.activePlayerIndex].playerId});
            }else{
                playerRaise({chipAmount: 10, playerId:pokerTable.players[pokerTable.activePlayerIndex].playerId});
            }
        }
        else{
            if(compHand.handScore < 500){
                betAmount = 10;
            }else{
                betAmount = 30;
            }
            var randNum = Math.floor(Math.random() * 11);
            if(randNum <= 6){
                playerCall({playerId:pokerTable.players[pokerTable.activePlayerIndex].playerId});
            }else{
                playerRaise({chipAmount:betAmount, playerId:pokerTable.players[pokerTable.activePlayerIndex].playerId});
            }
        }
    }else{
        playerCall({playerId:pokerTable.players[pokerTable.activePlayerIndex].playerId});
    }
}

 http.listen(3000, function() {
    console.log('listening on localhost:3000');
 });

 const Table=require('./Table')
 var pokerTable= new Table();

 var waitRoom=[];
 var quitGame=[];
 var clients = 0;
 

 
 io.on('connection', function(socket) {
    clients++;

    if(clients > 5){
        //display wait room
        waitRoom.push(socket.id);
        socket.emit('setPlayerId',{socketId: socket.id});
        socket.emit('goToWaitRoom',{socketId: socket.id});
        return;
    }

    socket.emit('setPlayerId',{socketId: socket.id});
    
    const Player=require('./Player')
    var newPlayer= new Player(socket.id);
    pokerTable.setPlayers(newPlayer);
    
    socket.on('evaluateHands', function(data){
        pokerTable.checkWinner();
    });

    //called when player clicks ready button
    socket.on('playerReady', function(data){
        onePlayer=pokerTable.getPlayer(data.playerId);
        onePlayer.ready=true;
        onePlayer.playerName = data.playerName;

        var readyTable=pokerTable.checkReady();
        if(readyTable==true && pokerTable.activeGame==false){
            if(pokerTable.players.length > 1){
                pokerTable.resetPlayer();
                pokerTable.startGame();
                players=pokerTable.getPlayers();

                for(var index=0; index<players.length; index++){
                        if(players[index].folded==false){
                            players[index].cards=pokerTable.dealPlayerCards();
                        }
                        io.sockets.connected[players[index].playerId].emit('receiveCards', {cards: players[index].cards});
                }
                var messageStr = "Starting a round of betting!";
                io.sockets.emit('updateMessage', {message: messageStr});

                io.sockets.emit('updateTable', {pokerTable: pokerTable, showCards:false});
                io.sockets.connected[players[pokerTable.activePlayerIndex].playerId].emit('activeTurn', {});
                io.sockets.connected[players[pokerTable.activePlayerIndex].playerId].emit('noCheckControls', {});
            }
        }else if(pokerTable.activeGame==true){
            onePlayer.cards.push({"image": "playing_card_back.png"});
            onePlayer.cards.push({"image": "playing_card_back.png"});
        }
    });

    //called when player clicks ready button in sim
    socket.on('simReady', function(data){
        onePlayer=pokerTable.getPlayer(data.playerId);
        onePlayer.ready=true;
        onePlayer.playerName = data.playerName;
        if(data.numComputers>4){
            data.numComputers=4;
        }
        //create computer Players
        for(var i=0;i<parseInt(data.numComputers);i++){
            const Player=require('./Player');
            computerId = "computer"+i;
            var newPlayer= new Player(computerId);
            newPlayer.playerName = computerId;
            newPlayer.isComputer=true;
            newPlayer.ready = true;
            pokerTable.setPlayers(newPlayer);
        }
        pokerTable.resetPlayer();
        pokerTable.startGame();

        players=pokerTable.getPlayers();

        for(var index=0; index<players.length; index++){
            if(players[index].folded==false){
                players[index].cards=pokerTable.dealPlayerCards();
            }
            console.log(players[index].playerId.substring(0,4));
            if(players[index].playerId.substring(0,4) != "comp" ){
                io.sockets.connected[players[index].playerId].emit('receiveCards', {cards: players[index].cards});
            }
        }
        io.sockets.emit('updateTable', {pokerTable: pokerTable, showCards:false});
        if(players[pokerTable.activePlayerIndex].playerId.substring(0,4) == "comp"){
            playerCall({playerId:players[pokerTable.activePlayerIndex].playerId});
        }else{
            io.sockets.connected[players[pokerTable.activePlayerIndex].playerId].emit('activeTurn', {});
            //io.sockets.connected[players[pokerTable.activePlayerIndex].playerId].emit('noCheckControls', {});
        }
    });

    //calls when player clicks play again
    socket.on('playAgain', function(data){
        onePlayer=pokerTable.getPlayer(data.playerId);
        onePlayer.ready=true;

        var readyTable=pokerTable.checkReady();
        if(readyTable==true){
            if(pokerTable.players.length > 1){
                pokerTable.resetGame();
                pokerTable.startGame();
                //deal player cards
                pokerTable.dealAllPlayerCards();
                io.sockets.emit('updateTable', {pokerTable: pokerTable, showCards:false});
                io.sockets.connected[players[pokerTable.activePlayerIndex].playerId].emit('activeTurn', {});
            }
        }
    });

    //calls when player clicks sim again
    socket.on('simAgain', function(data){
        onePlayer=pokerTable.getPlayer(data.playerId);
        onePlayer.ready=true;
        pokerTable.resetGame();
        pokerTable.startGame();
        pokerTable.dealAllPlayerCards();
        io.sockets.emit('updateTable', {pokerTable: pokerTable, showCards:false});

        if(players[pokerTable.activePlayerIndex].playerId.substring(0,4) == "comp"){
            playerCall({playerId:players[pokerTable.activePlayerIndex].playerId});
        }else{
            io.sockets.connected[players[pokerTable.activePlayerIndex].playerId].emit('activeTurn', {});
        }
    });

    //called when player clicks raise
    socket.on('Raise', function(data){
        playerRaise(data);
    });

    //called when player clicks check
    socket.on('Check', function(data){
        playerCheck(data);
    });

    //called when player clicks call
    socket.on('Call', function(data){
        playerCall(data);
    });

    //called when player clicks fold
    socket.on('Fold', function(data){
        playerFold(data);
    });

    //called when player clicks allin
    //bet all players chips
    socket.on('AllIn', function(data){
        onePlayer=pokerTable.getPlayer(data.playerId);        
        //var raiseAmount=(pokerTable.minBet-onePlayer.roundBet+onePlayer.chipCount);
        var raiseAmount=onePlayer.chipCount;
        if(pokerTable.minBet < onePlayer.chipCount){
            pokerTable.minBet = onePlayer.chipCount;
        }

        onePlayer.chipCount=0;

        pokerTable.pot+=raiseAmount;

        onePlayer.roundBet+=raiseAmount;
        onePlayer.allIn = true;
        //change betting index
        pokerTable.setBetIndex(data.playerId);

        io.sockets.emit('updateTable', {pokerTable: pokerTable, showCards:false});
        var currentPlayer = pokerTable.activePlayerIndex;
        var nextPlayerIndex=pokerTable.setActivePlayer();
        
        var tableDone = pokerTable.dealEndGame();
        if(tableDone==true){
            callDealCards();
        }
        else{
            io.sockets.connected[players[nextPlayerIndex].playerId].emit('activeTurn', {});
        }
    });

   socket.on('disconnect', function () {
        clients--;
        //check if a sim game
        for(var i = 0; i<pokerTable.players.length;i++){
            if(pokerTable.players[i].isComputer==true){
                pokerTable = new Table();
                pokerTable.resetGame();
                return;
            }
        }

        if(pokerTable.activeGame == true){
            quitGame.push(socket.id);
            if(pokerTable.players[pokerTable.activePlayerIndex].playerId == socket.id){
                console.log("HERE!");
                playerFold({playerId: socket.id});
            }else{
                console.log("RHERE!");
                var quitPlayer=pokerTable.getPlayer(socket.id);
                quitPlayer.folded=true;
                //quitPlayer.didBet=true;
            }
        }else{
            pokerTable.removePlayer(socket.id);
        }

        if(pokerTable.players.length == 0){
            pokerTable = new Table();
            pokerTable.resetGame();
        }
        
   });
});