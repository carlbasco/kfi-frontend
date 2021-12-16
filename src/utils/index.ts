import { ApiAuth } from '@lib'

interface DownloadImageProps {
  url: string
  id: string | undefined | string[]
}

const downloadImage = async (url:string) => {
  const res = await ApiAuth.get(url, { responseType: 'blob' })
  const obj = window.URL.createObjectURL(await res.data)
  const link = document.createElement('a')
  link.href = obj
  link.download = `Image.${url.split('.').pop()}`
  link.click()
  window.URL.revokeObjectURL(obj)
  link.remove()
}

const searchFilter = (data: Array<any>, keyword: string) => {
  return data.filter((item) => {
    return Object.keys(item).some((key) => {
      if (typeof item[key] === 'object')
        return Object.values(item[key])
          .toString()
          .toLowerCase()
          .includes(keyword.toLowerCase())

      return (
        item[key].toString().toLowerCase().indexOf(keyword.toLowerCase()) > -1
      )
    })
  })
}

export { downloadImage, searchFilter }
