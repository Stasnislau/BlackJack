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
    isGameOver,
    results,
    isGameStarted,
    isCurrentPlayer,
    onRemoveAiPlayer
}: PlayerDTO & { isGameOver: boolean, results: Record<string, string>, isCurrentPlayer: boolean, isGameStarted: boolean, onRemoveAiPlayer: (id: string) => void }) => {
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
        <div className={`flex flex-col items-center bg-gray-600 bg-opacity-85 shadow-xl p-4 rounded m-2 ${isCroupier ? 'absolute top-0 left-1/2 transform -translate-x-1/2' : 'relative'} ${isCurrentPlayer && !isGameOver ? 'border-2 border-green-500' : ''}`}>
            <div className="flex flex-col items-center relative">
                {results[id] && <p className="text-green-500 text-lg absolute left-[50%] top-[0%] transform -translate-x-1/2">{results[id]}</p>}
                <div className="flex bg-gray-950 rounded-t-xl relative">
                    <h2 className="text-xl font-bold px-8">{(isCroupier ? 'Croupier' : name ? name : "Player")}</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-2 bg-gray-950 p-4 pb-0 rounded-t-xl">
                    {cardSlots}
                </div>
                <div className="flex w-full flex-col bg-gray-950 p-2 ">
                    {((isGameOver || !isGameStarted) && results[id]) ?
                        (<p className={`animate-pulse text-center font-bold ${results[id] === 'Win' ? 'text-green-500' :
                            results[id] === 'Lose' ? 'text-red-500' :
                                results[id] === 'Draw' ? 'text-yellow-500' :
                                    'text-white'
                            }`}
                        >
                            {results[id]}
                        </p>) :
                        (isBlackjack ? <p className="text-green-500 text-center">Blackjack!</p> :
                            score > 21 && <p className="text-red-500 text-center">Busted!</p>)
                    }
                    {
                        ((isGameOver || !isGameStarted) && (money !== null && money < bet)) &&
                        <p className="text-red-500 text-center">Out of money!</p>
                    }
                </div>
                {(isGameStarted || isGameOver) && (score !== 0) &&
                    <div className="rounded-full bg-orange-500 absolute p-1 left-[50%] top-[95%] transform -translate-x-1/2">
                        <p className="text-white font-bold">Score:
                            <span className={
                                `text-xl ${score > 21 ? 'text-[#FF0000]' : 'text-white'}`

                            }> {score}</span></p>
                    </div>
                }
            </div>
            {isAI && !isGameStarted &&
                <button
                    onClick={() => onRemoveAiPlayer(id)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center mt-2 mr-2 hover:bg-red-700"
                >
                    X
                </button>
            }
        </div>
    );
};

export default PlayerBox;
