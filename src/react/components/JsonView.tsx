import type {JSX} from "react";

/**
 * A React component that renders JSON content inside a `code` element.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.json - The JSON string to be rendered as HTML.
 *
 * @returns {JSX.Element} The rendered `code` element containing the JSON content.
 *
 * @example
```TypeScript
import JsonView from "JsonView";

<JsonView json={JSON.stringify(object)}/>
```
 */
export default function JsonView({json}: { json: string }): JSX.Element {
	return (
		<code dangerouslySetInnerHTML={{__html: json}}></code>
	);
}