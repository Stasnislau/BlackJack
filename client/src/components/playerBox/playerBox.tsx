import { CardDTO, PlayerDTO } from "../../types";
import { cards } from "../../constants/cards";

const Card = ({ isRevealed, rank, suit }: CardDTO) => {

    return (
        <div className="
            flex
            justify-center
            items-center
            w-16
            h-auto
            m-1
            rounded
            shadow-lg
            overflow-hidden
            transform
            transition-transform
            duration-300
            hover:scale-110
        ">
            <div className={`${isRevealed ? 'bg-white' : 'bg-blue-500'}`}>
                <img
                    className="w-full object-cover"
                    src={cards.find((card) => card.Rank === rank && card.Suit === suit)?.Picture} alt={`${rank} of ${suit}`} />
            </div>
        </div>
    );
};

const PlayerBox = ({
    name,
    hand,
    money = 0,
    isAI,
    isCroupier,
    score,
    id,
    bet,
    hasFinishedTurn,
    isBlackjack,
    isConnected,
    isGameOver,
    results,
    isCurrentPlayer,
}: PlayerDTO & { isGameOver: boolean, results: Record<string, string>, isCurrentPlayer: boolean, isConnected?: boolean }) => {
    if (!id && !isCroupier) {
        return null;
    }
    return (
        <div className={`flex flex-col items-center p-4 rounded shadow-lg m-2 ${isCroupier ? 'absolute top-0 left-1/2 transform -translate-x-1/2' : 'relative'
            } ${id ? '' : 'border-dashed border-gray-300'} ${isAI || isCroupier ? 'bg-gray-400' : 'bg-gray-300'}
            ${hasFinishedTurn && !isCroupier ? 'opacity-50' : ''}
            ${isCurrentPlayer ? 'border-4 border-green-500' : ''}
            `}>
            <h3 className="text-lg font-bold">
                {name} {isCroupier && '(Croupier)'}{isAI && '(AI)'}
            </h3>
            <div className="flex flex-wrap justify-center">
                {hand.map((card, index) => (
                    <Card key={index} {...card} />
                ))}
            </div>
            {!isCroupier && (
                <>
                    {score > 21 && <p>Busted</p>}
                    <p>Score: {score == 0 ? "hidden" : score}</p>
                    <p>Money: ${money}</p>
                    <p>Bet: ${bet}</p>
                    {isBlackjack && <p className="text-green-500">Blackjack!</p>}
                    {isConnected !== undefined && (
                        <p>Connection: {isConnected ? 'Connected' : 'Disconnected'}</p>
                    )}
                    {isGameOver && (
                        <p className="text-lg">
                            {results[id]}
                        </p>
                    )}
                </>
            )}
            {isCroupier && (
                <>
                    {score > 21 && <p>Busted</p>}
                    <p>Score: {score == 0 ? "hidden" : score}</p>
                    <p>Bet: ${bet}</p>
                    {isBlackjack && <p className="text-green-500">Blackjack!</p>}
                    {isGameOver && (
                        <p className="text-lg">
                            {results[id]}
                        </p>
                    )}
                </>
            )}

        </div>
    );
};

export default PlayerBox;
