import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Firework = ({ x, y, color }: { x: number; y: number; color: string }) => {
    const particles = Array.from({ length: 12 });

    return (
        <>
            {particles.map((_, i) => {
                const angle = (i / particles.length) * Math.PI * 2;
                return (
                    <motion.div
                        key={i}
                        style={{
                            position: 'fixed',
                            left: x,
                            top: y,
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: color,
                        }}
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{
                            x: Math.cos(angle) * 100,
                            y: Math.sin(angle) * 100,
                            scale: 0,
                            opacity: 0,
                        }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                );
            })}
        </>
    );
};

const Fireworks = ({ isActive }: { isActive: boolean }) => {
    const [fireworks, setFireworks] = useState<Array<{
        id: number;
        x: number;
        y: number;
        color: string;
    }>>([]);

    useEffect(() => {
        if (!isActive) return;

        const colors = ['#FF1744', '#FF4081', '#F50057', '#D500F9', '#651FFF'];
        const interval = setInterval(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight / 2);
            const color = colors[Math.floor(Math.random() * colors.length)];
            const id = Date.now();

            setFireworks(prev => [...prev, { id, x, y, color }]);

            setTimeout(() => {
                setFireworks(prev => prev.filter(fw => fw.id !== id));
            }, 1000);
        }, 300);

        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <>
            {fireworks.map(fw => (
                <Firework key={fw.id} x={fw.x} y={fw.y} color={fw.color} />
            ))}
        </>
    );
};

export default Fireworks; 