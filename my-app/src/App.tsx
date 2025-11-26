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

const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__;

const isDev = import.meta.env.DEV;

const basename = (isTauri || isDev) ? '/' : '/Litscan-Frontend';

function App() {
    return (
        <BrowserRouter basename={basename}>
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