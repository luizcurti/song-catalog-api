import * as Yup from 'yup';

export const POPULARITY_MIN = 0;
export const POPULARITY_MAX = 10;

export const songSchema = Yup.object({
  name: Yup.string().required(),
  artist: Yup.string().required(),
  imageurl: Yup.string().required(),
  notes: Yup.string().required(),
  popularity: Yup.number().min(POPULARITY_MIN).max(POPULARITY_MAX).required(),
});

export type SongInput = Yup.InferType<typeof songSchema>;
