import * as Yup from 'yup';

import { POPULARITY_MAX, POPULARITY_MIN } from '../songSchema';

export const listSongsQuerySchema = Yup.object({
  page: Yup.number().integer().min(1).default(1),
  limit: Yup.number().integer().min(1).max(100).default(20),
  name: Yup.string().trim().optional(),
  artist: Yup.string().trim().optional(),
  popularityMin: Yup.number().min(POPULARITY_MIN).max(POPULARITY_MAX).optional(),
  popularityMax: Yup.number().min(POPULARITY_MIN).max(POPULARITY_MAX).optional(),
});

export type ListSongsQuery = Yup.InferType<typeof listSongsQuerySchema>;
