import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/userSlice';
import { deleteOrder } from '../store/slices/analysebooksSlice';
import { fetchCartBadge } from '../store/slices/cartSlice';
import type { RootState, AppDispatch } from '../store';
// Иконки
import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
// Стили
import './styles/Navbar.css';

export const AppNavbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
    const { application_id } = useSelector((state: RootState) => state.cart);

    const handleLogout = async () => {
        if (application_id) {
            try {
                await dispatch(deleteOrder(application_id)).unwrap();
                console.log(`Черновик ${application_id} был автоматически удален при выходе.`);
            } catch (e) {
                console.error("Не удалось удалить черновик при выходе", e);
            }
        }
        
        dispatch(logoutUser())
            .then(() => {
                dispatch(fetchCartBadge());
                navigate('/login');
            });
    };

    return (
        <Navbar fixed="top" expand="lg" className="navbar-custom">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand">
                    L I T S C A N
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    {/* Используем gap-4 для чуть большего отступа между ссылками */}
                    <Nav className="ms-auto align-items-center gap-4">
                        
                        <Nav.Link as={Link} to="/books" className="nav-link-custom">
                            Книги
                        </Nav.Link>

                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/applications" className="nav-link-custom">
                                    Мои заявки
                                </Nav.Link>

                                {/* Разделитель (черный, полупрозрачный) */}
                                <div className="d-none d-lg-block" style={{ borderLeft: '1px solid #1a1a1a', height: '20px', opacity: 0.3 }}></div>

                                <Nav.Link as={Link} to="/profile" className="nav-link-custom d-flex align-items-center gap-2">
                                    <PersonCircle size={20} />
                                    <span style={{ fontWeight: 600 }}>
                                        {user?.username || user?.full_name || 'Профиль'}
                                    </span>
                                </Nav.Link>

                                {/* Кнопку "Выход" лучше оставить кнопкой (или outline), 
                                    чтобы она визуально отделялась от навигации, 
                                    но можно и её сделать ссылкой, если нужно */}
                                <Button 
                                    variant="outline-dark" 
                                    size="sm" 
                                    onClick={handleLogout}
                                    className="d-flex align-items-center gap-2"
                                    style={{ fontFamily: 'Josefin Sans', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}
                                >
                                    <BoxArrowRight /> Выход
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* Разделитель */}
                                <div className="d-none d-lg-block" style={{ borderLeft: '1px solid #1a1a1a', height: '20px', opacity: 0.3 }}></div>
                                
                                <Nav.Link as={Link} to="/login" className="nav-link-custom">
                                    Вход
                                </Nav.Link>
                                
                                {/* ИЗМЕНЕНИЕ ЗДЕСЬ: Убрали Button, поставили Nav.Link с вашим классом */}
                                <Nav.Link as={Link} to="/register" className="nav-link-custom">
                                    Регистрация
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};