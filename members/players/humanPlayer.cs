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
}