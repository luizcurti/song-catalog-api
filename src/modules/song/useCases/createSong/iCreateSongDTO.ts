export interface IRequest {
  name: string;
  artist: string;
  imageurl: string;
  notes: string;
  popularity: number;
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
