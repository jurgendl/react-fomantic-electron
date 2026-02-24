import type {JSX} from "react";

/**
 * A React component that renders HTML content inside a `span` element.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.html - The HTML string to be rendered.
 *
 * @returns {JSX.Element} The rendered `span` element containing the HTML content.
 *
 * @example
```TypeScript
import HtmlView from "HtmlView";

<HtmlView html={html}/>
```
 */
export default function HtmlView({html}: { html: string }): JSX.Element {
	return (
		<span dangerouslySetInnerHTML={{__html: html}}></span>
	);
}