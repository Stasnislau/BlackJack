import { CardDTO, PlayerDTO } from "../../../types";
import { cards } from "../../../constants/cards";

const Card = ({ isRevealed, rank, suit }: CardDTO) => {

    return (
        <div className="
            flex
            justify-center
            items-center
            w-16 
            h-24
            shadow-lg
            overflow-hidden
        ">

            <img
                className="w-full h-full object-cover"
                src={cards.find((card) => card.Rank === rank && card.Suit === suit)?.Picture} alt={`${rank} of ${suit}`} />
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
    const cardSlots = Array.from({ length: 5 }).map((_, index) => {
        const card = hand[index];

        return card ? (
            <Card key={index} rank={card.rank} suit={card.suit} isRevealed={card.isRevealed} />
        ) : (
            <div key={index} className="w-16 h-24 bg-gray-500"></div>
        );
    });
    return (
        <div className={`flex flex-col items-center p-4 rounded shadow-lg m-2 ${isCroupier ? 'absolute top-0 left-1/2 transform -translate-x-1/2' : 'relative'} ${isCurrentPlayer ? 'border-2 border-green-500' : ''}`}>
            <div className="flex flex-col items-center">
                <div className="flex bg-gray-950 rounded-t-xl">
                    <h2 className="text-xl font-bold px-8">{name || (isCroupier ? 'Croupier' : 'Player')}</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-2 bg-gray-950 p-2">
                    {cardSlots}
                </div>
            </div>
        </div>
    );
};

export default PlayerBox;
