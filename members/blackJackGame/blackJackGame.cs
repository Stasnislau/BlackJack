using DTOs;
public class BlackjackGame
{
    public List<Player> Players { get; }
    public Croupier Croupier { get; }

    public Deck Deck { get; }

    public string CurrentPlayerId { get; set; }

    public bool IsGameOver { get; set; }

    public int Bet { get; set; }

    public bool IsGamePaused { get; set; }



    public BlackjackGame()
    {
        Croupier = new Croupier();
        Players = new List<Player>();
        Deck = new Deck();
        IsGameOver = false;
        CurrentPlayerId = "";
        Bet = 10;
        IsGamePaused = false;
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
        NextPlayer();
    }

    public string AddHumanPlayer(string name)
    {
        var player = new HumanPlayer(name);
        Players.Add(player);
        return player.Id;
    }

    public void AddAIPlayer()
    {
        string name = "AI" + new Random().Next(1000, 9999);
        Players.Add(new AIPlayer(name));
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
        if (!IsGameOver)
        {
            return new Dictionary<string, string>();
        }
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

    public GameState GetSpecificGameState(string playerId)
    {
        var CroupierHand = Croupier.Hand.Select((card, index) => new CardDTO(CurrentPlayerId == Croupier.Id || Croupier.HasFinishedTurn || index == 0, card.Rank, card.Suit)).ToList();
        var playersList = Players.Select(player => new PlayerDTO(
            player.Name,
            player.Hand.Select(card => new CardDTO(player.HasFinishedTurn || playerId == CurrentPlayerId, card.Rank, card.Suit)).ToList(),
            player.Money,
            player is AIPlayer,
            player is Croupier,
            player.HasFinishedTurn ? player.Score : 0,
            player.Id,
            player.Bet,
            player.HasFinishedTurn,
            player.Hand.Count == 2 && player.Score == 21
        )).ToList();
        if (playerId == Croupier.Id)
        {
            return new GameState(
                CurrentPlayerId,
                IsGameOver,
                IsGamePaused,
                playersList,
                DetermineResults()
            );
        }
        playersList.Add(new PlayerDTO(
            Croupier.Name,
            Croupier.Hand.Select(card => new CardDTO(true, card.Rank, card.Suit)).ToList(),
            Croupier.Money,
            false,
            true,
            Croupier.HasFinishedTurn ? Croupier.Score : 0,
            Croupier.Id,
            Croupier.Bet,
            Croupier.HasFinishedTurn,
            Croupier.Hand.Count == 2 && Croupier.Score == 21
        ));
        return new GameState(
            CurrentPlayerId,
            IsGameOver,
            IsGamePaused,
            playersList,
            DetermineResults()
        );
    }

    public GameState GetGeneralGameState()
    {
        return new GameState(
            CurrentPlayerId,
            IsGameOver,
            IsGamePaused,
            Players.Select(player => new PlayerDTO(
                player.Name,
                player.Hand.Select(card => new CardDTO(player.HasFinishedTurn, card.Rank, card.Suit)).ToList(),
                player.Money,
                player is AIPlayer,
                player is Croupier,
                player.HasFinishedTurn ? player.Score : 0,
                player.Id,
                player.Bet,
                player.HasFinishedTurn,
                player.Hand.Count == 2 && player.Score == 21
            )).ToList(),
            DetermineResults()
        );
    }


    public void MakeAIAction()
    {
        if (CurrentPlayerId == Croupier.Id)
        {
            while (!Croupier.HasFinishedTurn)
            {
                Croupier.DoAction(Deck);
            }
            return;
        }
        AIPlayer currentPlayer = (AIPlayer)Players.Find(player => player.Id == CurrentPlayerId);
        if (currentPlayer == null)
        {
            return;
        }
        while (!currentPlayer.HasFinishedTurn)
        {
            currentPlayer.DoAction(Deck);
        }
        if (currentPlayer.HasFinishedTurn)
        {
            NextPlayer();
        }
    }

    public GameState Hit(string playerId)
    {
        if (playerId != CurrentPlayerId)
        {
            return GetSpecificGameState(playerId);
        }
        Player currentPlayer = Players.Find(player => player.Id == playerId);
        if (currentPlayer == null)
        {
            return GetGeneralGameState();
        }
        currentPlayer.Draw(Deck);
        if (currentPlayer.Score >= 21)
        {
            currentPlayer.HasFinishedTurn = true;
            NextPlayer();
        }
        return GetSpecificGameState(playerId);
    }

    public GameState Stand(string playerId)
    {
        if (playerId != CurrentPlayerId)
        {
            return GetSpecificGameState(playerId);
        }
        Player currentPlayer = Players.Find(player => player.Id == playerId);
        if (currentPlayer == null)
        {
            return GetGeneralGameState();
        }
        currentPlayer.Stand();
        NextPlayer();
        return GetSpecificGameState(playerId);
    }


// FIX the way the state is sent, it should be unique for everyone
}