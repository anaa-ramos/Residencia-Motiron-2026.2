import { calcularStatusLicenca } from '@/utils/status'

export default function StatusBadge({ dataValidade }: { dataValidade: string }) {
  const { label, classes } = calcularStatusLicenca(dataValidade)
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {label}
    </span>
  )
}
