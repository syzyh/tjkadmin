import {
  START_CREATE_CATEGORY,
  START_CREATE_DEPARTMENT,
  START_CREATE_AUDIO,
  START_DELETE_CATEGORY,
  START_DELETE_DEPARTMENT,
  START_DELETE_AUDIO,
  START_FETCHING_DATA,
  START_UPDATE_CATEGORY,
  START_UPDATE_DEPARTMENT,
  START_UPDATE_AUDIO,
  
  DELETE_CATEGORY_FAILURE,
  DELETE_CATEGORY_SUCCESS,
  DELETE_DEPARTMENT_FAILURE,
  DELETE_DEPARTMENT_SUCCESS,
  DELETE_AUDIO_FAILURE,
  DELETE_AUDIO_SUCCESS,

  UPDATE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_DEPARTMENT_FAILURE,
  UPDATE_DEPARTMENT_SUCCESS,
  UPDATE_AUDIO_FAILURE,
  UPDATE_AUDIO_SUCCESS,

  CREATE_CATEGORY_FAILURE,
  CREATE_CATEGORY_SUCCESS,
  CREATE_DEPARTMENT_FAILURE,
  CREATE_DEPARTMENT_SUCCESS,
  CREATE_AUDIO_FAILURE,
  CREATE_AUDIO_SUCCESS,

  FETCHING_DATA_FAILURE,
  FETCHING_DATA_SUCCESS,
} from './constants.js';

import {
  fetchAllCategorysAPI,
  fetchAllDepartmentsAPI,
  fetchAllAudiosAPI,
  
  createCategoryAPI,
  createDepartmentAPI,
  createAudioAPI,

  deleteCategoryAPI,
  deleteDepartmentAPI,
  deleteAudioAPI,

  updateCategoryAPI,
  updateDepartmentAPI,
  updateAudioAPI,
} from './api.js';

import _ from 'lodash';

export const fetchingData = () => {
  return (dispatch, getState) => {
    dispatch({ type: START_FETCHING_DATA });
    Promise.all([fetchAllCategorysAPI(), fetchAllDepartmentsAPI(), fetchAllAudiosAPI()]).then(
      result => {
        const categorys = _.orderBy(result[0].data, ['category_order', 'category_name'], ['asc', 'asc']);
        const departments = _.orderBy(result[1].data, ['department_order', 'department_name'], ['asc', 'asc']);
        const audios = _.orderBy(result[2].data, ['audio_order', 'audio_name'], ['asc', 'asc']);
        dispatch({ type: FETCHING_DATA_SUCCESS, categorys, departments, audios });
      },
      error => dispatch({ type: FETCHING_DATA_FAILURE, error: '网络加载界面出错' })
    );
  };
};

export const createCategory = name => {
  return (dispatch, getState) => {
    dispatch({ type: START_CREATE_CATEGORY });
    const oldCategorys = getState().mobile.categorys;
    console.log(oldCategorys);
    let order = 0;
    if (oldCategorys.length > 0) {
      const lastOrder = _.last(oldCategorys).category_order;
      order = lastOrder >= 0 ? lastOrder + 1 : 0;
    }
    createCategoryAPI(name, order).then(
      result => {
        console.log(result);
        if (result.data.created) {
          dispatch({ type: CREATE_CATEGORY_SUCCESS, categorys:  [...oldCategorys, result.data._doc] });
        } else if(result.data.alreadyExists) {
          dispatch({ type: CREATE_CATEGORY_FAILURE, error: '该分类名称已存在' });
        } else {
          dispatch({ type: CREATE_CATEGORY_FAILURE, error: '创建分类失败'});
        }
      },
      error => {
        dispatch({ type: CREATE_CATEGORY_FAILURE, error: '创报分类出错'});
      }
    );
  };
};

export const deleteCategory = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: START_DELETE_CATEGORY });
    console.log('delete');
    deleteCategoryAPI(id).then(
      result => {
        console.log(result);
        if (result.data === 'deleted') {
          const categorys = _.filter(getState().mobile.categorys, c => c._id !== id);
          console.log(categorys);
          dispatch({ type: DELETE_CATEGORY_SUCCESS, categorys });
        } else {
          dispatch({ type: DELETE_CATEGORY_FAILURE, error: '删除分类失败'});
        }
      },
      error => {
        dispatch({ type: DELETE_CATEGORY_FAILURE, error: '删除分类出错' });
      }
    );
  };
};

