import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PersonCircle, PencilSquare, CheckLg, XLg, BoxArrowRight } from 'react-bootstrap-icons';
import { updateUserProfile, logoutUser } from '../store/slices/userSlice';
import type { RootState, AppDispatch } from '../store';
import './styles/main.css'; // Убедитесь, что стили из прошлого ответа (auth-card и т.д.) здесь есть

export const ProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user, token } = useSelector((state: RootState) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ full_name: '', username: '', password: '' });

    useEffect(() => {
        if (!token) navigate('/login');
    }, [token, navigate]);

    useEffect(() => {
        if (user) {
            setEditData({
                full_name: user.full_name || '',
                username: user.username || '',
                password: '',
            });
        }
    }, [user]);

    const handleSave = () => {
        if (user?.id) {
            dispatch(updateUserProfile({ id: user.id, data: editData }))
            .unwrap()
            .then(() => {
                setIsEditing(false);
                setEditData(prev => ({ ...prev, password: '' }));
                alert('Профиль обновлен!');
            })
            .catch((err) => alert(`Ошибка: ${err}`));
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            full_name: user?.full_name || '', 
            username: user?.username || '', 
            password: ''
        });
    };

    if (!user) return null;

    return (
        // Используем тот же класс обертки, что и в регистрации для общего фона
        <div className="auth-page-wrapper pt-5 pb-5 min-vh-100">
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        {/* Применяем класс auth-card для стекла */}
                        <Card className="auth-card shadow-lg border-0 rounded-4">
                            <Card.Header className="bg-transparent border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
                                {/* Брендовый заголовок */}
                                <h3 className="auth-title mb-0" style={{ fontSize: '24px' }}>Личный кабинет</h3>
                                {user.moderator && (
                                    <Badge bg="dark" className="rounded-pill px-3 py-2" style={{ fontFamily: 'Josefin Sans', letterSpacing: '0.1em' }}>
                                        MODERATOR
                                    </Badge>
                                )}
                            </Card.Header>
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-4 pb-4 border-bottom" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                                    <div className="me-4">
                                        <PersonCircle size={80} color="#1a1a1a" />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold mb-1" style={{ fontFamily: 'Josefin Sans' }}>{user.full_name}</h4>
                                        <p className="text-muted mb-0" style={{ fontFamily: 'Josefin Sans' }}>@{user.username}</p>
                                        <p className="text-muted small" style={{ fontFamily: 'Josefin Sans' }}>ID: {user.id}</p>
                                    </div>
                                </div>

                                <Form>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label style={{ fontFamily: 'Josefin Sans', fontWeight: '600', color: '#333' }}>ФИО</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={isEditing ? editData.full_name : user.full_name || ''}
                                                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                                                    disabled={!isEditing}
                                                    // Используем класс auth-input
                                                    className={`auth-input ${isEditing ? 'border-dark' : ''}`}
                                                    style={{ backgroundColor: isEditing ? '#fff' : 'rgba(255,255,255,0.5)' }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label style={{ fontFamily: 'Josefin Sans', fontWeight: '600', color: '#333' }}>Логин</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={isEditing ? editData.username : user.username || ''}
                                                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={`auth-input ${isEditing ? 'border-dark' : ''}`}
                                                    style={{ backgroundColor: isEditing ? '#fff' : 'rgba(255,255,255,0.5)' }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={12}>
                                            <Form.Group>
                                                <Form.Label style={{ fontFamily: 'Josefin Sans', fontWeight: '600', color: '#333' }}>
                                                    {isEditing ? 'Новый пароль' : 'Пароль'}
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={isEditing ? editData.password : '********'}
                                                    placeholder={isEditing ? 'Введите новый пароль для изменения' : ''}
                                                    onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={`auth-input ${isEditing ? 'border-dark' : ''}`}
                                                    style={{ backgroundColor: isEditing ? '#fff' : 'rgba(255,255,255,0.5)' }}
                                                />
                                                {isEditing && (
                                                    <Form.Text className="text-muted" style={{ fontFamily: 'Josefin Sans', fontSize: '0.8rem' }}>
                                                        Оставьте пустым, если не хотите менять пароль.
                                                    </Form.Text>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="d-flex justify-content-between align-items-center mt-5">
                                        <div>
                                            {!isEditing ? (
                                                <Button 
                                                    variant="dark" // Стиль бренда
                                                    onClick={() => setIsEditing(true)}
                                                    className="auth-btn d-flex align-items-center gap-2 px-4"
                                                >
                                                    <PencilSquare /> Редактировать
                                                </Button>
                                            ) : (
                                                <div className="d-flex gap-2">
                                                    <Button 
                                                        variant="dark" 
                                                        onClick={handleSave}
                                                        className="auth-btn d-flex align-items-center gap-2"
                                                    >
                                                        <CheckLg /> Сохранить
                                                    </Button>
                                                    <Button 
                                                        variant="outline-dark" 
                                                        onClick={handleCancel}
                                                        className="auth-btn d-flex align-items-center gap-2"
                                                        style={{ borderWidth: '2px' }}
                                                    >
                                                        <XLg /> Отмена
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <Button 
                                            variant="outline-dark" 
                                            onClick={handleLogout}
                                            className="auth-btn d-flex align-items-center gap-2"
                                            style={{ borderWidth: '2px' }}
                                        >
                                            <BoxArrowRight /> Выйти
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};