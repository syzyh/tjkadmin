import {
  START_FETCHING_MATERIAL,
  FETCHING_MATERIAL_FAILURE,
  FETCHING_MATERIAL_SUCCESS,
  START_UPLOAD_MATERIAL,
  START_DELETE_MATERIAL,
  START_RENAME_MATERIAL,
  UPLOAD_MATERIAL_SUCCESS,
  UPLOAD_MATERIAL_FAILURE,
  RENAME_MATERIAL_FAILURE,
  RENAME_MATERIAL_SUCCESS,
  DELETE_MATERIAL_FAILURE,
  DELETE_MATERIAL_SUCCESS,

  START_CREATE_GROUP,
  START_DELETE_GROUP,
  START_RENAME_GROUP,
  START_SWAP_GROUP,
  CREATE_GROUP_FAILURE,
  CREATE_GROUP_SUCCESS,
  RENAME_GROUP_FAILURE,
  RENAME_GROUP_SUCCESS,
  DELETE_GROUP_FAILURE,
  DELETE_GROUP_SUCCESS,
  SWAP_GROUP_FAILURE,
  SWAP_GROUP_SUCCESS,
} from './constants.js';

import { 
  fetchAllGroupsAPI,
  fetchAllMediaAPI,
  createGroupAPI,
  deleteGroupByIdAPI,
  renameGroupByIdAPI,

  deleteMediaByIdAPI,
  renameMediaByIdAPI,
  swapMediaGroupAPI,
} from './api';

export const getAllData = () => {
  return (dispatch, getState) => {
    dispatch({ type: START_FETCHING_MATERIAL });
    Promise.all([fetchAllGroupsAPI(), fetchAllMediaAPI()]).then(
      result => {
        dispatch({ type: FETCHING_MATERIAL_SUCCESS, groups: result[0].data, material: result[1].data});
      },
      error => dispatch({ type: FETCHING_MATERIAL_FAILURE, payload: '网络加载素材出错' })
    );
  };
};

export const confirmCreateGroup = (name, type) => {
  return (dispatch, getState) => {
    dispatch({ type: START_CREATE_GROUP });
    createGroupAPI(name, type).then(
      group => { 
        console.log(group);
        if(group.data.created) {
          const oldGroups = getState().material.groups;
          console.log(oldGroups);
          dispatch({ type: CREATE_GROUP_SUCCESS, payload: [...oldGroups, group.data._doc] });
        } else if (group.data.alreadyExists){
          dispatch({ type: CREATE_GROUP_FAILURE, payload: '该新建分组名称已存在' });
        }
      },
      error => { dispatch({ type: CREATE_GROUP_FAILURE, payload: '新建分组网络请求出错' })}
    );
  };
};

export const confirmRenameGroup = (groupId, newName) => {
  return (dispatch, getState) => {
    dispatch({ type: START_RENAME_GROUP });
    renameGroupByIdAPI(groupId, newName).then(
      result => {
        if (result.data.renamed) {
          const newGroups = getState().material.groups.map(g => {
            if (g._id !== groupId) return g;
            else return { ...g, name: newName };
          });
          console.log(newGroups);
          dispatch({ type: RENAME_GROUP_SUCCESS, payload: newGroups});
        } else if (result.data.alreadyExists) {
          dispatch({ type: RENAME_GROUP_FAILURE, payload: '该分组名称已存在'});
        } else {
          dispatch({ type: RENAME_GROUP_FAILURE, payload: '重命名分组失败'});
        }
      },
      error => {
        dispatch({ type: RENAME_GROUP_FAILURE, payload: '重命名分组失败'});
      }
    );
  };
};

export const confirmDeleteGroup = (groupId) => {
  return (dispatch, getState) => {
    dispatch({ type: START_DELETE_GROUP });
    deleteGroupByIdAPI(groupId).then(
      result => {
        if (result.data.deleted) {
          const remainedGroups = getState().material.groups.filter(g => g._id !== groupId);
          dispatch({ type: DELETE_GROUP_SUCCESS, payload: remainedGroups });
        } else {
          dispatch({ type: DELETE_GROUP_FAILURE, payload: '删除分组失败' });
        }
      },
      error => {
        dispatch({ type: DELETE_GROUP_FAILURE, payload: '删除分组失败' });
      }
    );
  };
};

export const deleteMaterial = id => {
  return (dispatch, getState) => {
    dispatch({ type: START_DELETE_MATERIAL });
    deleteMediaByIdAPI(id).then(
      result => {
        if (result.data.deleted) {
          const newMaterial = getState().material.material.filter(m => m._id !== id);
          dispatch({ type: DELETE_MATERIAL_SUCCESS, payload: newMaterial });
        } else {
          dispatch({type: DELETE_MATERIAL_FAILURE, payload: '删除素材失败'});
        }
      },
      error => {
        dispatch({ type: DELETE_MATERIAL_FAILURE, payload: '删除素材失败'});
      }
    );
  };
};

export const renameMaterial = (id, newName) => {
  return (dispatch, getState) => {
    dispatch({ type: START_RENAME_MATERIAL });
    renameMediaByIdAPI(id, newName).then(
      result => {
        if (result.data.renamed) {
          const newMaterial = getState().material.material.map(m => {
            if (m._id !== id) return m;
            else return { ...m, name: newName };
          });
          dispatch({ type: RENAME_MATERIAL_SUCCESS, payload: newMaterial});
        } else {
          dispatch({ type: RENAME_MATERIAL_FAILURE, payload: '重命名失败'});
        } 
      },
      error => {
        dispatch({ type: RENAME_GROUP_FAILURE, payload: '重命名素材失败'});
      }
    );
  };
};

export const swapMaterialGroup = (id ,groupId) => {  
  return (dispatch, getState) => {
    dispatch({ type: START_SWAP_GROUP });
    swapMediaGroupAPI(id, groupId).then(
      result => {
        if (result.data.swaped) {
          const newMaterial = getState().material.material.map(m => {
            if (m._id !== id) return m;
            else return { ...m, groupId };
          });
          dispatch({ type: SWAP_GROUP_SUCCESS, payload: newMaterial});
        } else {
          dispatch({ type: SWAP_GROUP_FAILURE, payload: '交换分组失败'});
        } 
      },
      error => {
        dispatch({ type: SWAP_GROUP_FAILURE, payload: '交换分组失败'});
      }
    );
  };
}

export const startUploadMaterial = () => {
  return { type: START_UPLOAD_MATERIAL };
};

export const uploadMaterialSuccess = file => {
  return { type: UPLOAD_MATERIAL_SUCCESS, payload: file};
};

export const uploadMaterialFailure = () => {
  return { type: UPLOAD_MATERIAL_FAILURE, payload: '上传图片失败' };
};
