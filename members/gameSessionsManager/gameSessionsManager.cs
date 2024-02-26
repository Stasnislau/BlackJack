public class GameSessionsManager
{
    private readonly Dictionary<string, BlackjackGame> _sessions = new();
    private readonly Dictionary<string, string> _connectionSessionMap = new();

    public string CreateGameSession()
    {
        var sessionId = Guid.NewGuid().ToString();
        _sessions[sessionId] = new BlackjackGame();
        return sessionId;
    }

    // voidAddPlayerToSession(string sessionId, string connectionId)
    // {
    //     _connectionSessionMap[connectionId] = sessionId;
    // }
    public void RemovePlayerFromSession(string connectionId)
    {
        if (_connectionSessionMap.TryGetValue(connectionId, out var sessionId))
        {
            // Remove player from game logic as needed
            _sessions[sessionId]?.RemovePlayer(connectionId); // Implement RemovePlayer accordingly
            _connectionSessionMap.Remove(connectionId);
        }
    }

}