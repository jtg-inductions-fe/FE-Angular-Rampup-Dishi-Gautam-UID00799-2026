export interface Article {
    id: number;
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
