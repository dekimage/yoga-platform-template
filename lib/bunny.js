import crypto from "crypto"

export function generateSignedUrl(videoId, expirationTime = 3600) {
  const libraryId = process.env.BUNNY_LIBRARY_ID
  const signingKey = process.env.BUNNY_SIGNING_KEY

  const expires = Math.floor(Date.now() / 1000) + expirationTime
  const path = `/${libraryId}/${videoId}/play`

  const stringToSign = `${signingKey}${path}${expires}`
  const signature = crypto.createHash("sha256").update(stringToSign).digest("hex")

  return `https://${libraryId}.bunnyvideo.com${path}?token=${signature}&expires=${expires}`
}
