import Fastify from "fastify";
import cors from "@fastify/cors";
import type { AuthCredentials, AuthSuccess, ErrorResponse, User } from "@ts-academy/types";

type StoredUser = User & { password: string };

const fastify = Fastify({ logger: true });

const usersByEmail = new Map<string, StoredUser>();
const tokensToUserId = new Map<string, string>();

await fastify.register(cors, {
  origin: true,
  credentials: true
});

const createToken = () => `token_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
const createUserId = () => `user_${Math.random().toString(36).slice(2, 10)}`;

function sanitizeUser(user: StoredUser): User {
  return {
    id: user.id,
    email: user.email
  };
}

function getBearerToken(header?: string): string | null {
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

fastify.get("/health", async () => ({
  status: "ok"
}));

fastify.post<{ Body: AuthCredentials; Reply: AuthSuccess | ErrorResponse }>(
  "/auth/register",
  async (request, reply) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.code(400).send({ message: "Email and password are required." });
    }

    if (usersByEmail.has(email)) {
      return reply.code(409).send({ message: "User already exists." });
    }

    const user: StoredUser = {
      id: createUserId(),
      email,
      password
    };

    usersByEmail.set(email, user);
    const token = createToken();
    tokensToUserId.set(token, user.id);

    return reply.code(201).send({
      token,
      user: sanitizeUser(user)
    });
  }
);

fastify.post<{ Body: AuthCredentials; Reply: AuthSuccess | ErrorResponse }>(
  "/auth/login",
  async (request, reply) => {
    const { email, password } = request.body;
    const user = usersByEmail.get(email);

    if (!user || user.password !== password) {
      return reply.code(401).send({ message: "Invalid email or password." });
    }

    const token = createToken();
    tokensToUserId.set(token, user.id);

    return {
      token,
      user: sanitizeUser(user)
    };
  }
);

fastify.get<{ Reply: User | ErrorResponse }>("/me", async (request, reply) => {
  const token = getBearerToken(request.headers.authorization);

  if (!token) {
    return reply.code(401).send({ message: "Missing bearer token." });
  }

  const userId = tokensToUserId.get(token);
  if (!userId) {
    return reply.code(401).send({ message: "Invalid token." });
  }

  const user = [...usersByEmail.values()].find((entry) => entry.id === userId);
  if (!user) {
    return reply.code(404).send({ message: "User not found." });
  }

  return sanitizeUser(user);
});

const port = Number(process.env.PORT ?? 3000);

try {
  await fastify.listen({ port, host: "0.0.0.0" });
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}
