
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useClickOutside from '../../hooks/useClickOutside';

interface CreateNameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, gameCode: string) => void;
    initGameCode: string;
}

const CreateNameModal = ({
    isOpen,
    onClose,
    onSubmit,
    initGameCode,
}: CreateNameModalProps) => {
    const [name, setName] = useState('');
    const [gameCode, setGameCode] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (initGameCode !== '')
            setGameCode(initGameCode);
    }, [initGameCode]);

    const ref = useRef(null);

    useClickOutside(ref, () => {
        setError(null);
        onClose();
    });

    const handleSubmit = () => {
        if (!name || !gameCode) {
            setError("Please fill in all fields");
            return;
        }
        onSubmit(name, gameCode);
        setError(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <div
                        className="bg-gray-600 p-10 rounded-xl text-text-primary relative md:w-auto w-full max-w-md lg:min-w-80 lg:max-w-none"
                        ref={ref}
                    >
                        <div className="absolute top-[5%] right-[5%] cursor-pointer">
                            <button
                                onClick={() => {
                                    setError(null);
                                    onClose()
                                }}
                                className="text-3xl hover:scale-110 transform transition duration-300 ease-in-out text-text-primary"
                            >
                                &times;
                            </button>
                        </div>
                        <h2 className="text-2xl mb-4 text-primary">Registration</h2>
                        <div className="mb-4 flex flex-col">
                            <label htmlFor="gameCode" className="mb-2 text-text-primary">Game Code</label>
                            <input
                                type="text"
                                value={gameCode}
                                disabled={initGameCode !== ''}
                                onChange={(e) => setGameCode(e.target.value)}
                                className="border p-2 rounded-lg mb-4 disabled:opacity-50 bg-gray-200 text-text-secondary outline-none"
                                placeholder='Enter Game Code Here...'
                            />
                            <label htmlFor="name" className="mb-2 text-text-primary">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border border-text-primary bg-gray-200 p-2 rounded-lg mb-4 text-text-secondary outline-none"
                                placeholder='Enter Name Here...'
                            />

                            <button
                                onClick={handleSubmit}
                                className="bg-primary text-text-secondary p-2 rounded-lg hover:saturate-150 hover:scale-105 transition duration-300 ease-in-out"
                            >
                                Submit
                            </button>
                        </div>
                        {error && <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-red-500">{error}</motion.p>}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

    );

}

export default CreateNameModal;