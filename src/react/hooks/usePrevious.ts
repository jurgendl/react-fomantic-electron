import {useEffect, useRef} from "react";

/**
 * Custom React hook to get the previous value of a state or prop.
 *
 * @template T - The type of the value to track.
 * @param {T} value - The current value to track.
 * @returns {T | undefined} - The previous value of the tracked state or prop, or undefined if it is the first render.
 *
 * @example
 Example usage in a functional component:

 ```tsx
 import React, {useState} from 'react';
 import usePrevious from './usePrevious';

 function Counter() {
   const [count, setCount] = useState(0);
   const prevCount = usePrevious(count);

   return (
     <div>
       <p>Current count: {count}</p>
       <p>Previous count: {prevCount}</p>
       <button onClick={() => setCount(count + 1)}>Increment</button>
     </div>
   );
 }
 ```
 *
 * @example
 A more detailed example showing how to compare previous and current values
 inside a useEffect. This is useful for reacting to changes (e.g., logging,
 animation triggers, or conditional side-effects) while ignoring the first
 render where there is no previous value yet.

 ```tsx
 import React, {useEffect, useState} from 'react';
 import usePrevious from './usePrevious';

 interface ValueWatcherProps { value: number }

 function ValueWatcher({ value }: ValueWatcherProps) {
   const prevValue = usePrevious<number>(value);

   useEffect(() => {
     // prevValue is undefined on first render — skip handling in that case
     if (prevValue === undefined) return;
     if (prevValue !== value) {
       console.log(`Value changed from ${prevValue} to ${value}`);
     }
   }, [prevValue, value]);

   return (
     <div>
       <p>Current: {value}</p>
       <p>Previous: {prevValue ?? '—'}</p>
     </div>
   );
 }
 ```
 */
export default function usePrevious<T>(value: T): T | undefined {
	const ref = useRef<T | undefined>(undefined);
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
}