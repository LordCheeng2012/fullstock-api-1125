import { ApiError } from "../lib/errors.ts";
import * as password from "../lib/password.ts";
import * as userRepository from "../repositories/user.repository.ts";
import type { PublicUser } from "../repositories/user.repository.ts";
 
export async function createUser(
  email: string,
  plainPassword: string,
): Promise<PublicUser> {
  const existing = await userRepository.findByEmail(email);
 
  if (existing !== null) {
    throw new ApiError(409, "El email ya está registrado");
  }
 
  const passwordHash = await password.hash(plainPassword);
 
  const user = await userRepository.create(email, passwordHash);
 
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export async function verifyCredentials(
  email: string,
  plainPassword: string,
): Promise<PublicUser> {
  const user = await userRepository.findByEmail(email);
 
  if (user === null) {
    throw new ApiError(401, "Credenciales inválidas");
  }
 
  const match = await password.compare(plainPassword, user.password);
 
  if (!match) {
    throw new ApiError(401, "Credenciales inválidas");
  }
 
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export async function getUserById(id: number): Promise<PublicUser | null> {
  const user = await userRepository.findById(id);
  if (user === null) return null;
 
  const { password: _password, ...publicUser } = user;
  return publicUser;
}