import fetchApi, { getAxiosError } from './fetchApi';

const mainRoute = 'cdn-auth';

const get = async (initialData) => {
  try {
    const { data } = await fetchApi.get(mainRoute, initialData);
    return data.body;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const listActive = async (initialData) => {
  try {
    const { data } = await fetchApi.get(`${mainRoute}/active`, initialData);
    return data.body;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const detail = async (id, initialData) => {
  try {
    const { data } = await fetchApi.get(`${mainRoute}/${id}`, initialData);
    return data.body;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const upload = async (initialData) => {
  try {
    const { data } = await fetchApi.post(process.env.CDN_URL_UPLOAD, initialData);
    return data;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const update = async (id, initialData) => {
  try {
    const { data } = await fetchApi.put(`${mainRoute}/${id}`, initialData);
    return data.body;
  } catch (error) {
    return { error: true, message: getAxiosError(error) };
  }
};

const remove = async (id) => {
  try {
    const { data } = await fetchApi.delete(`${mainRoute}/${id}`);
    return data.body;
  } catch (error) {
    console.log('error', error);
    return { error: true, message: getAxiosError(error) };
  }
};

const cdnAuthApi = { get, listActive, detail, upload, update, remove };
export default cdnAuthApi;
