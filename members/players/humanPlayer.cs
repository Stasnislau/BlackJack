public class HumanPlayer : Player
{
    public HumanPlayer(string name) : base(name, 100)
    {
    }

    public void ShowHand()
    {
        Console.WriteLine($"{Name} has:");
        foreach (Card card in Hand)
        {
            Console.WriteLine($"{card.Rank} of {card.Suit}");
        }
    }
}