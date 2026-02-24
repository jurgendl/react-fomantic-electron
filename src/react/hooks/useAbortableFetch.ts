import {useCallback, useEffect, useRef, useState} from "react";

type Status = "idle" | "loading" | "success" | "error" | "aborted";

type Parser<T> = (response: Response) => Promise<T>;

function isAbortError(e: unknown): e is DOMException {
	return e instanceof DOMException && e.name === "AbortError";
}

/**
 * Custom React hook to perform fetch requests with abort functionality.
 *
 * @template T - The type of the data returned by the fetch request.
 * @returns {Object} - An object containing the following properties:
 *   - `run`: A function to initiate the fetch request.
 *   - `abort`: A function to abort the ongoing fetch request.
 *   - `status`: The current status of the fetch request ("idle", "loading", "success", "error", "aborted").
 *   - `data`: The data returned by the fetch request, or `null` if no data is available.
 *   - `error`: The error message, or `null` if no error occurred.
 *
 * @example
 Example usage in a functional component:

 ```tsx
 import React, {useEffect} from 'react';
 import {useAbortableFetch} from './useAbortableFetch';

 function DataFetcher() {
   const {run, abort, status, data, error} = useAbortableFetch<any>();

   useEffect(() => {
     run('https://jsonplaceholder.typicode.com/posts')
       .catch(console.error);

     return () => abort(); // Cleanup on unmount
   }, [run, abort]);

   return (
     <div>
       <p>Status: {status}</p>
       {error && <p>Error: {error}</p>}
       {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
     </div>
   );
 }
 ```
 */
export function useAbortableFetch<T>() {
	const controllerRef = useRef<AbortController | null>(null);
	const [status, setStatus] = useState<Status>("idle");
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);

	/*const abort = useCallback(() => {
		if (!controllerRef.current) return;
		controllerRef.current.abort();
		controllerRef.current = null;
		setStatus("aborted");
	}, []);*/
	const abort = useCallback(() => {
		if (status !== "loading") return;
		controllerRef.current?.abort();
		controllerRef.current = null;
		setStatus("aborted");
	}, [status]);

	const run = useCallback(async (
		input: RequestInfo,
		parse?: Parser<T>,
		init?: RequestInit
	) => {
		// Abort any previous request
		controllerRef.current?.abort();

		const controller = new AbortController(); // ***
		controllerRef.current = controller;

		setStatus("loading");
		setData(null); // reset data from previous runs
		setError(null);

		try {
			const response = await fetch(input, {
				...init,
				signal: controller.signal, // *** Always pass the local variable, never the ref. (fixes race condition)
			});
			controllerRef.current = null; // --- quick

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			let result;
			if (parse) {
				result = await parse(response);
				setData(result);
			}
			setStatus("success");
			return result;
		} catch (e) {
			if (isAbortError(e)) {
				setStatus("aborted");
				return;
			}
			setError(e instanceof Error ? `${e.name}: ${e.message}` : String(e));
			setStatus("error");
			throw e;
		} finally {
			controllerRef.current = null; // --- always
		}
	}, []);

	useEffect(() => {
		// Abort on unmount
		return () => controllerRef.current?.abort();
	}, []);

	return {
		run,
		abort,
		status,
		data,
		error,
	};
}
