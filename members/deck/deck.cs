public enum Suit
{
    hidden = 0,
    Spades = 1,
    Hearts,
    Diamonds,
    Clubs
}

public enum Rank
{
    hidden = 0,
    Two = 2,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack = 10,
    Queen = 10,
    King = 10,
    Ace = 11
}


public class Deck
{



    public List<Card> Cards { get; }

    public Deck()
    {
        Cards = new List<Card>();
        foreach (Suit suit in Enum.GetValues(typeof(Suit)))
        {
            foreach (Rank rank in Enum.GetValues(typeof(Rank)))
            {
                Cards.Add(new Card(suit, rank));
            }
        }
    }

    public void PopulateDeck()
    {
        Cards.Clear();
        foreach (Suit suit in Enum.GetValues(typeof(Suit)))
        {
            foreach (Rank rank in Enum.GetValues(typeof(Rank)))
            {
                Cards.Add(new Card(suit, rank));
            }
        }
    }

    public void Shuffle()
    {
        Random rng = new Random();
        int n = Cards.Count;
        while (n > 1)
        {
            n--;
            int k = rng.Next(n + 1);
            Card value = Cards[k];
            Cards[k] = Cards[n];
            Cards[n] = value;
        }
    }

    public Card Draw()
    {
        Card card = Cards[0];
        Cards.RemoveAt(0);
        return card;
    }
}

public class Card
{
    public Suit Suit { get; }
    public Rank Rank { get; }

    public int Value
    {
        get
        {
            return (int)Rank;
        }
    }

    public Card(Suit suit, Rank rank)
    {
        Suit = suit;
        Rank = rank;
    }
}