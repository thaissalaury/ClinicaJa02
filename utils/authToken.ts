import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'clinicaJa.auth.accessToken';

const isAsyncStorageReady = () => {
  try {
    return Boolean((AsyncStorage as any)?.getItem && (AsyncStorage as any)?.setItem);
  } catch {
    return false;
  }
};

export async function saveAccessToken(token: string) {
  try {
    if (!isAsyncStorageReady()) return;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch {
    // fallback silencioso
  }
}

export async function getAccessToken(): Promise<string | null> {
  try {
    if (!isAsyncStorageReady()) return null;
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function clearAccessToken() {
  try {
    if (!isAsyncStorageReady()) return;
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch {
    // fallback silencioso
  }
}



