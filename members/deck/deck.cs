public class Deck
{
    private List<string> AvailableSuits = new List<string> { "Hearts", "Diamonds", "Clubs", "Spades" };
    private List<string> AvailableRanks = new List<string> { "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace" };
    public List<Card> Cards { get; }

    public Deck()
    {
        Cards = new List<Card>();
        foreach (string suit in AvailableSuits)
        {
            foreach (string rank in AvailableRanks)
            {
                Cards.Add(new Card(suit, rank));
            }
        }
    }

    public void PopulateDeck()
    {
        Cards.Clear();
        foreach (string suit in AvailableSuits)
        {
            foreach (string rank in AvailableRanks)
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
    public string Suit { get; }
    public string Rank { get; }

    public int Value { get; }

    private int GetValue()
    {
        switch (Rank)
        {
            case "Two":
                return 2;
            case "Three":
                return 3;
            case "Four":
                return 4;
            case "Five":
                return 5;
            case "Six":
                return 6;
            case "Seven":
                return 7;
            case "Eight":
                return 8;
            case "Nine":
                return 9;
            case "Ten":
                return 10;
            case "Jack":
                return 10;
            case "Queen":
                return 10;
            case "King":
                return 10;
            case "Ace":
                return 11;
            default:
                return 0;
        }
    }

    public Card(string suit, string rank)
    {
        Suit = suit;
        Rank = rank;
        Value = GetValue();
    }
}