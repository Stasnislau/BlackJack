import Two_Hearts from "../assets/cards/two_hearts.svg";
import Three_Hearts from "../assets/cards/three_hearts.svg";
import Four_Hearts from "../assets/cards/four_hearts.svg";
import Five_Hearts from "../assets/cards/five_hearts.svg";
import Six_Hearts from "../assets/cards/six_hearts.svg";
import Seven_Hearts from "../assets/cards/seven_hearts.svg";
import Eight_Hearts from "../assets/cards/eight_hearts.svg";
import Nine_Hearts from "../assets/cards/nine_hearts.svg";
import Ten_Hearts from "../assets/cards/ten_hearts.svg";
import Jack_Hearts from "../assets/cards/jack_hearts.svg";
import Queen_Hearts from "../assets/cards/queen_hearts.svg";
import King_Hearts from "../assets/cards/king_hearts.svg";
import Ace_Hearts from "../assets/cards/ace_hearts.svg";
import Two_Diamonds from "../assets/cards/two_diamonds.svg";
import Three_Diamonds from "../assets/cards/three_diamonds.svg";
import Four_Diamonds from "../assets/cards/four_diamonds.svg";
import Five_Diamonds from "../assets/cards/five_diamonds.svg";
import Six_Diamonds from "../assets/cards/six_diamonds.svg";
import Seven_Diamonds from "../assets/cards/seven_diamonds.svg";
import Eight_Diamonds from "../assets/cards/eight_diamonds.svg";
import Nine_Diamonds from "../assets/cards/nine_diamonds.svg";
import Ten_Diamonds from "../assets/cards/ten_diamonds.svg";
import Jack_Diamonds from "../assets/cards/jack_diamonds.svg";
import Queen_Diamonds from "../assets/cards/queen_diamonds.svg";
import King_Diamonds from "../assets/cards/king_diamonds.svg";
import Ace_Diamonds from "../assets/cards/ace_diamonds.svg";
import Two_Clubs from "../assets/cards/two_clubs.svg";
import Three_Clubs from "../assets/cards/three_clubs.svg";
import Four_Clubs from "../assets/cards/four_clubs.svg";
import Five_Clubs from "../assets/cards/five_clubs.svg";
import Six_Clubs from "../assets/cards/six_clubs.svg";
import Seven_Clubs from "../assets/cards/seven_clubs.svg";
import Eight_Clubs from "../assets/cards/eight_clubs.svg";
import Nine_Clubs from "../assets/cards/nine_clubs.svg";
import Ten_Clubs from "../assets/cards/ten_clubs.svg";
import Jack_Clubs from "../assets/cards/jack_clubs.svg";
import Queen_Clubs from "../assets/cards/queen_clubs.svg";
import King_Clubs from "../assets/cards/king_clubs.svg";
import Ace_Clubs from "../assets/cards/ace_clubs.svg";
import Two_Spades from "../assets/cards/two_spades.svg";
import Three_Spades from "../assets/cards/three_spades.svg";
import Four_Spades from "../assets/cards/four_spades.svg";
import Five_Spades from "../assets/cards/five_spades.svg";
import Six_Spades from "../assets/cards/six_spades.svg";
import Seven_Spades from "../assets/cards/seven_spades.svg";
import Eight_Spades from "../assets/cards/eight_spades.svg";
import Nine_Spades from "../assets/cards/nine_spades.svg";
import Ten_Spades from "../assets/cards/ten_spades.svg";
import Jack_Spades from "../assets/cards/jack_spades.svg";
import Queen_Spades from "../assets/cards/queen_spades.svg";
import King_Spades from "../assets/cards/king_spades.svg";
import Ace_Spades from "../assets/cards/ace_spades.svg";
import Back from "../assets/cards/back.svg";

interface CardItem {
    Rank: "Two" | "Three" | "Four" | "Five" | "Six" | "Seven" | "Eight" | "Nine" | "Ten" | "Jack" | "Queen" | "King" | "Ace" | "Hidden";
    Suit: "Hearts" | "Diamonds" | "Clubs" | "Spades" | "Hidden";
    Picture: string;
}

