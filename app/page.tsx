'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';

// Định nghĩa kiểu dữ liệu
interface Petal {
    id: number;
    left: number;
    animationDuration: number;
    size: number;
    rotation: number;
}

interface Firework {
    id: number;
    x: number;
    y: number;
    color: string;
}

// Component âm thanh - chỉ phát một lần khi click vào bánh
const BackgroundMusic = () => {
    // Sử dụng ref để theo dõi trạng thái
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hasPlayedRef = useRef(false);

    // Khởi tạo audio element
    useEffect(() => {
        const audio = new Audio('/background-music.mp3');
        audio.loop = true;
        audio.volume = 0.5;
        audioRef.current = audio;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Hàm phát nhạc - chỉ phát một lần
    const playMusic = () => {
        if (audioRef.current && !hasPlayedRef.current) {
            audioRef.current.play()
                .then(() => {
                    hasPlayedRef.current = true;
                    console.log("Nhạc đã bắt đầu phát và sẽ tiếp tục phát");
                })
                .catch(error => {
                    console.error("Không thể phát nhạc:", error);
                });
        }
    };

    return { playMusic };
};

// Component cánh hoa rơi
const RosePetals = () => {
    const [petals, setPetals] = useState<Petal[]>([]);

    useEffect(() => {
        // Tạo cánh hoa mới mỗi 300ms
        const interval = setInterval(() => {
            const newPetal: Petal = {
                id: Date.now(),
                left: Math.random() * 100,
                animationDuration: 5 + Math.random() * 5,
                size: 15 + Math.random() * 15,
                rotation: Math.random() * 360,
            };

            setPetals(prev => [...prev, newPetal]);

            // Xóa cánh hoa sau khi rơi xong
            setTimeout(() => {
                setPetals(prev => prev.filter(petal => petal.id !== newPetal.id));
            }, newPetal.animationDuration * 1000);
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
            {petals.map(petal => (
                <div
                    key={petal.id}
                    style={{
                        position: 'absolute',
                        top: '-20px',
                        left: `${petal.left}%`,
                        width: `${petal.size}px`,
                        height: `${petal.size}px`,
                        backgroundColor: '#FF4081',
                        borderRadius: '50% 0 50% 50%',
                        opacity: 0.8,
                        transform: `rotate(${petal.rotation}deg)`,
                        animation: `fall ${petal.animationDuration}s linear forwards`,
                    }}
                />
            ))}
        </div>
    );
};

// Component pháo hoa
const Fireworks = ({ isActive }: { isActive: boolean }) => {
    const [fireworks, setFireworks] = useState<Firework[]>([]);

    useEffect(() => {
        if (!isActive) return;

        const colors = ['#FF1744', '#FF4081', '#F50057', '#D500F9', '#651FFF'];

        // Tạo pháo hoa mới mỗi 300ms
        const interval = setInterval(() => {
            const newFirework: Firework = {
                id: Date.now(),
                x: Math.random() * 100,
                y: Math.random() * 50,
                color: colors[Math.floor(Math.random() * colors.length)],
            };

            setFireworks(prev => [...prev, newFirework]);

            // Xóa pháo hoa sau 1s
            setTimeout(() => {
                setFireworks(prev => prev.filter(fw => fw.id !== newFirework.id));
            }, 1000);
        }, 300);

        // Dừng tạo pháo hoa sau 5s
        const timeout = setTimeout(() => {
            clearInterval(interval);
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [isActive]);

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
            {fireworks.map(fw => (
                <div key={fw.id} style={{ position: 'absolute', left: `${fw.x}%`, top: `${fw.y}%` }}>
                    {Array.from({ length: 12 }).map((_, i) => {
                        const angle = (i / 12) * Math.PI * 2;
                        return (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    width: '4px',
                                    height: '4px',
                                    backgroundColor: fw.color,
                                    borderRadius: '50%',
                                    animation: 'firework 1s forwards',
                                    transform: `rotate(${angle}rad) translateX(0)`,
                                }}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

// Component thiệp chúc mừng
const Card = ({ isVisible, onClose, onNext, onPrev, currentModal }: {
    isVisible: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    currentModal: number;
}) => {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [studentId, setStudentId] = useState('');
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isVisible) return null;

    // Xử lý sự kiện click vào overlay để đóng thiệp
    const handleOverlayClick = (e: React.MouseEvent) => {
        // Chỉ đóng khi click vào overlay, không phải vào thiệp
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Xử lý gửi ảnh
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fileInputRef.current?.files?.length) {
            toast.error('Vui lòng chọn một ảnh để gửi');
            return;
        }

        if (!studentId.trim()) {
            toast.error('Vui lòng nhập mã số sinh viên');
            return;
        }

        const file = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('message', message);
        formData.append('studentId', studentId);

        setUploading(true);
        setUploadStatus('idle');

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('success');
                setMessage('');
                toast.success('Đã gửi thành công! ✅');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                setUploadStatus('error');
                toast.error('Có lỗi xảy ra khi gửi. Vui lòng thử lại! ❌');
            }
        } catch (error) {
            console.error('Lỗi khi gửi:', error);
            setUploadStatus('error');
            toast.error('Có lỗi xảy ra khi gửi. Vui lòng thử lại! ❌');
        } finally {
            setUploading(false);
        }
    };

    // Nội dung của các modal
    const modalContents = [
        // Modal 1: Thiệp chúc mừng sinh nhật
        <>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                🎂 Happy Birthday! ❤️
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                Mừng Như bước sang tuổi mới!
            </p>
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                Chúc Như có một ngày sinh nhật tuyệt vời và tràn đầy niềm vui!
                <br />
                Công việc, học tập luôn suôn sẻ, quan trọng nhất vẫn là sức khỏe và bình an 🍀
            </p>
        </>,
        // Modal 2: Form gửi ảnh
        <>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#FF1744' }}>
                Món quà nhỏ của toi ❤️
            </h2>

            <form onSubmit={handleSubmit} style={{ width: '100%', textAlign: 'left' }}>
                <div style={{ marginBottom: '2px' }}>
                    <label
                        htmlFor="student-id"
                        style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 'bold',
                            color: '#333'
                        }}
                    >
                        Mã số sinh viên: <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                        id="student-id"
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '0.5rem'
                        }}
                        placeholder="Nhập mã số sinh viên của bạn"
                        required
                    />
                </div>
                <p style={{ fontSize: '0.6rem', marginBottom: '1.5rem' }}>
                    Mã số sinh viên của NNN phải khớp!
                </p>
                <div style={{ marginBottom: '1rem' }}>
                    <label
                        htmlFor="file-upload"
                        style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 'bold',
                            color: '#333'
                        }}
                    >
                        Ảnh QR ngân hàng: <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '0.5rem'
                        }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label
                        htmlFor="message"
                        style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 'bold',
                            color: '#333'
                        }}
                    >
                        Lời nhắn (không bắt buộc):
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '0.5rem',
                            minHeight: '100px',
                            resize: 'vertical'
                        }}
                        placeholder="Nhập lời nhắn của bạn..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={uploading}
                    style={{
                        backgroundColor: uploading ? '#ccc' : '#FF1744',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        width: '100%',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {uploading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </>
    ];

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                animation: 'fadeIn 0.5s forwards',
                zIndex: 100,
                cursor: 'pointer', // Thêm cursor pointer để biểu thị có thể click
            }}
            onClick={handleOverlayClick}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '1rem',
                    maxWidth: '500px',
                    width: '90%',
                    color: '#FF1744',
                    textAlign: 'center',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                    animation: 'scaleIn 0.5s forwards',
                    cursor: 'default', // Đặt lại cursor mặc định cho thiệp
                    position: 'relative',
                }}
                onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra overlay
            >
                {/* Nội dung modal */}
                {modalContents[currentModal]}

                {/* Nút điều hướng */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '2rem',
                    borderTop: '1px solid #eee',
                    paddingTop: '1rem'
                }}>
                    <button
                        onClick={onPrev}
                        disabled={currentModal === 0}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: currentModal === 0 ? '#ccc' : '#FF1744',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: currentModal === 0 ? 'not-allowed' : 'pointer',
                            opacity: currentModal === 0 ? 0.5 : 1,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        ← Previous
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            color: '#333',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Close
                    </button>

                    <button
                        onClick={onNext}
                        disabled={currentModal === modalContents.length - 1}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: currentModal === modalContents.length - 1 ? '#ccc' : '#FF1744',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: currentModal === modalContents.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: currentModal === modalContents.length - 1 ? 0.5 : 1,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

