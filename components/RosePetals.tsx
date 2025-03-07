import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const RosePetals = () => {
    const [petals, setPetals] = useState<{ id: number; left: number }[]>([]);

    useEffect(() => {
        const createPetal = () => {
            const id = Date.now();
            const left = Math.random() * window.innerWidth;
            setPetals(prev => [...prev, { id, left }]);

            setTimeout(() => {
                setPetals(prev => prev.filter(petal => petal.id !== id));
            }, 10000);
        };

        const interval = setInterval(createPetal, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {petals.map(petal => (
                <motion.div
                    key={petal.id}
                    className="rose-petal"
                    initial={{ top: -20, left: petal.left, rotate: 0 }}
                    animate={{
                        top: '100vh',
                        rotate: 360,
                        left: petal.left + Math.sin(Date.now()) * 100,
                    }}
                    transition={{
                        duration: 10,
                        ease: 'linear',
                    }}
                />
            ))}
        </>
    );
};

export default RosePetals; 