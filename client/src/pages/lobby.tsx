import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { CreateNameModal } from '../components/modals';

const Lobby = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-center h-screen">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-500 text-white p-4 rounded-lg"
                >
                    Join Game
                </button>
            </div>

            <CreateNameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(name) => {
                    console.log(name);
                    navigate('/game');
                }}
            />
        </div>
    );
}

export default Lobby;
