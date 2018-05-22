import axios from 'axios';
import {apiConfig} from '../../frontend';

const userUrl = apiConfig('/api/user');

export const fetchUsersByNameAPI = (name) => {
  return axios.get(userUrl, {params: {name}});
};

export const changeUserRole = (id, role) => {
  return axios.post(userUrl+'/role', {id, role});
}