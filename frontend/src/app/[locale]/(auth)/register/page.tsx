'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import axios from '@/libs/axios'
import ToastAlert from '@/app/[locale]/_components/ui/toast-box'
import Link from 'next/link'

const SUPPORTED_LOCALES = ['en', 'jp', 'mm'] as const

const schema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email(),
    phone: z
      .string()
      .min(10, { message: 'Phone must be at least 10 digits' })
      .max(15, { message: 'Phone must be at most 15 digits' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    password_confirmation: z
      .string()
      .min(8, { message: 'Confirm Password must be at least 8 characters' }),
    locale: z.enum(SUPPORTED_LOCALES),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Passwords do not match',
  })

type InputType = z.infer<typeof schema>

export default function RegisterPage() {
  const t = useTranslations('Translation')
  const locale = useLocale()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isSupportedLocale = (value: string): value is InputType['locale'] =>
    SUPPORTED_LOCALES.includes(value as InputType['locale'])

  const resolvedLocale = isSupportedLocale(locale) ? locale : 'en'

  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      locale: resolvedLocale,
    },
  })

  useEffect(() => {
    form.setValue('locale', resolvedLocale, { shouldValidate: false })
  }, [form, resolvedLocale])

  const onSubmit = async (values: InputType) => {
    setIsSubmitting(true)
    try {
      await axios.post('/customer/register', values)
      ToastAlert.success({
        message: t('verificationEmailSent', { email: values.email }),
      })
      router.replace(`/${resolvedLocale}/login`)
    } catch (e) {
      console.error('Registration error:', e)
      ToastAlert.error({ message: t('registerFailed') })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{t('createAccount')}</h1>
            <p className="text-sm text-muted-foreground mt-1">Customer Portal</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <input type="hidden" {...form.register('locale')} />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('phone')}</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="09xxxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('confirmPassword')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('processing') : t('register')}
              </Button>
            </form>
          </Form>
          <div className="text-sm text-center mt-4 text-muted-foreground">
            {t('haveAccount')}{' '}
            <Link href={`/${locale}/login`} className="text-blue-600 hover:underline">
              {t('login')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
