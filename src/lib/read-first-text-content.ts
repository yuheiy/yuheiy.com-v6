import { Window } from "happy-dom";

export function readFirstTextContent(html: string) {
	const {
		document: { body },
	} = new Window();

	body.innerHTML = html;
	return body.querySelector("p")?.textContent;
}
