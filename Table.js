/*
table class:

*/
class Table{
        /**/
/*
constructor()
NAME

        constructor

SYNOPSIS

        constructor()
        nothing is passed to constructor
DESCRIPTION
        constructor sets attributes of class.

RETURNS

AUTHOR

        Lauren Mihalik

DATE

        1/29/2018

*/
/**/
    constructor(){
        this.players=[]
        this.pot=0
        this.bigBlindIndex=-1;
        this.smallBlindIndex=-1;
        this.betIndex=0;
        this.bigBlindVal=0;
        this.smallBlindVal=0;
        this.activePlayerIndex=0;
        this.minBet=0;
        this.tableCards=[];
        this.flop=false;
        this.turn=false;
        this.river=false;
        this.deckAmount=51;
        this.deck=this.get_deck();
        this.scoreOrder = ['0','1','2','3','4','5','6','7','8','9','10','J','Q','K','A'];
        this.activeGame=false;
        this.winningString="";
    }

/**/
/*
resetGame()
NAME

        resetGame() --> reset important attributes of the game

SYNOPSIS
    resetGame()
DESCRIPTION
        reset important attributes about a game to 0, [], false, new deck,

RETURNS

AUTHOR

        Lauren Mihalik

DATE

        3/4/2018

*/
/**/
    resetGame(){
        this.pot=0
        this.tableCards=[];
        this.flop=false;
        this.turn=false;
        this.river=false;
        this.deckAmount=51;
        this.deck = this.createDeck();
        this.resetPlayer();
    }

/**/
/*
resetPlayer()
NAME

        resetPlayer() --> reset important attributes of the player

SYNOPSIS
    resetGame()
DESCRIPTION
        reset important attributes about a player in a game to 0, [], false, new deck,

RETURNS

AUTHOR

        Lauren Mihalik

DATE

        3/4/2018

*/
/**/
    resetPlayer(){
        for( var index=0; index<this.players.length; index++){
            this.players[index].cards=[];
            this.players[index].folded=false;
            this.players[index].roundBet=0;
            this.players[index].allIn=false;
            //if player has no money folded = true
            if(this.players[index].chipCount == 0){
                this.players[index].folded=true;
            }
           
        }
    }

/**/
/*
createDeck()
NAME

        createDeck()--> reset important attributes of the player

SYNOPSIS
    createDeck()
DESCRIPTION
        this deck is not manipulated during the game so we call it to set the deck.

RETURNS
    the array of the deck
AUTHOR

        Lauren Mihalik

DATE

        1/29/2018

*/
/**/
    createDeck(){
        var newDeck=["2D",
        "2H",
        "2S",
        "2C",
        "3D",
        "3H",
        "3S",
        "3C",
        "4D",
        "4H",
        "4S",
        "4C",
        "5D",
        "5H",
        "5S",
        "5C",
        "6D",
        "6H",
        "6S",
        "6C",
        "7D",
        "7H",
        "7S",
        "7C",
        "8D",
        "8H",
        "8S",
        "8C",
        "9D",
        "9H",
        "9S",
        "9C",
        "10D",
        "10H",
        "10S",
        "10C",
        "JD",
        "JH",
        "JS",
        "JC",
        "QD",
        "QH",
        "QS",
        "QC",
        "KD",
        "KH",
        "KS",
        "KC",
        "AD",
        "AH",
        "AS",
        "AC"];
        return newDeck;
    }

/**/
/*
 get_deck(()
NAME

         get_deck()--> reset important attributes of the player

SYNOPSIS
     get_deck(()
DESCRIPTION
        this deck is manipulated during the game so we will lose cards as the rounds increments

RETURNS
    the array of the deck
AUTHOR

        Lauren Mihalik

DATE

        1/29/2018

*/
/**/
    get_deck(){
        var deck=["2D",
        "2H",
        "2S",
        "2C",
        "3D",
        "3H",
        "3S",
        "3C",
        "4D",
        "4H",
        "4S",
        "4C",
        "5D",
        "5H",
        "5S",
        "5C",
        "6D",
        "6H",
        "6S",
        "6C",
        "7D",
        "7H",
        "7S",
        "7C",
        "8D",
        "8H",
        "8S",
        "8C",
        "9D",
        "9H",
        "9S",
        "9C",
        "10D",
        "10H",
        "10S",
        "10C",
        "JD",
        "JH",
        "JS",
        "JC",
        "QD",
        "QH",
        "QS",
        "QC",
        "KD",
        "KH",
        "KS",
        "KC",
        "AD",
        "AH",
        "AS",
        "AC"];
        return deck;
    }

