import { format as formatUrl } from 'url';
import { apiUrl } from '../../../config.json';

const createUserService = ({ httpClient }) => {
  const fetchUsers = async (filters = {}) => {
    const { search } = filters;
    const url = formatUrl({
      pathname: `${apiUrl}/users`,
      query: {
        search,
      },
    });
    const { data } = await httpClient.get(url);

    return data;
  };

  const postUser = async (user) => {
    const url = `${apiUrl}/users`;
    const { data } = await httpClient.post(url, user);

    return data;
  };

  const alterUser = async (id, changes) => {
    const url = `${apiUrl}/users/${id}`;
    const { data } = await httpClient.put(url, changes);

    return data;
  };

  const fetchUserById = async (id) => {
    const url = `${apiUrl}/users/${id}`;
    const { data } = await httpClient.get(url);

    return data;
  };

  const deleteUserById = async (id) => {
    const url = `${apiUrl}/users/${id}`;
    const { data } = await httpClient.delete(url);

    return data;
  };

  return Object.freeze({
    fetchUsers,
    postUser,
    alterUser,
    fetchUserById,
    deleteUserById,
  });
};

export default createUserService;
