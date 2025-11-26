import { Navbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import './styles/Navbar.css';

export const AppNavbar = () => {
  return (
    // Убрали shadow-sm, так как у нас будет свой бордер и размытие
    <Navbar fixed="top" className="navbar-custom">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="brand">L I T S C A N</Navbar.Brand>
        </LinkContainer>

        <Nav className="ms-auto">
          <LinkContainer to="/books">
            {/* Добавили класс для стилизации ссылки */}
            <Nav.Link className="nav-link-custom">Книги</Nav.Link>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
};