import { getSession } from "next-auth/react"
import type { NextApiRequest, NextApiResponse } from 'next'
import { ILogEntry } from '@/types'

import createRouter from 'next-connect'
const router = createRouter<NextApiRequest, NextApiResponse>()

import { GoogleSpreadsheet } from 'google-spreadsheet'
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID)
let USER_EMAIL: string | null | undefined

async function userServiceAccountAuth() {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n") || ''
  })
}

async function loadSheet() {
  if (!USER_EMAIL) return {}

  await userServiceAccountAuth()
  await doc.loadInfo()
  const sheet = doc.sheetsByTitle[USER_EMAIL]
  if (!sheet) return {}

  await sheet.resetLocalCache(true)
  await sheet.loadCells('A1:B')

  const lastRowNumber = sheet.cellStats.nonEmpty / 2

  return { sheet, lastRowNumber }
}

async function getData() {
  const { sheet, lastRowNumber } = await loadSheet()
  if (!sheet) return {
    error: true,
    message: `Sheet for user "${USER_EMAIL}" was not found in the document.`
  }

  const data = []

  for (let i = 0; i < lastRowNumber; i++) {
    const date = sheet.getCell(i, 0)
    const weight = sheet.getCell(i, 1)

    data.push({
      date: date.formattedValue,
      weight: weight.formattedValue
    })
  }

  return data
}

async function addEntry(entry: ILogEntry) {
  let { sheet, lastRowNumber } = await loadSheet()

  if (!sheet || lastRowNumber === undefined) return

  if (lastRowNumber > 0) {
    const previousDate = sheet.getCell(lastRowNumber - 1, 0).value
    if (previousDate === entry.date) lastRowNumber -= 1
  }

  sheet.getCell(lastRowNumber, 0).value = entry.date
  sheet.getCell(lastRowNumber, 1).value = entry.weight

  return sheet.saveUpdatedCells()
}

router.get(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({ req })

  if (session) {
    USER_EMAIL = session.user?.email
    const data: any = await getData()

    if (data.error) {
      return res.status(404).send(data.message)
    }

    return res.status(200).json(data)
  }

  return res.status(401).send('401 unauthorized')
})

router.post(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({ req })

  if (session) {
    USER_EMAIL = session.user?.email

    await addEntry(req.body)
    return res.status(200).json({ success: true })
  }

  return res.status(401).send('401 unauthorized')
})

export default router
