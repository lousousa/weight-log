import type { NextApiRequest, NextApiResponse } from 'next'

import createRouter from 'next-connect'
const router = createRouter<NextApiRequest, NextApiResponse>()

import { GoogleSpreadsheet } from 'google-spreadsheet'
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID)

async function userServiceAccountAuth() {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n") || ''
  })
}

async function getData() {
  await userServiceAccountAuth()
  await doc.loadInfo()
  const sheet = doc.sheetsByTitle['MainSheet']
  await sheet.resetLocalCache(true)
  await sheet.loadCells('A1:B')

  const lastRowNumber = sheet.cellStats.nonEmpty / 2
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

router.get(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  res.status(200).json(await getData())
})

router.post(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  console.log(req.body)

  res.status(200).json({ success: true })
})

export default router

