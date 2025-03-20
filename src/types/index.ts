import { z } from 'zod';

// 卡片結構
export const CardSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
});
export type Card = z.infer<typeof CardSchema>;

// 清單結構
export const ListSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	cards: z.array(CardSchema),
});
export type List = z.infer<typeof ListSchema>;

// 看板結構
export const BoardSchema = z.object({
	lists: z.array(ListSchema),
});
export type Board = z.infer<typeof BoardSchema>;