    //sets player to the table array
    setPlayers(user){
        this.players.push(user);
    }

    //returns the players array
    getPlayers(){
        return this.players;
    }

    //sets the table pot
    setPot(count){
        this.pot+=count;
    }
    
    //returns the table pot
    getPot(){
        return this.pot;
    }

    //deals player cards
    dealPlayerCards(){
        var cardArr=[];
        cardArr.push(this.dealCard());
        cardArr.push(this.dealCard());
        return cardArr;
    }

    //takes in player socket id and returns player object
    getPlayer(playerId){
        for(var index=0; index<this.players.length; index++){
            if(this.players[index].playerId == playerId){
                return this.players[index];
            }
        }
    }

    //takes in player socket id and returns their index in the array
    getPlayerIndex(playerId){
        for(var index=0; index<this.players.length; index++){
            if(this.players[index].playerId == playerId){
                return index;
            }
        }
    }

    //increments the table betindex
    setBetIndex(playerId){
        for(var index=0; index<this.players.length; index++){
            if(this.players[index].playerId == playerId){
                this.betIndex=index;
            }
        }
    }

    //set active player index on table and reuturn the active player
    setActivePlayer(){
        var activeInd=this.activePlayerIndex;

        for(var index=1; index<=this.players.length; index++){
            activeInd++;
            if( activeInd >= players.length){
                activeInd=0;
            }
            if(this.players[activeInd].folded == false){
                if(this.players[activeInd].allIn == false){
                    this.activePlayerIndex=activeInd;
                    return this.activePlayerIndex;
                }
            }
        }
    }

    //checks if the player.ready attribute = true
    //returns true if they are all ready, otherwise returns false
    checkReady(){
        var trueCount=0;
        for(var index=0; index<this.players.length; index++){
            if(this.players[index].ready==true){
                trueCount++;
            }
        }
        if(trueCount == this.players.length){
            return true;
        }
        return false;
    }

    //removes the player from the player array by socketid
    removePlayer(socketId){
        for(var index=0; index<this.players.length; index++){
            if(this.players[index].playerId==socketId){
               this.players.splice(index, 1);
            }
        }
    }

    //Starts the game
    startGame(){
        this.activeGame=true;
        //increment the big blind
        this.bigBlindIndex++;
        if(this.bigBlindIndex >= this.players.length){
            this.bigBlindIndex=0;
        }
        //set the small blind
        this.smallBlindIndex=this.bigBlindIndex-1;
        if(this.smallBlindIndex < 0 ){
            this.smallBlindIndex=this.players.length-1;
        }
        this.betIndex=this.bigBlindIndex;
        //incrememnt the blinds
        this.bigBlindVal+=10;
        this.smallBlindVal+=5;

        //subtract big blind from player
        this.players[this.bigBlindIndex].chipCount-=this.bigBlindVal;
        this.players[this.bigBlindIndex].didBet=true;
        this.pot+=this.bigBlindVal;

        this.players[this.bigBlindIndex].roundBet+=this.bigBlindVal;
        
        //subtract small blind from player --> add to pot
        this.players[this.smallBlindIndex].chipCount-=this.smallBlindVal;
        this.pot+=this.smallBlindVal; 
        
        this.players[this.smallBlindIndex].roundBet+=this.smallBlindVal;
        //setting active player
        this.activePlayerIndex=this.bigBlindIndex+1;
        if(this.activePlayerIndex >= this.players.length){
            this.activePlayerIndex=0;
        }

        this.minBet=this.bigBlindVal;
    }

