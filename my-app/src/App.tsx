import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { BooksListPage } from './pages/BooksListPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { ApplicationsListPage } from './pages/ApplicationsListPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';



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
        <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />      
        <Route path="/register" element={<RegisterPage />} />  
        <Route element={<MainLayout />}>
            <Route path="/books" element={<BooksListPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} /> 
            <Route path="/applications" element={<ApplicationsListPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
}

export default App;