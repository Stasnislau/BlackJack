public class Croupier : Player
{

    public Croupier() : base("Croupier", 99999)
    {
    }


    private int CalculatePotentialWinLoss(Player[] players)
    {
        int potentialWin = players.Sum(player => player.Bet);
        int potentialLoss = 0;

        foreach (Player player in players)
        {
            if (player.Score > 21 || (player.Score <= 21 && player.Score > Score) || (player.Score == Score && player.Hand.Count <= Hand.Count))
            {
                potentialLoss += player.Bet;
            }
        }

        return potentialWin - potentialLoss;
    }

    public void DoAction(Deck deck, Player[] players)
    {
        int potentialWinLoss = CalculatePotentialWinLoss(players);
        int playersWithScoreGreaterThanCroupier = players.Count(player => player.Score > Score && player.Score <= 21);
        int playersWithAceOrTenShowing = players.Count(player => player.Hand.Any(card => card.Rank == "Ace" || card.Rank == "Ten" || card.Rank == "Jack" || card.Rank == "Queen" || card.Rank == "King"));

        if (potentialWinLoss <= 0 && Score >= 17 && playersWithScoreGreaterThanCroupier == 0 && playersWithAceOrTenShowing == 0)
        {
            Stand();
        }
        else if (Score < 17)
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