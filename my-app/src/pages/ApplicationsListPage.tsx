import React, { useEffect, useState } from 'react';
import { Container, Table, Form, Row, Col, Badge, Spinner, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrdersList } from '../store/slices/analysebooksSlice'; // Используем ordersSlice
import type { AppDispatch, RootState } from '../store';
import { CalendarEvent, Funnel } from 'react-bootstrap-icons';
import './styles/main.css';

// Хелпер для статусов (цвета Bootstrap)
const getStatusBadge = (status: number | undefined) => {
    switch (status) {
        case 1: return <Badge bg="secondary" className="px-3 py-2 fw-normal">Черновик</Badge>;
        case 2: return <Badge bg="dark" className="px-3 py-2 fw-normal">Удалена</Badge>;
        case 3: return <Badge bg="primary" className="px-3 py-2 fw-normal">Сформирована</Badge>; // или В работе
        case 4: return <Badge bg="success" className="px-3 py-2 fw-normal">Завершена</Badge>;
        case 5: return <Badge bg="danger" className="px-3 py-2 fw-normal">Отклонена</Badge>;
        default: return <Badge bg="light" text="dark">Неизвестно</Badge>;
    }
};

// Функция для красивого форматирования даты
const formatDate = (dateString?: string) => {
    if (!dateString) return <span className="text-muted small">—</span>;
    return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

export const ApplicationsListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    // Берем данные из ordersSlice
    const { list, loading } = useSelector((state: RootState) => state.orders);

    const [filters, setFilters] = useState({
        status: 'all',
        from: '',
        to: ''
    });

    useEffect(() => {
        dispatch(fetchOrdersList(filters));
    }, [dispatch, filters]);

    const handleRowClick = (id: number | undefined) => {
        // Переход на страницу деталей заявки
        if (id) navigate(`/applications/${id}`);
    };

    const handleFilterChange = (e: React.ChangeEvent<any>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        // Используем класс auth-page-wrapper для общего фона, если нужно, или просто белый
        <div className="min-vh-100" style={{ backgroundColor: '#f9f9f9' }}>
            <Container className="pt-5 mt-5 pb-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-uppercase" style={{ fontFamily: 'Josefin Sans', letterSpacing: '0.1em' }}>
                        История заявок
                    </h2>
                    <p className="text-muted" style={{ fontFamily: 'Josefin Sans' }}>
                        Отслеживайте статус анализа ваших книг
                    </p>
                </div>

                {/* Карточка фильтров */}
                <Card className="mb-4 border-0 shadow-sm rounded-4 overflow-hidden">
                     <Card.Body className="p-4 bg-white">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontFamily: 'Josefin Sans' }}>
                            <Funnel /> Фильтры
                        </h6>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Label className="small text-muted">Статус</Form.Label>
                                <Form.Select 
                                    name="status" 
                                    value={filters.status} 
                                    onChange={handleFilterChange}
                                    className="border-light bg-light text-dark"
                                    style={{ fontFamily: 'Josefin Sans' }}
                                >
                                    <option value="all">Все заявки</option>
                                    <option value="1">Черновики</option>
                                    <option value="3">Сформированные</option>
                                    <option value="4">Завершенные</option>
                                    <option value="5">Отклоненные</option>
                                </Form.Select>
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small text-muted">Создана (от)</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    name="from" 
                                    value={filters.from} 
                                    onChange={handleFilterChange} 
                                    className="border-light bg-light"
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="small text-muted">Создана (до)</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    name="to" 
                                    value={filters.to} 
                                    onChange={handleFilterChange} 
                                    className="border-light bg-light"
                                />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="dark" />
                    </div>
                ) : (
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 bg-white">
                                <thead className="bg-light text-muted small text-uppercase">
                                    <tr>
                                        <th className="py-3 ps-4">ID</th>
                                        <th className="py-3">Статус</th>                            
                                        <th className="py-3"><CalendarEvent className="me-2"/>Дата создания</th>
                                        <th className="py-3">Дата формирования</th> 
                                        <th className="py-3 pe-4">Дата завершения</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(list || []).length > 0 ? (list || []).map((order) => (
                                        <tr 
                                            key={order.id} 
                                            onClick={() => handleRowClick(order.id)} 
                                            style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                                            className="order-row"
                                        >
                                            <td className="fw-bold ps-4">#{order.id}</td>
                                            <td>{getStatusBadge(order.status)}</td>
                                            
                                            <td style={{ fontFamily: 'Josefin Sans', fontSize: '0.95rem' }}>
                                                {formatDate(order.creation_date)}
                                            </td>

                                            <td style={{ fontFamily: 'Josefin Sans', fontSize: '0.95rem' }}>
                                                {formatDate(order.forming_date)}
                                            </td>
                                            
                                            <td style={{ fontFamily: 'Josefin Sans', fontSize: '0.95rem' }} className="pe-4">
                                                {formatDate(order.completion_date)} 
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-5 text-muted">
                                                <h5 className="fw-bold" style={{ fontFamily: 'Josefin Sans' }}>Список пуст</h5>
                                                <p className="small mb-0">У вас пока нет заявок, соответствующих фильтрам.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                )}
            </Container>
        </div>
    );
};