    //Checks if the betting round is complete
    checkBettingComplete(nextPlayer){
        var didBetCount=0;
        var activePlayer=0;

        for(var index=0; index<this.players.length; index++){
            if(this.players[index].folded == false && this.players[index].allIn == false){
                activePlayer++;
            }
            if(this.players[index].didBet == true){
                didBetCount++;
            }
        }
        if(didBetCount==activePlayer){
            return true;
        }
        return false;
    }

    //reset the betting round 
    //called if someone raises, next card, or new round
    resetBetting(){
        for(var index=0; index<this.players.length; index++){
            if(this.players[index].folded == false && this.players[index].allIn == false){
                this.players[index].didBet=false;
            }
        }
    }

    //deals a card from the deck
    dealCard(){
        const Card=require('./Card')
        
        //var deck=this.get_deck();
        var value1 = Math.floor((Math.random()*this.deckAmount)+1);
        var oneCard=this.deck[value1];
        var newCard= new Card(oneCard);
        
        this.deck.splice(value1, 1);
        this.deckAmount--;

        return newCard;
    }

    //resets attribute for next card deal
    setUpDealRound(){
        this.resetBetting();
        this.minBet = 0;
        for(var i = 0; i < this.players.length;i++){
            this.players[i].roundBet = 0;
        }
    }

    //ends the game if everyone folds
    endGame(){
        var foldCount=0;
        for(var i=0;i<this.players.length;i++){
            if(this.players[i].folded == true){
                foldCount++;
            }
        }
        if(foldCount == this.players.length-1){
            this.flop=true;
            this.turn=true;
            this.river=true;
            return true;
        }
        return false;
    }

    //deals to the end of the game if all in
    dealEndGame(){
        var foldCount=0;
        var allInCount=0;
        var activeCount=0;

        for(var i=0;i<this.players.length;i++){
            if(this.players[i].folded == true){
                foldCount++;
            }
            else if(this.players[i].allIn == true){
                allInCount++;
            }
            else{
                activeCount++;
            }
        }
        var countSum = allInCount + foldCount;
        if(countSum == this.players.length || activeCount == 1){
            if(foldCount ==  this.players.length-1){
                //everyone else folded
                this.flop=true;
                this.turn=true;
                this.river=true;
            }else{
                //all in situation
                if(this.flop==false){
                    this.dealCards();
                    this.dealCards();
                }else if(this.turn==false){
                    this.dealCards();
                }
            }
            return true;
        }
        return false;
    }

   /**/
/*
 dealCards(()
NAME

    dealCards()

SYNOPSIS
     dealCards()
DESCRIPTION
    check if player in players array is not folded and call deal cards function.
RETURNS
AUTHOR

        Lauren Mihalik

DATE

        3/2/2018

*/
/**/
    //deals cards for the table
    dealCards(){
        this.setUpDealRound();
        this.endGame();
        if(this.flop==false){
            //deal 3 cards
            this.tableCards.push(this.dealCard());
            this.tableCards.push(this.dealCard());
            this.tableCards.push(this.dealCard());
            
            this.flop=true;
        }
        else if(this.turn==false){
            this.tableCards.push(this.dealCard());
            this.turn=true;
            //deal 1 card
        }
        else if(this.river==false){
            //deal 1 card
            this.tableCards.push(this.dealCard());
            this.river=true;
        }
        else{
            //evaluate winner
            var winningHand=this.checkWinner();
            var winner=this.getPlayer(winningHand.playerId);
            this.winningString = "GAME OVER! " + winner.playerName + " won $" + this.pot;
            this.winningString += " with a " + winningHand.handType; 
            winner.chipCount+=this.pot;
            
            return false;
        }
        //setting active player back to small blind or next player after if folded
        this.activePlayerIndex=this.smallBlindIndex-1;
        if(this.activePlayerIndex <0){
            this.activePlayerIndex=players.length;
        }
        this.betIndex = this.setActivePlayer();
        return true;
    }

