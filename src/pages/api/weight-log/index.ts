import { getSession } from "next-auth/react"
import type { NextApiRequest, NextApiResponse } from 'next'
import { ILogEntry } from '@/types'

import createRouter from 'next-connect'
const router = createRouter<NextApiRequest, NextApiResponse>()

import { GoogleSpreadsheet } from 'google-spreadsheet'
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID)
let isAuthenticated = false
let isDocumentLoaded = false

async function userServiceAccountAuth() {
  if (isAuthenticated) return

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n") || ''
  })

  isAuthenticated = true
}

async function loadDocumentInfo() {
  if (isDocumentLoaded) return

  await doc.loadInfo()
  isDocumentLoaded = true
}

async function loadSheet(userEmail: string | null | undefined) {
  if (!userEmail) return {}

  await userServiceAccountAuth()
  await loadDocumentInfo()

  const sheet = doc.sheetsByTitle[userEmail]
  if (!sheet) return {}

  return { sheet }
}

async function getData(userEmail: string | null | undefined) {
  const { sheet } = await loadSheet(userEmail)
  if (!sheet) return {
    error: true,
    message: `Sheet for user "${userEmail}" was not found in the document.`
  }

  const rows = await sheet.getRows()

  return rows.map(row => ({
    date: row.date,
    weight: row.weight
  }))
}

async function addEntry(userEmail: string | null | undefined, entry: ILogEntry) {
  const { sheet } = await loadSheet(userEmail)

  if (!sheet) return

  const rows = await sheet.getRows()
  const existingRow = rows.find(row => row.date === entry.date)

  if (existingRow) {
    existingRow.weight = entry.weight
    return existingRow.save()
  }

  return sheet.addRow({
    date: entry.date,
    weight: entry.weight
  })
}

router.get(async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({ req })

  if (session) {
    const data: any = await getData(session.user?.email)

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
    await addEntry(session.user?.email, req.body)
    return res.status(200).json({ success: true })
  }

  return res.status(401).send('401 unauthorized')
})

export default router
