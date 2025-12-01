import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/userSlice';
import type { AppDispatch, RootState } from '../store';
import { BoxArrowInRight } from 'react-bootstrap-icons';
import './styles/main.css'; // Убедитесь, что стили auth-... здесь есть

export const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (isAuthenticated) {
            // Перенаправляем на каталог книг после входа
            navigate('/books');
        }
        dispatch(clearError());
    }, [isAuthenticated, navigate, dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(loginUser(formData)).unwrap();
            // Навигация сработает в useEffect, но можно и тут оставить для надежности
            navigate('/books');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        // Используем общий класс обертки для фона
        <div className="auth-page-wrapper d-flex align-items-center justify-content-center min-vh-100">
            <Container style={{ maxWidth: '400px' }}>
                {/* Класс стекла auth-card */}
                <Card className="auth-card shadow-lg border-0 rounded-4">
                    <Card.Body className="p-5">
                        <div className="text-center mb-4">
                            {/* Шрифт бренда */}
                            <h2 className="auth-title">Вход</h2>
                            <p className="text-muted" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                                Добро пожаловать в L I T S C A N
                            </p>
                        </div>

                        {error && <Alert variant="danger" className="text-center" style={{ fontFamily: 'Josefin Sans' }}>{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Floating className="mb-3">
                                <Form.Control
                                    id="username"
                                    type="text"
                                    placeholder="Логин"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    className="auth-input" // Кастомный инпут
                                />
                                <label htmlFor="username">Логин</label>
                            </Form.Floating>

                            <Form.Floating className="mb-4">
                                <Form.Control
                                    id="password"
                                    type="password"
                                    placeholder="Пароль"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="auth-input" // Кастомный инпут
                                />
                                <label htmlFor="password">Пароль</label>
                            </Form.Floating>

                            <Button 
                                variant="dark" // Черная кнопка бренда
                                type="submit" 
                                className="w-100 py-3 auth-btn rounded-3 d-flex align-items-center justify-content-center gap-2"
                                disabled={loading}
                            >
                                {loading ? <Spinner size="sm" animation="border" /> : <><BoxArrowInRight size={20}/> Войти</>}
                            </Button>
                        </Form>

                        <div className="text-center mt-4 auth-footer-text">
                            <span className="text-muted">Нет аккаунта? </span>
                            {/* Ссылка в стиле бренда */}
                            <Link to="/register" className="auth-link fw-bold text-decoration-none">
                                Зарегистрироваться
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};