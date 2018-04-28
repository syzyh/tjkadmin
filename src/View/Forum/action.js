import {
  deleteDiscussionAPI,
  deleteOpinionAPI,
  fetchAllDiscussionsAPI,
} from './api';

import _ from 'lodash';

export const deleteDiscussion = (discussion_id) => {
  return (dispatch, getState) => {
    dispatch({ type: "start_delete_discussion"});
    deleteDiscussionAPI(discussion_id).then(
      result => {
        console.log(result);
        if (!result.data.deleted) {
          dispatch({ type: "delete_discussion_failure", error: '创建失败' });
        } else {
          const discussions = getState().branch.discussions;
          const newDiscussions = _.filter(discussions, d => d.discussion_id !== discussion_id);
          dispatch({type: "delete_discussion_success", payload: newDiscussions});
        }
      },
      error => dispatch({ type: "delete_discussion_failure", error: '网络登录出错' })
    );
  };
};

export const deleteOpinion = (opinion_id, discussion_id) => {
  return (dispatch, getState) => {
    dispatch({ type: "start_delete_opinion"});
    deleteOpinionAPI(opinion_id).then(
      result => {
        if (!result.data.deleted) {
          dispatch({ type: "delete_opinion_failure", error: '创建失败' });
        } else {
          const discussions = getState().branch.discussions;
          const newDiscussions = _.map(discussions, d => {
            if (d.discussion_id === discussion_id) {
              d.opinions = _.filter(d.opinions, o => o.opinion_id !== opinion_id );
            }
            return d;
          });
          dispatch({type: "delete_opinion_success", payload: newDiscussions});
        }
      },
      error => dispatch({ type: "delete_opinion_failure", error: '网络登录出错' })
    );
  };
};

export const fetchAllDiscussions = () => {
  return (dispatch, getState) => {
    dispatch({ type: "start_fetching_discussion"});
    fetchAllDiscussionsAPI().then(
      result => {
        dispatch({type: "fetching_discussion_success", payload: result.data});
      },
      error => dispatch({ type: "fetching_discussion_failure", error: '网络登录出错' })
    );
  };
};