import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { buttonClass } from '../../components/ui/buttonClasses'
import { CopyButton } from '../../components/ui/CopyButton'
import { useLocale } from '../../i18n/locale-context'
import { cn } from '../../lib/cn'
import { fillTemplate, todayAsIsoDate } from '../../lib/format'
import {
  EMPTY_INQUIRY,
  INQUIRY_LIMITS,
  PRODUCT_TYPE_KEYS,
  buildCustomOrderMessage,
  hasErrors,
  isProductType,
  sanitizeText,
  validateInquiry,
  type InquiryDraft,
  type InquiryErrorCode,
  type InquiryErrors,
  type InquiryField,
  type ProductType,
} from '../../lib/inquiry'
import { getMailtoUrl, getWhatsAppUrl } from '../../lib/links'
import type { CategoryId, Product } from '../../types/product'

const FIELD_ORDER: InquiryField[] = [
  'name',
  'contact',
  'productType',
  'colors',
  'description',
  'deadline',
]

const CATEGORY_TO_PRODUCT_TYPE: Record<CategoryId, ProductType> = {
  accessories: 'accessory',
  home: 'homeTextile',
  gifts: 'other',
}

const labelClass = 'block text-[10px] font-medium tracking-[0.16em] text-ink-muted uppercase'

function fieldClass(hasError: boolean, extra?: string): string {
  return cn(
    'mt-2 w-full rounded-xl border bg-ivory px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-muted focus:outline-none focus:ring-2',
    hasError
      ? 'border-danger focus:border-danger focus:ring-danger/15'
      : 'border-line focus:border-clay focus:ring-clay/15',
    extra,
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-[12px] leading-5 text-danger">
      {message}
    </p>
  )
}

interface PreparedInquiry {
  message: string
  whatsappUrl: string | null
  mailtoUrl: string | null
}

interface InquiryFormProps {
  /** When someone arrives from a product page, the form starts pre-filled. */
  initialProduct?: Product
}

