/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsAnalyseBooksBadgeDTO {
  application_id?: number;
  count?: number;
}

export interface DsAnalyseBooksDTO {
  avg_sentence_len?: number;
  avg_word_len?: number;
  books?: DsBookInApplicationDTO[];
  completion_date?: string;
  conjunction_freq?: number;
  creation_date?: string;
  creator_login?: number;
  forming_date?: string;
  id?: number;
  lexical_diversity?: number;
  moderator_login?: number;
  responce?: string;
  status?: number;
}

export interface DsAnalyseBooksResolveRequest {
  /** "complete" | "reject" */
  action: string;
}

export interface DsAnalyseBooksUpdateRequest {
  avg_sentence_len?: number;
  avg_word_len?: number;
  conjunction_freq?: number;
  lexical_diversity?: number;
}

export interface DsBookCreateRequest {
  avg_sentence_len?: number;
  avg_word_len?: number;
  conjunction_freq?: number;
  image?: string;
  lexical_diversity?: number;
  text: string;
  title: string;
}

export interface DsBookDTO {
  avg_sentence_len?: number;
  avg_word_len?: number;
  conjunction_freq?: number;
  id?: number;
  image?: string;
  lexical_diversity?: number;
  status?: boolean;
  text?: string;
  title?: string;
}

export interface DsBookInApplicationDTO {
  avg_sentence_len?: number;
  avg_word_len?: number;
  book_id?: number;
  conjunction_freq?: number;
  description?: string;
  image?: string;
  lexical_diversity?: number;
  text?: string;
  title?: string;
}

export interface DsBookToApplicationUpdateRequest {
  description?: string;
}

export interface DsBookUpdateRequest {
  avg_sentence_len?: number;
  avg_word_len?: number;
  conjunction_freq?: number;
  image?: string;
  lexical_diversity?: number;
  status?: boolean;
  text?: string;
  title?: string;
}

export interface DsLoginResponse {
  token?: string;
  user?: DsUserDTO;
}

export interface DsPaginatedResponse {
  items?: any;
  total?: number;
}

export interface DsUserDTO {
  full_name?: string;
  id?: number;
  moderator?: boolean;
  username?: string;
}

export interface DsUserLoginRequest {
  password: string;
  username: string;
}

export interface DsUserRegisterRequest {
  full_name: string;
  password: string;
  username: string;
}

