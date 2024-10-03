using DTOs;

public class GameSessionsManager
{
    private readonly Dictionary<string, BlackjackGame> _gameCodeGameMap = new(); // 
    private readonly Dictionary<string, string> _connectionSessionMap = new(); //  connectionId, GameCode

    private readonly Dictionary<string, string> _playerConnectionMap = new(); //  playerId, connectionId


    private BlackjackGame? GetGame(string gameCode)
    {
        var result = _gameCodeGameMap.TryGetValue(gameCode, out var game) ? game : null;
        return result;
    }

    private string GetPlayerId(string connectionId)
    {
        KeyValuePair<string, string> pair = _playerConnectionMap.FirstOrDefault(c => c.Value == connectionId);
        if (pair.Key != null)
        {
            string userId = pair.Key;
            return userId;
        }
        else
        {
            return "";
        }
    }

    private async void RemovePlayerUnlessConnected(string playerId, string gameCode)
    {
        try
        {
            await Task.Delay(20000);
            if (_playerConnectionMap.ContainsKey(playerId))
            {
                return;
            }
            _gameCodeGameMap[gameCode]?.RemovePlayer(playerId);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }

    public string CreateGameSession()
    {
        var gameCode = Guid.NewGuid().ToString();
        _gameCodeGameMap[gameCode] = new BlackjackGame();
        return gameCode;
    }

    public void StartGame(string gameCode)
    {
        var game = GetGame(gameCode);
        if (game == null)
        {
            throw new GameException("Session not found");
        }
        if (game.Players.Count < 1)
        {
            throw new GameException("Not enough players");
        }
        game.StartGame();
    }

    public string AddHumanPlayerToSession(string gameCode, string name, string connectionId)
    {
        var game = GetGame(gameCode);
        if (game == null)
        {
            throw new GameException("Game not found");
        }
        if (_connectionSessionMap.ContainsKey(connectionId))
        {
            if (_connectionSessionMap[connectionId] == gameCode)
                throw new GameException("Player already in the game");
            else {
                throw new GameException("Player already in another game");
            }

        }
        var playerId = game.AddHumanPlayer(name);
        _connectionSessionMap[connectionId] = gameCode;
        _playerConnectionMap[playerId] = connectionId;
        return playerId;
    }
    public void AddAIPlayerToSession(string gameCode)
    {
        _gameCodeGameMap[gameCode]?.AddAIPlayer();
    }
    public void RemoveHumanPlayerFromGame(string gameCode, string connectionId, string? playerId)
    {
        playerId ??= GetPlayerId(connectionId);

        _gameCodeGameMap[gameCode]?.RemovePlayer(playerId);
        _connectionSessionMap.Remove(connectionId);
        _playerConnectionMap.Remove(playerId);
    }

    public void RemoveAIPlayerFromGame(string gameCode, string playerId)
    {
        if (_gameCodeGameMap[gameCode] == null)
        {
            throw new GameException("Game not found");
        }

        _gameCodeGameMap[gameCode].RemovePlayer(playerId);
    }
    public void RemovePlayerFromGame(string gameCode, string playerId)
    {
        if (_playerConnectionMap.TryGetValue(playerId, out var connectionId))
        {
            _connectionSessionMap.Remove(connectionId);
        }
        else
        {
            throw new GameException("Player not found");
        }
        _gameCodeGameMap[gameCode]?.RemovePlayer(playerId);
        _playerConnectionMap.Remove(playerId);
    }

    public void RemoveGame(string gameCode)
    {
        _gameCodeGameMap.Remove(gameCode);
    }

    public GameState? GetGameState(string gameCode)
    {
        var game = GetGame(gameCode);
        if (game == null)
        {
            return null;
        }
        return game.GetGameState();
    }

    public bool ReconnectPlayer(string connectionId, string playerId, string gameCode)
    {
        if (!_playerConnectionMap.TryGetValue(playerId, out string? value) && value == connectionId && !_gameCodeGameMap[gameCode].Players.Any(p => p.Id == playerId))
        {
            return false;
        }
        string oldConnectionId = value;
        _playerConnectionMap[playerId] = connectionId;
        _connectionSessionMap[connectionId] = gameCode;
        if (oldConnectionId != null && _connectionSessionMap.ContainsKey(oldConnectionId))
            _connectionSessionMap.Remove(oldConnectionId);
        return true;
    }

    public bool IsGameSessionAvailable(string gameId)
    {
        return _gameCodeGameMap.containsKey(gameId);
    }

    public void Hit(string gameCode, string connectionId)
    {

        var game = GetGame(gameCode);
        string playerId = GetPlayerId(connectionId);
        if (game == null)
        {
            throw new GameException("Session not found");
        }
        if (playerId == "")
        {
            throw new GameException("Player not found");
        }
        game.Hit(playerId);
    }

    public void Double(string gameCode, string connectionId)
    {
        var game = GetGame(gameCode);
        string playerId = GetPlayerId(connectionId);
        if (game == null)
        {
            throw new GameException("Session not found");
        }
        if (playerId == "")
        {
            throw new GameException("Player not found");
        }
        game.Double(playerId);
    }

    public void Stand(string gameCode, string connectionId)
    {
        var game = GetGame(gameCode);
        string playerId = GetPlayerId(connectionId);
        if (game == null)
        {
            throw new GameException("Session not found");
        }
        if (playerId == "")
        {
            throw new GameException("Player not found");
        }
        game.Stand(playerId);
    }

    public void Split(string gameCode, string connectionId)
    {
        var game = GetGame(gameCode);
        string playerId = GetPlayerId(connectionId);
        if (game == null)
        {
            throw new GameException("Session not found");
        }
        if (playerId == "")
        {
            throw new GameException("Player not found");
        }
        game.Split(playerId);
    }

    public BroadCastDto[] GetGameStatesForBroadcast(string gameCode)
    {
        var game = GetGame(gameCode);
        if (game == null)
        {
            throw new GameException("Session not found");
        }
        var states = game.GetAllGameStates();
        var broadcastDTOs = new List<BroadCastDto>();
        foreach (var state in states)
        {
            if (_playerConnectionMap.TryGetValue(state.playerId, out var connectionId))
            {
                broadcastDTOs.Add(new BroadCastDto(connectionId, state, gameCode));
            }
        }
        return broadcastDTOs.ToArray();
    }

    public void RestartGame(string gameCode)
    {
        var game = GetGame(gameCode);
        if (game == null)
        {
            throw new GameException("Session not found");
        }
        game.RestartGame();
    }

    public void DisconnectPlayer(string connectionId)
    {
        string playerId = GetPlayerId(connectionId);
        if (playerId != "")
        {
            string gameCode = _connectionSessionMap[connectionId];
            _connectionSessionMap.Remove(connectionId);
            _playerConnectionMap.Remove(playerId);
            RemovePlayerUnlessConnected(playerId, gameCode);
        }
    }

    public bool IsPlayerInGame(string connectionId, string gameCode)
    {
        string playerId = GetPlayerId(connectionId);
        return _gameCodeGameMap[gameCode].Players.Any(p => p.Id == playerId);
    }



}
