import { all, fork } from "redux-saga/effects";
import navigationSaga from "./navigationSaga";
import userSaga from "./userSaga";

// We `fork()` these tasks so they execute in the background.
export function* rootSaga() {
    yield all([fork(navigationSaga), fork(userSaga)]);
}
