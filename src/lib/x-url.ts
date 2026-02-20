const X_STATUS_PATH = /^\/[A-Za-z0-9_]+\/status\/[0-9]+\/?$/;

export const isValidXStatusUrl = (value: string): boolean => {
  if (!value) return false;

  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^www\./i, '').toLowerCase();
    if (host !== 'x.com') return false;
    return X_STATUS_PATH.test(parsed.pathname);
  } catch {
    return false;
  }
};
