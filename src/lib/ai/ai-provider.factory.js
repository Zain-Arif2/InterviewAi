import { OpenRouterProvider } from './openrouter.provider';
let cachedProvider = null;

export function getAIProvider() {
  if (cachedProvider) return cachedProvider;

  const providerName = process.env.AI_PROVIDER || 'openrouter';

  switch (providerName) {
    case 'openrouter':
      cachedProvider = new OpenRouterProvider();
      break;
    default:
      throw new Error(`Unsupported AI_PROVIDER: ${providerName}`);
  }

  return cachedProvider;
}