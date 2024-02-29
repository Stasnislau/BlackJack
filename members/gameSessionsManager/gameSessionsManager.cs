using DTOs;

public class GameSessionsManager
{
    private readonly Dictionary<string, BlackjackGame> _sessions = new();
    private readonly Dictionary<string, string> _connectionSessionMap = new();

        private BlackjackGame? GetGameSession(string sessionId)
    {
        return _sessions.TryGetValue(sessionId, out var game) ? game : null;
    }

    public string CreateGameSession()
    {
        var sessionId = Guid.NewGuid().ToString();
        _sessions[sessionId] = new BlackjackGame();
        return sessionId;
    }

    public GameState StartGame(string sessionId, string playerId)
    {
        var game = GetGameSession(sessionId);
        if (game == null)
        {
            throw new ArgumentException("Session not found");
        }
        game.StartGame();
        return game.GetGameState(playerId);
    }

    public void AddPlayerToSession(string sessionId, string connectionId)
    {
        _connectionSessionMap[connectionId] = sessionId;
    }
    public void RemovePlayerFromSession(string connectionId)
    {
        if (_connectionSessionMap.TryGetValue(connectionId, out var sessionId))
        {
            _sessions[sessionId]?.RemovePlayer(connectionId); 
            _connectionSessionMap.Remove(connectionId);
        }
    }

    public void RemoveSession(string sessionId)
    {
        _sessions.Remove(sessionId);
    }

    public GameState? GetGameState(string sessionId, string playerId) {
        var game = GetGameSession(sessionId);
        if (game == null) {
            return null;
        }
        return game.GetGameState(playerId);
    }
}