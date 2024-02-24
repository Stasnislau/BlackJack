public static class GameHub {
    public static void StartGame() {
        Deck deck = new Deck();
        deck.PopulateDeck();
        deck.Shuffle();
        Croupier croupier = new Croupier();
        HumanPlayer player = new HumanPlayer("Player");
        croupier.Draw(deck, true);
        player.Draw(deck);
        croupier.Draw(deck, true);
        player.Draw(deck);
        player.ShowHand();
        croupier.ShowHand();
        while (player.Score < 21) {
            Console.WriteLine("Do you want to draw another card? (y/n)");
            string input = Console.ReadLine();
            if (input == "y") {
                player.Draw(deck);
                player.ShowHand();
            } else {
                break;
            }
        }
        while (croupier.Score < 17) {
            croupier.Draw(deck, true);
        }
        croupier.ShowAll();
        if (player.Score > 21) {
            Console.WriteLine("You lost!");
        } else if (croupier.Score > 21) {
            Console.WriteLine("You won!");
        } else if (player.Score > croupier.Score) {
            Console.WriteLine("You won!");
        } else if (player.Score < croupier.Score) {
            Console.WriteLine("You lost!");
        } else {
            Console.WriteLine("It's a draw!");
        }
    }
}