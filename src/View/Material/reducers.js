import {
  START_FETCHING_MATERIAL,
  FETCHING_MATERIAL_SUCCESS,
  FETCHING_MATERIAL_FAILURE,

  CREATE_GROUP_FAILURE,
  CREATE_GROUP_SUCCESS,
  START_CREATE_GROUP,

  START_DELETE_GROUP,
  DELETE_GROUP_FAILURE,
  DELETE_GROUP_SUCCESS,

  START_RENAME_GROUP,
  RENAME_GROUP_FAILURE,
  RENAME_GROUP_SUCCESS,

  START_UPLOAD_MATERIAL,
  UPLOAD_MATERIAL_FAILURE,
  UPLOAD_MATERIAL_SUCCESS,

  START_DELETE_MATERIAL,
  DELETE_MATERIAL_FAILURE,
  DELETE_MATERIAL_SUCCESS,

  START_RENAME_MATERIAL,
  RENAME_MATERIAL_FAILURE,
  RENAME_MATERIAL_SUCCESS,

  START_SWAP_GROUP,
  SWAP_GROUP_FAILURE,
  SWAP_GROUP_SUCCESS,
} from './constants.js';

const initialState = {
  fetchingMaterial: true,
  updating: false,
  error: null,
  material: [],
  groups: [],
}

export const materialReducer = (state = initialState, action) => {
  switch(action.type) {
    case START_FETCHING_MATERIAL:
      return {
        ...state,
        fetchingMaterial: true,
        error: null,
      };
    
    case START_CREATE_GROUP:
    case START_RENAME_GROUP:
    case START_DELETE_GROUP:
    case START_UPLOAD_MATERIAL:
    case START_DELETE_MATERIAL:
    case START_RENAME_MATERIAL:
    case START_SWAP_GROUP:
      if (state.updating) {
        return state
      } else {
        return {
          ...state,
          updating: true,
          error: null,
        };
      }

    case FETCHING_MATERIAL_FAILURE:
      return {
        ...state,
        fetchingMaterial: false,
        error: action.payload,
      };

    case CREATE_GROUP_FAILURE:
    case DELETE_GROUP_FAILURE:
    case RENAME_GROUP_FAILURE:
    case UPLOAD_MATERIAL_FAILURE:
    case DELETE_MATERIAL_FAILURE:
    case RENAME_MATERIAL_FAILURE:
    case SWAP_GROUP_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload,
      };

    case FETCHING_MATERIAL_SUCCESS:
      return {
        ...state,
        fetchingMaterial: false,
        error: null,
        groups: action.groups,
        material: action.material,
      };

    case CREATE_GROUP_SUCCESS:
    case DELETE_GROUP_SUCCESS:
    case RENAME_GROUP_SUCCESS:
      return {
        ...state,
        updating: false,
        groups: action.payload,
      };

    case DELETE_MATERIAL_SUCCESS:
    case RENAME_MATERIAL_SUCCESS:
    case SWAP_GROUP_SUCCESS:
      return {
        ...state,
        updating: false,
        material: action.payload,
      }

    case UPLOAD_MATERIAL_SUCCESS:
      return {
        ...state,
        updating: false,
        material: [...state.material, action.payload],
      }

    default:
      return state;
  }
};