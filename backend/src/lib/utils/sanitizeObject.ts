function sanitizeObject<T extends Record<string, unknown>>(obj: T, keysToRemove: string[]) {
  const sanitizedObject = { ...obj };
  keysToRemove.forEach((key) => {
    delete sanitizedObject[key];
  });

  return sanitizedObject;
}

export default sanitizeObject;