    /**/
/*
 dealAllPlayerCards(()
NAME

    dealAllPlayerCards()

SYNOPSIS
     dealAllPlayerCards()
DESCRIPTION
    check if player in players array is not folded and call deal cards function.
RETURNS
AUTHOR

        Lauren Mihalik

DATE

        3/2/2018

*/
/**/
    //deals all player hands
    // used to set up new round
    dealAllPlayerCards(){
        for(var index=0; index<this.players.length; index++){
            if(this.players[index].folded==false){
                this.players[index].cards=this.dealPlayerCards();
            }
        }
    }

    /**/
/*
 evaluateHand(()
NAME

    evaluateHand()

SYNOPSIS
     evaluateHand(playerId)
     playerId --> id of the specific player 
DESCRIPTION
    making the 7 card array of 2 player cards and 5 table cards
    finds the best hand for this player.
RETURNS
    returns the array of the players hand.
AUTHOR

        Lauren Mihalik

DATE

        3/19/2018

*/
/**/
    //Looks for the best hand for the given player id
    evaluateHand(playerId){
        var sevenCardArr=[];
        var totalCardStr=[];
        var player=this.getPlayer(playerId);
        
        //getting each player card into array
        for(var index=0; index<player.cards.length; index++){
            sevenCardArr.push(player.cards[index]);
        }

        //getting table cards into array
        for(var index=0; index<this.tableCards.length; index++){
            sevenCardArr.push(this.tableCards[index]);
        }

        //getting card string from cards
        for(var i=0; i<sevenCardArr.length; i++){
            totalCardStr.push(sevenCardArr[i].cardString);
        }

        var comboArray = this.getCombo(totalCardStr);
        
        const Hand=require('./Hand')
        var playerHand= new Hand(playerId, []);

        //loop over comboarray
        for(var x = 0; x < comboArray.length;x++){
            //score hand returns array, [0] initial score [1] total hand score
            var scoreArr = this.scoreHand(comboArray[x]);
            //compare hands
            if(scoreArr[0] > playerHand.highCardScore){
                //set best compared hand == besthand
                playerHand.highCardScore = scoreArr[0];
                playerHand.handScore = scoreArr[1];
                playerHand.cards = comboArray[x];
            }
            else if(scoreArr[0] == playerHand.highCardScore){
                if(scoreArr[1] > playerHand.handScore){
                    //tie breaker
                    //set best compared hand == besthand
                    playerHand.highCardScore = scoreArr[0];
                    playerHand.handScore = scoreArr[1];
                    playerHand.cards = comboArray[x];
                }
            }
        }
        playerHand.setHandType();
        return playerHand;
    }

