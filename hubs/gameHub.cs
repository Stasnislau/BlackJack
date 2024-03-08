using DTOs;
using Microsoft.AspNetCore.SignalR;

public class GameHub : Hub
{
    private readonly GameSessionsManager _gameSessionsManager;

    public GameHub(GameSessionsManager gameSessionsManager)
    {
        _gameSessionsManager = gameSessionsManager;
    }

    private async Task BroadcastGameState(string gameCode)
    {
        try {
        var broadCastDTOs = _gameSessionsManager.GetGameStatesForBroadcast(gameCode);
        Console.WriteLine(broadCastDTOs[0].gameState.Players[0].Hand);
        foreach (var broadCastDto in broadCastDTOs)
        {
            await Clients.Client(broadCastDto.connectionId).SendAsync("GameMessage", new
            {
                task = "state",
                broadCastDto.gameCode,
                broadCastDto.gameState,
                broadCastDto.playerId
            });
        }
        }
        catch (Exception e)
        {
            Console.WriteLine("Unable to broadcast. " + e);
        }
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
            Console.WriteLine("Error creating game session " + e);
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
            Console.WriteLine("Error joining game " + e);
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
            Console.WriteLine("Error leaving game " + e);
        }
    }

    public async Task StartGame(string gameCode)
    {
        try
        {
            _gameSessionsManager.StartGame(gameCode);
            await Clients.Group(gameCode).SendAsync("GameMessage", new
            {
                task = "start",
                gameCode,
                message = "The game has started.",
            });
            await BroadcastGameState(gameCode);
        }
        catch (Exception e)
        {
            Console.WriteLine("Error starting game " + e);
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
            Console.WriteLine("Error removing player " + e);
        }
    }

    public async Task IsGameSessionAvailable(string gameCode)
    {
        try
        {
            bool result = _gameSessionsManager.IsGameSessionAvailable(gameCode);
            await Clients.Caller.SendAsync("GameMessage", new {
                task = "available",
                gameCode,
                message = result
            });
        }
        catch (Exception e)
        {
            Console.WriteLine("Error validating " + e);
        }
    }

    public async Task Reconnect(string gameCode, string playerId)
    {
        try
        {
            bool result = _gameSessionsManager.ReconnectPlayer(Context.ConnectionId, playerId, gameCode);
            if (result)
            {
                Console.WriteLine("Successfully reconnected " + playerId);
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
                    gameState = _gameSessionsManager.GetGameState(gameCode, playerId)

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
            Console.WriteLine("Error reconnecting " + e);
        }

    }

    public async Task Hit(string gameCode)
    {
        try
        {
            _gameSessionsManager.Hit(gameCode, Context.ConnectionId);
            await BroadcastGameState(gameCode);
            
        }
        catch (Exception e)
        {
            Console.WriteLine("Error hitting " + e);
        }
    }

    public async Task Stand(string gameCode)
    {
        try
        {
            _gameSessionsManager.Stand(gameCode, Context.ConnectionId);
            await BroadcastGameState(gameCode);
        }
        catch (Exception e)
        {
            Console.WriteLine("Error standing " + e);
        }
    }
}