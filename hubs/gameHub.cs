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
        try
        {
            var gameCode = _gameSessionsManager.CreateGameSession();
            await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
            await Clients.Group(gameCode).SendAsync("GameMessage", new
            {
                task = "create",
                gameCode,
                message = $"{Context.ConnectionId} has created the group {gameCode}."
            });
        }
        catch (Exception e)
        {
            Console.WriteLine("Error creating game session " + e.Message);
        }
    }

    public async Task JoinGame(string gameCode, string name)
    {
        try
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
            string playerId = _gameSessionsManager.AddHumanPlayerToSession(gameCode, name, Context.ConnectionId);
            await Clients.Group(gameCode).SendAsync("GameMessage", new
            {
                task = "join",
                gameCode,
                playerId,
                connectionId = Context.ConnectionId,
                message = $"{Context.ConnectionId} has joined the group {gameCode}."
            });
        }
        catch (Exception e)
        {
            Console.WriteLine("Error joining game " + e.Message);
        }
    }

    public async Task LeaveGame(string gameCode, string playerId)
    {
        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameCode);
            _gameSessionsManager.RemovePlayerFromSession(Context.ConnectionId, playerId);
            await Clients.Group(gameCode).SendAsync("GameMessage", new
            {
                task = "leave",
                gameCode,
                playerId,
                connectionId = Context.ConnectionId,
                message = $"{Context.ConnectionId} has left the group {gameCode}."
            });

            await Clients.Caller.SendAsync("GameMessage", new
            {
                task = "leave",
                gameCode,
                connectionId = Context.ConnectionId,
                message = $"You have left the group {gameCode}."
            });
        }
        catch (Exception e)
        {
            Console.WriteLine("Error leaving game " + e.Message);
        }
    }

    public async Task StartGame(string gameCode)
    {
        try
        {
            await Clients.Group(gameCode).SendAsync("GameMessage", new
            {
                task = "start",
                gameCode,
                message = "The game has started.",
            });
            var gameState = _gameSessionsManager.StartGame(gameCode, Context.ConnectionId);
            await Clients.Group(gameCode).SendAsync("GameMessage", new
            {
                task = "state",
                gameCode,
                gameState
            });
        }
        catch (Exception e)
        {
            Console.WriteLine("Error starting game " + e.Message);
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        try
        {
            _gameSessionsManager.RemovePlayerFromSession(Context.ConnectionId, playerId: "");
            if (exception != null)
            {
                Console.WriteLine(exception.Message);
            }
            await base.OnDisconnectedAsync(exception);
        }
        catch (Exception e)
        {
            Console.WriteLine("Error removing player " + e.Message);
        }
    }

    public async Task IsGameSessionAvailable(string gameCode)
    {
        try
        {
            bool result = _gameSessionsManager.IsGameSessionAvailable(gameCode);
            await Clients.Caller.SendAsync("GameMessage", result);
        }
        catch (Exception e)
        {
            Console.WriteLine("Error validating " + e.Message);
        }
    }

    public async Task Reconnect(string gameCode, string playerId)
    {
        try
        {
            bool result = _gameSessionsManager.ReconnectPlayer(Context.ConnectionId, playerId, gameCode);
            if (result)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
                await Clients.Group(gameCode).SendAsync("GameMessage", new
                {
                    task = "reconnect",
                    gameCode,
                    playerId,
                    connectionId = Context.ConnectionId,
                    message = "success"
                });
                await Clients.Caller.SendAsync("GameMessage", new
                {
                    task = "state",
                    gameCode,
                    gameState = _gameSessionsManager.GetSpecificGameState(gameCode, playerId)
                    
                });
            }
            else
            {
                await Clients.Caller.SendAsync("GameMessage", new
                {
                    task = "reconnect",
                    gameCode,
                    connectionId = Context.ConnectionId,
                    message = "failure"
                });
            }
        }
        catch (Exception e)
        {
            Console.WriteLine("Error reconnecting " + e.Message);
        }

    }

    public async Task Hit(string gameCode, string playerId)
    {
        try
        {
            var gameStateSpecific = _gameSessionsManager.Hit(gameCode, playerId);
            var gameState = _gameSessionsManager.GetGeneralGameState(gameCode);
            await Clients.OthersInGroup(gameCode).SendAsync("GameMessage", new
            {
                task = "state",
                gameCode,
                gameState
            });
            await Clients.Caller.SendAsync("GameMessage", new
            {
                task = "state",
                gameCode,
                gameState = gameStateSpecific
            });
        }
        catch (Exception e)
        {
            Console.WriteLine("Error hitting " + e.Message);
        }
    }

    public async Task Stand(string gameCode, string playerId)
    {
        try
        {
            var gameStateSpecific = _gameSessionsManager.Stand(gameCode, playerId);
            var gameState = _gameSessionsManager.GetGeneralGameState(gameCode);
            await Clients.OthersInGroup(gameCode).SendAsync("GameMessage", new
            {
                task = "state",
                gameCode,
                gameState
            });
            await Clients.Caller.SendAsync("GameMessage", new
            {
                task = "state",
                gameCode,
                gameState = gameStateSpecific
            });
        }
        catch (Exception e)
        {
            Console.WriteLine("Error standing " + e.Message);
        }
    }
}