     /**/
/*
 scoreHand(()
NAME

    scoreHand()

SYNOPSIS
     scoreHand(cardArray)
     cardArray --> is the array of the hand  
DESCRIPTION
    this function will call the fucntions that check the different hands
    it will see if tts true and set the score.
RETURNS
    returns the array of the score and hand
AUTHOR

        Lauren Mihalik

DATE

        3/18/2018

*/
/**/
    //evaluates the score for the provided 5card hand
    scoreHand(cardArray){
        cardArray = this.sortHand(cardArray);
        var score = 0;
        var highCardVal = 0;
        var cardVal = "";
        var handVal = 0;
        var cardScore=0;
        //check for 9 possible hands & assign score
        //check for flush, if false skip royal, straight flush, and flush
        var isFlush = this.checkFlush(cardArray);

        if(isFlush == true){
            //check royal flush 900 no high required
            if(this.checkRoyalFlush(cardArray) == true){
                score = 900;
                return [score,score];
            }
            //check straight flush 800 + high
            if(this.checkStraight(cardArray) == true){
                cardVal = cardArray[4].substring(0,cardArray[4].length-1);
                highCardVal = this.scoreOrder.indexOf(cardVal);
                score = 800 + highCardVal;
                handVal=this.getHandScore(cardArray) +800;
                return [score,handVal]
            }
        }
        //check 4kind 700 + high
        if(this.checkFourKind(cardArray)==true){
            cardVal = cardArray[4].substring(0,cardArray[4].length-1);
            highCardVal = this.scoreOrder.indexOf(cardVal);
            handVal=this.getHandScore(cardArray) +700;
            score = 700 + highCardVal;
            return [score,handVal];
        }
        //check full house 600 + high + low
        //get 3 of kind
        var threeKindVal = this.checkThreeKind(cardArray);
        if(threeKindVal != 0){
           var fullHouseVal = this.checkFullhouse(cardArray,threeKindVal);
            if(fullHouseVal !=0){
                score = 600 + threeKindVal+threeKindVal+fullHouseVal;
                return [score,score];
            }    
        }
        //check flush score 500 + high
        if(isFlush == true){
            cardVal = cardArray[4].substring(0,cardArray[4].length-1);
            highCardVal = this.scoreOrder.indexOf(cardVal);
            score = 500 + highCardVal;
            handVal=this.getHandScore(cardArray) + 500;
            return [score,handVal];
        }
        //check straight 400 + high
        if(this.checkStraight(cardArray) == true){
            cardVal = cardArray[4].substring(0,cardArray[4].length-1);
            highCardVal = this.scoreOrder.indexOf(cardVal);
            score = 400 + highCardVal;
            return [score,score];
        }
        //check 3kind 300 + high
        if(threeKindVal != 0){
            score = 300 + threeKindVal;
            handVal=this.getHandScore(cardArray) + 300;
            return [score,handVal];
        }
        //check 2pair 200 + high + low
        var checkPairVal = this.checkPair(cardArray);
        if(checkPairVal !=0){
            var checkTwoPairVal = this.checkTwoPair(cardArray,checkPairVal)
            if(checkTwoPairVal != 0){
                score = 200 + checkTwoPairVal + checkPairVal;
                handVal=this.getHandScore(cardArray) + 200;
                return [score,handVal];
            }
        }
        //check 1pair 100 + high
        if(checkPairVal !=0){
            score = 100  + checkPairVal;
            handVal=this.getHandScore(cardArray) + 100;
            return [score,handVal];
        }
        //check high + highval
        cardVal = cardArray[4].substring(0,cardArray[4].length-1);
        cardScore = this.scoreOrder.indexOf(cardVal);
        highCardVal = this.scoreOrder.indexOf(cardVal);
        score = highCardVal;
        handVal=this.getHandScore(cardArray);
        return [score,handVal];
    }

     /**/
/*
 sortHand(()
NAME

    sortHand()

SYNOPSIS
     sortHand(cardArray)
     cardArray --> is the array of the hand  
DESCRIPTION
     sort the hand by the scsore value
RETURNS
    returns the sorted array to be used
AUTHOR

        Lauren Mihalik

DATE

        3/18/2018

*/
/**/
    //sorts the hand by scorevalue
    sortHand(cardArray){
        var sortedArray=[];
        for(var i=0;i<cardArray.length;i++){
            if(sortedArray.length == 0 ){
                sortedArray.push(cardArray[i]);
            }
            else{
                var cardVal = cardArray[i].substring(0,cardArray[i].length-1);
                var cardScore = this.scoreOrder.indexOf(cardVal);
                var sortLength = sortedArray.length
                var added = false;
                for(var x = 0; x<sortLength;x++){
                    var sortedVal = sortedArray[x].substring(0,sortedArray[x].length-1);
                    var sortedScore = this.scoreOrder.indexOf(sortedVal);
                    if(cardScore < sortedScore){
                        sortedArray.splice(x,0,cardArray[i]);
                        added = true;
                        break;
                    }
                }
                if(added == false){
                    sortedArray.push(cardArray[i]);
                }
            }
        }
        return sortedArray;
    }

