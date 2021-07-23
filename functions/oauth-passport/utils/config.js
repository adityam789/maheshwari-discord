// lambda/utils/config.js
// Circumvent problem with Netlify CLI.
// https://github.com/netlify/netlify-dev-plugin/issues/147
const process = require('process')

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8888' : process.env.BASE_URL

const COOKIE_SECURE = process.env.NODE_ENV !== 'development'

const ENDPOINT = process.env.NODE_ENV === 'development' ? '/.netlify/functions' : '/api'

const { DISCORD_CLIENT_ID } = process.env
const { DISCORD_CLIENT_SECRET } = process.env

const SECRET = process.env.SECRET || 'SUPERSECRET'

module.exports = {
  BASE_URL,
  COOKIE_SECURE,
  ENDPOINT,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  SECRET,
}
