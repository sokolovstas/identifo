import { toDeepCase } from '~/utils/apiMapper';

const createAccountService = ({ httpClient, apiUrl }) => {
  const fetchSettings = async () => {
    const url = `${apiUrl}/settings/account`;
    const { data } = await httpClient.get(url);

    return toDeepCase(data, 'camel');
  };

  const postSettings = async (settings) => {
    const url = `${apiUrl}/settings/account`;
    const { data } = httpClient.patch(url, toDeepCase(settings, 'snake'));

    return data;
  };

  return Object.freeze({
    fetchSettings,
    postSettings,
  });
};

export default createAccountService;
