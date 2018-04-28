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

const initialState = {
  fetching: true,
  updating: false,
  error: null,
  categorys: [],
  departments: [],
  audios: []
};

export const mobileReducer = (state = initialState, action) => {
  switch(action.type) {
    case START_FETCHING_DATA:
      return {
        ...state,
        fetching: true,
        error: null,
      }

    case FETCHING_DATA_SUCCESS:
      return {
        ...state,
        fetching: false,
        error: null,
        categorys: action.categorys,
        departments: action.departments,
        audios: action.audios,
      }

    case FETCHING_DATA_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.error,
      }

    case START_CREATE_CATEGORY:
    case START_CREATE_DEPARTMENT:
    case START_CREATE_AUDIO:
    case START_DELETE_CATEGORY:
    case START_DELETE_DEPARTMENT:
    case START_DELETE_AUDIO:
    case START_UPDATE_CATEGORY:
    case START_UPDATE_DEPARTMENT:
    case START_UPDATE_AUDIO:
      if (state.updating) {
        return state;
      } else {
        return {
          ...state,
          updating: true,
          error: null,
        }
      }

    case CREATE_CATEGORY_FAILURE:
    case DELETE_CATEGORY_FAILURE:
    case UPDATE_CATEGORY_FAILURE:
    case CREATE_DEPARTMENT_FAILURE:
    case DELETE_DEPARTMENT_FAILURE:
    case UPDATE_DEPARTMENT_FAILURE:
    case CREATE_AUDIO_FAILURE:
    case DELETE_AUDIO_FAILURE:
    case UPDATE_AUDIO_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.error,
      }

    case CREATE_CATEGORY_SUCCESS:
    case DELETE_CATEGORY_SUCCESS:
    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        updating: false,
        categorys: action.categorys,
      }
    
    case CREATE_DEPARTMENT_SUCCESS:
    case DELETE_DEPARTMENT_SUCCESS:
    case UPDATE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        updating: false,
        departments: action.departments,
      }

    case CREATE_AUDIO_SUCCESS:
    case DELETE_AUDIO_SUCCESS:
    case UPDATE_AUDIO_SUCCESS:
      return {
        ...state,
        updating: false,
        audios: action.audios,
      }

    default:
      return state;
  }
};