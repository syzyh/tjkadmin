const initialState = {
  fetching: false,
  updating:false,
  error: null,
  discussions: [],
};

export const forumReducer = (state = initialState, action) => {
  switch(action.type) {
    case "start_fetching_discussion":
      return {
        ...state,
        fetching: true,
        error: null,
      }

    case "fetching_discussion_success":
        return {
          ...state,
          fetching: false,
          discussions: action.payload,
        };

    case "fetching_discussion_failure":
      return {
        ...state,
        fetching: false,
        error: action.error,
      }

    case "start_delete_discussion":
    case "start_delete_opinion":
      return {
        ...state,
        updating: true,
        error: null,
      }

      case "delete_discussion_failure":
      case "delete_opinion_failure":
        return {
          ...state,
          updating: false,
          error: action.error,
        }

      case "delete_discussion_success":
      case "delete_opinion_success":
        return {
          ...state,
          updating: false,
          discussions: action.payload,
        }

    default:
      return state;
  }
};