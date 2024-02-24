public class Croupier : Player
{

    public Croupier() : base("Croupier", 99999)
    {
    }

    public void Draw(Deck deck, bool show)
    {
        Hand.Add(deck.Draw());
        if (show)
        {
            Console.WriteLine($"{Name} drew a {Hand[Hand.Count - 1].Rank} of {Hand[Hand.Count - 1].Suit}");
        }
    }

    public void ShowHand()
    {
        Console.WriteLine($"{Name} has a {Hand[0].Rank} of {Hand[0].Suit} and a hidden card");
    }

    public void ShowAll()
    {
        Console.WriteLine($"{Name} has:");
        foreach (Card card in Hand)
        {
            Console.WriteLine($"{card.Rank} of {card.Suit}");
        }
    }
    
}