export interface DsUserUpdateRequest {
  full_name?: string;
  password?: string;
  username?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title API для системы анализа книг
 * @version 1.0
 * @contact API Support <support@example.com>
 *
 * API-сервер для управления книгами, заявками и анализом текстов
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  analysebooks = {
    /**
     * @description Возвращает отфильтрованный список всех сформированных заявок (кроме черновиков и удаленных).
     *
     * @tags analysebooks
     * @name AnalysebooksList
     * @summary Получить список заявок (авторизованный пользователь)
     * @request GET:/analysebooks
     * @secure
     * @response `200` `(DsAnalyseBooksDTO)[]` OK
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    analysebooksList: (
      query?: {
        /** Фильтр по статусу заявки */
        status?: string;
        /** Фильтр по дате 'от' (формат YYYY-MM-DD) */
        from?: string;
        /** Фильтр по дате 'до' (формат YYYY-MM-DD) */
        to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsAnalyseBooksDTO[], Record<string, string>>({
        path: `/analysebooks`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает ID черновика текущего пользователя и количество книг в нем.
     *
     * @tags analysebooks
     * @name CartList
     * @summary Получить информацию для иконки корзины (авторизованный пользователь)
     * @request GET:/analysebooks/cart
     * @secure
     * @response `200` `DsAnalyseBooksBadgeDTO` OK
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    cartList: (params: RequestParams = {}) =>
      this.request<DsAnalyseBooksBadgeDTO, Record<string, string>>({
        path: `/analysebooks/cart`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Находит или создает черновик заявки для текущего пользователя и добавляет в него книгу.
     *
     * @tags books
     * @name DraftBooksCreate
     * @summary Добавить книгу в черновик заявки (все)
     * @request POST:/analysebooks/draft/books/{book_id}
     * @secure
     * @response `201` `Record<string,string>` Сообщение об успехе
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    draftBooksCreate: (bookId: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/analysebooks/draft/books/${bookId}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Возвращает полную информацию о заявке, включая привязанные книги.
     *
     * @tags analysebooks
     * @name AnalysebooksDetail
     * @summary Получить одну заявку по ID (авторизованный пользователь)
     * @request GET:/analysebooks/{id}
     * @secure
     * @response `200` `DsAnalyseBooksDTO` OK
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `404` `Record<string,string>` Заявка не найдена
     */
    analysebooksDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsAnalyseBooksDTO, Record<string, string>>({
        path: `/analysebooks/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Позволяет пользователю обновить поля своей заявки.
     *
     * @tags analysebooks
     * @name AnalysebooksUpdate
     * @summary Обновить данные заявки (авторизованный пользователь)
     * @request PUT:/analysebooks/{id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    analysebooksUpdate: (
      id: number,
      updateData: DsAnalyseBooksUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/analysebooks/${id}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Логически удаляет заявку, переводя ее в статус "удалена".
     *
     * @tags analysebooks
     * @name AnalysebooksDelete
     * @summary Удалить заявку (авторизованный пользователь)
     * @request DELETE:/analysebooks/{id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    analysebooksDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/analysebooks/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Изменяет дополнительное описание для конкретной книги в рамках одной заявки.
     *
     * @tags analysebooks-m-m
     * @name BooksUpdate
     * @summary Обновить описание книги в заявке (авторизованный пользователь)
     * @request PUT:/analysebooks/{id}/books/{book_id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    booksUpdate: (
      id: number,
      bookId: number,
      updateData: DsBookToApplicationUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/analysebooks/${id}/books/${bookId}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Удаляет связь между заявкой и книгой.
     *
     * @tags analysebooks-m-m
     * @name BooksDelete
     * @summary Удалить книгу из заявки (авторизованный пользователь)
     * @request DELETE:/analysebooks/{id}/books/{book_id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    booksDelete: (id: number, bookId: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/analysebooks/${id}/books/${bookId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Переводит заявку из статуса "черновик" в "сформирована".
     *
     * @tags analysebooks
     * @name FormUpdate
     * @summary Сформировать заявку (авторизованный пользователь)
     * @request PUT:/analysebooks/{id}/form
     * @secure
     * @response `204` `void` No Content
     * @response `400` `Record<string,string>` Не все поля заполнены
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    formUpdate: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/analysebooks/${id}/form`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Модератор завершает (с расчетом) или отклоняет заявку.
     *
     * @tags analysebooks
     * @name ResolveUpdate
     * @summary Завершить или отклонить заявку (только модератор)
     * @request PUT:/analysebooks/{id}/resolve
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен
     */
    resolveUpdate: (
      id: number,
      action: DsAnalyseBooksResolveRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/analysebooks/${id}/resolve`,
        method: "PUT",
        body: action,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  auth = {
    /**
     * @description Получение JWT токена по логину и паролю для доступа к защищенным эндпоинтам.
     *
     * @tags auth
     * @name LoginCreate
     * @summary Аутентификация пользователя (все)
     * @request POST:/auth/login
     * @response `200` `DsLoginResponse` OK
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `401` `Record<string,string>` Неверные учетные данные
     */
    loginCreate: (
      credentials: DsUserLoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsLoginResponse, Record<string, string>>({
        path: `/auth/login`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет текущий JWT токен в черный список, делая его недействительным. Требует авторизации.
     *
     * @tags auth
     * @name LogoutCreate
     * @summary Выход из системы (авторизованный пользователь)
     * @request POST:/auth/logout
     * @secure
     * @response `200` `Record<string,string>` Сообщение об успехе
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  books = {
    /**
     * @description Возвращает постраничный список книг.
     *
     * @tags books
     * @name BooksList
     * @summary Получить список книг (все)
     * @request GET:/books
     * @response `200` `DsPaginatedResponse` OK
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    booksList: (
      query?: {
        /** Фильтр по названию книги */
        title?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsPaginatedResponse, Record<string, string>>({
        path: `/books`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новую запись о книге.
     *
     * @tags books
     * @name BooksCreate
     * @summary Создать новую книгу (только модератор)
     * @request POST:/books
     * @secure
     * @response `201` `DsBookDTO` Created
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен (не модератор)
     */
    booksCreate: (bookData: DsBookCreateRequest, params: RequestParams = {}) =>
      this.request<DsBookDTO, Record<string, string>>({
        path: `/books`,
        method: "POST",
        body: bookData,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает детальную информацию о книге.
     *
     * @tags books
     * @name BooksDetail
     * @summary Получить одну книгу по ID (все)
     * @request GET:/books/{id}
     * @response `200` `DsBookDTO` OK
     * @response `404` `Record<string,string>` Книга не найдена
     */
    booksDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsBookDTO, Record<string, string>>({
        path: `/books/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет информацию о существующей книге.
     *
     * @tags books
     * @name BooksUpdate
     * @summary Обновить книгу (только модератор)
     * @request PUT:/books/{id}
     * @secure
     * @response `200` `DsBookDTO` OK
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен
     */
    booksUpdate: (
      id: number,
      updateData: DsBookUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsBookDTO, Record<string, string>>({
        path: `/books/${id}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет книгу из системы.
     *
     * @tags books
     * @name BooksDelete
     * @summary Удалить книгу (только модератор)
     * @request DELETE:/books/{id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен
     */
    booksDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/books/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Загружает и привязывает изображение к книге.
     *
     * @tags books
     * @name ImageCreate
     * @summary Загрузить изображение для книги (только модератор)
     * @request POST:/books/{id}/image
     * @secure
     * @response `200` `Record<string,string>` URL загруженного изображения
     * @response `400` `Record<string,string>` Файл не предоставлен
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен
     */
    imageCreate: (
      id: number,
      data: {
        /** Файл изображения */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/books/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Создает нового пользователя в системе. По умолчанию роль "пользователь", не "модератор".
     *
     * @tags auth
     * @name UsersCreate
     * @summary Регистрация нового пользователя (все)
     * @request POST:/users
     * @response `201` `DsUserDTO` Created
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    usersCreate: (
      credentials: DsUserRegisterRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsUserDTO, Record<string, string>>({
        path: `/users`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает публичные данные пользователя. Требует авторизации.
     *
     * @tags users
     * @name UsersDetail
     * @summary Получение данных пользователя по ID (авторизованный пользователь)
     * @request GET:/users/{id}
     * @secure
     * @response `200` `DsUserDTO` OK
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `404` `Record<string,string>` Пользователь не найден
     */
    usersDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsUserDTO, Record<string, string>>({
        path: `/users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет имя пользователя или пароль. Требует авторизации.
     *
     * @tags users
     * @name UsersUpdate
     * @summary Обновление данных пользователя (авторизованный пользователь)
     * @request PUT:/users/{id}
     * @secure
     * @response `204` `void` No Content
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    usersUpdate: (
      id: number,
      updateData: DsUserUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/users/${id}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
