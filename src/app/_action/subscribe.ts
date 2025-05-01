'use server'
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library'
import { db } from '@/lib/db'
import { CustomerStatus } from '@prisma/client'
import { SubscribeSchema } from '../schemas/subscribe.schema'

export const subscribeAction = async (_: any, formData: FormData) => {
  try {
    const { data, success, error } = SubscribeSchema.safeParse({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
    })

    if (!success) {
      return { success: false, message: error.message }
    }

    const subscriber = await db.customer.findFirst({
      where: { email: data.email },
    })

    if (subscriber) {
      return { success: false, message: 'You are already subscribed' }
    }

    const subscription = await db.customer.create({
      data: { ...data, status: CustomerStatus.SUBSCRIBER },
    })
    return { success: true, message: 'You have successfully subscribed' }
  } catch (error) {
    console.log('Error in subscribeAction', error)
    if (
      error instanceof PrismaClientKnownRequestError ||
      error instanceof PrismaClientUnknownRequestError
    ) {
      return { success: false, message: error.message }
    }
    if (error instanceof Error) {
      return { success: false, message: error.message }
    }

    return { success: false, message: 'Something went wrong' }
  }
}
