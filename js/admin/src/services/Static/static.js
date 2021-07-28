const createStaticService = ({ httpClient, apiUrl }) => {
  const fetchStaticFile = async (name, ext = 'html') => {
    const url = `${apiUrl}/static/template?name=${name}&ext=${ext}`;
    const response = await httpClient.get(url);

    return response.data.contents;
  };

  const updateStaticFile = async (name, ext, contents) => {
    const url = `${apiUrl}/static/template?name=${name}&ext=${ext}`;
    await httpClient.put(url, { contents });
  };

  return {
    fetchStaticFile,
    updateStaticFile,
  };
};

export default createStaticService;
