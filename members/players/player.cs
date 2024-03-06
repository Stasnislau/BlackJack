public abstract class Player
{
    public string Name { get; }
    public List<Card> Hand { get; }

    public int Money { get; private set; }
    public int Score { get; private set; }
    public string Id { get; }

    public int Bet { get; private set; }

    public bool HasFinishedTurn = false;

    protected bool isBlackjack;

    public Player(string name, int money)
    {
        Name = name;
        Hand = new List<Card>();
        Money = money;
        Id = Guid.NewGuid().ToString();
        Bet = 0;
        HasFinishedTurn = false;
    }

    public void Draw(Deck deck)
    {
        Hand.Add(deck.Draw());
        CalculateScore();
    }

    public void Stand()
    {
        HasFinishedTurn = true;
    }

    protected void CalculateScore()
    {
        int newScore = 0;
        foreach (Card card in Hand)
        {
            newScore += card.Value;
            if (newScore > 21 && card.Rank == "Ace")
            {
                newScore -= 10;
            }
        }
        if (newScore == 21 && Hand.Count == 2)
        {
            isBlackjack = true;
        }
        Score = newScore;
    }

    public void ResetHand()
    {
        Hand.Clear();
        Score = 0;
    }
    public void WinBet(int Bet)
    {
        Money += Bet;
    }

    public void LoseBet(int Bet)
    {
        Money -= Bet;
    }
    public void SetBet(int bet)
    {
        if (bet > Money)
        {
            throw new InvalidOperationException("Not enough money");
        }
        Bet = bet;
    }

}