 /**/
/*
 checkFlush(()
NAME

    checkFlush()

SYNOPSIS
     checkFlush(cardArray)
     cardArray --> is the array of the hand  
DESCRIPTION
     this function handles if there is a  flush in the hand
RETURNS
    returns the hand card count of the hand object
AUTHOR

        Lauren Mihalik

DATE

        3/16/2018

*/
/**/
    checkFlush(cardArray){
        //cardArray = ['5h','4h','3h']
        var suit="";
        for(var i=0;i<cardArray.length;i++){
            var cardSuit = cardArray[i].substring(cardArray[i].length-1);
            if(suit==""){
                suit = cardSuit;
            }
            else if(cardSuit != suit){
                return false;
            }
        }
        return true;
    }

 /**/
/*
 checkRoyalFlush(()
NAME

    checkRoyalFlush()

SYNOPSIS
     checkRoyalFlush(cardArray)
     cardArray --> is the array of the hand  
DESCRIPTION
     this function handles if there is a royal flush in the hand
RETURNS
    returns the hand card count of the hand object
AUTHOR

        Lauren Mihalik

DATE

        3/16/2018

*/
/**/
    checkRoyalFlush(cardArray){
        //royal flush is 10 - A
        //array is sorted
        var firstCardVal = cardArray[0].substring(0, cardArray[0].length-1);
        var secondCardVal = cardArray[4].substring(0, cardArray[4].length-1);

        if(firstCardVal == '10' && secondCardVal == 'A'){
            return true;
        }
        else{
            return false;
        }
    }

 /**/
/*
 checkStraight(()
NAME

    checkStraight()

SYNOPSIS
     checkStraight(cardArray)
     cardArray --> is the array of the hand  
DESCRIPTION
     this function handles if there is a striaght in the hand
RETURNS
    returns the hand card count of the hand object
AUTHOR

        Lauren Mihalik

DATE

        3/16/2018

*/
/**/
    checkStraight(cardArray){
        var scoreCardArray = []
        var startPos = 0;

        for(var i = 0; i < cardArray.length; i++){
            var cardVal = cardArray[i].substring(0,cardArray[i].length-1);
            var cardScore = this.scoreOrder.indexOf(cardVal);
            if(startPos == 0 ){
                startPos = cardScore;
            }
            scoreCardArray.push(cardVal);
        }

        var checkArray = this.scoreOrder.slice(startPos, startPos + 5);

        if(scoreCardArray.toString()==checkArray.toString()){
			return true;
        }else{
            return false;
        }
    }

       /**/
/*
 checkFourKind(()
NAME

    checkFourKind()

SYNOPSIS
     checkFourKind(cardArray)
     cardArray --> is the array of the hand  
DESCRIPTION
     this function handles if there is a four of a kind in the hand
RETURNS
    returns the hand card count of the hand object
AUTHOR

        Lauren Mihalik

DATE

        3/16/2018

*/
/**/
    checkFourKind(cardArray){
        var scoreCardArray = [];
        var startPos = 0;
        for(var i = 0; i < cardArray.length; i++){
            var cardVal = cardArray[i].substring(0,cardArray[i].length-1);
            var cardScore = this.scoreOrder.indexOf(cardVal);
            if(startPos == 0 ){
                startPos = cardScore;
            }
            scoreCardArray.push(cardVal);
        }
        if(scoreCardArray[0]==scoreCardArray[1] && scoreCardArray[1]==scoreCardArray[2] && scoreCardArray[2]==scoreCardArray[3]){
            return true;
        }else{
            return false;
        }
    }

