import { AppNavbar } from '../components/Navbar';
import { Container } from 'react-bootstrap';
import './styles/HomePage.css';
import videoSource from '../assets/books-background.mp4';
import imageSource from '../assets/books-background.png';

export const HomePage = () => {
    const isDev = import.meta.env.DEV;  
    return (
        <div className="homepage"> 
            <AppNavbar />

            <div className="homepage-video-container">
                {isDev ? (
                    // В режиме разработки показываем ВИДЕО
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="homepage-video-background"
                    >
                        <source src={videoSource} type="video/mp4" />
                    </video>
                ) : (
                    // В билде (Tauri/GitHub) показываем КАРТИНКУ
                    // Класс используем тот же, чтобы она растягивалась так же, как видео
                    <img 
                        src={imageSource} 
                        alt="Background" 
                        className="homepage-video-background" 
                    />
                )}
                
                <div className="video-overlay"></div> 

                <Container className="homepage-content text-center text-white">
                    {/* Добавили класс animate-title */}
                    <h1 className="display-2 fw-bold animate-title">
                        Добро пожаловать в <span className="highlight-brand">LITSCAN</span>
                    </h1>
                    {/* Добавили класс animate-subtitle */}
                    <p className="lead fs-3 mt-4 animate-subtitle">
                        Сервис для анализа литературных произведений с помощью современных лингвистических метрик.
                    </p>
                </Container>
            </div>
        </div>
    );
};