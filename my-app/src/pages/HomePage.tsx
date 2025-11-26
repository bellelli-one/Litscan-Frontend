import { AppNavbar } from '../components/Navbar';
import { Container } from 'react-bootstrap';
import './styles/HomePage.css';
import videoBackground from '/background/books-background.mp4';

export const HomePage = () => {
    return (
        <div className="homepage"> 
            <AppNavbar />

            <div className="homepage-video-container">
                <video autoPlay loop muted playsInline className="homepage-video-background">
                    <source src={videoBackground} type="video/mp4" />
                    Ваш браузер не поддерживает видео-тег.
                </video>
                
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