import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const {checkIn } = await sut.execute({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
    })

    console.log(checkIn.created_at)

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8 ,0 , 0))

    await sut.execute({
      gymId: 'gym_01',
      userId: 'user_01',
    })

    await expect(() => sut.execute({
      gymId: 'gym_01',
      userId: 'user_01',
    })).rejects.toBeInstanceOf(Error)
  })
  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8 ,0 , 0))

    await sut.execute({
      gymId: 'gym_01',
      userId: 'user_01',
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8 ,0 , 0))

    const {checkIn} = await sut.execute({
      gymId: 'gym_01',
      userId: 'user_01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
