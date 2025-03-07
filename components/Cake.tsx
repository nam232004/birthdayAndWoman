import { motion } from 'framer-motion';
import { useState } from 'react';

const Cake = ({ onCakeClick }: { onCakeClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="relative cursor-pointer w-96 h-96 bg-transparent"
            style={{ transform: 'translateZ(0)' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onCakeClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            {/* Cake shadow */}
            <div className="absolute bottom-0 w-full h-4 bg-black/20 rounded-full blur-md" />

            {/* Cake plate */}
            <motion.div
                className="absolute bottom-0 w-full h-6 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full shadow-lg"
                animate={{
                    y: isHovered ? -5 : 0,
                }}
            />

            {/* Cake base */}
            <motion.div
                className="absolute bottom-6 w-full h-40 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-2xl shadow-lg border-2 border-yellow-100"
                animate={{
                    y: isHovered ? -5 : 0,
                }}
            >
                {/* Vertical stripes */}
                <div className="absolute inset-0 flex justify-around">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-1 h-full bg-yellow-100/50" />
                    ))}
                </div>
            </motion.div>

            {/* Frosting layer */}
            <motion.div
                className="absolute bottom-36 w-[108%] h-12 bg-white -left-[4%] rounded-full shadow-lg"
                animate={{
                    y: isHovered ? -8 : 0,
                }}
            >
                {/* Frosting decorations */}
                <div className="absolute -bottom-2 w-full flex justify-around">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-6 h-6 bg-white rounded-full shadow-inner"
                            animate={{
                                y: isHovered ? -2 : 0,
                            }}
                            transition={{
                                delay: i * 0.1,
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Strawberries */}
            <div className="absolute bottom-40 w-full flex justify-around px-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="relative"
                        animate={{
                            y: isHovered ? -10 : 0,
                        }}
                        transition={{
                            delay: i * 0.1,
                        }}
                    >
                        <div className="w-8 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full shadow-lg" />
                        <div className="absolute -top-2 left-1/2 w-4 h-4 bg-gradient-to-b from-green-500 to-green-600 rounded-full transform -translate-x-1/2 rotate-45" />
                    </motion.div>
                ))}
            </div>

            {/* Candles */}
            <div className="absolute bottom-44 w-full flex justify-around px-12">
                {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="relative"
                        animate={{
                            y: isHovered ? -12 : 0,
                        }}
                        transition={{
                            delay: i * 0.1,
                        }}
                    >
                        {/* Candle stick */}
                        <motion.div
                            className="w-3 h-12 bg-gradient-to-t from-pink-300 to-pink-200 rounded-sm shadow-lg"
                        />
                        {/* Flame */}
                        <motion.div
                            className="absolute -top-4 left-1/2 w-6 h-8"
                            animate={{
                                scaleY: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        >
                            <div className="w-full h-full bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full" />
                            {/* Flame glow */}
                            <div className="absolute inset-0 bg-yellow-300/50 rounded-full blur-sm" />
                            {/* Additional glow */}
                            <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-md scale-150" />
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* Sparkles */}
            {isHovered && (
                <div className="absolute inset-0">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <motion.div
                            key={`sparkle-${i}`}
                            className="absolute w-2 h-2 bg-yellow-200 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.1,
                            }}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Cake; 