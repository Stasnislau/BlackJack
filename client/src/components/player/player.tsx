
interface CardProps {
    isRevealed: boolean;
    rank: Rank;
    suit: Suit;
}

enum Rank {
    hidden = 0,
    two = 2,
    three = 3,
    four = 4,
    five = 5,
    six = 6,
    seven = 7,
    eight = 8,
    nine = 9,
    ten = 10,
    jack = 10,
    queen = 10,
    king = 10,
    ace = 11,
}

enum Suit {
    hidden = 0,
    Spades = 1,
    Hearts,
    Diamonds,
    Clubs
}


interface PlayerProps {
    name?: string;
    hand?: CardProps[];
    money?: number;
    isAI?: boolean;
    isCroupier?: boolean;
    score?: number;
    id?: string;
    bet?: number;
    hasFinishedTurn?: boolean;
    isBlackjack?: boolean;
    isConnected?: boolean;
}

const Card = ({ isRevealed, rank, suit }: CardProps) => {
    return (
        <div className="bg-gray-200 p-2 rounded shadow-sm m-1">
            {isRevealed ? `${rank} of ${suit}` : 'Card Back'}
        </div>
    );
};

const Player = ({
    name,
    hand = [],
    money,
    isAI,
    isCroupier,
    score,
    id,
    bet,
    hasFinishedTurn,
    isBlackjack,
    isConnected = false
}: PlayerProps) => {
    if (!id) {
        return (
            <div className="border-2 border-dashed border-gray-300 h-32 w-32 flex justify-center items-center">
                <span className="text-gray-500">Empty</span>
            </div>
        );
    }

    return (
        <div className="p-4 border rounded shadow space-y-2">
            <h3 className="text-lg font-bold">{name} {isCroupier ? '(Croupier)' : isAI ? '(AI)' : ''}</h3>
            <div className="flex flex-wrap">
                {hand.map((card, index) => (
                    <Card key={index} {...card} />
                ))}
            </div>
            <p>Score: {score}</p>
            <p>Money: ${money}</p>
            <p>Bet: ${bet}</p>
            {isBlackjack && <p className="text-green-500">Blackjack!</p>}
            <p>Status: {hasFinishedTurn ? 'Waiting' : 'Playing'}</p>
            <p>Connection: {isConnected ? 'Connected' : 'Disconnected'}</p>
        </div>
    );
}
