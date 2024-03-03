import { useEffect, useState } from 'react';
import { connection } from '../connection';
import { useLocation, useParams } from 'react-router';
import { GameMessageInterface, GameState } from '../types';
import PlayerBox from '../components/playerBox/playerBox';

const GamePage = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [gameState, setGameState] = useState({} as GameState);
    const { gameCode } = useParams();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get('name');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isJoined, setIsJoined] = useState(false);

    async function startConnection() {

        if (connection.state === "Disconnected") {
            try {
                await connection.start();
                console.log('SignalR Connected.');
                setIsConnected(true);
                const blackJack = localStorage.getItem("blackJack");
                console.log(blackJack, "blackJack");
                if (blackJack) {
                    const { localGameCode, localPlayerId } = JSON.parse(blackJack);
                    if (gameCode === localGameCode && localPlayerId !== "") {
                        connection.invoke('Reconnect', gameCode, localPlayerId).catch((err) => console.error(err));
                        return;
                    }
                }
                connection.invoke('JoinGame', gameCode, name).catch((err) => console.error(err));
            } catch (err) {
                console.error('SignalR Connection Error: ', err);
            }
        }
    }

    useEffect(() => {
        if (!isConnected && connection.state === "Disconnected") {
            startConnection();
        }

        connection.onclose(() => {
            console.log('SignalR Disconnected.');
            setIsConnected(false);
            startConnection();
        });

        return () => {
            if (connection.state === "Connected")
                connection.stop();
        };
    }, [gameCode]);

    useEffect(() => {
        if (gameCode && isConnected && !isJoined) {
            connection.invoke('JoinGame', gameCode, name).catch((err) => console.error(err));
        }
    }, [gameCode, isConnected, isJoined]);


    useEffect(() => {
        connection.on("reconnect", (message) => {
            if (message === "success" && message.playerId !== "") {
                setIsConnected(true);
                console.log('Reconnected');
            } else if (message === "failed") {
                localStorage.removeItem("blackJack");
                console.error('Reconnect failed');
                startConnection();
            }
        });

        return () => {
            connection.off("reconnect");
        };
    }, [gameCode, isConnected]);

    useEffect(() => {
        connection.on("GameMessage", (message) => {
            const response = message as GameMessageInterface;
            switch (response.task) {
                case "start":
                    console.log("STARTUEM SUKA BLYAT");
                    setIsGameStarted(true);
                    break;
                case "state":
                    setGameState(response.gameState!);
                    console.log('Game State Updated:', response.gameState);
                    break;
                case "join":
                    console.log('Player Joined:', response.message);
                    setIsJoined(true);
                    localStorage.setItem("blackJack", JSON.stringify({ localGameCode: gameCode, localPlayerId: response.playerId }));
                    break;
                case "leave":
                    console.log('Player Left:', response.message);
                    break;
                case "error":
                    console.error('Game Error:', response.message);
                    break;

                default:
                    break;
            }
        });

        return () => {
            connection.off("GameMessage");
        };
    }, []);

    return (
        <div className='
        flex flex-col items-center justify-center h-screen
        '>
            <h1>Game Page</h1>
            {isConnected ? <p>Connected</p> : <p>Disconnected</p>}
            {gameCode && <p>Game Code: {gameCode}</p>}
            {!isGameStarted && <p>Waiting for players...</p>}
            {!isGameStarted &&
                <button onClick={() => connection.invoke('StartGame', gameCode).catch((err) => console.error(err))}>Start Game</button>
            }


            {
                isGameStarted && (
                    <div>
                        <h2>Game State</h2>
                        <div className="flex space-x-4">
                            {gameState && gameState.players && gameState.players.length > 0 && gameState.players.map((player) => (
                                <PlayerBox key={player.id} {...player} />
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default GamePage;
