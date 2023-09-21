import { SearchGymsUseCase } from "../search-gyms"
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"

export const makeSearchGymsUseCase = () => {
  const gymsReposirory = new PrismaGymsRepository()
  const useCase = new SearchGymsUseCase(gymsReposirory)

  return useCase
}