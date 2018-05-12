/*
Player class:
    just Player object when needed.
*/
class Player{
/**/
/*
constructor()
NAME

        constructor

SYNOPSIS

        constructor(newId)
        newId --> string of player id

DESCRIPTION
        constructor 

RETURNS

AUTHOR

        Lauren Mihalik

DATE

        2/1/2018

*/
/**/
    constructor(newId){
        this.chipCount=1000;
        this.playerId=newId;
        this.playerName="";
        this.ready=false;
        this.cards=[];
        this.roundBet=0;
        this.folded=true;
        this.allIn=false;
        this.isComputer=false;
        this.didBet=false;
    }
    
};
module.exports = Player;