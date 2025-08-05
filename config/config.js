import keyManager from './keyManager.js';

export default {
  AIR_KEY: keyManager.getKey('AIR_KEY'),
  API_KEY: keyManager.getKey('API_KEY'),
  API_URL: keyManager.getKey('API_URL'),
  AIR_URL: keyManager.getKey('AIR_URL'),
}