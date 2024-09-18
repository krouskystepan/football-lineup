import { SEASONS } from '@/constants'
import { formatNumberToReadableString } from '@/lib/utils'

export default function Seasons() {
  return (
    <div className="mx-auto max-w-xl mt-4">
      <h2 className="mb-2 text-3xl font-semibold text-center">
        Detailní popis sezón
      </h2>
      <div className="grid gap-3 grid-cols-2">
        {SEASONS.map((season) => (
          <div key={season.seasonName} className="border p-2 space-y-0.5">
            <h2 className="font-bold text-2xl">{season.seasonName}</h2>
            <p>
              <strong>Start:</strong> {season.startDate}
            </p>
            <p>
              <strong>Konec:</strong> {season.endDate}
            </p>
            <p className="badScore pt-1">
              <strong>Špatné skóre:</strong>{' '}
              {formatNumberToReadableString(season.badScore)}
            </p>
            <p className="mediumScore">
              <strong>Průměrné skóre:</strong>{' '}
              {formatNumberToReadableString(season.mediumScore)}
            </p>
            <p className="goodScore">
              <strong>Dobré skóre:</strong>{' '}
              {formatNumberToReadableString(season.goodScore)}
            </p>
          </div>
        )).reverse()}
      </div>
    </div>
  )
}
