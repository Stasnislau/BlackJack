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
    const emptySlots = Math.max(0, 4 - (players?.length || 0));

    return (
        <div className="h-screen  w-screen text-white py-8 overflow-y-auto">
            <div className="mx-auto w-full px-4">
                <div className="flex flex-col justify-between">
                    {gameState?.isGameStarted && croupier && (
                        <div className="mb-10 w-fit absolute top-[5%] left-[50%]">
                            <PlayerBox
                                key={croupier.id}
                                {...croupier}
                                isGameOver={gameState.isGameOver}
                                isCurrentPlayer={croupier.id === playerId}
                                results={gameState.results}
                                isGameStarted={gameState.isGameStarted}
                            />
                        </div>
                    )}
                    <div className="flex justify-center gap-8">
                        {players?.map((player) => (
                            <PlayerBox
                                key={player.id}
                                {...player}
                                isGameOver={gameState.isGameOver}
                                results={gameState.results}
                                isCurrentPlayer={player.id === playerId}
                                isGameStarted={gameState.isGameStarted}
                            />
                        ))}

                        {!gameState.isGameStarted &&
                            Array.from({ length: emptySlots }).map((_, index) => (
                                <EmptyPlayerBox key={index} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};


export default GameDesk;