import * as React from 'react';
import {type Dispatch, type SetStateAction, useEffect, useRef, useState} from 'react';
import './App.scss';
import styles from "./App.module.scss";
import {createLogger} from "../utils/logger.ts";

function App() {
	const LOGGER = createLogger("App");
	LOGGER.warn("warn");
	LOGGER.info("info");
	LOGGER.debug("debug");
	LOGGER.trace("trace");

	return (
		<>
			<div className="ui segment">
				This is <span className="ui red text">red</span> inline text and this is <span
				className="ui blue text">blue</span> inline text and this is <span
				className="ui purple text">purple</span> inline text
			</div>
			<div className={styles.exampleStyle}>Hello World!</div>
		</>
	);
}

export default App
