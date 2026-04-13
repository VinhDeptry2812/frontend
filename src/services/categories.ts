import api from './api';

export const getCategories = (tree = false) => {
  return api.get('/categories', { params: { tree: tree ? 1 : 0 } });
};

export const getCategoryById = (id: number) => {
  return api.get(`/categories/${id}`);
};
