import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Импортируем компоненты из react-bootstrap
import { Container, Row, Col, Spinner, Form, Badge, Image, Button, InputGroup, Navbar } from 'react-bootstrap';
import { BookCard } from '../components/BookCard';
import { getBooks, getCartBadge } from '../api/booksApi';
import type { IBook, ICartBadge } from '../types';
// Стили теперь будут совсем маленькими
import type { AppDispatch } from '../store';
import { setSearchTerm, selectSearchTerm } from '../store/slices/filterSlice';
import './styles/BooksListPage.css';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const BooksListPage = () => {
    const [books, setBooks] = useState<IBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [cartBadge, setCartBadge] = useState<ICartBadge>({ appl_id: null, count: 0 });
    const dispatch = useDispatch<AppDispatch>();
    const searchTerm = useSelector(selectSearchTerm);

    const fetchBooks = (searchQuery: string) => {
        setLoading(true);
        getBooks(searchQuery)
            .then(data => {
                if (Array.isArray(data.items)) {
                    setBooks(data.items);
                } else {
                    console.error("Получены неверные данные:", data);
                    setBooks([]);
                }
            })
            .catch(err => {
                console.error("Ошибка при загрузке книг:", err);
                setBooks([]);
            })
            .finally(() => setLoading(false));
    };

   useEffect(() => {
        fetchBooks(searchTerm);
        getCartBadge().then(cartData => {
            setCartBadge(cartData);
        });
    }, []);

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        fetchBooks(searchTerm);
    };

    const isCartActive = cartBadge.count > 0 && cartBadge.appl_id !== null;
    const crumbsForServices = [
        { label: 'Главная', path: '/' },
        { label: 'Каталог книг' }
    ];

    return (
        <div>
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
                                    // Исправлено: теперь ввод в строку поиска будет работать
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
                    <div className="text-center"><Spinner animation="border" variant="primary" /></div>
                ) : (
                    <Row xs={1} md={2} lg={2} className="g-5 justify-content-center">
                        {books.map(book => (
                            <Col key={book.id} className="d-flex justify-content-center">
                                <BookCard book={book} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            {/* --- ВОЗВРАЩЕНА ВАША ВЕРСИЯ КОРЗИНЫ --- */}
            <div className="cart-wrapper">
                <a href={isCartActive ? `/order/${cartBadge.appl_id}` : undefined} style={{ cursor: isCartActive ? 'pointer' : 'not-allowed' }}>
                    <Image 
                        src="mock_images/book.jpg" 
                        alt="Корзина" 
                        className="cart-image" 
                        style={{ opacity: isCartActive ? 1 : 0.5 }}
                    />
                    <Badge pill bg="primary" className="cart-indicator">
                        {cartBadge.count || 0}
                    </Badge>
                </a>
            </div>
        </div>
    );
};