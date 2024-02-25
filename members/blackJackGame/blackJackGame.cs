
public class BlackjackGame
{
    public List<Player> Players { get; }
    public Croupier Croupier { get; }

    public Deck Deck { get; }

    public string CurrentPlayerId { get; set; }

    public bool IsGameOver { get; set; }

    public int Bet { get; set; }



    public BlackjackGame()
    {
        Croupier = new Croupier();
        Players = new List<Player>();
        Deck = new Deck();
        IsGameOver = false;
        CurrentPlayerId = "";
        Bet = 10;
    }

    public void StartGame()
    {
        Players.ForEach(player => player.SetBet(Bet));
        Croupier.SetBet(Bet);

        Deck.PopulateDeck();
        Deck.Shuffle();
        foreach (Player player in Players)
        {
            player.Draw(Deck);
            player.Draw(Deck);
        }
        Croupier.Draw(Deck, true);
        Croupier.Draw(Deck, true);

    }

    public void AddHumanPlayer(string name, bool isAi = false)
    {
        if (isAi)
        {
            Players.Add(new AIPlayer(name));
            return;
        }
        Players.Add(new HumanPlayer(name));
    }

    public void RemovePlayer(string id)
    {
        Players.RemoveAll(player => player.Id == id);
    }


    public void NextPlayer()
    {
        if (CurrentPlayerId == "")
        {
            CurrentPlayerId = Players[0].Id;
            return;
        }
        int index = Players.FindIndex(player => player.Id == CurrentPlayerId);
        if (index == Players.Count - 1)
        {
            CurrentPlayerId = Croupier.Id;
            return;
        }
        CurrentPlayerId = Players[index + 1].Id;
    }

    public void EndGame()
    {
        IsGameOver = true;
    }

    public void ResetGame()
    {
        IsGameOver = false;
        CurrentPlayerId = "";
        Croupier.ResetHand();
        foreach (Player player in Players)
        {
            player.ResetHand();
        }
    }

    public Dictionary<string, string> DetermineResults()
    {
        Dictionary<string, string> results = new Dictionary<string, string>();
        foreach (Player player in Players)
        {
            int playersBet = player.Bet;
            if (player.Score > 21)
            {
                results.Add(player.Id, "Bust");
                Croupier.WinBet(playersBet);
                player.LoseBet(playersBet);
                continue;
            }
            if (Croupier.Score > 21)
            {
                results.Add(player.Id, "Win");
                player.WinBet(playersBet);
                Croupier.LoseBet(playersBet);
                continue;
            }
            if (player.Score == 21 && player.Hand.Count == 2 && Croupier.Score != 21 && Croupier.Hand.Count != 2)
            {
                results.Add(player.Id, "Blackjack");
                player.WinBet(playersBet * 2);
                Croupier.LoseBet(playersBet * 2);
                continue;
            }
            if (Croupier.Score == 21 && Croupier.Hand.Count == 2 && player.Score != 21 && player.Hand.Count != 2)
            {
                results.Add(player.Id, "Lose");
                Croupier.WinBet(playersBet);
                player.LoseBet(playersBet);
                continue;
            }
            if (player.Score > Croupier.Score)
            {
                results.Add(player.Id, "Win");
                player.WinBet(playersBet);
                Croupier.LoseBet(playersBet);
                continue;
            }
            if (player.Score == Croupier.Score)
            {
                results.Add(player.Id, "Draw");
                continue;
            }
            results.Add(player.Id, "Lose");
        }
        return results;
    }

}