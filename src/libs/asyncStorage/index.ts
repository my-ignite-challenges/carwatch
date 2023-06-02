import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_SYNC_AT = "@carwatch:last_sync_at";

export async function saveLastSyncTimestamp() {
  const timestamp = new Date().getTime();

  await AsyncStorage.setItem(LAST_SYNC_AT, JSON.stringify(timestamp));
}

export async function getLastSyncTimestamp() {
  const storedTimestamp = await AsyncStorage.getItem(LAST_SYNC_AT);

  return Number(storedTimestamp);
}
