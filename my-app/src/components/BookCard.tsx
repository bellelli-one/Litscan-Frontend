import React from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// Redux (как у друга)
import { useSelector, useDispatch } from 'react-redux';
import { addBookToDraft } from '../store/slices/cartSlice'; // Используем наш новый экшен
import type { RootState, AppDispatch } from '../store';
import type { IBook } from '../types';
import './styles/BookCard.css';

// Путь к заглушке (если нужно, поправь под свой проект)
export const DefaultImage = '/mock_images/book.jpg';

interface BookCardProps {
    book: IBook;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const dispatch = useDispatch<AppDispatch>();
    // Проверка авторизации (логика друга)
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    // Обработчик добавления в корзину
    const handleAdd = () => {
        if (book.id) {
            dispatch(addBookToDraft(book.id));
        }
    };

    return (
        <Card className="book-card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
            <Card.Body className="d-flex flex-column p-4">
                <div className="d-flex flex-grow-1 mb-3">
                    {/* Левая часть: Картинка */}
                    <div className="pe-3" style={{ flex: '0 0 40%' }}>
                        <Image
                            // getSafeImageUrl уже применен в slice, поэтому тут просто book.image
                            src={book.image || DefaultImage}
                            alt={book.title}
                            fluid
                            className="book-card-img rounded"
                            style={{ objectFit: 'cover', height: '100%', minHeight: '150px' }}
                        />
                    </div>
                    
                    {/* Правая часть: Инфо и Метрики */}
                    <div className="d-flex flex-column" style={{ flex: '1 1 60%' }}>
                        <Card.Title as="h5" className="mb-3 fw-bold" style={{ fontFamily: 'Josefin Sans' }}>
                            {book.title}
                        </Card.Title>
                        
                        <div className="book-card-markers mt-auto small text-muted">
                            <div className="marker-item">
                                <strong>Ср. длина слова:</strong> {book.avg_word_len?.toFixed(2) || 0}
                            </div>
                            <div className="marker-item">
                                <strong>Лекс. разн.:</strong> {book.lexical_diversity?.toFixed(2) || 0}
                            </div>
                             <div className="marker-item">
                                <strong>Частота союзов:</strong> {book.conjunction_freq?.toFixed(3) || 0}
                            </div>
                            <div className="marker-item">
                                <strong>Ср. предл.:</strong> {book.avg_sentence_len?.toFixed(2) || 0}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Нижняя часть: Кнопки (Логика друга) */}
                <div className="d-flex gap-2 mt-auto">
                    {/* Кнопка Подробнее */}
                    <Link to={`/books/${book.id}`} className="w-100 text-decoration-none">
                        <Button 
                            variant="outline-dark"
                            className="w-100"
                        >
                            Подробнее
                        </Button>
                    </Link>

                    {/* Кнопка Добавить (Только для авторизованных) */}
                    {isAuthenticated && (
                        <Button 
                            variant="dark"
                            className="w-100"
                            onClick={handleAdd}
                        >
                            Добавить
                        </Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};