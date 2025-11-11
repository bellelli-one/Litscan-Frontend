import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Row, Col, Card, Image, Button, ListGroup, Breadcrumb } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getBookById } from '../api/booksApi.ts';
import type { IBook } from '../types';
import { AppNavbar } from '../components/Navbar'; // 1. Импортируем общий Navbar
import './styles/BookDetailPage.css'; // Наш новый, маленький CSS

export const BookDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<IBook | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setLoading(true);
            getBookById(id)
                .then(data => setBook(data))
                .finally(() => setLoading(false));
        }
    }, [id]);

    // Состояние загрузки
    if (loading) {
        return (
            <>
                <AppNavbar />
                <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                </div>
            </>
        );
    }
    
    // Состояние "Книга не найдена"
    if (!book) {
        return (
            <>
                <AppNavbar />
                <Container className="text-center mt-5 pt-5">
                    <h2 className="display-4">Книга не найдена</h2>
                    <p className="lead text-muted">Возможно, вы ошиблись адресом.</p>
                    <LinkContainer to="/litscan">
                        <Button variant="outline-primary" size="lg" className="mt-3">Вернуться к списку</Button>
                    </LinkContainer>
                </Container>
            </>
        );
    }
    const breadcrumbsData = [
        { label: 'Главная', path: '/' },
        { label: 'Книги', path: '/books' }, // Ссылка на список книг
        { label: book.title, active: true } // Последний элемент без path, он будет активным
    ];
    // Основное состояние - книга найдена
    return (
        <div className="book-detail-page">
            <AppNavbar /> {/* 2. Используем общий Navbar */}

            <Container className="details-container-margin">
                {/* 3. Оборачиваем все в красивую карточку с тенью */}
                <Card className="shadow-sm">
                    <Card.Body className="p-4 p-md-5">

                        {/* Хлебные крошки */}
                        {/* <Breadcrumb>
                            <LinkContainer to="/litscan">
                                <Breadcrumb.Item>L I T S C A N</Breadcrumb.Item>
                            </LinkContainer>
                            <Breadcrumb.Item active>{book.title}</Breadcrumb.Item>
                        </Breadcrumb> */}
                        <Breadcrumbs crumbs={breadcrumbsData} />
                        <Row className="g-5 mt-3">
                            <Col md={5} className="text-center">
                                <Image src={book.image} alt={book.title} className="book-main-image" />
                            </Col>
                            <Col md={7}>
                                <h1 className="display-5 fw-bold">{book.title}</h1>
                                <p className="lead mt-4">{book.text}</p>
                                
                                {/* 4. Используем ListGroup для красивого вывода метрик */}
                                <ListGroup variant="flush" className="mt-4">
                                    {/* 5. ИСПРАВЛЯЕМ ИМЕНА ПОЛЕЙ НА snake_case */}
                                    <ListGroup.Item>
                                        <strong>Средняя длина слова:</strong> {book.avg_word_len.toFixed(2)}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Лексическое разнообразие:</strong> {book.lexical_diversity.toFixed(2)}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Частота союзов:</strong> {book.conjunction_freq.toFixed(3)}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Средняя длина предложения:</strong> {book.avg_sentence_len.toFixed(2)}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};