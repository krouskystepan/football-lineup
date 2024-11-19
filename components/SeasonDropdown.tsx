'use client'

import { useRouter } from 'next/navigation'
import { SeasonType } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface SeasonDropdownProps {
  seasons: SeasonType[]
  selectedSeasonId?: string
}

export default function SeasonDropdown({
  seasons,
  selectedSeasonId,
}: SeasonDropdownProps) {
  const router = useRouter()

  const handleChange = (selectedId: string) => {
    router.push(
      selectedId && selectedId !== ' '
        ? `/stats?seasonId=${selectedId}`
        : '/stats'
    )
  }

  return (
    <Select value={selectedSeasonId || ' '} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue defaultValue=" " />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value=" ">Všechny sezóny</SelectItem>
        {seasons
          .map((season) => (
            <SelectItem key={season._id} value={season._id!}>
              {season.seasonName}
            </SelectItem>
          ))
          .reverse()}
      </SelectContent>
    </Select>
  )
}
