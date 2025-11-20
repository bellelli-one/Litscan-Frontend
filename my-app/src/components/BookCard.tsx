import { Card, Button, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import type { IBook } from '../types';
import './styles/BookCard.css';

export const DefaultImage = 'http://172.18.0.5:9000/test/default-book.jpg';

interface BookCardProps {
    book: IBook;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
    return (
        <Card className="book-card h-100">
            <Card.Body className="d-flex flex-column">
                <div className="d-flex flex-grow-1">
                    <div className="pe-3" style={{ flex: '0 0 40%' }}>
                        <Image
                            // Поля 'image' и 'title' совпадают, здесь все ОК
                            src={book.image || DefaultImage}
                            alt={book.title}
                            fluid
                            className="book-card-img"
                        />
                    </div>
                    <div className="d-flex flex-column" style={{ flex: '1 1 60%' }}>
                        <Card.Title as="h5" className="text-center mb-3">{book.title}</Card.Title>
                        
                        {/* <Card.Text as="div" className="book-card-description">
                            {book.text}
                        </Card.Text> */}

                        <div className="book-card-markers mt-auto">
                            {/* --- НАЧАЛО ИЗМЕНЕНИЙ --- */}
                            <div className="marker-item">
                                <strong>Ср. длина слова:</strong> {book.avg_word_len.toFixed(2)}
                            </div>
                            <div className="marker-item">
                                <strong>Лекс. разнообразие:</strong> {book.lexical_diversity.toFixed(2)}
                            </div>
                             <div className="marker-item">
                                <strong>Частота союзов:</strong> {book.conjunction_freq.toFixed(3)}
                            </div>
                            <div className="marker-item">
                                <strong>Ср. длина предложения:</strong> {book.avg_sentence_len.toFixed(2)}
                            </div>
                            {/* --- КОНЕЦ ИЗМЕНЕНИЙ --- */}
                        </div>
                    </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                    {/* <Button 
                        variant="primary"
                        className="w-100"
                    >
                        Добавить
                    </Button> */}
                    
                    <LinkContainer to={`/book/${book.id}`}>
                        <Button 
                            variant="secondary"
                            className="w-100"
                        >
                            Подробнее...
                        </Button>
                    </LinkContainer>
                </div>
            </Card.Body>
        </Card>
    );
};