import { AppNavbar } from '../components/Navbar';
import { Container } from 'react-bootstrap'; // Используем Container для консистентности
import './styles/HomePage.css';
import videoBackground from '/background/books-background.webm';

export const HomePage = () => {
    return (
        // Убрали лишнюю обертку .homepage-wrapper
        <div className="homepage"> 
            <AppNavbar />

            <div className="homepage-video-container">
                <video autoPlay loop muted playsInline className="homepage-video-background">
                    <source src={videoBackground} type="video/webm" />
                    Ваш браузер не поддерживает видео-тег.
                </video>
                
                {/* Добавили оверлей для лучшей читаемости текста */}
                <div className="video-overlay"></div> 

                <Container className="homepage-content text-center text-white">
                    <h1 className="display-3 fw-bold">Добро пожаловать в LITSCAN!</h1>
                    <p className="lead fs-3">
                        Сервис для анализа литературных произведений с помощью современных лингвистических метрик.
                    </p>
                </Container>
            </div>
        </div>
    );
};