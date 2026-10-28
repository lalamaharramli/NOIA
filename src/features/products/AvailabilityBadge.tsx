import { useLocale } from '../../i18n/locale-context'
import type { AvailabilityStatus } from '../../types/product'
import { Badge } from '../../components/ui/buttonStyles'

const TONES = {
  'in-stock': 'positive',
  'made-to-order': 'neutral',
  'sold-out': 'muted',
} as const

export function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  const { t } = useLocale()

  const labels: Record<AvailabilityStatus, string> = {
    'in-stock': t.availability.inStock,
    'made-to-order': t.availability.madeToOrder,
    'sold-out': t.availability.soldOut,
  }

  return <Badge tone={TONES[status]}>{labels[status]}</Badge>
}
