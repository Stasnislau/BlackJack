const EmptyPlayerBox = () => {
    return (
        <div className="flex flex-col items-center justify-center w-40 h-40 bg-gray-900 rounded-lg shadow-lg m-4">
            <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse">
                Add Player
            </div>
            <div className="w-16 h-4 bg-gray-800 rounded-full mt-2 animate-pulse">

                Click to Add AI Player
            </div>
        </div>
    );
};

export default EmptyPlayerBox;