import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { BooksListPage } from './pages/BooksListPage';
import { BookDetailPage } from './pages/BookDetailPage';

const MainLayout = () => (
    <>
        <AppNavbar />
        <main>
            <Outlet />
        </main>
    </>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route element={<MainLayout />}>
                    <Route path="/books" element={<BooksListPage />} />
                    <Route path="/book/:id" element={<BookDetailPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;