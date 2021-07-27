const createDatabaseService = ({ httpClient, apiUrl }) => {
  const testConnection = async (settings) => {
    const url = `${apiUrl}/settings/storage/test`;
    const { data } = await httpClient.post(url, settings);

    return data;
  };

  const fetchSettings = async () => {
    const url = `${apiUrl}/settings`;
    const { data } = await httpClient.get(url);

    return data.storage;
  };

  const postSettings = async (storage) => {
    const url = `${apiUrl}/settings/storage`;
    const { data } = await httpClient.put(url, storage);

    return data;
  };

  return Object.freeze({
    testConnection,
    fetchSettings,
    postSettings,
  });
};

export default createDatabaseService;
