import { db } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/password";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  company: string;
  phone: string;
  plan: string;
};

const sanitizeUser = (user: {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  plan: string;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  company: user.company,
  phone: user.phone,
  plan: user.plan,
});

export async function login(payload: LoginPayload) {
  const user = await db.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    return null;
  }

  const valid = verifyPassword(payload.password, user.passwordHash);
  if (!valid) {
    return null;
  }

  return sanitizeUser(user);
}

export async function register(payload: RegisterPayload) {
  const existingUser = await db.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error("EMAIL_EXISTS");
  }

  const createdUser = await db.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      company: payload.company,
      phone: payload.phone,
      plan: payload.plan,
      passwordHash: hashPassword(payload.password),
    },
  });

  return sanitizeUser(createdUser);
}
