export declare namespace ApiDto {
  export interface Pagination {
    limit?: number;
    page?: number;
  }

  export interface Order {
    orderBy?: string;
    orderDirection?: string;
  }

  export interface Search {
    search?: string;
  }

  export type PaginatedQueryParams<T extends Record<any, any>> = T & Pagination & Order;

  export type QueryParamsBase<T extends Record<PropertyKey, unknown>> = T & Pagination & Order & Search;

  export interface PaginatedList<T> {
    existsNext: boolean;
    itemsCounter: number;
    items: T[];
  }

  export interface BasicResponse {
    result: boolean;
    content: {
      result: 0 | 1;
    };
  }
  // API Error Response Type
  interface ApiErrorResponse {
    error: {
      message: string;
    }; // error.response.data.content
    status: number; // error.response.status
    headers: Record<string, string>; // error.response.headers
  }

  export type ApiError = ApiErrorResponse | Error;
}
