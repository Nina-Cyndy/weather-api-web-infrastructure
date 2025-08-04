import keyManager from './keyManager.js';

export default {
  AIR_KEY: process.env.AIR_KEY ? keyManager.decode(process.env.AIR_KEY) : keyManager.getKey('AIR_KEY'),
  API_KEY: process.env.API_KEY ? keyManager.decode(process.env.API_KEY) : keyManager.getKey('API_KEY'),
  API_URL: process.env.API_URL ? keyManager.decode(process.env.API_URL) : keyManager.getKey('API_URL'),
  AIR_URL: process.env.AIR_URL ? keyManager.decode(process.env.AIR_URL) : keyManager.getKey('AIR_URL'),
}