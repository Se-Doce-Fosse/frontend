const STORAGE_KEY = 'seddocefoc_hidden_comments';

const readHiddenCommentIds = (): number[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));
  } catch {
    return [];
  }
};

const writeHiddenCommentIds = (ids: number[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const uniqueIds = Array.from(new Set(ids));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueIds));
  } catch {
    // Ignora erros de armazenamento
  }
};

export const getHiddenCommentIds = (): number[] => readHiddenCommentIds();

export const addHiddenCommentId = (id: number) => {
  const currentIds = readHiddenCommentIds();

  if (currentIds.includes(id)) {
    return;
  }

  writeHiddenCommentIds([...currentIds, id]);
};

export const removeHiddenCommentId = (id: number) => {
  const currentIds = readHiddenCommentIds();

  if (!currentIds.includes(id)) {
    return;
  }

  writeHiddenCommentIds(currentIds.filter((storedId) => storedId !== id));
};
