import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateNameModal } from '../components/modals';
import { connection } from '../connection';
import { CreateResponse } from '../types';
import BlackjackPicture from './../assets/pictures/blackjack.png'

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
            setIsConnected(false);
            startConnection();
        });
    }, []);

    const handleCreateGame = async () => {
        connection.invoke('CreateGame').catch((err) => console.error(err));
    }
    useEffect(() => {
        connection.on("GameMessage", (message) => {
            const response = message as CreateResponse;
            if (response.task === "create") {
                setGameCode(response.gameCode);
                setIsGameCreated(true);
            }

        });

        return () => {
            if (connection.state === "Connected") {
                connection.off("GameMessage");
            }
        };
    }, []);

    return (
        <div className="h-screen bg-background-primary overflow-y-auto px-20">
            <div className="flex flex-row w-full mt-20">
                <div className='grow 2xl:w-[65%] md:w-[75%] w-[50%]'>
                    <div className="flex flex-col justify-center px-[20%] w-full h-full gap-4 font-bold">
                        <p className='text-primary text-6xl'>Join others in BlackJack</p>
                        <p className='text-secondary text-2xl'>Get tonnes of cash</p>
                        <button
                            onClick={() => setIsNameModalOpen(true)}
                            className="bg-primary w-40 text-text-secondary hover:scale-105 hover:saturate-150 text-lg font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out shadow-lg"
                        >
                            Join Game
                        </button>
                    </div>
                </div>
                <div className='grow 2xl:w-[35%] md:w-[25%] w-[50%]'>
                    <img src={BlackjackPicture} alt="Blackjack" className="w-full h-auto object-cover" />
                </div>
            </div>
            <div className=" mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="md:text-3xl text-xl text-gold mb-6">How to Play</h2>
                    <p className="mb-4 md:text-lg sm:text-md text-sm text-green-300">
                        Beat the dealer by getting a count as close to 21 as possible, without going over.
                        If you do it better than the dealer, you win.
                    </p>
                    <p className="mb-4 md:text-lg sm:text-md text-sm text-green-300">
                        Hit to take another card, or stand to stop. If your total is higher than the dealer's
                        without going over 21, you win the round.
                    </p>
                </div>
                <div className="flex justify-center gap-4">

                    <button
                        onClick={handleCreateGame}
                        className="bg-gradient-to-r from-gold-500 to-gold-700 hover:scale-110 hover:saturate-150 text-xl font-bold py-4 px-8 rounded-full transition duration-300 ease-in-out shadow-lg"
                    >
                        Create Game
                    </button>
                </div>
                {isGameCreated && (
                    <div className="flex justify-center items-center mt-8">
                        <div className="bg-green-500 text-white text-2xl font-bold py-2 px-4 rounded-lg shadow-lg flex items-center gap-4">
                            <span>Game Code: &nbsp;
                                <span className="text-gold animate-pulse">
                                    {gameCode}
                                </span>
                            </span>
                            <button
                                onClick={() => navigator.clipboard.writeText(gameCode)}
                                className="bg-gold-500 hover:bg-gold-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                                title="Copy Game Code"
                            >
                                Copy
                            </button>
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
                    navigate(`/game/${gameCode}?name=${encodeURIComponent(name)}`);
                }}
                initGameCode={gameCode}
            />
        </div>
    );
};

export default Lobby;
