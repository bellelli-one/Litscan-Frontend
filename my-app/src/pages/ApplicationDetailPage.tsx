import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchOrderById, 
    updateOrderFields, 
    updateBookDescription, 
    removeBookFromOrder,
    submitOrder,
    deleteOrder,
    resolveOrder, 
    resetOperationSuccess,
    clearCurrentOrder
} from '../store/slices/analysebooksSlice'; 
import { Trash, CheckCircleFill, BarChartLine, ExclamationCircle, XCircleFill } from 'react-bootstrap-icons';
import type { AppDispatch, RootState } from '../store';
import './styles/main.css';

export const DefaultBook = '/mock_images/default-book.jpg';
const STATUS_DRAFT = 1;
const STATUS_FORMED = 3; 
const STATUS_COMPLETED = 4;
const STATUS_REJECTED = 5;

export const ApplicationDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    
    const { currentOrder, loading, operationSuccess } = useSelector((state: RootState) => state.orders);
    const { user } = useSelector((state: RootState) => state.user);
    const isModerator = user?.moderator === true;

    const [formData, setFormData] = useState({
        avg_word_len: 0,
        lexical_diversity: 0,
        conjunction_freq: 0,
        avg_sentence_len: 0
    });
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [descriptions, setDescriptions] = useState<{[key: number]: string}>({});

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderById(id));
        }
        return () => { 
            dispatch(clearCurrentOrder()); 
            dispatch(resetOperationSuccess()); 
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (currentOrder) {
            setFormData({
                avg_word_len: currentOrder.avg_word_len || 0,
                lexical_diversity: currentOrder.lexical_diversity || 0,
                conjunction_freq: currentOrder.conjunction_freq || 0,
                avg_sentence_len: currentOrder.avg_sentence_len || 0
            });
            
            const descMap: {[key: number]: string} = {};
            currentOrder.books?.forEach(b => {
                if(b.book_id) descMap[b.book_id] = b.description || '';
            });
            setDescriptions(descMap);
        }
    }, [currentOrder]);

    const handleModeratorAction = (action: 'complete' | 'reject') => {
        if (currentOrder?.id && window.confirm(`Вы уверены, что хотите ${action === 'complete' ? 'одобрить' : 'отклонить'} эту заявку?`)) {
            dispatch(resolveOrder({ id: currentOrder.id, action }));
        }
    };

    if (operationSuccess) {
        return (
            <Container className="mt-5 pt-5 text-center">
                <Card className="auth-card p-5 shadow-lg border-0 rounded-4">
                    <h2 className="text-dark mb-3 fw-bold" style={{ fontFamily: 'Josefin Sans' }}>Успешно!</h2>
                    <p className="text-muted">Статус заявки был обновлен.</p>
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <Link to="/books"><Button variant="outline-dark">В каталог</Button></Link>
                        <Link to="/applications"><Button variant="dark">К списку заявок</Button></Link>
                    </div>
                </Card>
            </Container>
        );
    }

    if (loading || !currentOrder) return <Container className="pt-5 text-center"><p>Загрузка...</p></Container>;

    const isDraft = currentOrder.status === STATUS_DRAFT;
    const isFormed = currentOrder.status === STATUS_FORMED;
    const isCompleted = currentOrder.status === STATUS_COMPLETED;
    const isRejected = currentOrder.status === STATUS_REJECTED;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setFormData(prev => ({ 
            ...prev, 
            [e.target.name]: isNaN(val) ? 0 : val 
        }));
    };

    const handleSaveMain = () => {
        if(currentOrder?.id) {
            dispatch(updateOrderFields({ id: currentOrder.id, data: formData }))
            .unwrap()
            .then(() => {
                setSaveMessage("Успешно сохранено!");
                setTimeout(() => setSaveMessage(null), 3000);
            })
            .catch(() => {
                setSaveMessage("Ошибка сохранения");
                setTimeout(() => setSaveMessage(null), 3000);
            });
        }
    };

    const handleDescBlur = (bookId: number) => {
        if(currentOrder.id && descriptions[bookId] !== undefined) {
            dispatch(updateBookDescription({
                orderId: currentOrder.id,
                bookId,
                desc: descriptions[bookId]
            }));
        }
    };

    return (
        <Container className="pt-5 mt-5 pb-5">
            <Card className="auth-card border-0 shadow-sm mb-4">
                <Card.Body className="text-center py-3">
                    <h4 className="fw-bold m-0" style={{ fontFamily: 'Josefin Sans', textTransform: 'uppercase' }}>
                        Заявка #{currentOrder.id}
                    </h4>
                    <p className="text-muted mb-0 mt-1">
                        Статус: {
                            isDraft ? 'Черновик' : 
                            isFormed ? 'В обработке (На модерации)' : 
                            isCompleted ? 'Одобрено' : 'Отклонено'
                        }
                    </p>
                </Card.Body>
            </Card>

            <Row className="mb-4 g-4">
                {/* Левая колонка: Ввод метрик */}
                <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
                        <Card.Body>
                            <h5 className="fw-bold mb-3" style={{ fontFamily: 'Josefin Sans' }}>Параметры анализа (Целевые)</h5>
                            <Form>
                                <Form.Group as={Row} className="mb-3 align-items-center">
                                    <Form.Label column sm={6} className="text-muted small">Средняя длина слова</Form.Label>
                                    <Col sm={6}>
                                        <Form.Control 
                                            type="number" step="0.1" name="avg_word_len" 
                                            value={formData.avg_word_len} onChange={handleInputChange} 
                                            disabled={!isDraft} className="auth-input"
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3 align-items-center">
                                    <Form.Label column sm={6} className="text-muted small">Лексическое разнообразие</Form.Label>
                                    <Col sm={6}>
                                        <Form.Control 
                                            type="number" step="0.01" name="lexical_diversity" 
                                            value={formData.lexical_diversity} onChange={handleInputChange} 
                                            disabled={!isDraft} className="auth-input"
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3 align-items-center">
                                    <Form.Label column sm={6} className="text-muted small">Частота союзов</Form.Label>
                                    <Col sm={6}>
                                        <Form.Control 
                                            type="number" step="0.01" name="conjunction_freq" 
                                            value={formData.conjunction_freq} onChange={handleInputChange} 
                                            disabled={!isDraft} className="auth-input"
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3 align-items-center">
                                    <Form.Label column sm={6} className="text-muted small">Сред. длина предложения</Form.Label>
                                    <Col sm={6}>
                                        <Form.Control 
                                            type="number" step="1" name="avg_sentence_len" 
                                            value={formData.avg_sentence_len} onChange={handleInputChange} 
                                            disabled={!isDraft} className="auth-input"
                                        />
                                    </Col>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Правая колонка: Статус/Результат */}
                <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                            
                            {isCompleted && (
                                <div className="w-100">
                                    <BarChartLine size={48} className="text-success mb-3" />
                                    <h5 className="fw-bold text-success" style={{ fontFamily: 'Josefin Sans' }}>Анализ завершен</h5>
                                    
                                    <div className="bg-white p-3 rounded border text-start mt-2 shadow-sm">
                                        <h6 className="border-bottom pb-2 mb-3 text-muted small text-uppercase fw-bold" style={{ fontFamily: 'Josefin Sans' }}>
                                            Результаты (Рассчитанные)
                                        </h6>
                                        
                                        {/* ВОТ ТУТ ТЕПЕРЬ ВСЕ 4 МЕТРИКИ */}
                                        <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                                            <span className="text-muted small">Ср. длина слова:</span>
                                            <strong>{currentOrder.avg_word_len?.toFixed(2) || 0}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                                            <span className="text-muted small">Лекс. разнообразие:</span>
                                            <strong>{currentOrder.lexical_diversity?.toFixed(2) || 0}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                                            <span className="text-muted small">Частота союзов:</span>
                                            <strong>{currentOrder.conjunction_freq?.toFixed(2) || 0}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted small">Ср. длина предл.:</span>
                                            <strong>{currentOrder.avg_sentence_len?.toFixed(1) || 0}</strong>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isRejected && (
                                <div>
                                    <ExclamationCircle size={48} className="text-danger mb-3" />
                                    <h5 className="text-danger fw-bold" style={{ fontFamily: 'Josefin Sans' }}>Заявка отклонена</h5>
                                    <p className="text-muted">
                                        Результаты анализа не соответствуют требованиям или были отклонены модератором.
                                    </p>
                                </div>
                            )}

                            {!isCompleted && !isRejected && (
                                <div className="w-100">
                                    <BarChartLine size={48} className="text-secondary mb-3" />
                                    <h5 className="fw-bold" style={{ fontFamily: 'Josefin Sans' }}>
                                        {isFormed ? "На модерации" : "Ожидание формирования"}
                                    </h5>
                                    
                                    <p className="text-muted small">
                                        {isDraft 
                                            ? "Сформируйте заявку, чтобы запустить анализ." 
                                            : "Анализ выполнен. Ожидайте решения модератора."
                                        }
                                    </p>

                                    {/* === КНОПКИ ДЛЯ МОДЕРАТОРА === */}
                                    {isModerator && isFormed && (
                                        <div className="mt-4 border-top pt-3">
                                            <p className="small fw-bold text-dark mb-2">Панель Модератора</p>
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button 
                                                    variant="success" 
                                                    onClick={() => handleModeratorAction('complete')}
                                                    className="d-flex align-items-center gap-2"
                                                >
                                                    <CheckCircleFill /> Одобрить
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    onClick={() => handleModeratorAction('reject')}
                                                    className="d-flex align-items-center gap-2"
                                                >
                                                    <XCircleFill /> Отклонить
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* СПИСОК КНИГ */}
            <h5 className="fw-bold mb-3 mt-4" style={{ fontFamily: 'Josefin Sans' }}>Книги для анализа</h5>
            <div className="d-flex flex-column gap-3 mb-5">
                {currentOrder.books?.map((b) => (
                    <Card key={b.book_id} className="border-0 shadow-sm mb-3 overflow-hidden">
                        <Card.Body className="p-3">
                            <Row className="align-items-center g-4">
                                <Col xs={12} md={2} className="text-center">
                                    <div style={{ width: '100px', height: '140px', margin: '0 auto', overflow: 'hidden', borderRadius: '8px' }}>
                                        <Image src={b.image || DefaultBook} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                </Col>
                                <Col xs={12} md={5}>
                                    <h5 className="fw-bold mb-3" style={{ fontFamily: 'Josefin Sans' }}>{b.title}</h5>
                                    
                                    {/* ВОТ ТУТ ТЕПЕРЬ ТОЖЕ 4 МЕТРИКИ */}
                                    <div className="d-flex flex-wrap gap-3 mb-3">
                                        <div className="bg-light rounded p-2 text-center" style={{ minWidth: '80px' }}>
                                            <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>Ср. дл. слова</small>
                                            <span className="fw-bold">{b.avg_word_len?.toFixed(2) || '-'}</span>
                                        </div>
                                        <div className="bg-light rounded p-2 text-center" style={{ minWidth: '80px' }}>
                                            <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>Лекс. разн.</small>
                                            <span className="fw-bold">{b.lexical_diversity?.toFixed(2) || '-'}</span>
                                        </div>
                                        <div className="bg-light rounded p-2 text-center" style={{ minWidth: '80px' }}>
                                            <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>Союзы</small>
                                            <span className="fw-bold">{b.conjunction_freq?.toFixed(3) || '-'}</span>
                                        </div>
                                        <div className="bg-light rounded p-2 text-center" style={{ minWidth: '80px' }}>
                                            <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>Предлож.</small>
                                            <span className="fw-bold">{b.avg_sentence_len?.toFixed(1) || '-'}</span>
                                        </div>
                                    </div>

                                    {/* БЕЙДЖИК ВЕРОЯТНОСТИ ДЛЯ КНИГИ */}
                                    {isCompleted && b.similarity !== undefined && b.similarity !== null && (
                                        <div className="mb-3">
                                            <Badge bg={b.similarity > 0.6 ? "success" : "warning"} className="p-2 fw-normal">
                                                Совпадение: {(b.similarity * 100).toFixed(1)}%
                                            </Badge>
                                        </div>
                                    )}

                                    {isDraft && (
                                        <Button 
                                            variant="outline-danger" size="sm" className="d-flex align-items-center gap-2"
                                            onClick={() => dispatch(removeBookFromOrder({ orderId: currentOrder.id!, bookId: b.book_id! }))}
                                        >
                                            <Trash /> Удалить из заявки
                                        </Button>
                                    )}
                                </Col>
                                <Col xs={12} md={5} className="d-flex flex-column">
                                    <Form.Group className="flex-grow-1 d-flex flex-column">
                                        <Form.Label className="small text-muted mb-1" style={{ fontFamily: 'Josefin Sans' }}>Примечание</Form.Label>
                                        <Form.Control
                                            as="textarea" rows={3} placeholder="Напишите комментарий..."
                                            value={descriptions[b.book_id!] || ''}
                                            onChange={(e) => setDescriptions(prev => ({ ...prev, [b.book_id!]: e.target.value }))}
                                            disabled={!isDraft}
                                            className="bg-light border-0 flex-grow-1 mb-2"
                                            style={{ resize: 'none', fontSize: '0.9rem' }}
                                        />
                                        {isDraft && (
                                            <div className="text-end">
                                                <Button 
                                                    variant="outline-success" size="sm"
                                                    onClick={() => handleDescBlur(b.book_id!)}
                                                    style={{ fontFamily: 'Josefin Sans' }}
                                                >
                                                    <CheckCircleFill className="me-2"/> Сохранить
                                                </Button>
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {isDraft && (currentOrder.books || []).length > 0 && (
                <div className="sticky-bottom bg-white border-top p-3 shadow-lg" style={{ bottom: 0, margin: '0 -12px' }}>
                    <Container>
                        <Row className="align-items-center">
                            <Col xs={12} md={6} className="d-flex gap-2 mb-2 mb-md-0">
                                <Button variant="outline-dark" onClick={handleSaveMain}>
                                    Сохранить параметры
                                </Button>
                                <Button variant="danger" onClick={() => {
                                    if(window.confirm('Удалить заявку?')) dispatch(deleteOrder(currentOrder.id!));
                                }}>
                                    Удалить
                                </Button>
                                {saveMessage && (
                                    <span className={`small fw-bold ${saveMessage.includes('Ошибка') ? 'text-danger' : 'text-success'}`}>
                                        {saveMessage}
                                    </span>
                                )}
                            </Col>
                            <Col xs={12} md={6} className="text-md-end">
                                 <Button 
                                    variant="dark" 
                                    size="lg" 
                                    className="px-5 fw-bold"
                                    onClick={() => dispatch(submitOrder(currentOrder.id!))}
                                >
                                    Сформировать <CheckCircleFill className="ms-2"/>
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </Container>
    );
};