// Component hiệu ứng lấp lánh
const Sparkles = ({ isActive }: { isActive: boolean }) => {
    const [sparkles, setSparkles] = useState<{ id: number, x: number, y: number, size: number }[]>([]);

    useEffect(() => {
        if (!isActive) return;

        // Tạo hiệu ứng lấp lánh xung quanh bánh
        const interval = setInterval(() => {
            const newSparkle = {
                id: Date.now(),
                x: 50 + (Math.random() * 40 - 20), // Xung quanh bánh
                y: 50 + (Math.random() * 40 - 20), // Xung quanh bánh
                size: 2 + Math.random() * 4,
            };

            setSparkles(prev => [...prev, newSparkle]);

            // Xóa hiệu ứng sau 1.5s
            setTimeout(() => {
                setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
            }, 1500);
        }, 100);

        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {sparkles.map(sparkle => (
                <div
                    key={sparkle.id}
                    style={{
                        position: 'absolute',
                        left: `${sparkle.x}%`,
                        top: `${sparkle.y}%`,
                        width: `${sparkle.size}px`,
                        height: `${sparkle.size}px`,
                        backgroundColor: '#FFEB3B',
                        borderRadius: '50%',
                        boxShadow: '0 0 8px 2px rgba(255, 235, 59, 0.8)',
                        opacity: 0,
                        animation: 'sparkle 1.5s ease-in-out forwards',
                    }}
                />
            ))}
        </div>
    );
};

// Component hiệu ứng âm thanh
const SoundEffect = () => {
    const clickSoundRef = useRef<HTMLAudioElement | null>(null);
    const [soundError, setSoundError] = useState(false);

    useEffect(() => {
        // Tạo audio element cho hiệu ứng âm thanh
        try {
            // Bạn cần thêm file âm thanh click vào thư mục public với tên click-sound.mp3
            const clickSound = new Audio('/click-sound.mp3');
            clickSound.volume = 0.7;
            clickSoundRef.current = clickSound;

            // Xử lý lỗi nếu không tìm thấy file
            clickSound.addEventListener('error', () => {
                console.error("Không thể tải file âm thanh click");
                setSoundError(true);
            });
        } catch (error) {
            console.error("Lỗi khi tạo audio element:", error);
            setSoundError(true);
        }

        // Cleanup khi component unmount
        return () => {
            clickSoundRef.current = null;
        };
    }, []);

    const playClickSound = () => {
        if (clickSoundRef.current && !soundError) {
            // Reset âm thanh nếu đang phát
            clickSoundRef.current.currentTime = 0;
            clickSoundRef.current.play().catch(error => {
                console.error("Không thể phát âm thanh:", error);
                setSoundError(true);
            });
        }
    };

    return {
        playClickSound,
        soundError
    };
};

// Component âm thanh cho nút
const ButtonSound = () => {
    const playButtonSound = () => {
        try {
            // Tạo âm thanh mới mỗi lần click để không ảnh hưởng đến các âm thanh khác

            const buttonSound = new Audio('/click-sound.mp3');
            buttonSound.volume = 0.3;
            buttonSound.play().catch(error => {
                console.error("Không thể phát âm thanh nút:", error);
            });
        } catch (error) {
            console.error("Lỗi khi tạo âm thanh nút:", error);
        }
    };

    return { playButtonSound };
};

export default function Home() {
    const [message, setMessage] = useState("Click the cake for a surprise! 🎂");
    const [showFireworks, setShowFireworks] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [showSparkles, setShowSparkles] = useState(false);
    const [currentModal, setCurrentModal] = useState(0);

    // Khởi tạo các hook âm thanh
    const { playMusic } = BackgroundMusic();
    const { playClickSound, soundError } = SoundEffect();

    const handleCakeClick = () => {
        setMessage("Happy birthday & women's day ❤️");
        setShowFireworks(true);
        setShowCard(true);
        setCurrentModal(0); // Reset về modal đầu tiên khi mở lại
        playClickSound(); // Sử dụng playClickSound thay vì playButtonSound

        // Phát nhạc khi click vào bánh lần đầu tiên
        playMusic();
    };

    // Hàm đóng thiệp
    const handleCloseCard = () => {
        setShowCard(false);
    };

    // Hiệu ứng khi hover bánh
    const handleCakeHover = () => {
        setIsHovering(true);
        setShowSparkles(true);
    };

    const handleCakeLeave = () => {
        setIsHovering(false);
        setShowSparkles(false);
    };

    // Hàm chuyển đến modal tiếp theo
    const handleNextModal = () => {
        setCurrentModal(prev => prev + 1);
    };

    // Hàm quay lại modal trước đó
    const handlePrevModal = () => {
        setCurrentModal(prev => Math.max(0, prev - 1));
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#e53e3e',
            fontFamily: 'Arial, sans-serif',
            overflow: 'hidden',
            position: 'relative',
        }}>
            {/* Toaster cho thông báo */}
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: '#22c55e',
                        },
                    },
                    error: {
                        duration: 3000,
                        style: {
                            background: '#ef4444',
                        },
                    },
                }}
            />

            {/* CSS Animations */}
            <style jsx global>{`
                @keyframes fall {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(100vh) rotate(360deg); }
                }
                
                @keyframes firework {
                    0% { transform: rotate(inherit) translateX(0); opacity: 1; }
                    100% { transform: rotate(inherit) translateX(100px); opacity: 0; }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                @keyframes scaleIn {
                    from { transform: scale(0); }
                    to { transform: scale(1); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-10px) rotate(-2deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(-5px) rotate(2deg); }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                @keyframes sparkle {
                    0% { opacity: 0; transform: scale(0); }
                    50% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(0); }
                }
                
                @keyframes glow {
                    0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7)); }
                    50% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.9)); }
                }
            `}</style>

            {/* Cánh hoa rơi */}
            <RosePetals />

            {/* Pháo hoa */}
            <Fireworks isActive={showFireworks} />

            {/* Thiệp chúc mừng */}
            <Card isVisible={showCard} onClose={handleCloseCard} onNext={handleNextModal} onPrev={handlePrevModal} currentModal={currentModal} />

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100%',
            }}>
                {/* Cake container */}
                <div
                    style={{
                        position: 'relative',
                        width: '300px',
                        height: '300px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onMouseEnter={handleCakeHover}
                    onMouseLeave={handleCakeLeave}
                    onClick={handleCakeClick}
                >
                    {/* Hiệu ứng lấp lánh */}
                    <Sparkles isActive={showSparkles} />

                    {/* Đĩa bánh */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        width: '280px',
                        height: '20px',
                        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 70%)',
                        borderRadius: '50%',
                        filter: 'blur(2px)',
                        zIndex: 1,
                    }}></div>

                    {/* Ảnh bánh kem */}
                    <div style={{
                        position: 'relative',
                        width: '250px',
                        height: '250px',
                        animation: `${isHovering ? 'pulse 1s infinite' : 'float 6s infinite ease-in-out'}`,
                        filter: `${isHovering ? 'brightness(1.1)' : 'brightness(1)'}`,
                        transition: 'filter 0.3s ease',
                        zIndex: 2,
                        cursor: 'pointer',
                    }}>
                        <Image
                            src="/cake.png"
                            alt="Birthday Cake"
                            width={250}
                            height={250}
                            style={{
                                objectFit: 'contain',
                                animation: 'glow 2s infinite ease-in-out',
                                filter: `${isHovering ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))' : 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))'}`,
                                transition: 'filter 0.3s ease',
                            }}
                        />
                    </div>
                </div>

                <div style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginTop: '20px',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    animation: 'fadeIn 1s ease-in-out',
                }}>
                    {message}
                </div>
            </div>
        </div>
    );
} 