import { useEffect, useState, useContext } from 'react';
import { connection } from '../connection';
import { useLocation, useParams } from 'react-router';
import { GameMessageInterface, GameState } from '../types';
import PlayerBox from '../components/playerBox/playerBox';
import { Context } from '../main';

const GamePage = () => {
    const [isConnected, setIsConnected] = useState(connection.state === "Connected");
    const [gameState, setGameState] = useState({} as GameState);
    const { gameCode } = useParams();
    const location = useLocation();
    const store = useContext(Context);

    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get('name');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isJoined, setIsJoined] = useState(false);

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
                    console.log('Game State Updated:', response.gameState);
                    break;
                case "reconnect":
                    console.log('Reconnected:', response.message);
                    if (response.message === "success" && response.playerId !== "") {
                        setIsConnected(true);
                        setIsJoined(true);
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
            {isJoined && <p>Joined</p>}

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
