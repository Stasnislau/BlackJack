import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateNameModal } from '../components/modals';
import { connection } from '../connection';
import { CreateResponse } from '../types';
import BlackjackPicture from './../assets/pictures/blackjack.png'
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className=" min-h-screen h-full bg-background-primary overflow-y-auto">
            <div className='flex flex-col w-full h-full'>
                <div className="flex flex-row w-full mt-6">
                    <div className='grow 3xl:w-[52%] md:w-[45%] w-[50%] 3xl:pl-[10%] xl:pl-[2%] lg:pl-10'>
                        <div className="flex flex-col justify-center w-full h-full gap-4 font-bold md:ml-20">
                            <p className='text-primary lg:text-7xl md:text-5xl text-3xl select-none'>Join others in BlackJack</p>
                            <p className='text-secondary text-3xl animate-pulse select-none'>Play online to
                                <span className='text-primary'> win</span> big
                            </p>
                            <button
                                onClick={() => setIsNameModalOpen(true)}
                                className="bg-primary w-40 select-none text-text-secondary hover:scale-105 hover:saturate-150 text-lg font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out shadow-lg"
                            >
                                Join Game
                            </button>
                        </div>
                    </div>
                    <div className='grow 2xl:w-[45%] md:w-[40%] w-[50%] lg:pr-[10%] select-none'>
                        <img src={BlackjackPicture} alt="Blackjack" className="w-auto h-full object-cover" />
                    </div>
                </div>
                <div className="flex flex-row w-full h-12 mt-8 bg-background-secondary">
                    <div className="w-1/3 rounded-e-full h-full justify-center bg-primary">
                        <p className="text-text-secondary flex h-full text-2xl font-bold justify-center items-center select-none">
                            It's your chance
                        </p>
                    </div>
                    <div className="grow rounded-full h-full justify-between flex text-md flex-row mx-6">
                        <p className="text-text-primary flex h-full font-bold justify-center items-center select-none">
                            Play with people around the globe
                        </p>
                        <p className="text-text-primary flex h-full font-bold justify-center items-center select-none">
                            Create your own game
                        </p>
                        <p className="text-text-primary flex h-full font-bold justify-center items-center select-none">
                            Join a game
                        </p>
                    </div>
                </div>


                <div className="grow min-h-0 bg-button-secondary w-full pt-8 mx-auto px-4 grid grid-cols-3 grid-rows-2 gap-4">
                    <div className="col-start-2 row-start-2 flex flex-col items-center justify-center gap-4">
                        <button
                            onClick={handleCreateGame}
                            disabled={isGameCreated}
                            className="bg-gold-700 select-none
                             disabled:opacity-50 disabled:cursor-not-allowed
                            text-text-primary hover:scale-105 hover:saturate-150 text-3xl font-bold py-4 px-8 rounded-full transition duration-300 ease-in-out shadow-lg"
                        >
                            Create Game
                        </button>
                    </div>
                    <div className="col-start-1 row-span-2 row-start-1 flex flex-col items-start gap-4">
                        <div className='w-full text-center gap-4'>
                            <p className="text-primary  font-bold text-xl select-none">
                                Rules of the Game
                            </p>
                        </div>
                        <p className="text-text-primary text-md select-none">
                            1. The goal is to get closer to 21 than the dealer without going over.
                        </p>
                        <p className="text-text-primary text-md select-none">
                            2. Cards 2-10 are worth their face value, face cards are worth 10, and Aces are worth 1 or 11.
                        </p>
                        <p className="text-text-primary text-md select-none">
                            3. Players receive two cards face up, while the dealer has one card face up and one face down.
                        </p>
                    </div>
                    <AnimatePresence>
                        {isGameCreated && (
                            <div className="col-start-2 row-start-1 flex justify-center items-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col justify-between gap-4 items-center bg-gradient-to-tr from-gold-700 to-gold-200 p-4 rounded-xl shadow-lg"
                                >
                                    <span className=" text-gray-900 font-bold text-2xl select-none">
                                        Game Code
                                    </span>
                                    <div className="flex flex-row items-center gap-4">
                                        <p
                                            className="text-text-secondary font-bold text-lg select-text font-mono">
                                            {gameCode}
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigator.clipboard.writeText(gameCode)}
                                            className=" text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out bg-gray-700 hover:saturate-150 select-none"
                                            title="Copy Game Code"
                                        >
                                            Copy
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                    <div className="col-start-3 row-span-2 row-start-1 flex flex-col items-start gap-4">
                        <div className='w-full text-center gap-4'>
                            <p className="text-primary  font-bold text-xl select-none">
                                Responsible Gaming
                            </p>
                        </div>
                        <p className="text-text-primary text-md select-none">
                            1. Set a budget and stick to it.
                        </p>
                        <p className="text-text-primary text-md select-none">
                            2. Take breaks and don't chase losses.
                        </p>
                        <p className="text-text-primary text-md select-none">
                            3. Know when to walk away and enjoy other activities.
                        </p>
                    </div>
                </div>
            </div>
            <CreateNameModal
                isOpen={isNameModalOpen}
                onClose={() => setIsNameModalOpen(false)}
                onSubmit={(name: string, gameCode: string) => {
                    navigate(`/game/${gameCode}?name=${encodeURIComponent(name)}`);
                }}
                initGameCode={gameCode}
            />
        </div >
    );
};

export default Lobby;
