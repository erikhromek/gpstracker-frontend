function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withExponentialBackoff<T>(
  action: () => Promise<T>,
  maxRetries: number,
  initialDelay: number,
): Promise<T> {
  let attempt = 0;
  let delayTime = initialDelay;

  while (attempt < maxRetries) {
    try {
      return await action();
    } catch (error) {
      attempt++;
      if (attempt === maxRetries) {
        throw error;
      }
      await delay(delayTime);
      delayTime *= 2;
    }
  }

  throw new Error();
}
