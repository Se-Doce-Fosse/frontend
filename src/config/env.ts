declare const importMeta: { env: Record<string, string> } | undefined;

export const env = {
  backendUrl:
    (typeof importMeta !== 'undefined' && importMeta.env.VITE_BACKEND_URL) ||
    process.env.VITE_BACKEND_URL,
};
