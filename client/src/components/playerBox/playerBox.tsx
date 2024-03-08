import { CardDTO, PlayerDTO } from "../../types";
import { cards } from "../../constants/cards";

const Card = ({ isRevealed, rank, suit }: CardDTO) => {

    return (
        <div className="
            flex
            justify-center
            items-center
            w-12
            h-16
            m-1
            bg-white
            rounded
            shadow-lg
            overflow-hidden
            transform
            transition-transform
            duration-300
            hover:scale-110
        ">
            <div className={`card ${isRevealed ? 'bg-white' : 'bg-blue-500'}`}>
                <img
                    className="w-full h-full object-cover"
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
    isConnected
}: PlayerDTO & { isConnected?: boolean, thisPlayerId: string }) => {
    if (!id && !isCroupier) {
        return null;
    }

    const boxStyles = `flex flex-col items-center p-4 border rounded shadow-lg m-2 ${isCroupier ? 'absolute top-0 left-1/2 transform -translate-x-1/2' : 'relative'
        } ${id ? '' : 'border-dashed border-gray-300'} ${isAI || isCroupier ? 'bg-gray-400' : 'bg-gray-300'}`;
    return (
        <div className={boxStyles}>
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
                    {score > 21 ? <p>Busted</p>
                        :
                        <p>Score: {score == 0 ? "hidden" : score}</p>
                    }
                    <p>Money: ${money}</p>
                    <p>Bet: ${bet}</p>
                    {isBlackjack && <p className="text-green-500">Blackjack!</p>}
                    <p>Status: {hasFinishedTurn ? 'Waiting' : 'Playing'}</p>
                    {isConnected !== undefined && (
                        <p>Connection: {isConnected ? 'Connected' : 'Disconnected'}</p>
                    )}
                </>
            )}
            {isCroupier && (
                <>
                    <p>Score: {score == 0 ? "hidden" : score}</p>
                    {score > 21 ? <p>Busted</p>
                        :
                        <p>Score: {score == 0 ? "hidden" : score}</p>
                    }
                    <p>Bet: ${bet}</p>
                    {isBlackjack && <p className="text-green-500">Blackjack!</p>}
                </>
            )}

        </div>
    );
};

export default PlayerBox;
