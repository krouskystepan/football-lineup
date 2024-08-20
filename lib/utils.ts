import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function parseScore(value: string): number {
  // Normalize input: replace commas with periods for decimal places
  value = value.replace(',', '.')

  // Remove any spaces
  value = value.replace(/[\s,]/g, '')

  // Extract numeric part
  let num = parseFloat(value.replace(/[^0-9.]/g, ''))

  // Apply multiplier based on suffix
  if (value.toLowerCase().includes('k')) {
    num *= 1000
  } else if (value.toLowerCase().includes('m')) {
    num *= 1000000
  }

  return Math.floor(num)
}

export function formatScore(value: string): string {
  return parseScore(value).toString()
}
