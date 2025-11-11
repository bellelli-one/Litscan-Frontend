import { Breadcrumb } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import type { ICrumb } from '../types/index';
import './styles/Breadcrumbs.css'; // Наш новый CSS

interface BreadcrumbsProps {
  // Компонент теперь просто принимает массив "крошек"
  // Он не решает за вас, какой будет первая ссылка
  crumbs: ICrumb[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  return (
    // 1. Используем готовый компонент <Breadcrumb>
    // listProps добавляет ARIA-атрибуты для доступности
    <Breadcrumb listProps={{ 'aria-label': 'breadcrumb' }} className="custom-breadcrumbs">
      {crumbs.map((crumb, index) => {
        // 2. Определяем, является ли "крошка" последней в списке
        const isLast = index === crumbs.length - 1;

        return isLast ? (
          // 3. Если последняя - делаем ее "активной" (просто текст, не ссылка)
          <Breadcrumb.Item active key={index}>
            {crumb.label}
          </Breadcrumb.Item>
        ) : (
          // 4. Если не последняя - оборачиваем в LinkContainer, чтобы сделать ее ссылкой
          <LinkContainer to={crumb.path || '#'} key={index}>
            <Breadcrumb.Item>{crumb.label}</Breadcrumb.Item>
          </LinkContainer>
        );
      })}
    </Breadcrumb>
  );
};