using System.Reflection.Metadata;
using DTOs;
using Microsoft.AspNetCore.SignalR;

public class GameHub : Hub
{
    private readonly GameSessionsManager _gameSessionsManager;

    public GameHub(GameSessionsManager gameSessionsManager)
    {
        _gameSessionsManager = gameSessionsManager;
    }

    private async Task HandleException(Exception e, string? task)
    {
        if (e is GameException)
        {
            await Clients.Caller.SendAsync("Error", new
            {
                task,
                message = e.Message
            });
        }
        else
        {
            Console.WriteLine(e);
        }
    }

    private async Task BroadcastGameState(string gameCode)
    {
        try
        {
            var broadCastDTOs = _gameSessionsManager.GetGameStatesForBroadcast(gameCode);
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
            if (e is GameException)
                Console.WriteLine("Error broadcasting game state " + e.Message);
            else
                Console.WriteLine(e);
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
            if (e is GameException)
                Console.WriteLine("Error creating game session " + e.Message);
            else
                Console.WriteLine(e);
        }
    }

    public async Task JoinGame(string gameCode, string name)
    {
        try
        {
            if (!_gameSessionsManager.IsGameSessionAvailable(gameCode))
            {
                throw new GameException("not available.");
            }
            if (_gameSessionsManager.IsPlayerInGame(Context.ConnectionId, gameCode))
            {
                await Clients.Caller.SendAsync("GameMessage", new
                {
                    task = "state",
                    gameCode,
                    gameState = _gameSessionsManager.GetGameState(gameCode)
                });
                return;
            }
            await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
            string playerId = _gameSessionsManager.AddHumanPlayerToSession(gameCode, name, Context.ConnectionId);
            await Clients.Caller.SendAsync("GameMessage", new
            {
                task = "join",
                gameCode,
                playerId,
                connectionId = Context.ConnectionId,
                message = $"{Context.ConnectionId} has joined the group {gameCode}."
            });
            await BroadcastGameState(gameCode);
        }
        catch (Exception e)
        {
            await HandleException(e, "join");
        }
    }

    public async Task LeaveGame(string gameCode, string playerId)
    {
        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameCode);
            _gameSessionsManager.RemovePlayerFromGame(gameCode, playerId);
            await Clients.Caller.SendAsync("GameMessage", new
            {
                task = "leave",
                gameCode,
                connectionId = Context.ConnectionId,
                message = $"You have left the group {gameCode}."
            });
            await BroadcastGameState(gameCode);
        }
        catch (Exception e)
        {
            await HandleException(e, "leave");
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
            await HandleException(e, "start");
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        try
        {
            _gameSessionsManager.DisconnectPlayer(Context.ConnectionId);
            if (exception != null)
            {
                Console.WriteLine(exception.Message, "Connection lost");
            }
            await base.OnDisconnectedAsync(exception);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }
    public async Task IsGameSessionAvailable(string gameCode)
    {
        try
        {
            bool result = _gameSessionsManager.IsGameSessionAvailable(gameCode);
            await Clients.Caller.SendAsync("GameMessage", new
            {
                task = "available",
                gameCode,
                message = result
            });
        }
        catch (Exception e)
        {
            await HandleException(e, "available");
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
                await Clients.Caller.SendAsync("GameMessage", new
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
                    gameState = _gameSessionsManager.GetGameState(gameCode)
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
            await HandleException(e, "reconnect");
        }

    }

    public async Task AddAIPlayer(string gameCode)
    {
        try
        {
            _gameSessionsManager.AddAIPlayerToSession(gameCode);
            await BroadcastGameState(gameCode);
        }
        catch (Exception e)
        {
            await HandleException(e, "add");
        }
    }

    public async Task RemoveAIPlayer(string gameCode, string playerId)
    {
        try
        {
            _gameSessionsManager.RemoveAIPlayerFromGame(gameCode, playerId);
            await BroadcastGameState(gameCode);
        }
        catch (Exception e)
        {
            await HandleException(e, "remove");
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
            await HandleException(e, "hit");
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
            await HandleException(e, "stand");
        }
    }

    public async Task Double(string gameCode)
    {
        try
        {
            _gameSessionsManager.Double(gameCode, Context.ConnectionId);
            await BroadcastGameState(gameCode);
        }
        catch (Exception e)
        {
            await HandleException(e, "double");
        }
    }

    public async Task RestartGame(string gameCode)
    {
        try
        {
            _gameSessionsManager.RestartGame(gameCode);
            await BroadcastGameState(gameCode);
        }
        catch (Exception e)
        {
            await HandleException(e, "restart");
        }
    }


}