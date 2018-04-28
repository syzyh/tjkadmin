import axios from 'axios';
import {apiConfig} from '../../frontend';

const categoryUrl = apiConfig('/serve/api/category');
const departmentUrl = apiConfig('/serve/api/department');
const audioUrl = apiConfig('/serve/api/audio');

export const fetchAllCategorysAPI = () => {
  return axios.get(categoryUrl);
};

export const createCategoryAPI = (name, order) => {
  console.log({name, order});
  return axios.post(categoryUrl, { name, order });
};

export const deleteCategoryAPI = id => {
  return axios.delete(categoryUrl, { params: { id }});
};

export const updateCategoryAPI = (id, name, order) => {
  return axios.put(categoryUrl, { id, name, order });
};

export const fetchAllDepartmentsAPI = () => {
  return axios.get(departmentUrl);
};

export const createDepartmentAPI = (id, name, imgUrl, urlName, order, imgUrl2) => {
  return axios.post(departmentUrl, { id, name, imgUrl, urlName, order, imgUrl2 });
};

export const deleteDepartmentAPI = id => {
  return axios.delete(departmentUrl, { params: { id }});
};

export const updateDepartmentAPI = (id, name, imgUrl, urlName, order, imgUrl2) => {
  return axios.put(departmentUrl, { id, name, imgUrl, urlName, order, imgUrl2 });
};

export const fetchAllAudiosAPI = () => {
  return axios.get(audioUrl);
};

export const createAudioAPI = (department_id, name, url, imgUrl, description, order, type) => {
  console.log(department_id);
  return axios.post(audioUrl, { department_id, name, url, imgUrl, description, order, type });
};

export const deleteAudioAPI = id => {
  return axios.delete(audioUrl, { params: { id }});
};

export const updateAudioAPI = (id, name, url, imgUrl, description, order) => {
  return axios.put(audioUrl, { id, name, url, imgUrl, description, order });
};