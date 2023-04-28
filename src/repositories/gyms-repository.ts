import { Gym } from "@prisma/client";

export interface GymsRepository {
  findById(Id: string): Promise<Gym | null>
}