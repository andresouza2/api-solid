import request from 'supertest'
import {app} from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh token', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'andre@example.com',
        password_hash: await hash('123456', 6)
      },
    })
    
    // await request(app.server).post('/users').send({
    //   name: 'John Doe',
    //   email: 'andre@example.com',
    //   password: '123456'
    // })

    const authResponse  = await request(app.server).post('/sessions').send({
      email: 'andre@example.com',
      password: '123456'
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await request(app.server)
    .patch('/token/refresh')
    .set('Cookie', cookies)
    .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String)
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})