import React, { useEffect, useState } from 'react';
import { Container, Table, Form, Row, Col, Badge, Spinner, Card, Button, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrdersList, resolveOrder } from '../store/slices/analysebooksSlice'; 
import type { AppDispatch, RootState } from '../store';
import { CalendarEvent, Funnel, Person, CheckLg, XLg } from 'react-bootstrap-icons';
import './styles/main.css';

const getStatusBadge = (status: number | undefined) => {
    switch (status) {
        case 1: return <Badge bg="secondary" className="px-3 py-2 fw-normal">Черновик</Badge>;
        case 2: return <Badge bg="dark" className="px-3 py-2 fw-normal">Удалена</Badge>;
        case 3: return <Badge bg="warning" text="dark" className="px-3 py-2 fw-normal">На модерации</Badge>;
        case 4: return <Badge bg="success" className="px-3 py-2 fw-normal">Завершена</Badge>;
        case 5: return <Badge bg="danger" className="px-3 py-2 fw-normal">Отклонена</Badge>;
        default: return <Badge bg="light" text="dark">Неизвестно</Badge>;
    }
};

const formatDate = (dateString?: string) => {
    if (!dateString) return <span className="text-muted small">—</span>;
    return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
};

const getTodayString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const ApplicationsListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const { list, loading } = useSelector((state: RootState) => state.orders);
    const { user } = useSelector((state: RootState) => state.user);
    
    // Флаг модератора
    const isModerator = user?.moderator === true;

    const [backendFilters, setBackendFilters] = useState({
        status: 'all',
        from: getTodayString(),
        to: getTodayString()
    });

    const [creatorFilter, setCreatorFilter] = useState('');

    const loadData = () => {
        dispatch(fetchOrdersList(backendFilters));
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000); 
        return () => clearInterval(interval);
    }, [dispatch, backendFilters]); 

    const handleRowClick = (id: number | undefined) => {
        if (id) navigate(`/applications/${id}`);
    };

    const handleBackendFilterChange = (e: React.ChangeEvent<any>) => {
        setBackendFilters({ ...backendFilters, [e.target.name]: e.target.value });
    };

    // === ИЗМЕНЕНО: УБРАН ALERT (CONFIRM) ===
    const handleModeratorAction = (e: React.MouseEvent, id: number, action: 'complete' | 'reject') => {
        e.stopPropagation(); // Останавливаем переход на страницу детализации
        // Сразу отправляем действие
        dispatch(resolveOrder({ id, action }));
    };
    // =======================================

    const filteredList = (list || []).filter(order => {
        if (!creatorFilter) return true;
        const creator = String(order.creator_login || '');
        return creator.toLowerCase().includes(creatorFilter.toLowerCase());
    });

    const isFirstLoading = loading && (!list || list.length === 0);

    // Динамическая ширина колонок: для модератора (4 поля) - md=3, для юзера (3 поля) - md=4
    const colSize = isModerator ? 3 : 4;

    return (
        <div className="min-vh-100" style={{ backgroundColor: '#f9f9f9' }}>
            <Container className="pt-5 mt-5 pb-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-uppercase" style={{ fontFamily: 'Josefin Sans', letterSpacing: '0.1em' }}>
                        {isModerator ? 'Панель Модератора' : 'История заявок'}
                    </h2>
                    <p className="text-muted" style={{ fontFamily: 'Josefin Sans' }}>
                        Заявки за сегодня ({formatDate(getTodayString())})
                    </p>
                </div>

                <Card className="mb-4 border-0 shadow-sm rounded-4 overflow-hidden">
                     <Card.Body className="p-4 bg-white">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontFamily: 'Josefin Sans' }}>
                            <Funnel /> Фильтры
                        </h6>
                        <Row className="g-3">
                            <Col md={colSize}>
                                <Form.Label className="small text-muted">Статус</Form.Label>
                                <Form.Select 
                                    name="status" 
                                    value={backendFilters.status} 
                                    onChange={handleBackendFilterChange}
                                    className="border-light bg-light text-dark"
                                    style={{ fontFamily: 'Josefin Sans' }}
                                >
                                    <option value="all">Все заявки</option>
                                    <option value="1">Черновики</option>
                                    <option value="3">На модерации</option>
                                    <option value="4">Завершенные</option>
                                    <option value="5">Отклоненные</option>
                                </Form.Select>
                            </Col>
                            <Col md={colSize}>
                                <Form.Label className="small text-muted">Создана (от)</Form.Label>
                                <Form.Control 
                                    type="date" name="from" value={backendFilters.from} 
                                    onChange={handleBackendFilterChange} className="border-light bg-light"
                                />
                            </Col>
                            <Col md={colSize}>
                                <Form.Label className="small text-muted">Создана (до)</Form.Label>
                                <Form.Control 
                                    type="date" name="to" value={backendFilters.to} 
                                    onChange={handleBackendFilterChange} className="border-light bg-light"
                                />
                            </Col>

                            {/* === СКРЫВАЕМ ПОЛЕ, ЕСЛИ НЕ МОДЕРАТОР === */}
                            {isModerator && (
                                <Col md={3}>
                                    <Form.Label className="small text-muted">Поиск по автору</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="bg-light border-light"><Person/></InputGroup.Text>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Логин..." 
                                            value={creatorFilter}
                                            onChange={(e) => setCreatorFilter(e.target.value)}
                                            className="border-light bg-light"
                                        />
                                    </InputGroup>
                                </Col>
                            )}
                        </Row>
                    </Card.Body>
                </Card>

                {isFirstLoading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="dark" />
                        <p className="text-muted mt-2">Загрузка списка...</p>
                    </div>
                ) : (
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 bg-white">
                                <thead className="bg-light text-muted small text-uppercase">
                                    <tr>
                                        <th className="py-3 ps-4">ID</th>
                                        
                                        {/* === СКРЫВАЕМ КОЛОНКУ АВТОРА, ЕСЛИ НЕ МОДЕРАТОР === */}
                                        {isModerator && <th className="py-3">Автор</th>}
                                        
                                        <th className="py-3">Статус</th>                            
                                        <th className="py-3 text-center">Прогресс</th>
                                        <th className="py-3"><CalendarEvent className="me-2"/>Дата создания</th>
                                        <th className="py-3">Дата формирования</th> 
                                        {/* Колонка действий только для модератора */}
                                        {isModerator && <th className="py-3 text-end pe-4">Действия</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredList.length > 0 ? filteredList.map((order) => (
                                        <tr 
                                            key={order.id} 
                                            onClick={() => handleRowClick(order.id)} 
                                            style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                                            className="order-row"
                                        >
                                            <td className="fw-bold ps-4">#{order.id}</td>
                                            
                                            {/* === ЯЧЕЙКА АВТОРА === */}
                                            {isModerator && (
                                                <td>{order.creator_login || '—'}</td>
                                            )}

                                            <td>{getStatusBadge(order.status)}</td>
                                            
                                            <td className="text-center">
                                                {(order.total_books || 0) > 0 ? (
                                                    <Badge bg="info" className="fw-normal px-3" text="dark">
                                                        {order.total_books} кн.
                                                    </Badge>
                                                ) : <span className="text-muted small">—</span>}
                                            </td>

                                            <td style={{ fontFamily: 'Josefin Sans', fontSize: '0.95rem' }}>
                                                {formatDate(order.creation_date)}
                                            </td>

                                            <td style={{ fontFamily: 'Josefin Sans', fontSize: '0.95rem' }}>
                                                {formatDate(order.forming_date)}
                                            </td>
                                            
                                            {/* КНОПКИ МОДЕРАТОРА */}
                                            {isModerator && (
                                                <td className="text-end pe-4">
                                                    {/* Кнопки доступны только если статус 3 (На модерации) */}
                                                    {order.status === 3 && (
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <Button 
                                                                variant="outline-success" size="sm" 
                                                                onClick={(e) => handleModeratorAction(e, order.id!, 'complete')}
                                                                title="Одобрить"
                                                            >
                                                                <CheckLg />
                                                            </Button>
                                                            <Button 
                                                                variant="outline-danger" size="sm" 
                                                                onClick={(e) => handleModeratorAction(e, order.id!, 'reject')}
                                                                title="Отклонить"
                                                            >
                                                                <XLg />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={isModerator ? 7 : 5} className="text-center py-5 text-muted">
                                                <h5 className="fw-bold" style={{ fontFamily: 'Josefin Sans' }}>Список пуст</h5>
                                                <p className="small mb-0">Заявок за сегодня не найдено или фильтры слишком строгие.</p>
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