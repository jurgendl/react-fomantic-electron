import axios, {type AxiosRequestConfig, type AxiosResponseHeaders} from 'axios';
import {isAbortError, queryURLPart} from "@local/local-commons-utils";
import {createLogger} from "./logger.ts";

export function createAxiosInstance(baseURL: string, defaultContentType: string | undefined, defaultAccept: string | undefined, showErrorFn: (errorMessage: string) => void | undefined) {
	// Set config defaults when creating the instance
	if (!defaultContentType) defaultContentType = 'application/json';
	if (!defaultAccept) defaultAccept = 'application/json';
	const axiosInstance = axios.create({
		baseURL,
		//httpsAgent: false, // Disable HTTPS
		headers: {
			'Content-Type': defaultContentType || 'application/json',
			'Accept': defaultAccept || 'application/json',
		},
		paramsSerializer: {
			indexes: null, // 👈 don't use key[]=... for multiple values, use multiple key=value instead
		},
	});

	const LOGGER = createLogger("axios");

	function onError(data: any, error: any) {
		if (isAbortError(error)) throw error;

		let msg = "Error occured";
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			msg = error.response.statusText;
			LOGGER.error("axios", {
				...data,
				status: error.response.status,
				statusText: error.response.statusText,
				headers: error.response.headers,
				response: error.response.data
			});
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			const httpRequest = error.request as XMLHttpRequest;
			LOGGER.error("axios", {...data, httpRequest});
		} else {
			// Something happened in setting up the request that triggered an Error
			msg = error.message;
			LOGGER.error("axios", {...data, errorMessage: msg});
		}
		if (showErrorFn) {
			showErrorFn(msg);
		}
		return msg;
	}

	function curlCommand(method: string, url: string, queryParams: any, accept: string | undefined) {
		const methodStr = method === 'HEAD' ? '--head' : `-X ${method}`;
		const queryURLPartString = queryParams ? queryURLPart(queryParams) : "";
		const acceptString = method === 'HEAD' ? "" : `-H 'Accept: ${accept || defaultAccept}'`;
		return `curl ${methodStr} ${acceptString} '${baseURL}${url}${queryURLPartString}'`;
	}

	function curlCommandPayload(method: string, url: string, queryParams: any, accept: string | undefined, contentType: string | undefined, body: any) {
		const methodStr = `-X ${method}`;
		const bodyString = body ? "--json '" + JSON.stringify(body) + "'" : "";
		const contentTypeString = body ? `-H 'Content-Type: ${contentType || defaultContentType}'` : "";
		const queryURLPartString = queryParams ? queryURLPart(queryParams) : "";
		const acceptString = `-H 'Accept: ${accept || defaultAccept}'`;
		return `curl ${methodStr} ${contentTypeString} ${acceptString} '${baseURL}${url}${queryURLPartString}' ${bodyString}`;
	}

	function createConfig(contentType: string | undefined, accept: string | undefined, queryParams: Record<string, any> | undefined, abortSignal: AbortSignal | undefined) {
		const config: AxiosRequestConfig = {};
		if (queryParams) config.params = queryParams;
		if (contentType) config.headers = {"Content-Type": contentType};
		if (accept) config.headers = {"Accept": accept};
		if (abortSignal) config.signal = abortSignal;
		return config;
	}

	function headersToRecord(
		headers: AxiosResponseHeaders | Record<string, any>
	): Record<string, string> {
		const result: Record<string, string> = {};

		for (const [key, value] of Object.entries(headers)) {
			if (value == null) continue;

			if (Array.isArray(value)) {
				result[key] = value.join(", ");
			} else {
				result[key] = String(value);
			}
		}

		return result;
	}

	function dateDiff(date1: Date, date2: Date = new Date()) {
		return date2.getTime() - date1.getTime();
	}

	async function HEAD<T>(url: string, queryParams?: any): Promise<Record<string, string>> {
		const start = new Date();
		const config = createConfig(undefined, undefined, queryParams, undefined);
		const _ = {
			curlCommand: curlCommand('HEAD', url, queryParams, undefined),
			queryParams
		};
		try {
			LOGGER.info("HEAD", _);
			const response = await axiosInstance.head<T>(url, config);
			const headerRecord = headersToRecord(response.headers);
			LOGGER.info("HEAD", {
				..._,
				duration: dateDiff(start),
				status: response.status,
				statusText: response.statusText,
				headers: headerRecord
			});
			return headerRecord;
		} catch (error: any) {
			onError(_, error);
			throw error;
		}
	}

	async function GET<T>(url: string, queryParams?: any, accept?: string | undefined, abortSignal?: AbortSignal): Promise<T> {
		const start = new Date();
		const config = createConfig(undefined, accept, queryParams, abortSignal);
		const _ = {
			curlCommand: curlCommand('GET', url, queryParams, accept),
			accept,
			queryParams,
			abortSignal: abortSignal != null
		};
		try {
			LOGGER.info("GET", _);
			const response = await axiosInstance.get<T>(url, config);
			const headerRecord = headersToRecord(response.headers);
			LOGGER.info("GET", {
				..._,
				duration: dateDiff(start),
				status: response.status,
				statusText: response.statusText,
				response: response.data != null,
				headers: headerRecord
			});
			return response.data;
		} catch (error: any) {
			onError(_, error);
			throw error;
		}
	}

	async function DELETE<T>(url: string, queryParams?: any, accept?: string | undefined): Promise<T> {
		const start = new Date();
		const config = createConfig(undefined, accept, queryParams, undefined);
		const _ = {
			curlCommand: curlCommand('DELETE', url, queryParams, accept),
			accept,
			queryParams
		};
		try {
			LOGGER.info("DELETE", _);
			const response = await axiosInstance.delete<T>(url, config);
			const headerRecord = headersToRecord(response.headers);
			LOGGER.info("DELETE", {
				..._,
				duration: dateDiff(start),
				status: response.status,
				statusText: response.statusText,
				response: response.data != null,
				headers: headerRecord
			});
			return response.data;
		} catch (error: any) {
			onError(_, error);
			throw error;
		}
	}

	async function POST<T>(url: string, body: any, queryParams?: any, contentType?: string | undefined, accept?: string | undefined): Promise<T> {
		if (body == null) throw new Error("body is undefined");
		const start = new Date();
		const config = createConfig(contentType, accept, queryParams, undefined);
		const _ = {
			curlCommand: curlCommandPayload('POST', url, queryParams, accept, contentType, body),
			accept,
			contentType,
			queryParams
		};
		try {
			LOGGER.info("POST", _);
			const response = await axiosInstance.post<T>(url, body, config);
			const headerRecord = headersToRecord(response.headers);
			LOGGER.info("POST", {
				..._,
				duration: dateDiff(start),
				status: response.status,
				statusText: response.statusText,
				response: response.data != null,
				headers: headerRecord
			});
			return response.data;
		} catch (error: any) {
			onError(_, error);
			throw error;
		}
	}

	async function PUT<T>(url: string, body: any, queryParams?: any, contentType?: string | undefined, accept?: string | undefined): Promise<T> {
		if (body == null) throw new Error("body is undefined");
		const start = new Date();
		const config = createConfig(contentType, accept, queryParams, undefined);
		const _ = {
			curlCommand: curlCommandPayload('PUT', url, queryParams, accept, contentType, body),
			accept,
			contentType,
			queryParams
		};
		try {
			LOGGER.info("PUT", _);
			const response = await axiosInstance.put<T>(url, body, config);
			const headerRecord = headersToRecord(response.headers);
			LOGGER.info("PUT", {
				..._,
				duration: dateDiff(start),
				status: response.status,
				statusText: response.statusText,
				response: response.data != null,
				headers: headerRecord
			});
			return response.data;
		} catch (error: any) {
			onError(_, error);
			throw error;
		}
	}

	return {baseURL, HEAD, GET, DELETE, PUT, POST};
}

/*
axiosInstance.interceptors.response.use(
	response => response,
	error => {
		LOGGER.error('API call failed:', error);
		// Handle specific error cases
		if (error.response.status === 401) {
			// Unauthorized
		} else if (error.response.status === 404) {
			// Not found
		}
		return Promise.reject(error);
	}
);
*/

/*
apiClient.interceptors.request.use(
  config => {
    // Add authorization token to every request
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
*/

/*export const fetcher = <T>(url: string, onrejected?: ((reason: any) => (T | PromiseLike<T>)) | null | undefined): Promise<T> =>
	fetch(url)
		.then(res => {
			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
			return res.json() as Promise<T>;
		})
		.catch(onrejected);

export const fetchAxios = <T>(url: string, onrejected?: ((reason: any) => (void | PromiseLike<void>)) | null | undefined): Promise<T | void> =>
	axios
		.get<T>(url)
		.then(res => res.data)
		.catch(onrejected);*/
