import axios from 'axios';
import {apiConfig} from '../../frontend';

const groupUrl = apiConfig('/serve/api/group');
const mediaUrl = apiConfig('/serve/api/media');

export const fetchAllGroupsAPI = () => {
  console.log("group url:", groupUrl);
  return axios.get(groupUrl);
};

export const createGroupAPI = (name, type) => {
  return axios.post(groupUrl, { name, type});
};

export const fetchAllGroupsByTypeAPI = (type) => {
  return axios.get(groupUrl, { params: { type } });
};

export const deleteGroupByIdAPI = (id) => {
  return axios.delete(groupUrl, { params: { id }});
};

export const renameGroupByIdAPI = (id, name) => {
  return axios.put(groupUrl, { id, name });
};

export const fetchAllMediaAPI = (groupId, type) => {
  return axios.get(mediaUrl, { params: {groupId, type}});
};

export const deleteMediaByIdAPI = id => {
  return axios.delete(mediaUrl, {params: {id}});
}

export const renameMediaByIdAPI = (id, name) => {
  return axios.put(mediaUrl, {id, name});
}

export const swapMediaGroupAPI = (id, groupId) => {
  return axios.put(mediaUrl, {id, groupId});
}
