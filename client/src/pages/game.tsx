import { useEffect, useState } from 'react';
import { connection } from '../connection';
import { useLocation, useParams } from 'react-router';
import { GameMessageInterface, GameState } from '../types';
import GameDesk from '../components/gameDesk/gameDesk';
import { useNavigate } from 'react-router-dom';

const GamePage = () => {
    const [isConnected, setIsConnected] = useState(connection.state === "Connected");
    const [gameState, setGameState] = useState({} as GameState);
    const [playerId, setPlayerId] = useState('');
    const { gameCode } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get('name');
    const [isGameStarted, setIsGameStarted] = useState(gameState.isGameStarted || false);
    const [isJoined, setIsJoined] = useState(false);

    const handleHit = () => {
        connection.invoke('Hit', gameCode).catch((err) => console.error(err));
    }

    const handleStand = () => {
        connection.invoke('Stand', gameCode).catch((err) => console.error(err));
    }

    const handleAddAiPlayer = () => {
        connection.invoke('AddAiPlayer', gameCode).catch((err) => console.error(err));
    }

    const handleRemoveAiPlayer = (playerId: string) => {
        connection.invoke('RemoveAiPlayer', gameCode, playerId).catch((err) => console.error(err));
    }

    const handleLeaveGame = (playerId: string) => {
        connection.invoke('LeaveGame', gameCode, playerId).catch((err) => console.error(err));
    }

    async function startConnection() {
        try {
            console.log('SignalR Connecting in Game Page...', connection.state, gameCode, name);
            if (connection.state === "Disconnected") {
                await connection.start();
                console.log('SignalR Connected.');
                setIsConnected(true);
                const blackJack = localStorage.getItem("blackJack");
                console.log(blackJack, "blackJack");
                if (blackJack) {
                    const { localGameCode, localPlayerId } = JSON.parse(blackJack);
                    if (gameCode === localGameCode && localPlayerId !== "") {
                        connection.invoke('Reconnect', gameCode, localPlayerId).catch((err) => console.error(err));
                    }
                    else {
                        localStorage.removeItem("blackJack");
                    }
                }
                else {
                    console.log('Joining Game:', gameCode, name);
                    connection.invoke('JoinGame', gameCode, name).catch((err) => console.error(err));
                }

            }
            else if (connection.state === "Connected" && !isJoined) {
                connection.invoke('JoinGame', gameCode, name).catch((err) => console.error(err));
            }
        } catch (err) {
            console.error('SignalR Connection Error: ', err);
        }
    }

    useEffect(() => {
        if (!isConnected && connection.state === "Disconnected") {
            startConnection();
        }

        connection.onclose(() => {
            setIsConnected(false);
            console.log('SignalR Disconnected.');
            startConnection();
        });

        return () => {
            if (connection.state === "Connected" && isJoined && gameCode) {
                console.log('SignalR Stopping in Game Page...', isJoined, gameCode);
                connection.stop();
            }
        };
    }, [gameCode]);

    useEffect(() => {
        console.log('SignalR State Changed:', connection.state);
        if (gameCode && isConnected && !isJoined && connection.state === "Connected") {
            connection.invoke('JoinGame', gameCode, name).catch((err) => console.error(err));
        }
    }, [connection.state, gameCode, isConnected, isJoined, name]);


    useEffect(() => {
        connection.on("GameMessage", (message) => {
            const response = message as GameMessageInterface;
            switch (response.task) {
                case "start":
                    console.log("POEHALI! ");
                    setIsGameStarted(true);
                    break;
                case "state":
                    setGameState(response.gameState!);
                    setIsGameStarted(response.gameState!.isGameStarted);
                    console.log('Game State Updated:', response.gameState);
                    break;
                case "reconnect":
                    if (response.message === "success" && response.playerId !== "") {
                        console.log(response)
                        setIsConnected(true);
                        setIsJoined(true);
                        setPlayerId(response.playerId!);
                        console.log('Reconnected');
                    } else if (response.message === "failure") {
                        localStorage.removeItem("blackJack");
                        console.log('Reconnect failed', isConnected);
                        startConnection();
                    }
                    break;
                case "join":
                    console.log('Player Joined:', response.message);
                    setIsJoined(true);
                    localStorage.setItem("blackJack", JSON.stringify({ localGameCode: gameCode, localPlayerId: response.playerId }));
                    setPlayerId(response.playerId!);
                    console.log('Player id:', response.playerId!);
                    break;
                case "leave":
                    console.log('Player Left:', response.message);
                    navigate('/');
                    break;
                case "error":
                    console.error('Game Error:', response.message);
                    break;

                default:
                    break;
            }
        });

        return () => {
            if (connection.state === "Connected") {
                connection.off("GameMessage");
            }
        };
    }, []);

    return (
        <div className='flex flex-col items-center justify-center h-screen text-white'>
            <div className="flex flex-col p-4 absolute right-[1%] top-[5%] bg-gray-800 bg-opacity-60 shadow-lg rounded-lg">
                {name && (
                    <p className="text-lg mb-2">
                        Name: <span className="text-gold-200">{name}</span>
                    </p>
                )}
                {isConnected ? (
                    <p className="text-casino-green">Connected</p>
                ) : (
                    <p className="text-red-400">Disconnected</p>
                )}
                {isJoined ? (
                    <p className="text-casino-green">Joined</p>
                ) : (
                    <p className="text-red-500">Not Joined</p>
                )}
                {gameState.players && gameState.players.length > 0 && (
                    <>
                        <p>Money: {gameState.players.find((player) => player.id === playerId)?.money}</p>
                        <p>Bet: {gameState.players.find((player) => player.id === playerId)?.bet}</p>
                    </>
                )}
                {gameCode && (
                    <p className="text-lg mb-2">
                        Game Code: <span className="text-gold-200">{gameCode}</span>
                    </p>
                )}
                {!isGameStarted || gameState.isGameOver ? (
                    <p className="italic mb-3">Waiting to start...</p>
                ) : null}
            </div>

            {!isGameStarted && !gameState.isGameOver && isJoined &&
                <div className="absolute left-[50%] top-[45%] transform -translate-x-1/2 flex flex-row gap-4">
                    <button

                        onClick={() => connection.invoke('StartGame', gameCode).catch((err) => console.error(err))}
                        className="bg-primary text-text-secondary hover:saturate-150 hover:scale-105 z-10 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    >
                        Start Game
                    </button>
                    <button
                        onClick={() => handleLeaveGame(playerId)}
                        className="bg-red-500 hover:bg-red-700 hover:scale-105 z-10 text-white font-bold py-2 px-4 rounded  focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    >
                        Leave Game
                    </button>
                </div>
            }
            {gameState.isGameOver && isJoined &&
                <div className="absolute left-[50%] top-[45%] transform -translate-x-1/2 flex flex-row gap-4">
                    <button
                        onClick={() => connection.invoke('RestartGame', gameCode).catch((err) => console.error(err))}
                        className="bg-primary text-text-secondary hover:saturate-150 hover:scale-105 z-10 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    >
                        Restart Game
                    </button>
                    <button
                        onClick={() => handleLeaveGame(playerId)}
                        className="bg-red-500 hover:bg-red-700 hover:scale-105  z-10 text-white font-bold py-2 px-4 rounded  focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    >
                        Leave Game
                    </button>
                </div>
            }
            {
                !isJoined && (
                    <p className="text-2xl">Joining...</p>
                )
            }

            {isJoined && GameDesk({
                gameState,
                playerId,
                onHit: handleHit,
                onStand: handleStand,
                onAddPlayer: handleAddAiPlayer,
                onRemoveAiPlayer: handleRemoveAiPlayer,
            })}
        </div >
    );
}

export default GamePage;
