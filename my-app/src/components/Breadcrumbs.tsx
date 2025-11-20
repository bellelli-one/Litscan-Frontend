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
    <Breadcrumb listProps={{ 'aria-label': 'breadcrumb' }} className="custom-breadcrumbs">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return isLast ? (
          <Breadcrumb.Item active key={index}>
            {crumb.label}
          </Breadcrumb.Item>
        ) : (
          <LinkContainer to={crumb.path || '#'} key={index}>
            <Breadcrumb.Item>{crumb.label}</Breadcrumb.Item>
          </LinkContainer>
        );
      })}
    </Breadcrumb>
  );
};