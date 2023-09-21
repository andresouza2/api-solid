import request from 'supertest'
import {app} from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Serch Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some academies description',
        phone: '(92) 9999-9999',
        latitude: -3.0576514,
        longitude: -59.9681565,
      })

      await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some academies description',
        phone: '(92) 9999-9999',
        latitude: -3.0576514,
        longitude: -59.9681565,
      })

      const response = await request(app.server)
        .get('/gyms/search')
        .query({
          q: 'JavaScript'
        })
        .set('Authorization', `Bearer ${token}`)
        .send()

      expect(response.statusCode).toEqual(200)
      expect(response.body.gyms).toHaveLength(1)
      expect(response.body.gyms).toEqual([
        expect.objectContaining({
          title: 'JavaScript Gym'
        })
      ])
      
  })
})