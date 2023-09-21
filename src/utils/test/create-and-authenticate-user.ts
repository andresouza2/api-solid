import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export const createAndAuthenticateUser = async (app: FastifyInstance, isAdmin = false) => {
  await prisma.user.create({
    data: {
      name: 'Andre Souza 010',
      email: 'andre@example.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })
  
  const authResponse  = await request(app.server).post('/sessions').send({
    email: 'andre@example.com',
    password: '123456'
  })
  
  const { token } = authResponse.body

  return {
    token,
  }
}