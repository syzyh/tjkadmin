import axios from 'axios';
import {apiConfig} from '../../frontend';

const discussionUrl = apiConfig('/api/discussion');
const opinionUrl = apiConfig('/api/opinion');

export const fetchAllDiscussionsAPI = () => {
  return axios.get(discussionUrl);
};

export const deleteDiscussionAPI = (discussion_id) => {
  return axios.delete(discussionUrl, {params: {discussion_id}});
};

export const deleteOpinionAPI = (opinion_id) => {
  return axios.delete(opinionUrl, {params: {opinion_id}});
};
