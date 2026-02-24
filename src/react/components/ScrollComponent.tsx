import {type JSX, type RefObject, useEffect, useState} from "react";
import {
	scrollElementToTop,
	scrollElementToBottom,
	scrollWindowToTop,
	scrollWindowToBottom
} from "./ScrollFunctions";

interface ScrollComponentProps {
	componentToScrollRef: RefObject<HTMLElement | null> | undefined;
}

/**
 * ScrollComponent
 *
 * This component provides buttons to scroll to the top or bottom of a given element or the window.
 * It listens to the scroll events of the provided element or the window and determines whether the user
 * is at the top or bottom of the scrollable area.
 *
 * @param {Object} props - The properties object.
 * @param {RefObject<HTMLElement | null> | undefined} props.componentToScrollRef - A React ref object pointing to the element to scroll. If undefined, the window is used.
 *
 * @returns {JSX.Element} A fixed-position component with buttons to scroll to the top or bottom.
 *
 * @example
 * import ScrollComponent from 'ScrollComponent';
 * import { useRef } from 'react';
 *
 * function App() {
 *   const ref = useRef(null);
 *
 *   return (
 *     <div>
 *       <div ref={ref} style={{ height: '300px', overflow: 'auto' }}>
 *         <p>Content goes here...</p>
 *       </div>
 *       <ScrollComponent componentToScrollRef={ref} />
 *     </div>
 *   );
 * }
 */
export default function ScrollComponent({componentToScrollRef}: ScrollComponentProps): JSX.Element {
	const [atTop, setAtTop] = useState(true);
	const [atBottom, setAtBottom] = useState(false);


	useEffect(() => {
		if (componentToScrollRef) { // scrollabe component is not the main window
			const componentToScroll = componentToScrollRef.current;
			if (!componentToScroll) return; // scrollable component is not visible
			const onScroll = () => {
				const scrollTop = componentToScroll.scrollTop;
				const height = componentToScroll.clientHeight;
				const scrollHeight = componentToScroll.scrollHeight;
				setAtTop(scrollTop <= 0);
				setAtBottom(scrollTop + height >= scrollHeight - 1);
			};
			onScroll();
			componentToScroll.addEventListener("scroll", onScroll);
			return () => componentToScroll.removeEventListener("scroll", onScroll);
		} else { // scrollabe component is the main window
			const onScroll = () => {
				const scrollTop = window.scrollY;
				const windowHeight = window.innerHeight;
				const docHeight = document.documentElement.scrollHeight;
				setAtTop(scrollTop === 0);
				setAtBottom(scrollTop + windowHeight >= docHeight - 1);
			};
			onScroll();
			window.addEventListener("scroll", onScroll);
			return () => window.removeEventListener("scroll", onScroll);
		}
	}, [componentToScrollRef]);

	function scrollToTop() {
		if (componentToScrollRef) {
			if (componentToScrollRef.current) {
				scrollElementToTop(componentToScrollRef.current);
			}
		} else {
			scrollWindowToTop();
		}
	}

	function scrollToBottom() {
		if (componentToScrollRef) {
			if (componentToScrollRef.current) {
				scrollElementToBottom(componentToScrollRef.current);
			}
		} else {
			scrollWindowToBottom();
		}
	}

	return (<>
		{!componentToScrollRef || componentToScrollRef.current && <>
            <div className="fixed bottom-4 right-4 flex gap-1"
                 style={{zIndex: 1000}}>
				{!atTop && (
					<button onClick={() => scrollToTop()}
							className="ui icon button">
						<i className="angle double up icon"></i>
					</button>
				)}
				{!atBottom && (
					<button onClick={() => scrollToBottom()}
							className="ui icon button">
						<i className="angle double down icon"></i>
					</button>
				)}
            </div>
        </>}
	</>);
}