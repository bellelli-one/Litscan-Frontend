import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Badge, Image, Button, InputGroup, Navbar } from 'react-bootstrap';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../store/slices/booksSlice';
import { fetchCartBadge } from '../store/slices/cartSlice';
import { setSearchTerm, selectSearchTerm } from '../store/slices/filterSlice';
import type { AppDispatch, RootState } from '../store';
// Компоненты
import { BookCard } from '../components/BookCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
// Стили
import './styles/BooksListPage.css';

export const BooksListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // 1. Получаем данные из Redux (вместо useState)
    const { items: books, loading } = useSelector((state: RootState) => state.books);
    const searchTerm = useSelector(selectSearchTerm);
    const cartState = useSelector((state: RootState) => state.cart);

    // Логика активности корзины (проверяем application_id)
    const isCartActive = cartState.count > 0 && cartState.application_id !== null;

    // 2. Загружаем данные при открытии страницы (Thunks)
    useEffect(() => {
        // Если при переходе назад searchTerm остался, загрузятся отфильтрованные книги
        dispatch(fetchBooks(searchTerm));
        // Обновляем бейджик корзины
        dispatch(fetchCartBadge());
    }, [dispatch]); // Запускаем 1 раз при монтировании

    // Обработка поиска
    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(fetchBooks(searchTerm));
    };

    // Переход в корзину/заявку
    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isCartActive && cartState.application_id) {
            navigate(`/applications/${cartState.application_id}`);
        }
    };

    const crumbsForServices = [
        { label: 'Главная', path: '/' },
        { label: 'Каталог книг' }
    ];

    return (
        <div>
            {/* Навбар оставил твой, он красивый */}
            <Navbar bg="white" expand="lg" className="shadow-sm">
                <Container>
                    <Navbar.Brand href="/" className="brand">L I T S C A N</Navbar.Brand>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Breadcrumbs crumbs={crumbsForServices} />
                <hr className="header-line" />

                <Form onSubmit={handleSearchSubmit}>
                    <Row className="justify-content-center mb-4">
                        <Col xs={12} md={10} lg={8}>
                            <InputGroup>
                                <Form.Control
                                    type="search"
                                    placeholder="Введите произведение для поиска..."
                                    value={searchTerm}
                                    // Изменяем состояние в Redux при вводе
                                    onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                                />
                                <Button variant="dark" type="submit" disabled={loading}>
                                    {loading ? 'Поиск...' : 'Найти'}
                                </Button>
                            </InputGroup>
                        </Col>
                    </Row>
                </Form>

                {loading ? (
                    <div className="text-center mt-5">
                        <Spinner animation="border" variant="dark" />
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={2} className="g-5">
                        {books.map(book => (
                            <Col key={book.id}>
                                <BookCard book={book} />
                            </Col>
                        ))}
                        {books.length === 0 && (
                            <Col xs={12} className="text-center mt-5">
                                <p className="text-muted">Книги не найдены</p>
                            </Col>
                        )}
                    </Row>
                )}
            </Container>

            {/* Плавающая корзина (логика из Redux, стиль твой) */}
            <div className="cart-wrapper">
                <div 
                    onClick={handleCartClick} 
                    style={{ cursor: isCartActive ? 'pointer' : 'not-allowed', position: 'relative', display: 'inline-block' }}
                >
                    <Image 
                        src="mock_images/book.jpg" 
                        alt="Корзина" 
                        className="cart-image" 
                        style={{ opacity: isCartActive ? 1 : 0.5 }}
                    />
                    {isCartActive && (
                        <Badge pill bg="dark" className="cart-indicator">
                            {cartState.count}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
};