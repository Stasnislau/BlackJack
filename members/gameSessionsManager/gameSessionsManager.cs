using DTOs;

public class GameSessionsManager
{
    private readonly Dictionary<string, BlackjackGame> _sessions = new(); // 
    private readonly Dictionary<string, string> _connectionSessionMap = new(); //  connectionId, sessionId

    private readonly Dictionary<string, string> _playerConnectionMap = new(); //  playerId, connectionId

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

    public GameState StartGame(string sessionId, string connectionId)
    {
        var game = GetGameSession(sessionId);
        if (game == null)
        {
            throw new ArgumentException("Session not found");
        }
        game.StartGame();
        string playerId = GetPlayerId(connectionId);
        return game.GetGameState(playerId);
    }

    public string AddHumanPlayerToSession(string sessionId, string name, string connectionId)
    {
        var game = GetGameSession(sessionId);
        if (game == null)
        {
            throw new ArgumentException("Session not found");
        }
        var playerId = game.AddHumanPlayer(name);
        _connectionSessionMap[connectionId] = sessionId;
        _playerConnectionMap[playerId] = connectionId;
        return playerId;
    }
    public void AddAIPlayerToSession(string sessionId)
    {
        _sessions[sessionId]?.AddAIPlayer();
    }
    public void RemoveHumanPlayerFromSession(string sessionId, string connectionId, string? playerId)
    {
        playerId ??= GetPlayerId(connectionId);
        
        _sessions[sessionId]?.RemovePlayer(playerId);
        _connectionSessionMap.Remove(connectionId);
        _playerConnectionMap.Remove(playerId);
    }
    public void RemovePlayerFromSession(string sessionId, string playerId) {
        if (_playerConnectionMap.TryGetValue(playerId, out var connectionId)) {
            _connectionSessionMap.Remove(connectionId);
        }
        _playerConnectionMap.Remove(playerId);
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

    public bool ReconnectPlayer(string connectionId, string playerId) {
        if (_playerConnectionMap.ContainsKey(playerId)) {
            return false;
        }
        _playerConnectionMap[connectionId] = playerId;
        _connectionSessionMap[connectionId] = _sessions.FirstOrDefault(x => x.Value.Players.Any(p => p.Id == playerId)).Key;
        return true;
    }

    private string GetPlayerId(string connectionId)
    {
        return _playerConnectionMap.TryGetValue(connectionId, out var playerId) ? playerId : "";
    }

    public bool IsGameSessionAvailable(string gameId)
    {
        return _sessions.ContainsKey(gameId);
    }
}