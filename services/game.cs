public class GameService
{

    readonly BlackjackGame _game;

    public GameService()
    {
        _game = new BlackjackGame();
    }

    public void StartGame()
    {
        _game.StartGame();
    }

}