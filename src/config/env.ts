export const parseBoolean = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined || value === '') return fallback;
  return value.toLowerCase() === 'true';
};

export const cleanPublicValue = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export const assertHttpsUrl = (value: string | undefined, label: string): string | undefined => {
  const cleaned = cleanPublicValue(value);
  if (!cleaned) return undefined;
  let parsed: URL;
  try {
    parsed = new URL(cleaned);
  } catch {
    throw new Error(`${label} must be an absolute HTTPS URL.`);
  }
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) {
    throw new Error(`${label} must be an absolute HTTPS URL without embedded credentials.`);
  }
  return parsed.toString();
};
