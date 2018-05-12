/**********************************
Card class:
    hold card what makes up a card
    string, suit, number, image
***********************************/

class Card{

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

        2/22/2018

*/
/**/
    constructor(cardStr){
        this.cardString=""
        this.cardString=cardStr;
        this.suit=this.cardString.substring(this.cardString.length-1);

        //gets 5 out of "5H"
        this.number=this.cardString.substring(0, this.cardString.length-1);

        this.image

        var suitString;
        if(this.suit == "H"){
            suitString="hearts";
        }
        else if(this.suit == "D"){
            suitString="diamonds";
        }
        else if(this.suit == "C"){
            suitString="clubs";
        }
        else if(this.suit == "S"){
            suitString="spades";
        }
        
        this.image=this.number+"_of_"+suitString+".png";

        if(this.number == "J"){
            this.image="jack_of_"+suitString+"2.png";
        }

        else if(this.number == "Q"){
            this.image="queen_of_"+suitString+"2.png";
        }

        else if(this.number == "K"){
            this.image="king_of_"+suitString+"2.png";
        }

        else if(this.number == "A"){
            this.image="ace_of_"+suitString+".png";
        }
    }  


    setColor(color){
        this._color=color;
    }

    getColor(){
        return this._color
    }
     
}
module.exports = Card;