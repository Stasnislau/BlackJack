
interface EmptyPlayerBoxProps {
    onAddPlayer: () => void;
}

const cardSlots = Array.from({ length: 5 }).map((_, index) => {

    return (
        <div key={index} className="w-16 h-24 bg-gray-500"></div>
    );
});

const EmptyPlayerBox = ({ onAddPlayer }: EmptyPlayerBoxProps) => {
    return (
        <div className={`flex flex-col items-center bg-gray-600 bg-opacity-85 shadow-xl p-4 rounded m-2 }`}>
            <div className="flex flex-col items-center relative">
                <div className="flex bg-gray-950 rounded-t-xl relative">
                    <h2 className="text-xl font-bold animate-pulse px-8">Empty slot</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-2 bg-gray-950 p-4 pb-0 rounded-t-xl">
                    {cardSlots}
                </div>
            </div>
            <div className="flex w-full flex-col bg-gray-950 p-2 relative ">

                <button onClick={onAddPlayer} className="bg-casino-green text-white px-4 py-2 rounded-full absolute left-[50%] top-[95%] transform -translate-x-1/2 hover:saturate-50 transition duration-200 hover:scale-105">
                    Add AI Player
                </button>
            </div>
        </div>
    );
};

export default EmptyPlayerBox;

