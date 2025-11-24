import type {IPaginatedBooks} from "../types/index.ts";
import { dest_root } from "../config/tauri_config";


export const BOOKS_MOCK: IPaginatedBooks = {
    items: [
        {
            id: 1,
            title: "Капитанская дочка",
            text: "«Капитанская дочка» — это историческая повесть Александра Пушкина о чести, долге и любви, разворачивающаяся на фоне пугачёвского восстания и представленная как семейные записки молодого офицера Петра Гринёва.",
            image: `${dest_root}mock_images/kapitanskayadochka.jpeg`,
            status: true,
            avg_word_len: 5.15,
            lexical_diversity: 0.28,
            conjunction_freq: 0.075,
            avg_sentence_len: 9.89
        },
        {
            id: 2,
            title: "Война и мир",
            text: "«Война и мир» — это масштабная эпопея Льва Толстого о судьбах русского общества на фоне Наполеоновских войн, исследующая вечные вопросы истории, свободы воли, любви и смысла человеческого существования.",
            image: `${dest_root}mock_images/voinaimir.jpg`,
            status: true,
            avg_word_len: 5.08,
            lexical_diversity: 0.14,
            conjunction_freq: 0.093,
            avg_sentence_len: 12.78
        },
        {
            id: 3,
            title: "Грокаем алгоритмы",
            text: "«Грокаем алгоритмы» — это иллюстрированное руководство Адитьи Бхаграва, которое наглядно и доступно объясняет базовые алгоритмы и структуры данных через пошаговые примеры на Python и простые графические схемы.",
            image: `${dest_root}mock_images/grokaem.jpg`,
            status: true,
            avg_word_len: 6.01,
            lexical_diversity: 0.19,
            conjunction_freq: 0.064,
            avg_sentence_len: 8.41
        },
        {
            id: 4,
            title: "Компьютерные сети",
            text: "«Компьютерные сети» Эндрю Таненбаума — это книга, в которой последовательно изложены основные концепции, определяющие современное состояние компьютерных сетей и тенденции их развития",
            image: `${dest_root}mock_images/tanenb.jpg`,
            status: true,
            avg_word_len: 6.49,
            lexical_diversity: 0.21,
            conjunction_freq: 0.058,
            avg_sentence_len: 11.25
        }
    ],
    total: 4
};