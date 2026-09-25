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

export interface ArticleListResponse {
    success: boolean;
    message: string;
    data: ArticleListData;
    timeStamp: string;
}

export interface ArticleResponse {
    success: boolean;
    message: string;
    data: Article;
    timeStamp: string;
}

export interface CreateArticleRequest {
    title: string;
    shortDescription: string;
    description: string;
    image: string;
    tags: string[];
}

export interface CreateArticleResponse {
    success: boolean;
    message: string;
    data: Article;
    timestamp: string;
}
