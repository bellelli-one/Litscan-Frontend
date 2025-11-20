import { Navbar, Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import './styles/Navbar.css';

export const AppNavbar = () => {
  return (
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