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
  await sheet.resetLocalCache(true)
  await sheet.loadCells('A1:B')

  return { sheet, lastRowNumber: sheet.cellStats.nonEmpty / 2 }
}

async function getData() {
  const { sheet, lastRowNumber } = await loadSheet()
  if (!sheet) return

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
  if (!sheet || !lastRowNumber) return

  const previousDate = sheet.getCell(lastRowNumber - 1, 0).value
  if (previousDate === entry.date) lastRowNumber -= 1

  sheet.getCell(lastRowNumber, 0).value = entry.date
  sheet.getCell(lastRowNumber, 1).value = entry.weight

  return sheet.saveUpdatedCells()
}

router.get(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({ req })

  if (session) {
    USER_EMAIL = session.user?.email
    return res.status(200).json(await getData())
  }

  return res.status(401).send('401 unauthorized')
})

router.post(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({ req })

  if (session) {
    await addEntry(req.body)
    return res.status(200).json({ success: true })
  }

  return res.status(401).send('401 unauthorized')
})

export default router
