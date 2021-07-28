import { toDeepCase } from '~/utils/apiMapper';

const CAMEL_CASE = 'camel';
const SNAKE_CASE = 'snake';

const createSettingsService = ({ httpClient, apiUrl }) => {
  const fetchLoginSettings = async () => {
    const url = `${apiUrl}/settings/login`;
    const { data } = await httpClient.get(url);

    return toDeepCase(data, CAMEL_CASE);
  };

  const updateLoginSettings = (settings) => {
    const url = `${apiUrl}/settings/login`;
    return httpClient.put(url, toDeepCase(settings, SNAKE_CASE));
  };

  const fetchExternalServicesSettings = async () => {
    const url = `${apiUrl}/settings/services`;
    const { data } = await httpClient.get(url);
    return toDeepCase(data, CAMEL_CASE);
  };

  const updateExternalServicesSettings = async (settings) => {
    const url = `${apiUrl}/settings/services`;
    return httpClient.put(url, toDeepCase(settings, SNAKE_CASE));
  };

  const fetchSessionStorageSettings = async () => {
    const url = `${apiUrl}/settings/storage/session`;
    const { data } = await httpClient.get(url);
    return toDeepCase(data, CAMEL_CASE);
  };

  const updateSessionStorageSettings = async (settings) => {
    const url = `${apiUrl}/settings/storage/session`;
    return httpClient.put(url, toDeepCase(settings, SNAKE_CASE));
  };

  const fetchStaticFilesSettings = async () => {
    const url = `${apiUrl}/settings/static`;
    const { data } = await httpClient.get(url);

    return toDeepCase(data, CAMEL_CASE);
  };

  const updateStaticFilesSettings = async (settings) => {
    const url = `${apiUrl}/settings/static`;
    return httpClient.put(url, toDeepCase(settings, SNAKE_CASE));
  };

  const fetchGeneralSettings = async () => {
    const url = `${apiUrl}/settings/general`;
    const { data } = await httpClient.get(url);
    return toDeepCase(data, CAMEL_CASE);
  };

  const updateGeneralSettings = async (settings) => {
    const url = `${apiUrl}/settings/general`;
    return httpClient.put(url, toDeepCase(settings, SNAKE_CASE));
  };

  const fetchConfigurationStorageSettings = async () => {
    const url = `${apiUrl}/settings/storage/configuration`;
    const { data } = await httpClient.get(url);

    return toDeepCase(data, CAMEL_CASE);
  };

  const updateConfigurationStorageSettings = async (settings) => {
    const url = `${apiUrl}/settings/storage/configuration`;
    return httpClient.put(url, toDeepCase(settings, SNAKE_CASE));
  };

  const uploadJWTKeys = async (pubKey, privKey) => {
    const url = `${apiUrl}/static/uploads/keys`;

    const formData = new FormData();
    formData.append('keys', pubKey, 'public.pem');
    formData.append('keys', privKey, 'private.pem');

    return httpClient.post(url, formData);
  };

  const requestServerRestart = async () => {
    const url = `${apiUrl}/restart`; // TODO: not final
    await httpClient.post(url);
  };

  return {
    fetchLoginSettings,
    updateLoginSettings,
    fetchExternalServicesSettings,
    updateExternalServicesSettings,
    fetchSessionStorageSettings,
    updateSessionStorageSettings,
    fetchStaticFilesSettings,
    updateStaticFilesSettings,
    fetchGeneralSettings,
    updateGeneralSettings,
    fetchConfigurationStorageSettings,
    updateConfigurationStorageSettings,
    uploadJWTKeys,
    requestServerRestart,
  };
};

export default createSettingsService;
