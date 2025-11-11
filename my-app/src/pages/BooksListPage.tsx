// import { useState, useEffect } from 'react';
// import { Container, Row, Col, Spinner, Form, Badge, Image, Button } from 'react-bootstrap';
// import { BookCard } from '../components/BookCard.tsx';
// import { getBooks, getCartBadge } from '../api/booksApi.ts';
// import type { IBook, ICartBadge } from '../types';
// import './styles/BooksListPage.css';

// export const BooksListPage = () => {
//     const [books, setBooks] = useState<IBook[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [cartBadge, setCartBadge] = useState<ICartBadge>({ appl_id: null, count: 0 });

//     const fetchBooks = (searchQuery: string) => {
//         setLoading(true);
//         getBooks(searchQuery)
//             .then(data => {
//                 if (Array.isArray(data)) {
//                     setBooks(data);
//                 } else {
//                     console.error("Получены неверные данные:", data);
//                     setBooks([]);
//                 }
//             })
//             .finally(() => setLoading(false));
//     };

//     useEffect(() => {
//         fetchBooks('');
//         getCartBadge().then(cartData => {
//             setCartBadge(cartData);
//         });
//     }, []);

//     const handleSearchSubmit = (event: React.FormEvent) => {
//         event.preventDefault();
//         fetchBooks(searchTerm);
//     };

//     const isCartActive = cartBadge.count > 0 && cartBadge.appl_id !== null;

//     return (
//         <div className="books-page">
//             <header className="books-header">
//                 <h1>
//                     <a href="/litscan" className="brand">L I T S C A N</a>
//                 </h1>
//             </header>

//             <Container fluid className="pt-4">
//                 <Form onSubmit={handleSearchSubmit}>
//                     <Row className="justify-content-center mb-4">
//                         <Col xs={12} md={10} lg={8}>
//                             <div className="search-and-cart-wrapper">
//                                 <Form.Control
//                                     type="search"
//                                     placeholder="Введите произведение"
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="search-input"
//                                 />
//                                 <Button variant="dark" type="submit" disabled={loading}>
//                                     {loading ? 'Поиск...' : 'Найти'}
//                                 </Button>
//                                 <div className="cart-wrapper">
//                                     {isCartActive ? (                               
//                                         <a 
//                                             href={`/order/${cartBadge.appl_id}`}
//                                             title="Перейти к заявке"
//                                         >
//                                             <Image src="http://172.18.0.4:9000/test/book.jpg" alt="Корзина" width={70} />
//                                         </a>
//                                     ) : (                                  
//                                         <div style={{ cursor: 'not-allowed' }}>
//                                             <Image 
//                                                 src="http://172.18.0.4:9000/test/book.jpg" 
//                                                 alt="Корзина" 
//                                                 width={70} 
//                                                 style={{ opacity: 0.5 }} 
//                                             />
//                                         </div>
//                                     )}                               
//                                     {isCartActive && (
//                                         <Badge pill bg="primary" className="cart-indicator">
//                                             {cartBadge.count}
//                                         </Badge>
//                                     )}
//                                 </div>                          
//                             </div>
//                         </Col>
//                     </Row>
//                 </Form>

//                 {loading ? (
//                     <div className="text-center"><Spinner animation="border" variant="primary" /></div>
//                 ) : (
//                     <Row className="justify-content-center">
//                         <Col xs={12} lg={11}>
//                             <div className="books-container">
//                                 {books.map(book => (
//                                     <BookCard key={book.id} book={book} />
//                                 ))}
//                             </div>
//                         </Col>
//                     </Row>
//                 )}
//             </Container>
//         </div>
//     );
// };


import { useState, useEffect } from 'react';
// Импортируем компоненты из react-bootstrap
import { Container, Row, Col, Spinner, Form, Badge, Image, Button, InputGroup, Navbar } from 'react-bootstrap';
import { BookCard } from '../components/BookCard';
import { getBooks, getCartBadge } from '../api/booksApi';
import type { IBook, ICartBadge } from '../types';
// Стили теперь будут совсем маленькими
import './styles/BooksListPage.css';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const BooksListPage = () => {
    const [books, setBooks] = useState<IBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartBadge, setCartBadge] = useState<ICartBadge>({ appl_id: null, count: 0 });

    const fetchBooks = (searchQuery: string) => {
        setLoading(true);
        getBooks(searchQuery)
            .then(data => {
                console.log("Данные, полученные от бэкенда:", data.items); 
                setBooks(Array.isArray(data.items) ? data.items : [])})
            .catch(err => {
                console.error("Ошибка при загрузке книг:", err);
                setBooks([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBooks('');
        getCartBadge().then(cartData => { setCartBadge(cartData);});
    }, []);

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        fetchBooks(searchTerm);
    };

    const isCartActive = cartBadge.count > 0 && cartBadge.appl_id !== null;
    const crumbsForServices = [
    { label: 'Главная', path: '/' },
    { label: 'Услуги' }
    ];
    return (
        <div>
            {/* Используем Navbar для хедера, как в большинстве Bootstrap-сайтов */}
            <Navbar bg="white" expand="lg" className="shadow-sm">
                <Container>
                    <Navbar.Brand href="/litscan" className="brand">L I T S C A N</Navbar.Brand>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Breadcrumbs crumbs={crumbsForServices} />
                {/* Декоративная линия, как у друга */}
                <hr className="header-line" />

                <Form onSubmit={handleSearchSubmit}>
                    <Row className="justify-content-center mb-4">
                        <Col xs={12} md={10} lg={8}>
                             {/* Используем InputGroup для красивого соединения поля и кнопки */}
                            <InputGroup>
                                <Form.Control
                                    type="search"
                                    placeholder="Введите произведение для поиска..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    // Используем сетку Bootstrap для карточек
                    <Row xs={1} md={2} lg={2} className="g-5 justify-content-center">
                        {books.map(book => (
                            <Col key={book.id} className="d-flex justify-content-center">
                                <BookCard book={book} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            {/* Иконка корзины */}
            <div className="cart-wrapper">
                <a href={isCartActive ? `/order/${cartBadge.appl_id}` : undefined} style={{ cursor: isCartActive ? 'pointer' : 'not-allowed' }}>
                    <Image 
                        src="http://172.18.0.4:9000/test/book.jpg" 
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