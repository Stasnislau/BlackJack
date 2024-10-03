import { GameState } from "../../types";
import PlayerBox from "./playerBoxes/playerBox";
import EmptyPlayerBox from "./playerBoxes/emptyPlayerBox";

interface GameDeskProps {
    gameState: GameState;
    playerId: string;
    onHit: () => void;
    onStand: () => void;
    onDouble: () => void;
    onSplit: () => void;
    onAddPlayer: () => void;
    onRemoveAiPlayer: (id: string) => void;
}

const GameDesk = ({ gameState, playerId, onHit, onDouble, onStand, onSplit, onAddPlayer, onRemoveAiPlayer }: GameDeskProps) => {
    const croupier = gameState?.isGameStarted || gameState.isGameOver ? gameState?.players[gameState?.players.length - 1] : null;
    const players = gameState?.players && gameState.players.length > 1 ? gameState?.players.slice(0, -1) : []
    const emptySlots = Math.max(0, 3 - (players?.length || 0));
    const player = players?.find(player => player.id === playerId);
    const canDouble = player && player.money ? player.bet * 2 <= player.money : false;
    const canSplit = player && player.hand.length === 2 && player.hand[0].rank === player.hand[1].rank;
    const getPlayerPosition = (index: number, isEmpty = false) => {
        const numberOfTheBox = isEmpty ?
            players?.length + index
            : index;
        if (numberOfTheBox === 0) {
            return "absolute bottom-[10%] left-[50%] translate-x-[-50%]";
        }
        if (numberOfTheBox === 1) {
            return "absolute bottom-[10%] left-[5%] translate-y-[-40%]";
        }
        if (numberOfTheBox === 2) {
            return "absolute bottom-[10%] right-[5%] translate-y-[-40%]";
        }

        return "";
    };


    return (
        <div className="h-screen w-screen text-white overflow-y-auto">
            {(gameState?.isGameStarted || gameState.isGameOver) && croupier && (
                <div className="absolute top-[5%] left-[50%] translate-x-[-50%] w-full">
                    <PlayerBox
                        key={croupier.id}
                        {...croupier}
                        isGameOver={gameState.isGameOver}
                        isCurrentPlayer={croupier.id === gameState.currentPlayerId}
                        results={gameState.results}
                        isGameStarted={gameState.isGameStarted}
                        onRemoveAiPlayer={onRemoveAiPlayer}
                    />
                </div>
            )}
            <div className="flex justify-center gap-8">
                {players?.map((player, index) => (
                    <div className={getPlayerPosition(index)} key={player.id}>
                        <PlayerBox
                            {...player}
                            isGameOver={gameState.isGameOver}
                            results={gameState.results}
                            isCurrentPlayer={player.id === gameState.currentPlayerId}
                            isGameStarted={gameState.isGameStarted}
                            onRemoveAiPlayer={onRemoveAiPlayer}
                        />
                    </div>
                ))}

                {(!gameState.isGameStarted || gameState.isGameOver) &&
                    Array.from({ length: emptySlots }).map((_, index) => (
                        <div className={getPlayerPosition(index, true)} key={index}>
                            <EmptyPlayerBox onAddPlayer={onAddPlayer} />
                        </div>
                    ))
                }
                {gameState.isGameStarted && playerId === gameState?.currentPlayerId && (
                    <div className="absolute bottom-[2%] left-[50%] translate-x-[-50%]">
                        <div className="flex gap-4">
                            <button
                                onClick={onHit}

                                className="bg-primary text-white font-bold py-2 px-4 rounded hover:saturate-150 hover:scale-105 focus:outline-none focus:shadow-outline"
                            >
                                Hit
                            </button>
                            <button
                                onClick={onDouble}
                                className="bg-primary text-white font-bold py-2 px-4 rounded hover:saturate-150 hover:scale-105 focus:outline-none focus:shadow-outline disabled:opacity-50"
                                disabled={!canDouble}
                            >
                                Double
                            </button>
                            <button
                                onClick={onSplit}
                                className="bg-primary text-white font-bold py-2 px-4 rounded hover:saturate-150 hover:scale-105 focus:outline-none focus:shadow-outline disabled:opacity-50"
                                disabled={!canSplit}
                            >
                                Split
                            </button>
                            <button
                                onClick={onStand}
                                className="bg-red-500 hover:bg-red-700 hover:scale-105 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Stand
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};



export default GameDesk;
