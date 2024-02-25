using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

[ApiController]
[Route("api/[controller]")]

public class GameController : ControllerBase
{
    public readonly GameService _gameService;

    public GameController(GameService gameService)
    {
        _gameService = gameService;
    }

    [HttpGet("start")]
    public string Get()
    {
        _gameService.StartGame();
        return JsonConvert.SerializeObject("Game started");
    }
}