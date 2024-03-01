import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateNameModal } from '../components/modals';
import { connection } from '../connection';
import { CreateResponse } from '../types';

const Lobby = () => {
    const navigate = useNavigate();
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [gameCode, setGameCode] = useState('');
    const [isGameCreated, setIsGameCreated] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        async function startConnection() {

            if (connection.state === "Disconnected") {
                try {
                    await connection.start();
                    console.log('SignalR Connected.');
                    setIsConnected(true);
                } catch (err) {
                    console.error('SignalR Connection Error: ', err);
                }
            }
        }

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
    }, []);

    const handleCreateGame = async () => {
        // send a message to the server to create a new game
        connection.invoke('CreateGame').catch((err) => console.error(err));
    }
    useEffect(() => {
        connection.on("GameMessage", (message) => {
            const response = message as CreateResponse;
            if (response.task === "create") {
                setGameCode(response.sessionId);
                setIsGameCreated(true);
            }
            console.log(message);
            // Handle the message, update UI accordingly
        });

        return () => {
            connection.off("GameMessage");
        };
    }, []);

    return (
        <div className="h-screen bg-gradient-to-b from-gray-800 to-green-900 text-white py-8 overflow-y-auto">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="xl:text-6xl md:text-3xl text-2xl font-bold text-green-200 mb-4">
                        BlackJack Table
                    </h1>
                    <p className="md:text-lg sm:text-md text-sm text-green-100 mb-8">
                        Play BlackJack with players from around the globe.
                    </p>
                </div>
                <div className="text-center mb-12">
                    <h2 className="md:text-3xl text-xl text-green-300 mb-6">How to Play</h2>
                    <p className="mb-4 md:text-lg sm:text-md text-sm">
                        Beat the dealer by getting a count as close to 21 as possible, without going over.
                        If you do it better than the dealer, you win.
                    </p>
                    <p className="mb-4 md:text-lg sm:text-md text-sm">
                        Hit to take another card, or stand to stop. If your total is higher than the dealer's
                        without going over 21, you win the round.
                    </p>
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setIsNameModalOpen(true)}
                        className="bg-green-700 hover:scale-110 hover:saturate-150 text-xl font-bold py-4 px-8 rounded-full transition duration-300 ease-in-out shadow-lg"
                    >
                        Join Game
                    </button>
                    <button
                        onClick={handleCreateGame}
                        className="bg-green-500 hover:scale-110 hover:saturate-150 text-xl font-bold py-4 px-8 rounded-full transition duration-300 ease-in-out shadow-lg"
                    >
                        Create Game
                    </button>
                </div>
                {isGameCreated && (
                    <div className="flex justify-center items-center mt-8">
                        <div className="bg-green-500 text-white text-2xl font-bold py-2 px-4 rounded-lg shadow-lg animate-pulse">
                            Game Code: {gameCode}
                        </div>
                    </div>
                )}
                <footer className="text-center text-green-300 mt-12 md:text-lg sm:text-md text-sm">
                    <p>
                        Ready for the challenge? Grab a seat at the table by joining a game or setting up your own.
                    </p>
                </footer>

            </div>

            <CreateNameModal
                isOpen={isNameModalOpen}
                onClose={() => setIsNameModalOpen(false)}
                onSubmit={(name: string, gameCode: string) => {
                    navigate(`/game/${gameCode}`);
                }}
                initGameCode={gameCode}
            />


        </div >
    );
};

export default Lobby;
