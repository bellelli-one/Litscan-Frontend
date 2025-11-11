import { Navbar, Container, Nav } from 'react-bootstrap';
// 1. Импортируем LinkContainer, как мы делали раньше
import { LinkContainer } from 'react-router-bootstrap';

// 2. Импортируем наши новые стили
import './styles/Navbar.css';

export const AppNavbar = () => {
  return (
    // 3. Добавляем наш класс для точных отступов и убираем `fluid` из Container
    <Navbar fixed="top" className="shadow-sm navbar-custom-padding">
      <Container>
        {/* 4. Оборачиваем бренд в LinkContainer */}
        <LinkContainer to="/">
          <Navbar.Brand className="brand">L I T S C A N</Navbar.Brand>
        </LinkContainer>

        <Nav className="ms-auto">
          {/* 5. Оборачиваем ссылку на книги в LinkContainer */}
          <LinkContainer to="/books">
            <Nav.Link className="fs-5 text-dark">Книги</Nav.Link>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
};