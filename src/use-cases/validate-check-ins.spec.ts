import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory'
import { ValidateCheckInUseCase } from './validate-check-ins'
import { ResourceNotFoundError } from './errors'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check in', async () => {
    const CreatedCheckIn = await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    const {checkIn} = await sut.execute({
     checkInId: CreatedCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })
  it('should be able to validate an inexistent check in', async () => {
   await expect(() => 
    sut.execute({
      checkInId: 'inexistent-check-in-id',
     })
   ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('should be able to validate the check-ins after 20 minutes of this creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const CreatedCheckIn = await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })
    
    const twentyOneMinutesInMS = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMS)

    await expect(() => sut.execute({checkInId: CreatedCheckIn.id})).rejects.toBeInstanceOf(Error)
  })
})
