public class AIPlayer : Player
{
    public AIPlayer(string name) : base(name, 100)
    {
    }

    public void ShowHand()
    {
        foreach (Card card in Hand)
        {
            Console.WriteLine($"{card.Rank} of {card.Suit}");
        }
    }

    public void DoAction(Deck deck)
    {
        if (Score < 17)
        {
            Draw(deck);
        }
        else if (Score == 17 && Hand.Count(card => card.Rank == "Ace") == 1)
        {
            Draw(deck);
        }
        else
        {
            Stand();
        }
    }
}