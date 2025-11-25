
export interface ICrumb {
  label: string;
  path?: string;
  active?: boolean;
}

export interface IBook {
    id: number;
    title: string;
    text: string;
    image?: string;
    status: boolean;
    avg_word_len: number;         // <-- Исправлено
    lexical_diversity: number;   // <-- Исправлено
    conjunction_freq: number;    // <-- Исправлено
    avg_sentence_len: number;     // <-- Исправлено
}

export interface IPaginatedBooks {
  items: IBook[];
  total: number;
}

export interface ICartBadge {
  appl_id: number | null;
  count: number;
}

export interface BreadcrumbsProps {
  crumbs: ICrumb[];
}

export interface bookCardProps {
    factor: IBook;
}

export interface FilterState {
    searchTerm: string;
}