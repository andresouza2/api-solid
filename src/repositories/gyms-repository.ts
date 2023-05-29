import { Gym, Prisma } from "@prisma/client";

export interface GymsRepository {
  findById(Id: string): Promise<Gym | null>
  searchMany: (query: string, page: number) => Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}