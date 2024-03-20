public class Croupier : Player
{

    public Croupier() : base("Croupier", 99999)
    {
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