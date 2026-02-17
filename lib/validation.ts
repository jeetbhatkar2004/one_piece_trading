import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export const verifyOTPSchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(6).max(100),
  refCode: z.string().min(1).max(20).optional(),
  refClickedAt: z.number().optional(), // timestamp when ref link was first visited
})

export const requestOTPSchema = z.object({
  email: z.string().email(),
})

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const quoteSchema = z.object({
  slug: z.string().min(1),
  side: z.enum(['BUY', 'SELL']),
  amountIn: z.string().regex(/^\d+(\.\d+)?$/),
  slippageBps: z.number().int().min(0).max(10000).optional().default(20),
})

export const tradeSchema = z.object({
  slug: z.string().min(1),
  side: z.enum(['BUY', 'SELL']),
  amountIn: z.string().regex(/^\d+(\.\d+)?$/),
  slippageBps: z.number().int().min(0).max(10000).optional().default(20),
  clientNonce: z.string().uuid(),
})

export const friendRequestSchema = z.object({
  username: z.string().min(1),
})

export const respondFriendRequestSchema = z.object({
  requestId: z.string().uuid(),
  accept: z.boolean(),
})

export const postSchema = z.object({
  content: z.string().min(1).max(500),
})