export const updateCategory = (id, name) => {
  return (dispatch, getState) => {
    dispatch({ type: START_UPDATE_CATEGORY });
    let category_name, category_order;
    const oldCategorys = getState().mobile.categorys;
    const categorys = _.map(oldCategorys, c => {
      if (c._id === id) {
        category_order = c.category_order;
        category_name = name;
        return { ...c, category_name };
      } else {
        return c;
      }
    });

    updateCategoryAPI(id, category_name, category_order).then(
      result => {
        if (result.data === 'updated') {
          dispatch({ type: UPDATE_CATEGORY_SUCCESS, categorys });
        } else {
          dispatch({ type: UPDATE_CATEGORY_FAILURE, error: '更新分类失败'});
        }
      },
      error => {
        dispatch({ type: UPDATE_CATEGORY_FAILURE, error: '更新分类出错' });
      }
    );
  };
};

export const topCategory = id => {
  return (dispatch, getState) => {
    dispatch({ type: START_UPDATE_CATEGORY });
    const oldCategorys = getState().mobile.categorys;
    const category_order = oldCategorys[1].category_order - 1;

    let category;
    let categorys = _.filter(oldCategorys, c => {
      if (c._id === id) category = c;
      return c._id !== id;
    });
    categorys.splice(1, 0, { ...category, category_order });
    console.log(categorys);

    updateCategoryAPI(id, category.category_name, category_order).then(
      result => {
        console.log(result);
        if (result.data === 'updated') {
          dispatch({ type: UPDATE_CATEGORY_SUCCESS, categorys });
        } else {
          dispatch({ type: UPDATE_CATEGORY_FAILURE, error: '更新分类失败' });
        }
      },
      error => {
        dispatch({ type: UPDATE_CATEGORY_FAILURE, error: '更新分类出错' });
      }
    );
  };
};


export const createDepartment = (id, name, imgUrl, urlName, imgUrl2) => {
  return (dispatch, getState) => {
    dispatch({ type: START_CREATE_DEPARTMENT });
    const oldDepartments = getState().mobile.departments;
    const order = oldDepartments.length > 0 ? _.last(oldDepartments).department_order + 1 : 0;
    console.log(oldDepartments);
    createDepartmentAPI(id, name, imgUrl, urlName, order, imgUrl2).then(
      result => {
        console.log(result);
        if (result.data.created) {
          dispatch({ type: CREATE_DEPARTMENT_SUCCESS, departments:  [...oldDepartments, result.data._doc] });
        } else {
          const error = result.data.alreadyExists ? "该病情名称已经存在" : '创建病种失败';
          dispatch({ type: CREATE_DEPARTMENT_FAILURE, error });
        }
      },
      error => {
        dispatch({ type: CREATE_DEPARTMENT_FAILURE, error: '创建病种出错'});
      }
    );
  };
};

export const deleteDepartment = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: START_DELETE_DEPARTMENT });
    deleteDepartmentAPI(id).then(
      result => {
        console.log(result);
        if (result.data.ok) {
          const departments = _.filter(getState().mobile.departments, c => c._id !== id);
          dispatch({ type: DELETE_DEPARTMENT_SUCCESS, departments });
        } else {
          dispatch({ type: DELETE_DEPARTMENT_FAILURE, error: '删除病种失败'});
        }
      },
      error => {
        dispatch({ type: DELETE_DEPARTMENT_FAILURE, error: '删除病种出错' });
      }
    );
  };
};

export const updateDapartment = (id, name, imgUrl, urlName, imgUrl2) => {
  return (dispatch, getState) => {
    dispatch({ type: START_UPDATE_DEPARTMENT });
    const oldDepartments = getState().mobile.departments;
    let department_name, department_imgUrl, department_urlName, department_order, department_imgUrl2;
    const departments = _.map(oldDepartments, c => {
      if (c._id === id) {
        department_name = name ? name : c.department_name;
        department_imgUrl = imgUrl ? imgUrl : c.department_imgUrl;
        department_imgUrl2 = imgUrl2 ? imgUrl2 : c.department_imgUrl2;
        department_urlName = urlName ? urlName : c.department_urlName;
        department_order = c.department_order;

        return { ...c, department_name, department_imgUrl, department_urlName, department_imgUrl2 };
      } else {
        return c;
      }
    });

    console.log({id, department_name, department_imgUrl, department_urlName, department_order, department_imgUrl2})
    updateDepartmentAPI(id, department_name, department_imgUrl, department_urlName, department_order, department_imgUrl2).then(
      result => {
        console.log(result);
        if (result.data.updated) {
          dispatch({ type: UPDATE_DEPARTMENT_SUCCESS, departments });
        } else {
          dispatch({ type: UPDATE_DEPARTMENT_FAILURE, error: '更新病种失败'});
        }
      },
      error => {
        dispatch({ type: UPDATE_DEPARTMENT_FAILURE, error: '更新病种出错' });
      }
    );
  };
};

