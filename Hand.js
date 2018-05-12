/*
    Hand class: set the hand attributes when needed
    function for get hand type
*/
class Hand{
/**/
/*
constructor()
NAME

        constructor

SYNOPSIS

        constructor(playerID, cardStr)
        playerID --> string of player id
        cardStr --> string of the card to be put in array
DESCRIPTION
        constructor sets attributes of class.

RETURNS

AUTHOR

        Lauren Mihalik

DATE

        2/8/2018

*/
/**/
    constructor(playerID, cardStr){
        this.cards=[];
        this.cards=cardStr;
        this.playerId=playerID;
        //sum of all cards
        this.handScore=0;
        //sum of highest scoring card
        this.highCardScore=0;
        this.handType="";
    }

/**/
/*
setHandType()
NAME
        setHandType --> set the name of the type of hand in each combo

SYNOPSIS
        setHandType()
        
DESCRIPTION
        this function will look at the score to determine the type of hand that 
        is in the range of the score.

RETURNS

AUTHOR

        Lauren Mihalik

DATE

        4/8/2018

*/
/**/  
    setHandType(){
        if(this.handScore >= 900){
            this.handType="Royal Flush";
        }
        else if(this.handScore >= 800){
            this.handType="Straight Flush";
        }
        else if(this.handScore >= 700){
            this.handType="Four of a Kind";
        }
        else if(this.handScore >= 600){
            this.handType="Full House";
        }
        else if(this.handScore >= 500){
            this.handType="Flush";
        }
        else if(this.handScore >= 400){
            this.handType="Straight";
        }
        else if(this.handScore >= 300){
            this.handType="Three of a Kind";
        }
        else if(this.handScore >= 200){
            this.handType="Two Pair";
        }
        else if(this.handScore >= 100){
            this.handType="Pair";
        }
        else{
            this.handType="High Card";
        }
    }

}
module.exports = Hand;