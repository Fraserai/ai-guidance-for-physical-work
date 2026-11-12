import * as SecureStore from 'expo-secure-store';

const OPENAI_API_KEY = 'no_name_yet.openai_api_key';

export async function saveOpenAIApiKey(apiKey: string) {
  await SecureStore.setItemAsync(OPENAI_API_KEY, apiKey.trim());
}

export async function getOpenAIApiKey() {
  return SecureStore.getItemAsync(OPENAI_API_KEY);
}

export async function clearOpenAIApiKey() {
  await SecureStore.deleteItemAsync(OPENAI_API_KEY);
}
