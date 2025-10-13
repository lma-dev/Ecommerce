'use client'

import { useCreateReport, useUpdateReport } from '@/features/reports/api'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createReportSchema } from '@/features/reports/schemas/createReportSchema'
import { updateReportSchema } from '@/features/reports/schemas/updateReportSchema'
import ToastAlert from '@/app/[locale]/_components/ui/toast-box'
import { useLocale } from 'next-intl'
import { FormSubmitButton } from '@/app/[locale]/_components/ui/button'
import CustomLink from '@/app/[locale]/_components/ui/custom-link'

const ReportForm = ({
  mode,
  defaultValues,
  t,
}: {
  mode: 'create' | 'edit' | 'show'
  defaultValues?: any
  t: any
}) => {
  const isReadOnly = mode === 'show'

  const form = useForm({
    resolver: zodResolver(mode === 'edit' ? updateReportSchema : createReportSchema),
    defaultValues: defaultValues ?? {
      amount: 1000,
      confirmStatus: 'PENDING',
      type: 'INCOME',
      description: '',
      verifier_id: undefined,
    },
  })

  const locale = useLocale()
  const create = useCreateReport()
  const update = useUpdateReport()

  const onSubmit = async (values: any) => {
    if (isReadOnly) return

    try {
      if (mode === 'edit' && defaultValues?.id) {
        await update.mutateAsync(
          { id: defaultValues.id, ...values },
          {
            onSuccess: () => {
              ToastAlert.success({ message: 'Report updated successfully' })
            },
          },
        )
      } else {
        await create.mutateAsync(values, {
          onSuccess: () => {
            ToastAlert.success({ message: 'Report created successfully' })
          },
        })
      }
    } catch (error) {
      console.error('Report form submission error:', error)
      ToastAlert.error({ message: 'Submission failed' })
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('amount')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder={t('amountPlaceholder')}
                  min={500}
                  step={2}
                  disabled={isReadOnly}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    field.onChange(value)
                  }}
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        {/* Confirm Status */}
        <FormField
          control={form.control}
          name="confirmStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('confirmStatus')}</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">{t('pending')}</SelectItem>
                    <SelectItem value="ACCEPTED">{t('accept')}</SelectItem>
                    <SelectItem value="REJECTED">{t('reject')}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        {/* Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('type')}</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">{t('income')}</SelectItem>
                    <SelectItem value="EXPENSE">{t('expense')}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description')}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={t('descriptionPlaceholder')}
                  maxLength={255}
                  disabled={isReadOnly}
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <CustomLink href={`/${locale}/${process.env.NEXT_PUBLIC_APP_VERSION}/reports`}>
            {t('back')}
          </CustomLink>

          {/* Only show submit button if not in "show" mode */}
          {!isReadOnly && (
            <FormSubmitButton text={mode === 'edit' ? t('updateReport') : t('createReport')} />
          )}
        </div>
      </form>
    </FormProvider>
  )
}

export default ReportForm