export const cards: CardItem[] = [
    { Rank: "Two", Suit: "Hearts", Picture: Two_Hearts },
    { Rank: "Three", Suit: "Hearts", Picture: Three_Hearts },
    { Rank: "Four", Suit: "Hearts", Picture: Four_Hearts },
    { Rank: "Five", Suit: "Hearts", Picture: Five_Hearts },
    { Rank: "Six", Suit: "Hearts", Picture: Six_Hearts },
    { Rank: "Seven", Suit: "Hearts", Picture: Seven_Hearts },
    { Rank: "Eight", Suit: "Hearts", Picture: Eight_Hearts },
    { Rank: "Nine", Suit: "Hearts", Picture: Nine_Hearts },
    { Rank: "Ten", Suit: "Hearts", Picture: Ten_Hearts },
    { Rank: "Jack", Suit: "Hearts", Picture: Jack_Hearts },
    { Rank: "Queen", Suit: "Hearts", Picture: Queen_Hearts },
    { Rank: "King", Suit: "Hearts", Picture: King_Hearts },
    { Rank: "Ace", Suit: "Hearts", Picture: Ace_Hearts },
    { Rank: "Two", Suit: "Diamonds", Picture: Two_Diamonds },
    { Rank: "Three", Suit: "Diamonds", Picture: Three_Diamonds },
    { Rank: "Four", Suit: "Diamonds", Picture: Four_Diamonds },
    { Rank: "Five", Suit: "Diamonds", Picture: Five_Diamonds },
    { Rank: "Six", Suit: "Diamonds", Picture: Six_Diamonds },
    { Rank: "Seven", Suit: "Diamonds", Picture: Seven_Diamonds },
    { Rank: "Eight", Suit: "Diamonds", Picture: Eight_Diamonds },
    { Rank: "Nine", Suit: "Diamonds", Picture: Nine_Diamonds },
    { Rank: "Ten", Suit: "Diamonds", Picture: Ten_Diamonds },
    { Rank: "Jack", Suit: "Diamonds", Picture: Jack_Diamonds },
    { Rank: "Queen", Suit: "Diamonds", Picture: Queen_Diamonds },
    { Rank: "King", Suit: "Diamonds", Picture: King_Diamonds },
    { Rank: "Ace", Suit: "Diamonds", Picture: Ace_Diamonds },
    { Rank: "Two", Suit: "Clubs", Picture: Two_Clubs },
    { Rank: "Three", Suit: "Clubs", Picture: Three_Clubs },
    { Rank: "Four", Suit: "Clubs", Picture: Four_Clubs },
    { Rank: "Five", Suit: "Clubs", Picture: Five_Clubs },
    { Rank: "Six", Suit: "Clubs", Picture: Six_Clubs },
    { Rank: "Seven", Suit: "Clubs", Picture: Seven_Clubs },
    { Rank: "Eight", Suit: "Clubs", Picture: Eight_Clubs },
    { Rank: "Nine", Suit: "Clubs", Picture: Nine_Clubs },
    { Rank: "Ten", Suit: "Clubs", Picture: Ten_Clubs },
    { Rank: "Jack", Suit: "Clubs", Picture: Jack_Clubs },
    { Rank: "Queen", Suit: "Clubs", Picture: Queen_Clubs },
    { Rank: "King", Suit: "Clubs", Picture: King_Clubs },
    { Rank: "Ace", Suit: "Clubs", Picture: Ace_Clubs },
    { Rank: "Two", Suit: "Spades", Picture: Two_Spades },
    { Rank: "Three", Suit: "Spades", Picture: Three_Spades },
    { Rank: "Four", Suit: "Spades", Picture: Four_Spades },
    { Rank: "Five", Suit: "Spades", Picture: Five_Spades },
    { Rank: "Six", Suit: "Spades", Picture: Six_Spades },
    { Rank: "Seven", Suit: "Spades", Picture: Seven_Spades },
    { Rank: "Eight", Suit: "Spades", Picture: Eight_Spades },
    { Rank: "Nine", Suit: "Spades", Picture: Nine_Spades },
    { Rank: "Ten", Suit: "Spades", Picture: Ten_Spades },
    { Rank: "Jack", Suit: "Spades", Picture: Jack_Spades },
    { Rank: "Queen", Suit: "Spades", Picture: Queen_Spades },
    { Rank: "King", Suit: "Spades", Picture: King_Spades },
    { Rank: "Ace", Suit: "Spades", Picture: Ace_Spades },
    { Rank: "Hidden", Suit: "Hidden", Picture: Back},
];