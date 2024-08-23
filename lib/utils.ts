import { type ClassValue, clsx } from 'clsx'
import { getServerSession } from 'next-auth'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function isLoggedIn() {
  const session = await getServerSession()

  if (!session?.user?.name) {
    throw new Error('Not logged in')
  }

  return session
}

export function calculateLineSums(
  data: any[],
  lineKeys: string[]
): Record<string, number> {
  // Initialize sums object dynamically
  const sums = lineKeys.reduce((acc, key) => {
    acc[`${key}Sum`] = 0
    return acc
  }, {} as Record<string, number>)

  // Compute line sums
  data.forEach((player: any) => {
    lineKeys.forEach((key) => {
      sums[`${key}Sum`] += player[key] || 0
    })
  })

  // Compute total sum separately and add it to the sums object
  sums.totalSum = data.reduce(
    (total: number, player: any) => total + (player.total || 0),
    0
  )

  return sums
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

export function formatNumberToReadableString(
  number: number,
  rounded = false
): string {
  let formattedNumber: number

  if (rounded) {
    if (number >= 1_000_000) {
      formattedNumber = Math.ceil(number / 1_000_000)
      return formattedNumber + 'M'
    } else if (number >= 1_000) {
      formattedNumber = Math.ceil(number / 1_000)
      return formattedNumber + 'k'
    } else {
      return Math.ceil(number).toString()
    }
  } else {
    if (number >= 1_000_000) {
      return (number / 1_000_000).toFixed(2) + 'M'
    } else if (number >= 1_000) {
      return (number / 1_000).toFixed(2) + 'k'
    } else {
      return number.toString()
    }
  }
}

export function convertToNumber(input: string): number {
  const trimmedInput = input.trim().toLowerCase()

  const normalizedInput = trimmedInput.replace(',', '.')

  const match = normalizedInput.match(/^(\d+(\.\d+)?)(k|m)?$/)

  if (!match) {
    throw new Error('Invalid input format')
  }

  const [_, numberPart, __, suffix] = match
  let number = parseFloat(numberPart)

  switch (suffix) {
    case 'k':
      number *= 1000
      break
    case 'm':
      number *= 1000000
      break
    default:
      break
  }

  return number
}
