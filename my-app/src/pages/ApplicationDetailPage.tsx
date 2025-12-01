import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchOrderById, 
    updateOrderFields, 
    updateBookDescription, 
    removeBookFromOrder,
    submitOrder,
    deleteOrder,
    resetOperationSuccess,
    clearCurrentOrder
} from '../store/slices/analysebooksSlice'; // Убедись, что путь верный (ordersSlice или analysebooksSlice)
import { Trash, CheckCircleFill, ExclamationCircle, BarChartLine, Floppy } from 'react-bootstrap-icons';
import type { AppDispatch, RootState } from '../store';
import './styles/main.css';

export const DefaultImage = 'mock_images/default-book.jpg';
const STATUS_DRAFT = 1;
const STATUS_COMPLETED = 4;
const STATUS_REJECTED = 5;

export const ApplicationDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    
    const { currentOrder, loading, operationSuccess } = useSelector((state: RootState) => state.orders);
    
    // Поля метрик заявки
    const [formData, setFormData] = useState({
        avg_word_len: 0,
        lexical_diversity: 0,
        conjunction_freq: 0,
        avg_sentence_len: 0
    });
    
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

    // Заполнение формы при загрузке
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

    if (operationSuccess) {
        return (
            <Container className="mt-5 pt-5 text-center">
                <Card className="auth-card p-5 shadow-lg border-0 rounded-4">
                    <h2 className="text-dark mb-3 fw-bold" style={{ fontFamily: 'Josefin Sans' }}>Успешно!</h2>
                    <p className="text-muted">Заявка была обновлена.</p>
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
        if(currentOrder.id) {
            dispatch(updateOrderFields({ 
                id: currentOrder.id, 
                // @ts-ignore
                data: formData 
            }))
            .unwrap()
            .then(() => alert("Параметры анализа сохранены!"))
            .catch(() => alert("Ошибка при сохранении"));
        }
    };

    // Сохранение "молча" при уходе с поля (оставляем для удобства)
    const handleDescBlur = (bookId: number) => {
        if(currentOrder.id && descriptions[bookId] !== undefined) {
            dispatch(updateBookDescription({
                orderId: currentOrder.id,
                bookId,
                desc: descriptions[bookId]
            }));
        }
    };

    // --- НОВАЯ ФУНКЦИЯ: Сохранение по кнопке с уведомлением ---
    const handleManualDescSave = (bookId: number) => {
        if(currentOrder.id && descriptions[bookId] !== undefined) {
            dispatch(updateBookDescription({
                orderId: currentOrder.id,
                bookId,
                desc: descriptions[bookId]
            }))
            .unwrap()
            .then(() => alert("Примечание к книге сохранено!"))
            .catch(() => alert("Ошибка при сохранении примечания"));
        }
    };

    return (
        <Container className="pt-5 mt-5 pb-5">
            <Card className="auth-card border-0 shadow-sm mb-4">
                <Card.Body className="text-center py-3">
                    <h4 className="fw-bold m-0" style={{ fontFamily: 'Josefin Sans', textTransform: 'uppercase' }}>
                        Заявка #{currentOrder.id}
                    </h4>
                    <p className="text-muted mb-0 mt-1">Статус: {isDraft ? 'Черновик' : isCompleted ? 'Готово' : 'В обработке'}</p>
                </Card.Body>
            </Card>

            {/* Блок параметров заявки (верхняя часть) */}
            <Row className="mb-4 g-4">
                <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
                        <Card.Body>
                            <h5 className="fw-bold mb-3" style={{ fontFamily: 'Josefin Sans' }}>Параметры анализа (Общие)</h5>
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
                                {/* Остальные поля... */}
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

                <Col md={6}>
                    <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                            {isCompleted ? (
                                <div>
                                    <BarChartLine size={48} className="text-success mb-3" />
                                    <h5 className="fw-bold text-success">Анализ завершен</h5>
                                </div>
                            ) : (
                                <div>
                                    <BarChartLine size={48} className="text-secondary mb-3" />
                                    <h5 className="fw-bold">Ожидание обработки</h5>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* --- СПИСОК КНИГ В ЗАЯВКЕ --- */}
            <h5 className="fw-bold mb-3 mt-4" style={{ fontFamily: 'Josefin Sans' }}>Книги для анализа</h5>
            <div className="d-flex flex-column gap-3 mb-5">
                {(currentOrder.books || []).length === 0 && (
                    <div className="text-center text-muted py-5 border rounded bg-light">
                        Список книг пуст.
                    </div>
                )}
                
                {currentOrder.books?.map((b) => (
                    <Card key={b.book_id} className="border-0 shadow-sm overflow-hidden">
                        <Card.Body className="p-0">
                            <Row className="g-0">
                                {/* Кола 1: Картинка */}
                                <Col md={2} className="d-flex align-items-center justify-content-center bg-light p-3">
                                    <div style={{ width: 70, height: 100, overflow: 'hidden', borderRadius: 4 }}>
                                        <Image 
                                            src={b.image || DefaultImage} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                </Col>
                                
                                {/* Кола 2: Информация */}
                                <Col md={6} className="p-3 border-end">
                                    <h6 className="fw-bold m-0 mb-3">{b.title}</h6>
                                    {/* Статистика */}
                                    <div className="bg-light rounded p-2 mb-3">
                                        <Row className="g-2 text-center">
                                            <Col xs={3}><small className="d-block text-muted" style={{fontSize: '0.65rem'}}>Ср. дл. слова</small><strong>{b.avg_word_len?.toFixed(2) || '-'}</strong></Col>
                                            <Col xs={3}><small className="d-block text-muted" style={{fontSize: '0.65rem'}}>Лекс. разн.</small><strong>{b.lexical_diversity?.toFixed(2) || '-'}</strong></Col>
                                            <Col xs={3}><small className="d-block text-muted" style={{fontSize: '0.65rem'}}>Союзы</small><strong>{b.conjunction_freq?.toFixed(3) || '-'}</strong></Col>
                                            <Col xs={3}><small className="d-block text-muted" style={{fontSize: '0.65rem'}}>Предлож.</small><strong>{b.avg_sentence_len?.toFixed(2) || '-'}</strong></Col>
                                        </Row>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Link to={`/books/${b.book_id}`}>
                                            <Button size="sm" variant="outline-dark">Подробнее</Button>
                                        </Link>
                                        {isDraft && (
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => dispatch(removeBookFromOrder({ orderId: currentOrder.id!, bookId: b.book_id! }))}
                                            >
                                                <Trash /> Удалить
                                            </Button>
                                        )}
                                    </div>
                                </Col>

                                {/* Кола 3: Примечание (М-М поле) */}
                                <Col md={4} className="p-3 bg-white">
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Примечание</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={descriptions[b.book_id!] || ''}
                                            onChange={(e) => setDescriptions(prev => ({ ...prev, [b.book_id!]: e.target.value }))}
                                            onBlur={() => handleDescBlur(b.book_id!)}
                                            disabled={!isDraft}
                                            className="bg-light border-0 mb-2"
                                            style={{ resize: 'none', fontSize: '0.9rem' }}
                                        />
                                    </Form.Group>

                                    {/* --- ВОТ ДОБАВЛЕННАЯ КНОПКА СОХРАНЕНИЯ М-М --- */}
                                    {isDraft && (
                                        <div className="text-end">
                                            <Button 
                                                variant="outline-success" 
                                                size="sm" 
                                                className="d-inline-flex align-items-center gap-1"
                                                onClick={() => handleManualDescSave(b.book_id!)}
                                            >
                                                <Floppy size={14} /> Сохранить
                                            </Button>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* Нижняя панель действий */}
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