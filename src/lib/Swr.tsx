import { ApiAuth } from '@lib'
import { FC } from 'react'
import { SWRConfig, SWRConfiguration } from 'swr'

const swrConfig: SWRConfiguration = {
  fetcher: (url: string) => ApiAuth.get(url).then((res) => res.data),
  refreshInterval: 1000 * 60,
  onErrorRetry: (err, key, config, revalidate, { retryCount }) => {
    if (err.status === 404) return
    if (retryCount >= 3) return
    setTimeout(() => revalidate({ retryCount }), 5000)
  },
}
export const fetcher = (url: string) => ApiAuth.get(url).then((res) => res.data)

const SwrProvider: FC = ({ children }) => {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>
}

export default SwrProvider
