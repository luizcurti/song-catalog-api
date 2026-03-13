export interface IRequest {
    id: string;
}

export interface IResponse {
    id: string;
    name: string;
    artist: string;
    imageurl: string;
    notes: string;
    popularity: number;
    created_at: Date;
    updated_at: Date;
}
