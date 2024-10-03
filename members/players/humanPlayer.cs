public class HumanPlayer : Player
{
    public HumanPlayer(string name) : base(name, 100)
    {
    }

    public void Double(Deck deck)
    {   
        if (Money < Bet * 2)
        {
            throw new Exception("Not enough money to double");
        }
        Draw(deck); 
        SetBet(Bet * 2);
        Stand();
    }

    public void Split(Deck deck)
    {
        if (Hand.Count != 2 || Hand[0].Rank != Hand[1].Rank)
        {
            throw new Exception("Cannot split");
        }
        if (Money < Bet * 2)
        {
            throw new Exception("Not enough money to split");
        }

        var newHand = new List<Card> { Hand[1] };
        Hand.RemoveAt(1);
        Draw(deck);
        SetBet(Bet * 2);

        // Create a new player with the same name and money
        var newPlayer = new HumanPlayer(Name)
        {
            Money = Money - Bet,
            Hand = newHand
        };
        newPlayer.Draw(deck);
    }
}
