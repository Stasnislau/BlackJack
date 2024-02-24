public abstract class Player {
    public string Name { get; }
    public List<Card> Hand { get; }

    public int Money { get; }

    public int Score { get; set; }

    public Player(string name, int money) {
        Name = name;
        Hand = new List<Card>();
        Money = money;
    }

    public void Draw(Deck deck) {
        Hand.Add(deck.Draw());
    }
}