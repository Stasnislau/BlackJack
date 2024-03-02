using Microsoft.AspNetCore.SignalR;

public class GameHub : Hub
{
    private readonly GameSessionsManager _gameSessionsManager;

    public GameHub(GameSessionsManager gameSessionsManager)
    {
        _gameSessionsManager = gameSessionsManager;
    }

    public async Task CreateGame()
    {
        var sessionId = _gameSessionsManager.CreateGameSession();
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
        await Clients.Group(sessionId).SendAsync("GameMessage", new {
            task = "create",
            sessionId,
            message = $"{Context.ConnectionId} has created the group {sessionId}."
        });
    }

    public async Task JoinGame(string gameId, string name)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        string playerId = _gameSessionsManager.AddHumanPlayerToSession(gameId, name, Context.ConnectionId);
        await Clients.Group(gameId).SendAsync("GameMessage", new {
            task = "join",
            gameId,
            playerId,
            message = $"{Context.ConnectionId} has joined the group {gameId}."
        });
    }

    public async Task LeaveGame(string gameId, string playerId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
        _gameSessionsManager.RemovePlayerFromSession(Context.ConnectionId, playerId);
        await Clients.Group(gameId).SendAsync("GameMessage", $"{playerId} has left the group {gameId}.");
        await Clients.Caller.SendAsync("GameMessage", new {
            task = "leave",
            gameId,
            message = $"You have left the group {gameId}."
        });
    }

    public async Task StartGame(string gameId)
    {
        await Clients.Group(gameId).SendAsync("GameMessage", $"{Context.ConnectionId} has started the game {gameId}.");
        var gameState = _gameSessionsManager.StartGame(gameId, Context.ConnectionId);
        await Clients.Group(gameId).SendAsync("GameStateChanged", gameState);
    }

    public override async Task OnDisconnectedAsync(Exception ?exception)
    {
        _gameSessionsManager.RemovePlayerFromSession(Context.ConnectionId, playerId: "");
        if (exception != null)
        {
            Console.WriteLine(exception.Message);
        }
        await base.OnDisconnectedAsync(exception);
    }   

    public Task<bool> IsGameSessionAvailable(string gameId)
    {
        return Task.FromResult(_gameSessionsManager.IsGameSessionAvailable(gameId));
    }
}