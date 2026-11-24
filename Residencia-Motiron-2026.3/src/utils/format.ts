export function formatarData(data: string): string {
  return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR')
}

export function formatarCapacidade(kwp: number): string {
  if (kwp >= 1000) return `${(kwp / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} MWp`
  return `${kwp.toLocaleString('pt-BR')} kWp`
}
