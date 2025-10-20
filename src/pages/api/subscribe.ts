import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, audienceId, firstName, lastName } = req.body

  if (!email || !email.length) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    const API_KEY = process.env.MAILCHIMP_API_KEY
    const DATACENTER = process.env.MAILCHIMP_API_KEY?.split('-')[1] // us17 from API key

    const data = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName || '',
        LNAME: lastName || '',
      },
    }

    const response = await fetch(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        body: JSON.stringify(data),
        headers: {
          Authorization: `apikey ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }
    )

    if (!response.ok) {
      // Get error message from Mailchimp
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to subscribe')
    }

    return res.status(201).json({ error: null, message: 'Success' })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error subscribing to newsletter'
    return res.status(500).json({ error: message })
  }
}
