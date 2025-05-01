'use client'
import { subscribeAction } from '@/app/_action/subscribe'
import { SubscribeSchema } from '@/app/schemas/subscribe.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheckIcon, CircleX, Loader2 } from 'lucide-react'
import { startTransition, useActionState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const NewsletterForm = () => {
  const [state, formAction, isPending] = useActionState(subscribeAction, {
    success: false,
    message: '',
  })

  const form = useForm({
    resolver: zodResolver(SubscribeSchema),
    mode: 'onChange',
  })

  const handleFormAction = async (formData: FormData) => {
    const valid = await form.trigger()
    if (!valid) return
    startTransition(() => formAction(formData))
  }

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset()
    }
  }, [state.success])

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-primary">
        Subscribe to our inventory updates
      </h3>
      <p className="text-gray-700">
        Enter your details to receive new stock updates
      </p>
      <Form {...form}>
        <form
          ref={formRef}
          className="space-y-2"
          action={handleFormAction}
          onSubmit={() => null}
        >
          <div className="grid grid-cols-2 space-x-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="First Name"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Last Name"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    className="bg-white w-full"
                    {...field}
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full uppercase font-bold">
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <span>Subscribe Now</span>
            )}
          </Button>

          {state.success && (
            <div className="flex items-center gap-2 rounded-md bg-green-500 p-3 text-white">
              <CircleCheckIcon className="w-5 h-5" />
              <span>Success! {state.message}</span>
            </div>
          )}

          {!state.success && state.message && (
            <div className="flex items-center gap-2 rounded-md bg-green-500 p-3 text-white">
              <CircleX className="w-5 h-5" />
              <span>Error! {state.message}</span>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}

export default NewsletterForm
