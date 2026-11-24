import { z } from 'zod'
import { TIPOS_LICENCA } from '@/types/solar'

export const usinaSchema = z.object({
  nome: z.string().min(3, 'Informe o nome da usina'),
  localizacao: z.string().min(3, 'Informe a localização'),
  capacidadeKwp: z.number({ error: 'Informe a capacidade em kWp' }).positive('A capacidade deve ser maior que zero'),
  status: z.enum(['ativa', 'inativa']),
})

export const licencaSchema = z.object({
  usinaId: z.string().min(1, 'Selecione a usina'),
  tipo: z.enum(TIPOS_LICENCA, { error: 'Selecione o tipo da licença' }),
  emissor: z.string().min(2, 'Informe o órgão ou concessionária emissora'),
  numero: z.string().min(3, 'Informe o número'),
  dataValidade: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe uma data válida'),
})

export type UsinaForm = z.infer<typeof usinaSchema>
export type LicencaForm = z.infer<typeof licencaSchema>
