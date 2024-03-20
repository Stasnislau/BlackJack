import { GameState } from "../../types";
import PlayerBox from "./playerBoxes/playerBox";
import EmptyPlayerBox from "./playerBoxes/emptyPlayerBox";

interface GameDeskProps {
    gameState: GameState;
    playerId: string;
    onHit: () => void;
    onStand: () => void;
    onAddPlayer: () => void;
    onRemoveAiPlayer: (id: string) => void;
}

const GameDesk = ({ gameState, playerId, onHit, onStand, onAddPlayer, onRemoveAiPlayer }: GameDeskProps) => {
    const croupier = gameState?.isGameStarted ? gameState?.players[gameState?.players.length - 1] : null;
    const players = gameState?.players && gameState.players.length > 1 ? gameState?.players.slice(0, -1) : []
    const emptySlots = Math.max(0, 3 - (players?.length || 0));
    const getPlayerPosition = (index: number, isEmpty = false) => {
        const numberOfTheBox = isEmpty ?
            players?.length + index
            : index;
        if (numberOfTheBox === 0) {
            return "absolute bottom-[15%] left-[50%] translate-x-[-50%]";
        }
        if (numberOfTheBox === 1) {
            return "absolute bottom-[20%] left-[5%] translate-y-[-50%]";
        }
        if (numberOfTheBox === 2) {
            return "absolute bottom-[20%] right-[5%] translate-y-[-50%]";
        }

        return "";
    };

    return (
        <div className="h-screen w-screen text-white overflow-y-auto">
            {gameState?.isGameStarted && croupier && (
                <div className="absolute top-[5%] left-[50%] translate-x-[-50%] w-full">
                    <PlayerBox
                        key={croupier.id}
                        {...croupier}
                        isGameOver={gameState.isGameOver}
                        isCurrentPlayer={croupier.id === playerId}
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
                            isCurrentPlayer={player.id === playerId}
                            isGameStarted={gameState.isGameStarted}
                            onRemoveAiPlayer={onRemoveAiPlayer}
                        />
                    </div>
                ))}

                {!gameState.isGameStarted &&
                    Array.from({ length: emptySlots }).map((_, index) => (
                        <div className={getPlayerPosition(index, true)} key={index}>
                            <EmptyPlayerBox onAddPlayer={onAddPlayer} />
                        </div>
                    ))
                }
                {gameState.isGameStarted && playerId === gameState?.currentPlayerId && (
                    <div className="absolute bottom-[5%] left-[50%] translate-x-[-50%]">
                        <div className="flex gap-4">
                            <button
                                onClick={onHit}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Hit
                            </button>
                            <button
                                onClick={onStand}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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