
export interface PaginationModel {
    from: number;
    index: number;
    size: number;
    count: number;
    pages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}


export interface ItemsObject<T> {
    $id: string;
    $values: T[];
}
