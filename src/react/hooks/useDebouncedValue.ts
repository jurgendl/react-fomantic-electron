import {useEffect, useState} from "react";

/**
 * Custom React hook to debounce a value.
 *
 * @template T - The type of the value to debounce.
 * @param {T} value - The value to debounce.
 * @param {number} [delay=500] - The debounce delay in milliseconds. Defaults to 500ms.
 * @returns {T} - The debounced value.
 *
 * @example
 TypeScript + React example:
 Shows a simple search input where `debouncedQuery` updates only after the user
 stops typing for 300ms. The debounced value is then used to trigger a fetch.

 ```tsx
 import React, {useEffect, useState} from 'react';
 import useDebouncedValue from './useDebouncedValue';

 function Search() {
   const [query, setQuery] = useState<string>('');
   const debouncedQuery = useDebouncedValue<string>(query, 300);

   useEffect(() => {
     if (!debouncedQuery) return;
     // Replace with your fetch/side-effect. Example:
     // fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
     //   .then(r => r.json())
     //   .then(results => console.log(results));
   }, [debouncedQuery]);

   return (
     <input
       value={query}
       onChange={(e) => setQuery(e.target.value)}
       placeholder="Type to search..."
     />
   );
 }
 ```
 */
export default function useDebouncedValue<T>(value: T, delay: number = 500) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(id);
	}, [value, delay]);
	return debounced;
}