    /**/
/*
 checkFullhouse(()
NAME

    checkFullhouse()

SYNOPSIS
     checkFullhouse(cardArray)
     cardArray --> is the array of the hand  
DESCRIPTION
     this function handles if there is a full house in the different combinations
RETURNS
    returns the hand card count of the hand object
AUTHOR

        Lauren Mihalik

DATE

        3/16/2018

*/
/**/
    checkFullhouse(cardArray,threeKindVal){
        var scoreCardArray = [];
        var cardcount = 0;
        for(var i = 0; i < cardArray.length; i++){
            var cardVal = cardArray[i].substring(0,cardArray[i].length-1);
            var cardScore = this.scoreOrder.indexOf(cardVal);
            scoreCardArray.push(cardScore);
        }
        for(var i=0;i<scoreCardArray.length;i++){
            var checkcard = scoreCardArray[i];
            cardcount=0;
            for(var x=0;x<scoreCardArray.length;x++){
              if(scoreCardArray[x]==checkcard){
                cardcount++;
              }
            }
            console.log(cardcount);
            console.log(checkcard);
            console.log(threeKindVal);
            if(cardcount==2){
                if(checkcard == threeKindVal){
                    cardcount = 0;
                }else{
                    return checkcard;
                    break;
                }
            }
            else{
              cardcount = 0;
            }
        }
        return cardcount;
    }

    /**/
/*
 checkThreeKind(()
NAME

    checkThreeKind()

SYNOPSIS
     checkThreeKind(cardArray)
     cardArray --> is the array of the hand  
DESCRIPTION
     this function handles if there is a three of a kind in the different combinations
RETURNS
    returns the hand card count of the hand object
AUTHOR

        Lauren Mihalik

DATE

        3/15/2018

*/
/**/
    checkThreeKind(cardArray){
        var scoreCardArray = [];
        var cardcount=0;
        for(var i = 0; i < cardArray.length; i++){
            var cardVal = cardArray[i].substring(0,cardArray[i].length-1);
            var cardScore = this.scoreOrder.indexOf(cardVal);
            scoreCardArray.push(cardScore);
        }
        for(var i=0;i<scoreCardArray.length;i++){
            var checkcard = scoreCardArray[i];
            cardcount=0;
            for(var x=0;x<scoreCardArray.length;x++){
              if(scoreCardArray[x]==checkcard){
                cardcount++;
              }
            }
            if(cardcount==3){
              return checkcard;
              break;
            }
            else{
              cardcount = 0;
            }
        }
        return cardcount;
    }

    /**/
/*
 checkPair(()
NAME

    checkPair()

SYNOPSIS
     checkPair(cardArray)
     cardArray --> is the array of the hand  
DESCRIPTION
     this function handles if there is a pair in the different combinations
RETURNS
    returns the hand card count of the hand object
AUTHOR

        Lauren Mihalik

DATE

        3/15/2018

*/
/**/
    checkPair(cardArray){
        var scoreCardArray = [];
        var cardcount=0;
        for(var i = 0; i < cardArray.length; i++){
            var cardVal = cardArray[i].substring(0,cardArray[i].length-1);
            var cardScore = this.scoreOrder.indexOf(cardVal);
            scoreCardArray.push(cardScore);
        }
        for(var i=0;i<scoreCardArray.length;i++){
            var checkcard = scoreCardArray[i];
            cardcount=0;
            for(var x=0;x<scoreCardArray.length;x++){
              if(scoreCardArray[x]==checkcard){
                cardcount++;
              }
            }
            if(cardcount==2){
              return checkcard;
              break;
            }
            else{
              cardcount = 0;
            }
        }
        return cardcount;
    }

/**/
/*
 checkTwoPair(()
NAME

    checkTwoPair()

SYNOPSIS
     checkTwoPair(cardArray) 
     cardArray --> is the array of the hand  
DESCRIPTION
     this function handles if there is a two pair in the different combinations
RETURNS
    returns the hand card count of the hand object
AUTHOR

        Lauren Mihalik

DATE

        3/15/2018

*/
/**/
    checkTwoPair(cardArray,twoKindVal){
        var scoreCardArray = [];
        var cardcount = 0;
        for(var i = 0; i < cardArray.length; i++){
            var cardVal = cardArray[i].substring(0,cardArray[i].length-1);
            var cardScore = this.scoreOrder.indexOf(cardVal);
            scoreCardArray.push(cardScore);
        }
        for(var i=0;i<scoreCardArray.length;i++){
            var checkcard = scoreCardArray[i];
            cardcount=0;
            for(var x=0;x<scoreCardArray.length;x++){
              if(scoreCardArray[x]==checkcard){
                cardcount++;
              }
            }
            if(cardcount==2){
                if(checkcard == twoKindVal){
                    cardcount = 0;
                }else{
                    return checkcard;
                    break;
                }
            }
            else{
              cardcount = 0;
            }
        }
        return cardcount;
    }

