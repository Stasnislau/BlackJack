
namespace DTOs
{
    public class GameState
    {
        public string CurrentPlayerId { get; set; }
        public bool IsGameOver { get; set; }

        public bool IsGamePaused { get; set; }

        public List<PlayerDTO> Players { get; set; }

        public Dictionary<string, string> Results { get; set; }

        public GameState(string currentPlayerId, bool isGameOver, bool isGamePaused, List<PlayerDTO> players, Dictionary<string, string> results)
        {
            CurrentPlayerId = currentPlayerId;
            IsGameOver = isGameOver;
            IsGamePaused = isGamePaused;
            Players = players;
            Results = results;
        }
    }
    public class PlayerDTO
    {
        public string Name { get; set; }
        public List<CardDTO> Hand { get; set; }
        public int? Money { get; set; }

        public bool IsAI { get; set; }

        public bool IsCroupier { get; set; }
        public int Score { get; set; }
        public string Id { get; set; }
        public int Bet { get; set; }
        public bool HasFinishedTurn { get; set; }
        public bool IsBlackjack { get; set; }

        public PlayerDTO(string name, List<CardDTO> hand, int? money, bool isAI, bool isCroupier, int score, string id, int bet, bool hasFinishedTurn, bool isBlackjack)
        {
            Name = name;
            Hand = hand;
            Money = money;
            IsAI = isAI;
            IsCroupier = isCroupier;
            Score = score;
            Id = id;
            Bet = bet;
            HasFinishedTurn = hasFinishedTurn;
            IsBlackjack = isBlackjack;
        }
    }

    public class CardDTO
    {

        public bool IsRevealed { get; set; }
        Rank Rank { get; set; }
        Suit Suit { get; set; }

        public CardDTO(bool isRevealed, Rank rank, Suit suit)
        {
            IsRevealed = isRevealed;
            Rank = isRevealed ? rank : Rank.hidden;
            Suit = isRevealed ? suit : Suit.hidden;
        }
    }
}
