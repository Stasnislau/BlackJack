
namespace DTOs
{
    public class GameState
    {
        public string CurrentPlayerId { get; set; }
        public bool IsGameOver { get; set; }

        public bool IsGamePaused { get; set; }
        public bool IsGameStarted { get; set; }

        public List<PlayerDTO> Players { get; set; }

        public Dictionary<string, string> Results { get; set; }

        public GameState(string currentPlayerId, bool isGameOver, bool isGamePaused, bool isGameStarted, List<PlayerDTO> players, Dictionary<string, string> results)
        {
            CurrentPlayerId = currentPlayerId;
            IsGameOver = isGameOver;
            IsGamePaused = isGamePaused;
            IsGameStarted = isGameStarted;
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

    public class StateDTO
    {

        public string playerId { get; set; }
        public GameState gameState { get; set; }

        public StateDTO(string playerId, GameState gameState)
        {
            this.playerId = playerId;
            this.gameState = gameState;
        }

        public StateDTO(StateDTO stateDTO)
        {
            this.playerId = stateDTO.playerId;
            this.gameState = stateDTO.gameState;
        }
    }

    public class BroadCastDto : StateDTO
    {
        public string connectionId { get; set; }

        public string gameCode { get; set; }

        public BroadCastDto(string playerId, GameState gameState, string connectionId) : base(playerId, gameState)
        {
            this.connectionId = connectionId;
        }

        public BroadCastDto(string connectionId, StateDTO gameState, string gameCode) : base(gameState)
        {
            this.connectionId = connectionId;
            this.gameCode = gameCode;
        }
    }
}
