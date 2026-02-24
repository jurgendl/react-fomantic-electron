export const scrollWindowToTop = (scrollBehaviorType: ScrollBehavior = "smooth") => {
	console.log("scrollWindowToTop", scrollBehaviorType);
	window.scrollTo({top: 0, behavior: scrollBehaviorType});
}

export const scrollWindowToBottom = (scrollBehaviorType: ScrollBehavior = "smooth") => {
	console.log("scrollWindowToBottom", scrollBehaviorType);
	window.scrollTo({top: document.documentElement.scrollHeight, behavior: scrollBehaviorType});
}

export const scrollElementToTop = (element: HTMLElement, scrollBehaviorType: ScrollBehavior = "smooth") => {
	console.log("scrollElementToTop", scrollBehaviorType);
	element.scrollTo({top: 0, behavior: scrollBehaviorType});
};

export const scrollElementToBottom = (element: HTMLElement, scrollBehaviorType: ScrollBehavior = "smooth") => {
	console.log("scrollWindowToBottom", scrollBehaviorType);
	element.scrollTo({top: element.scrollHeight, behavior: scrollBehaviorType});
};

export const jumpToElement = (elementOrId: string | HTMLElement, scrollToElementBehaviorType: ScrollLogicalPosition, scrollBehaviorType: ScrollBehavior = "smooth") => {
	console.log("jumpToElement", scrollBehaviorType, scrollToElementBehaviorType);
	const element =
		typeof elementOrId === "string"
			? document.getElementById(elementOrId)
			: elementOrId;
	if (!element) return;
	const cfg = {behavior: scrollBehaviorType, block: scrollToElementBehaviorType};
	element.scrollIntoView(cfg);
	// fixes not going to the correct position when lazy loading images
	setTimeout(() => element.scrollIntoView(cfg), 500);
	//const y = element.getBoundingClientRect().top + window.scrollY;
	//window.scrollTo({top: y, behavior);
}
{
	//alternative
	// fixes not going to the correct position when lazy loading images
	//listen to onLoad
	/*
	<LazyLoadImage
	  className="ui rounded bordered image"
	  src={...}
	  placeholderType="effect"
	  effectType="blur"
	  onLoad={(e) => {
		e.currentTarget.scrollIntoView({
		  behavior: "auto",
		  block: "center"
		});
	  }}
	/>
	 */
}
{
	//alternative
	// fixes not going to the correct position when lazy loading images
	//Prevent layout shift
	/*
	.image {
	  aspect-ratio: 4 / 3;
	  object-fit: cover;
	}
	 */
	//or
	/*
	<LazyLoadImage
	  width={300}
	  height={225}
	  ...
	/>
	 */
}