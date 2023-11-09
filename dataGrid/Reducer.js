/* eslint-disable */

import { ACTION } from "./Actions";

export const reducer = (state, action) => {
    switch (action.type) {
      // case ACTION.SELECT_ROW:
      //   return { ...state, selectedRow: action.payload };
      case ACTION.FETCH_START:
        return { ...state, loading: true, error: "", rowData: ""};
      case ACTION.FETCH_SUCCESS_ROW_DATA:
        return { ...state, loading: false, rowData: action.payload.rows, columns: action.payload.columns };
        case ACTION.FETCH_SUCCESS_COLUMNS:
        return { ...state, loading: false, columns: action.payload };
      case ACTION.FETCH_ERROR:
        return { ...state, loading: false, error: action.payload};
      case ACTION.SET_PAGE_COUNT:
        return { ...state, pageCount: action.payload };
      case ACTION.SET_RECORD_COUNT:
        return { ...state, recordCount: action.payload };
      case ACTION.UPDATE_CURRENT_PAGE:
        if ((state.currentPage > 1 && action.payload < 0) || (state.currentPage < state.pageCount && action.payload > 0)) {
          return { ...state, currentPage: state.currentPage + action.payload };
        }
      case ACTION.SET_PAGE_SIZE:
        return { ...state, pageSize: action.payload };
      case ACTION.MOVE_TO_FIRST_PAGE:
        return { ...state, currentPage: 1 };
      case ACTION.MOVE_TO_LAST_PAGE:
        return { ...state, currentPage: action.payload };
      case ACTION.SET_ROWS_PER_PAGE:
        return { ...state, rowsPerPage: action.payload };
      case ACTION.UPDATE_ROW:
        return { ...state, rowData: action.payload };
      case ACTION.SORT_BY:
        return { ...state, sortBy: action.payload };
      case ACTION.SET_SORT_DIRECTION:
        return { ...state, sortDirection: action.payload };
      default:
        throw new Error();
    }
  }