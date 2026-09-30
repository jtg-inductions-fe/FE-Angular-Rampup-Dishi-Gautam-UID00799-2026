export interface Article {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    image: string;
    author: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ArticleListData {
    data: Article[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

export interface CreateArticleRequest {
    title: string;
    shortDescription: string;
    description: string;
    image: string;
    tags: string[];
}

export interface ArticleValidationError {
    field: string;
    message: string;
}