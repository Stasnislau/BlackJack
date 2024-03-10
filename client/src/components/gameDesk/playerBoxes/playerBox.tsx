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
    isGameStarted,
    isCurrentPlayer,
}: PlayerDTO & { isGameOver: boolean, results: Record<string, string>, isCurrentPlayer: boolean, isGameStarted: boolean, isConnected?: boolean }) => {
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
            <div className="flex flex-col items-center relative">
                <div className="flex bg-gray-950 rounded-t-xl">
                    <h2 className="text-xl font-bold px-8">{(isCroupier ? 'Croupier' : name ? name : "Player")}</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-2 bg-gray-950 p-4 pb-0 rounded-t-xl">
                    {cardSlots}
                </div>
                <div className="flex w-full flex-col gap-2 bg-gray-950 p-2 ">
                    {isBlackjack ? <p className="text-green-500 text-center">Blackjack!</p> :
                        score > 21 && <p className="text-red-500 text-center">Busted!</p>}
                </div>
                {isGameStarted &&
                    <div className="rounded-full bg-orange-500 absolute p-1 left-[50%] top-[95%] transform -translate-x-1/2">
                        <p className="text-white font-bold">Score:
                            <span className={
                                `text-xl ${score > 21 ? 'text-red-500' : 'text-white'}`

                            }> {score}</span></p>
                    </div>
                }
            </div>
        </div>
    );
};

export default PlayerBox;
