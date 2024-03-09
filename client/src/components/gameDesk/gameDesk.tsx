import { useCallback, useState } from "react";
import { GameState } from "../../types";
import PlayerBox from "./playerBoxes/playerBox";
import EmptyPlayerBox from "./playerBoxes/emptyPlayerBox";

interface GameDeskProps {
    gameState: GameState;
    playerId: string;
}

const GameDesk = ({ gameState, playerId }: GameDeskProps) => {
    const croupier = gameState?.isGameStarted ? gameState?.players[gameState?.players.length - 1] : null;
    const players = gameState?.isGameStarted ? gameState?.players.slice(0, -1) : gameState?.players;
    const emptySlots = Math.max(0, 3 - (players?.length || 0));

    return (
        <div className="h-screen bg-gradient-to-b from-gray-800 to-green-900 text-white py-8 overflow-y-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center">
                    {gameState?.isGameStarted && croupier && (
                        <div className="mb-10">
                            <PlayerBox
                                key={croupier.id}
                                {...croupier}
                                isGameOver={gameState.isGameOver}
                                isCurrentPlayer={croupier.id === playerId}
                                results={gameState.results}
                            />
                        </div>
                    )}

                    <div className="flex justify-center gap-8"> {/* Adjust gap as needed */}
                        {players?.map((player) => (
                            <PlayerBox
                                key={player.id}
                                {...player}
                                isGameOver={gameState.isGameOver}
                                results={gameState.results}
                                isCurrentPlayer={player.id === playerId}
                            />
                        ))}
                        {Array.from({ length: emptySlots }).map((_, index) => (
                            <EmptyPlayerBox key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default GameDesk;