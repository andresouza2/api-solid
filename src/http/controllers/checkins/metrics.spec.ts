import request from 'supertest'
import {app} from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Check-in Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get total count of check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -3.0576514,
        longitude: -59.9681565,
      }
    })

    const checkIns = await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        }
      ]
    })

    const response  = await request(app.server)
      .get(`/check-ins/metrics`)
      .set('Authorization', `Bearer ${token}`)
      .send()

      expect(response.statusCode).toBe(201)
      expect(response.body.checkInsCount).toEqual(2)
      
  })
})