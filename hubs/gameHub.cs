using Microsoft.AspNetCore.SignalR;

public class GameHub : Hub
{
    private readonly GameSessionsManager _gameSessionsManager;

    public GameHub(GameSessionsManager gameSessionsManager)
    {
        _gameSessionsManager = gameSessionsManager;
    }

    public async Task CreateGame ()
    {
        var sessionId = _gameSessionsManager.CreateGameSession();
        await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
        await Clients.Group(sessionId).SendAsync("GameCreated", sessionId);
    }

    public async Task JoinGame(string gameId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        await Clients.Group(gameId).SendAsync("GameMessage", $"{Context.ConnectionId} has joined the group {gameId}.");
    }

    public async Task LeaveGame(string gameId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
        await Clients.Group(gameId).SendAsync("GameMessage", $"{Context.ConnectionId} has left the group {gameId}.");
    }

    public async Task StartGame(string gameId)
    {
        await Clients.Group(gameId).SendAsync("GameMessage", $"{Context.ConnectionId} has started the game {gameId}.");
    }

    public override async Task OnDisconnectedAsync(Exception ?exception)
    {
        _gameSessionsManager.RemovePlayerFromSession(Context.ConnectionId);
        if (exception != null)
        {
            Console.WriteLine(exception.Message);
        }
        await base.OnDisconnectedAsync(exception);
    }

    
}