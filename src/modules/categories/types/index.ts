export interface Category {
    id: string;
    name: string;
    description?: string;
    created_at?: string;
    products?: any[];
}

export interface CreateCategoryInput {
    name: string;
    description?: string;
}

export interface UpdateCategoryInput {
    name?: string;
    description?: string;
}