export function InquiryForm({ initialProduct }: InquiryFormProps) {
  const { t, locale } = useLocale()

  const [draft, setDraft] = useState<InquiryDraft>(() => {
    if (!initialProduct) return { ...EMPTY_INQUIRY }

    return {
      ...EMPTY_INQUIRY,
      productType: CATEGORY_TO_PRODUCT_TYPE[initialProduct.category],
      description: fillTemplate(t.customOrder.productPrefill, {
        product: initialProduct.name[locale],
      }),
    }
  })
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [prepared, setPrepared] = useState<PreparedInquiry | null>(null)
  const preparedTitleRef = useRef<HTMLHeadingElement>(null)

  // Move focus to the confirmation so keyboard and screen-reader users
  // notice that the message is ready at the bottom of the form.
  useEffect(() => {
    if (prepared) preparedTitleRef.current?.focus()
  }, [prepared])

  const isEmailContact = draft.contactMethod === 'email'

  function updateField<Field extends InquiryField>(field: Field, value: InquiryDraft[Field]) {
    setDraft((current) => ({ ...current, [field]: value }))
    setPrepared(null)

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[field]
        return next
      })
    }
  }

  function changeContactMethod(method: InquiryDraft['contactMethod']) {
    if (method === draft.contactMethod) return

    setDraft((current) => ({ ...current, contactMethod: method, contact: '' }))
    setPrepared(null)
    setErrors((current) => {
      const next = { ...current }
      delete next.contact
      return next
    })
  }

  function errorMessage(field: InquiryField, code: InquiryErrorCode): string {
    switch (code) {
      case 'required':
        return t.validation.required
      case 'tooShort':
        return fillTemplate(t.validation.tooShort, {
          min: field === 'description' ? INQUIRY_LIMITS.descriptionMin : INQUIRY_LIMITS.nameMin,
        })
      case 'tooLong':
        return fillTemplate(t.validation.tooLong, {
          max:
            field === 'description'
              ? INQUIRY_LIMITS.descriptionMax
              : field === 'colors'
                ? INQUIRY_LIMITS.colorsMax
                : field === 'name'
                  ? INQUIRY_LIMITS.nameMax
                  : INQUIRY_LIMITS.contactMax,
        })
      case 'invalidEmail':
        return t.validation.invalidEmail
      case 'invalidPhone':
        return t.validation.invalidPhone
      case 'invalidDate':
        return t.validation.invalidDate
      case 'invalidProduct':
        return t.validation.invalidProduct
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Sanitise first, then validate the cleaned values. The inputs show the
    // cleaned draft afterwards, so what the visitor sees is what gets sent.
    const cleaned: InquiryDraft = {
      ...draft,
      name: sanitizeText(draft.name, INQUIRY_LIMITS.nameMax),
      contact: sanitizeText(draft.contact, INQUIRY_LIMITS.contactMax),
      colors: sanitizeText(draft.colors, INQUIRY_LIMITS.colorsMax),
      description: sanitizeText(draft.description, INQUIRY_LIMITS.descriptionMax),
    }

    const nextErrors = validateInquiry(cleaned)
    setDraft(cleaned)
    setErrors(nextErrors)
    setHasSubmitted(true)

    if (hasErrors(nextErrors)) {
      setPrepared(null)
      const firstInvalidField = FIELD_ORDER.find((field) => nextErrors[field])
      if (firstInvalidField) {
        document.getElementById(`inquiry-${firstInvalidField}`)?.focus()
      }
      return
    }

    if (!isProductType(cleaned.productType)) return

    const message = buildCustomOrderMessage(cleaned, {
      labels: t.inquiry,
      locale,
      productTypeLabel: t.customOrder.productTypes[cleaned.productType],
      contactMethodLabel: isEmailContact ? t.customOrder.methodEmail : t.customOrder.methodWhatsApp,
    })

    setPrepared({
      message,
      whatsappUrl: getWhatsAppUrl(message),
      mailtoUrl: getMailtoUrl(t.inquiry.emailSubjectCustom, message),
    })
  }

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="rounded-[1.75rem] border border-line/75 bg-ivory px-5 py-6 sm:px-7 md:px-8 md:py-8"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-2xl">{t.customOrder.formTitle}</h2>
          <p className="text-[10px] tracking-[0.12em] text-ink-muted uppercase">
            {t.customOrder.formNote}
          </p>
        </div>

        {hasSubmitted && hasErrors(errors) && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-[13px] leading-5 text-danger"
          >
            {t.customOrder.formErrors}
          </p>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="inquiry-name" className={labelClass}>
              {t.customOrder.name} <span aria-hidden="true">*</span>
            </label>
            <input
              id="inquiry-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={INQUIRY_LIMITS.nameMax}
              value={draft.name}
              onChange={(event) => updateField('name', event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'inquiry-name-error' : undefined}
              placeholder={t.customOrder.namePlaceholder}
              className={fieldClass(Boolean(errors.name))}
            />
            <FieldError
              id="inquiry-name-error"
              message={errors.name ? errorMessage('name', errors.name) : undefined}
            />
          </div>

          <div>
            <label htmlFor="inquiry-productType" className={labelClass}>
              {t.customOrder.productType} <span aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <select
                id="inquiry-productType"
                name="productType"
                required
                value={draft.productType}
                onChange={(event) => updateField('productType', event.target.value as ProductType)}
                aria-invalid={Boolean(errors.productType)}
                aria-describedby={errors.productType ? 'inquiry-productType-error' : undefined}
                className={fieldClass(Boolean(errors.productType), 'appearance-none pr-10')}
              >
                <option value="" disabled>
                  {t.customOrder.productTypePlaceholder}
                </option>
                {PRODUCT_TYPE_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {t.customOrder.productTypes[key]}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                size={16}
                strokeWidth={1.7}
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-muted"
              />
            </div>
            <FieldError
              id="inquiry-productType-error"
              message={
                errors.productType ? errorMessage('productType', errors.productType) : undefined
              }
            />
          </div>

          <fieldset className="sm:col-span-2">
            <legend className={labelClass}>{t.customOrder.contactMethod}</legend>
            <div className="mt-2 flex gap-2">
              {(['whatsapp', 'email'] as const).map((method) => {
                const isSelected = draft.contactMethod === method

                return (
                  <label
                    key={method}
                    className={cn(
                      'flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-[13px] transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-clay',
                      isSelected
                        ? 'border-ink bg-cream/50 text-ink'
                        : 'border-line text-ink-soft hover:border-ink/40',
                    )}
                  >
                    <input
                      type="radio"
                      name="contactMethod"
                      value={method}
                      checked={isSelected}
                      onChange={() => changeContactMethod(method)}
                      className="sr-only"
                    />
                    {method === 'whatsapp'
                      ? t.customOrder.methodWhatsApp
                      : t.customOrder.methodEmail}
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="sm:col-span-2">
            <label htmlFor="inquiry-contact" className={labelClass}>
              {isEmailContact ? t.customOrder.emailAddress : t.customOrder.whatsappNumber}{' '}
              <span aria-hidden="true">*</span>
            </label>
            <input
              id="inquiry-contact"
              name="contact"
              type={isEmailContact ? 'email' : 'tel'}
              inputMode={isEmailContact ? 'email' : 'tel'}
              autoComplete={isEmailContact ? 'email' : 'tel'}
              required
              maxLength={INQUIRY_LIMITS.contactMax}
              value={draft.contact}
              onChange={(event) => updateField('contact', event.target.value)}
              aria-invalid={Boolean(errors.contact)}
              aria-describedby={errors.contact ? 'inquiry-contact-error' : undefined}
              placeholder={
                isEmailContact ? t.customOrder.emailPlaceholder : t.customOrder.whatsappPlaceholder
              }
              className={fieldClass(Boolean(errors.contact))}
            />
            <FieldError
              id="inquiry-contact-error"
              message={errors.contact ? errorMessage('contact', errors.contact) : undefined}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="inquiry-colors" className={labelClass}>
              {t.customOrder.colors}
            </label>
            <input
              id="inquiry-colors"
              name="colors"
              type="text"
              maxLength={INQUIRY_LIMITS.colorsMax}
              value={draft.colors}
              onChange={(event) => updateField('colors', event.target.value)}
              aria-invalid={Boolean(errors.colors)}
              aria-describedby={errors.colors ? 'inquiry-colors-error' : undefined}
              placeholder={t.customOrder.colorsPlaceholder}
              className={fieldClass(Boolean(errors.colors))}
            />
            <FieldError
              id="inquiry-colors-error"
              message={errors.colors ? errorMessage('colors', errors.colors) : undefined}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="inquiry-description" className={labelClass}>
              {t.customOrder.description} <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="inquiry-description"
              name="description"
              required
              rows={5}
              maxLength={INQUIRY_LIMITS.descriptionMax}
              value={draft.description}
              onChange={(event) => updateField('description', event.target.value)}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={`inquiry-description-hint${
                errors.description ? ' inquiry-description-error' : ''
              }`}
              placeholder={t.customOrder.descriptionPlaceholder}
              className={fieldClass(Boolean(errors.description), 'resize-y')}
            />
            <p id="inquiry-description-hint" className="mt-1.5 text-[11.5px] text-ink-muted">
              {t.customOrder.descriptionHint}
            </p>
            <FieldError
              id="inquiry-description-error"
              message={
                errors.description ? errorMessage('description', errors.description) : undefined
              }
            />
          </div>

          <div>
            <label htmlFor="inquiry-deadline" className={labelClass}>
              {t.customOrder.deadline}
            </label>
            <input
              id="inquiry-deadline"
              name="deadline"
              type="date"
              min={todayAsIsoDate()}
              value={draft.deadline}
              onChange={(event) => updateField('deadline', event.target.value)}
              aria-invalid={Boolean(errors.deadline)}
              aria-describedby={`inquiry-deadline-hint${
                errors.deadline ? ' inquiry-deadline-error' : ''
              }`}
              className={fieldClass(Boolean(errors.deadline))}
            />
            <p id="inquiry-deadline-hint" className="mt-1.5 text-[11.5px] text-ink-muted">
              {t.customOrder.deadlineHint}
            </p>
            <FieldError
              id="inquiry-deadline-error"
              message={errors.deadline ? errorMessage('deadline', errors.deadline) : undefined}
            />
          </div>

          <div className="flex items-end">
            <p className="text-[11.5px] leading-5 text-ink-muted">{t.customOrder.referenceNote}</p>
          </div>
        </div>

        <div className="mt-7 border-t border-line/60 pt-6">
          <button type="submit" className={buttonClass('primary', 'lg', 'w-full sm:w-auto')}>
            {t.customOrder.submit}
          </button>
        </div>
      </form>

      {prepared && (
        <section
          aria-labelledby="prepared-inquiry-title"
          className="mt-5 scroll-mt-28 rounded-[1.5rem] border border-sage/40 bg-sage/10 px-5 py-6 sm:px-7"
        >
          <h2
            id="prepared-inquiry-title"
            ref={preparedTitleRef}
            tabIndex={-1}
            className="text-2xl outline-none"
          >
            {t.customOrder.sentTitle}
          </h2>
          <p className="mt-2 text-[13px] leading-6">
            {prepared.whatsappUrl || prepared.mailtoUrl
              ? t.customOrder.preparedHint
              : t.customOrder.noChannels}
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {prepared.whatsappUrl && (
              <a
                href={prepared.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('primary', 'md')}
              >
                {t.customOrder.sendWhatsApp}
              </a>
            )}
            {prepared.mailtoUrl && (
              <a href={prepared.mailtoUrl} className={buttonClass('secondary', 'md')}>
                {t.customOrder.sendEmail}
              </a>
            )}
            <CopyButton text={prepared.message} label={t.customOrder.copyInstead} />
          </div>

          <details className="mt-5 border-t border-sage/30 pt-4">
            <summary className="cursor-pointer text-[10px] tracking-[0.16em] text-ink-muted uppercase transition-colors hover:text-clay">
              {t.customOrder.previewTitle}
            </summary>
            <pre className="mt-3 font-sans text-[12.5px] leading-6 whitespace-pre-wrap text-ink-soft">
              {prepared.message}
            </pre>
          </details>
        </section>
      )}
    </>
  )
}