export const topDepartment = id => {
  return (dispatch, getState) => {
    dispatch({ type: START_UPDATE_DEPARTMENT });
    const oldDepartments = getState().mobile.departments;
    const department_order = oldDepartments[0].department_order - 1;

    let department;
    const departments = _.filter(oldDepartments, c => {
      if (c._id === id) department = c;
      return c._id !== id;
    });
    departments.unshift({ ...department, department_order }); 

    updateDepartmentAPI(id, department.department_name, department.department_imgUrl, department.department_urlName, department_order).then(
      result => {
        console.log(result);
        if (result.data.updated) {
          dispatch({ type: UPDATE_DEPARTMENT_SUCCESS, departments });
        } else {
          dispatch({ type: UPDATE_DEPARTMENT_FAILURE, error: '更新病种失败' });
        }
      },
      error => {
        dispatch({ type: UPDATE_DEPARTMENT_FAILURE, error: '更新病种出错' });
      }
    );
  };
};

export const createAudio = (id, name, url, imgUrl, description, type) => {
  return (dispatch, getState) => {
    dispatch({ type: START_CREATE_AUDIO });
    const oldAudios = getState().mobile.audios;
    const order = oldAudios.length > 0 ? oldAudios[0].audio_order - 1 : 0;
    createAudioAPI(id, name, url, imgUrl, description, order, type).then(
      result => {
        console.log(result);
        if (!result.data.error) {
          dispatch({ type: CREATE_AUDIO_SUCCESS, audios:  [result.data.audio, ...oldAudios] });
        } else {
          dispatch({ type: CREATE_AUDIO_FAILURE, error: result.data.error });
        }
      },
      error => {
        dispatch({ type: CREATE_AUDIO_FAILURE, error: '创建推送出错'});
      }
    );
  };
};

export const deleteAudio = (id) => {
  return (dispatch, getState) => {
    dispatch({ type: START_DELETE_AUDIO });
    deleteAudioAPI(id).then(
      result => {
        console.log(result);
        if (!result.data.error) {
          const audios = _.filter(getState().mobile.audios, c => c._id !== id);
          dispatch({ type: DELETE_AUDIO_SUCCESS, audios });
        } else {
          dispatch({ type: DELETE_AUDIO_FAILURE, error: result.data.error});
        }
      },
      error => {
        dispatch({ type: DELETE_AUDIO_FAILURE, error: '删除病种出错' });
      }
    );
  };
};

export const updateAudio = (id, name, url, imgUrl, description) => {
  return (dispatch, getState) => {
    console.log(imgUrl);
    dispatch({ type: START_UPDATE_AUDIO });
    const oldAudios = getState().mobile.audios;
    let audio_name, audio_url, audio_description, audio_order, audio_imgUrl;
    const audios = _.map(oldAudios, c => {
      if (c._id === id) {
        audio_name = name ? name : c.audio_name;
        audio_url = url ? url : c.audio_url;
        audio_description = description ? description : c.audio_description;
        audio_order = c.audio_order;
        audio_imgUrl = imgUrl ? imgUrl : c.audio_imgUrl;

        return { ...c, audio_name, audio_url, audio_imgUrl, audio_description, audio_order };
      } else {
        return c;
      }
    });

    updateAudioAPI(id, name, url, imgUrl, description, audio_order).then(
      result => {
        console.log(result);
        if (!result.data.error) {
          dispatch({ type: UPDATE_AUDIO_SUCCESS, audios });
        } else {
          dispatch({ type: UPDATE_AUDIO_FAILURE, error: result.data.error});
        }
      },
      error => {
        dispatch({ type: UPDATE_AUDIO_FAILURE, error: '更新病种出错' });
      }
    );
  };
};

export const topAudio = id => {
  return (dispatch, getState) => {
    dispatch({ type: START_UPDATE_AUDIO });
    const oldAudios = getState().mobile.audios;
    const audio_order = oldAudios[0].audio_order - 1;

    let audio;
    const audios = _.filter(oldAudios, c => {
      if (c._id === id) audio = c;
      return c._id !== id;
    });
    audios.unshift({ ...audio, audio_order }); 

    updateAudioAPI(id, audio.audio_name, audio.audio_url, audio.audio_description, audio_order).then(
      result => {
        console.log(result);
        if (!result.data.error) {
          dispatch({ type: UPDATE_AUDIO_SUCCESS, audios });
        } else {
          dispatch({ type: UPDATE_AUDIO_FAILURE, error: result.data.error });
        }
      },
      error => {
        dispatch({ type: UPDATE_AUDIO_FAILURE, error: '更新病种出错' });
      }
    );
  };
};