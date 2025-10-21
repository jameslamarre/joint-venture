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

  console.log('Subscribe API called with:', {
    email,
    audienceId,
    hasFirstName: !!firstName,
    hasLastName: !!lastName,
  })

  if (!email || !email.length) {
    console.log('Missing email')
    return res.status(400).json({ error: 'Email is required' })
  }

  if (!audienceId) {
    console.log('Missing audienceId')
    return res.status(400).json({ error: 'Audience ID is required' })
  }

  try {
    const API_KEY = process.env.MAILCHIMP_API_KEY

    if (!API_KEY) {
      console.error('MAILCHIMP_API_KEY not found in environment variables')
      return res
        .status(500)
        .json({ error: 'Server configuration error: Missing API key' })
    }

    const DATACENTER = API_KEY.split('-')[1]

    if (!DATACENTER) {
      console.error('Could not extract datacenter from API key')
      return res
        .status(500)
        .json({ error: 'Server configuration error: Invalid API key format' })
    }

    console.log('Using datacenter:', DATACENTER)

    const data = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName || '',
        LNAME: lastName || '',
      },
    }

    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${audienceId}/members`
    console.log('Making request to:', url)

    // Add timeout and error handling for the fetch
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        body: JSON.stringify(data),
        headers: {
          Authorization: `apikey ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      clearTimeout(timeoutId)
      console.log('Mailchimp response status:', response.status)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
          throw new Error(
            `Mailchimp API error: ${response.status} ${response.statusText}`
          )
        }

        console.error('Mailchimp API error:', errorData)

        // Handle specific Mailchimp errors
        if (errorData.title === 'Member Exists') {
          return res
            .status(200)
            .json({ error: null, message: 'Already subscribed' })
        }

        throw new Error(
          errorData.detail || errorData.title || 'Failed to subscribe'
        )
      }

      const responseData = await response.json()
      console.log('Success! Subscriber ID:', responseData.id)

      return res.status(201).json({ error: null, message: 'Success' })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)

      if (fetchError?.name === 'AbortError') {
        console.error('Request timed out')
        throw new Error('Request timed out - please try again')
      }

      console.error('Fetch error details:', {
        name: fetchError?.name,
        message: fetchError?.message,
        cause: fetchError?.cause,
      })

      // Re-throw to be caught by outer catch
      throw fetchError
    }
  } catch (error) {
    console.error('Subscribe API error:', error)

    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5), // First 5 lines of stack
      })
    }

    let errorMessage = 'Error subscribing to newsletter'

    if (error instanceof Error) {
      if (error.message.includes('fetch failed')) {
        errorMessage =
          'Network error - please check your connection and try again'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out - please try again'
      } else {
        errorMessage = error.message
      }
    }

    return res.status(500).json({ error: errorMessage })
  }
}
