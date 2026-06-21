import { Router } from 'express';
import { z } from 'zod';
import { registerUser, loginUser } from '../services/auth.service';
import { prisma } from '../lib/prisma';

const router = Router();

const authSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(4),
});

const registerSchema = authSchema.extend({
  name: z.string().trim().min(1),
});

router.post('/register', async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const result = await registerUser(prisma, body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = authSchema.parse(req.body);
    const result = await loginUser(prisma, body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
