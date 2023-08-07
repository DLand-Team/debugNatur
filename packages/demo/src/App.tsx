import React, { lazy, Suspense } from "react";
import "./App.scss";
import { Provider } from "natur";
import { store } from "./stores/index";
import Demo from './pages/demo'
function App() {
	return (
		<Provider store={store}>
			<Demo/>
		</Provider>
	);
}

export default App;
