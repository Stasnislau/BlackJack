import { animate, motion, useAnimate } from "framer-motion";
import { useNavigate } from "react-router";
import React from "react";

const ErrorPage = () => {
    const navigate = useNavigate();

    const [scope404] = useAnimate();
    const [scopeText] = useAnimate();



    setTimeout(() => {
        navigate('/');
    }, 3000);

    const handleAnimation404 = async () => {
        await animate(
            scope404.current,
            {
                scale: 1.5,
                color: "rgba(255,0,0,1)",
            },
            {
                duration: 0.5,
                ease: "linear",

            }
        )
    }

    const handleAnimationText = async () => {
        await animate(
            scopeText.current,
            {
                x: [1000, -1000],
            },
            {
                duration: 3,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse",
            }
        )
    };

    React.useEffect(() => {
        handleAnimationText();
    }, []);
    React.useEffect(() => {
        handleAnimation404();
    }, []);
    return (
        <div>
            <motion.div
                initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
                animate={{ backgroundColor: 'rgba(0,0,0,1)' }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-screen w-full absolute bg-stone-950 text-7xl font-bold z-[5]"
            />
            <div className="h-screen w-full absolute flex justify-center items-center flex-col gap-10 overflow-hidden">
                <motion.p
                    ref={scope404}
                    className='text-6xl z-10'>404
                </motion.p>
                <motion.p
                    ref={scopeText}
                    className='xl:text-6xl text-2xl z-10'>Page not found
                </motion.p>
            </div>
        </div>
    );
}

export default ErrorPage;