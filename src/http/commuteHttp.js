/**
 * 출근기록을 가져오는 fetch 함수를 표시 함
 */

import { commuteActions } from "../store/toolkit/slice/commuteSlice";
import { tokenExpire } from "../utils/loginUtil";

// const url = "http://43.202.29.221";
const url = "http://localhost:8080";

export const getCommuteLog = (
  token,
  commuteType = null,
  searchType = null,
  searchKeyword = null
) => {
  return async (dispatch) => {
    const response = await fetch(
      url +
        `/api/commute?commuteType=${commuteType}&searchType=${searchType}&searchKeyword=${searchKeyword}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();
    dispatch(tokenExpire(json));
    dispatch(commuteActions.set(json));
  };
};
export const getOneCommute = (token) => {
  return async (dispatch) => {
    const response = await fetch(`${url}/api/commute/one`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    dispatch(commuteActions.setCommute(json));
  };
};
