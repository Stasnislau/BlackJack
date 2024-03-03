using DTOs;

public class GameSessionsManager
{
    private readonly Dictionary<string, BlackjackGame> _gameCodeGameMap = new(); // 
    private readonly Dictionary<string, string> _connectionSessionMap = new(); //  connectionId, sessionId

    private readonly Dictionary<string, string> _playerConnectionMap = new(); //  playerId, connectionId

    private BlackjackGame? GetGame(string gameCode)
    {
        Console.WriteLine("GetGame, gameCode: " + gameCode);
        var result = _gameCodeGameMap.TryGetValue(gameCode, out var game) ? game : null;
        Console.WriteLine("GetGame, result: " + result.Players.Count);
        return result;
    }

    public string CreateGameSession()
    {
        var gameCode = Guid.NewGuid().ToString();
        _gameCodeGameMap[gameCode] = new BlackjackGame();
        Console.WriteLine("CreateGameSession, gameCode: " + gameCode);
        return gameCode;
    }

    public GameState StartGame(string gameCode, string connectionId)
    {
        var game = GetGame(gameCode);
        if (game == null)
        {
            Console.WriteLine("OSHIBKA TUT");
            throw new ArgumentException("Session not found");
        }
        game.StartGame();
        string playerId = GetPlayerId(connectionId);
        return game.GetGameState(playerId);
    }

    public string AddHumanPlayerToSession(string gameCode, string name, string connectionId)
    {
        Console.WriteLine("POLETELO GOVNO NA VENTILYATOR"); 
        var game = GetGame(gameCode);
        if (game == null)
        {
            throw new ArgumentException("Game not found");
        }
        Console.WriteLine("POLETELO GOVNO NA VENTILYATOR 2");
        var playerId = game.AddHumanPlayer(name);
        Console.WriteLine("POLETELO GOVNO NA VENTILYATOR 3");
        _connectionSessionMap[connectionId] = gameCode;
        _playerConnectionMap[playerId] = connectionId;
        return playerId;
    }
    public void AddAIPlayerToSession(string gameCode)
    {
        _gameCodeGameMap[gameCode]?.AddAIPlayer();
    }
    public void RemoveHumanPlayerFromSession(string gameCode, string connectionId, string? playerId)
    {
        playerId ??= GetPlayerId(connectionId);

        _gameCodeGameMap[gameCode]?.RemovePlayer(playerId);
        _connectionSessionMap.Remove(connectionId);
        _playerConnectionMap.Remove(playerId);
    }
    public void RemovePlayerFromSession(string sessionId, string playerId)
    {
        if (_playerConnectionMap.TryGetValue(playerId, out var connectionId))
        {
            _connectionSessionMap.Remove(connectionId);
        }
        // _sessions[sessionId]?.RemovePlayer(playerId); wait for up to minute to see if the player reconnects
        _playerConnectionMap.Remove(playerId);
    }

    public void RemoveGame(string gameCode)
    {
        _gameCodeGameMap.Remove(gameCode);
    }

    public GameState? GetGameState(string gameCode, string playerId)
    {
        var game = GetGame(gameCode);
        if (game == null)
        {
            return null;
        }
        return game.GetGameState(playerId);
    }

    public bool ReconnectPlayer(string connectionId, string playerId, string gameCode)
    {
        if (_playerConnectionMap.ContainsKey(playerId) && _playerConnectionMap[playerId] != connectionId && _gameCodeGameMap[gameCode].Players.Any(p => p.Id == playerId))
        {
            return false;
        }
        string oldConnectionId = _playerConnectionMap[playerId];
        _playerConnectionMap[oldConnectionId] = connectionId;
        _connectionSessionMap[connectionId] = _gameCodeGameMap.FirstOrDefault(x => x.Value.Players.Any(p => p.Id == playerId)).Key;
        return true;
    }

    private string GetPlayerId(string connectionId)
    {
        return _playerConnectionMap.TryGetValue(connectionId, out var playerId) ? playerId : "";
    }

    public bool IsGameSessionAvailable(string gameId)
    {
        return _gameCodeGameMap.ContainsKey(gameId);
    }
}