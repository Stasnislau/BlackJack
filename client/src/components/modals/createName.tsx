
import React, { useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import useClickOutside from '../../hooks/useClickOutside';

interface CreateNameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
}

const CreateNameModal = ({
    isOpen,
    onClose,
    onSubmit,
}: CreateNameModalProps) => {
    const [name, setName] = useState('');

    const ref = useRef(null);

    useClickOutside(ref, () => {
        onClose();
    });

    const handleSubmit = () => {
        onSubmit(name);
        onClose();
    };




    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <div
                        className="bg-white p-10 rounded-lg text-gray-700 relative"
                        ref={ref}
                    >
                        <div className="absolute
                            top-[5%]
                            right-[5%]
                            cursor-pointer
                        ">
                            <button
                                onClick={onClose}
                                className="text-3xl hover:scale-110 transform transition duration-300 ease-in-out"
                            >
                                &times;
                            </button>
                        </div>
                        <h2 className="text-2xl mb-4">Enter your name</h2>
                        <div className="mb-4 flex flex-col">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border p-2 rounded-lg mb-4"
                            />
                            <button
                                onClick={handleSubmit}
                                className="bg-green-500 text-white p-2 rounded-lg"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

    );

}

export default CreateNameModal;