    /**/
/*
 getHandScore(()
NAME

    getHandScore()

SYNOPSIS
     getHandScore()  
DESCRIPTION
     loop through the srray and get the hand score
RETURNS
    returns the hand score from the Hand class
AUTHOR

        Lauren Mihalik

DATE

        3/12/2018

*/
/**/
    getHandScore(cardArray){
        var handScore=0;
        for(var i = 0; i < cardArray.length; i++){
            var cardVal = cardArray[i].substring(0,cardArray[i].length-1);
            var cardScore = this.scoreOrder.indexOf(cardVal);
            handScore+=cardScore;
        }
        return handScore;
    }

/**/
/*
 generateCombinations(()
NAME

    generateCombinations()

SYNOPSIS
     generateCombinations(size, cardsArr, workingArr, returnArr) 
           cardsArr --> array of cards
           workingArr --> array building
           returnArr --> array to be returned
           size -->inteher of size of array
DESCRIPTION
        recursive function to generate all possible combos of cards
RETURNS
    
AUTHOR

        Lauren Mihalik

DATE

        4/21/2018

*/
/**/
    //generates all combinations of possible 5 cards
    //with 7 cards we expect 21 combinations
    generateCombinations(size, cardsArr, workingArr, returnArr){
        if (size == 0) {
            if (workingArr.length > 0) {
                returnArr[returnArr.length] = workingArr;
            }
            return;
        }
        for (var i = 0; i < cardsArr.length; i++) {
            this.generateCombinations(size - 1, cardsArr.slice(i + 1), workingArr.concat([cardsArr[i]]), returnArr);
        }
        return;
    }

/**/
/*
 getCombo(()
NAME

    getCombo()

SYNOPSIS
     getCombo(cardsArr) --> array of cards
DESCRIPTION
        create array and call generate combo
RETURNS
    the array of the different combos
AUTHOR

        Lauren Mihalik

DATE

        4/21/2018

*/
/**/
    getCombo(cardsArr){
        var comboArray = [];
        this.generateCombinations(5,cardsArr, [], comboArray);
        return comboArray;
    }

/**/
/*
 checkWinner(()
NAME

         checkWinner()

SYNOPSIS
     checkWinner()
DESCRIPTION
        evaluates cards, and compares to find the highest high card score to determine winner.
RETURNS
    the winning hand
AUTHOR

        Lauren Mihalik

DATE

        4/27/2018

*/
/**/
    checkWinner(){
        var tableHands = [];
        for(var i=0; i<this.players.length; i++){
            if(this.players[i].folded == false){
                var playerHand = this.evaluateHand(this.players[i].playerId);
                tableHands.push(playerHand);
            }
        }

        var winningHand=tableHands[0];

        for(var x = 1;x<tableHands.length;x++){
            if(tableHands[x].highCardScore > winningHand.highCardScore){
                winningHand=tableHands[x];
            }else if(tableHands[x].highCardScore == winningHand.highCardScore){
                if(tableHands[x].handScore > winningHand.handScore){
                    winningHand=tableHands[x];
                }
            }
        }
        
        console.log("Winning Hand:");
        console.log(winningHand);
        return winningHand;

    }

};
module.exports = Table;