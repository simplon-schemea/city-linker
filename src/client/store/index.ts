import { createStore } from "redux";
import { reducer } from "./reducer";
import { devToolsEnhancer } from "redux-devtools-extension";
import { actions } from "./actions";

export const store = createStore(reducer, devToolsEnhancer({
    actionCreators: actions,
}));
