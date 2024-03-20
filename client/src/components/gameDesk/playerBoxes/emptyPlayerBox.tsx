import React from 'react';

interface EmptyPlayerBoxProps {
    onAddPlayer: () => void;
}

const EmptyPlayerBox = ({ onAddPlayer }: EmptyPlayerBoxProps) => {
    return (
        <div className="flex flex-col items-center p-4 w-60 h-60 bg-gray-900 rounded-lg shadow-2xl m-4">
            <div className="text-white text-xl font-semibold mb-2">Empty slot</div>
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-2 animate-pulse border-4 border-white">
                <div className="text-white text-xl font-semibold">AI</div>
            </div>
            <button onClick={onAddPlayer} className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition duration-200 transform hover:scale-105">
                Add AI Player
            </button>
        </div>
    );
};

export default EmptyPlayerBox;
