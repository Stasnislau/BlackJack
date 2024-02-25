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

    public override void DoAction(Deck deck)
    {
        Console.WriteLine("Do you want to draw a card? (y/n)");
        string input = Console.ReadLine();
        if (input == "y")
        {
            Draw(deck);
        }
    }
}