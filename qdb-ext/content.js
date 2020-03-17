//we did a lot of workarounds here to deal with how elements load dinamically on the dom, could probably use some refactoring
// chrome.tabs.onUpdated.addListener(function (){console.log("test")});
//detects surface

observeSummary(detect_surface());

var eval_surface;

function detect_surface(){
	if (window.location.href.startsWith("https://hume.google.com/eval/search?")){
		
		eval_surface = "eval-search";

		var elementToObserve = document
			.querySelector("#eval-app").shadowRoot
			.querySelector(eval_surface).shadowRoot
			.querySelector("eval-sxs-layout > div.iron-selected > eval-summary").shadowRoot;

		// observeSummary(elementToObserve);
	}
	else if (window.location.href.startsWith("https://hume.google.com/eval/assistant")){
		
		eval_surface = "eval-assistant";

		var elementToObserve = document
			.querySelector("#eval-app").shadowRoot
			.querySelector(eval_surface).shadowRoot;
			// .querySelector("eval-sxs-layout > div.iron-selected > eval-summary").shadowRoot
			// .querySelector("#test-side").shadowRoot;

		// observeSummary(elementToObserve);
	}

	return elementToObserve;

}


function observeSummary(elementToObserve){
	// create a new instance of `MutationObserver` named `observer`, 
	// passing it a callback function
	let observer = new MutationObserver(function() {
		console.log('callback that runs when observer is triggered');
		// observer.disconnect();

		open_ratings();

		setTimeout(function(){
			triggerQueryUnderstanding();
		},0);

	});
	// call "observe" on that MutationObserver instance, 
	// passing it the element to observe, and the options object
	observer.observe(elementToObserve, {childList: true, subtree: true});

};



document.getElementById("system-picker-box").onclick = function(){
	// console.log("click");
	detect_surface();
};


function open_ratings(){ //this function toggles the rating UI, but shouldn't be called right now since it triggers even on the
	if(window.location.href.includes("samply")){

		if(!document.querySelector("#eval-app").shadowRoot.querySelector(eval_surface).shadowRoot.querySelector("#ratings-toggle").hasAttribute("active")){

			document.querySelector("#eval-app").shadowRoot
				.querySelector(eval_surface).shadowRoot
				.querySelector("#ratings-toggle").click();

		}

	}
}


// var first_load = true; 

function triggerQueryUnderstanding(){

	let summary_path = document
			.querySelector("#eval-app").shadowRoot
			.querySelector(eval_surface).shadowRoot
			.querySelector("eval-sxs-layout > div.iron-selected > eval-summary").shadowRoot
			.querySelector("#test-side").shadowRoot;

	let qref_understanding_button = summary_path
		.querySelector("#annotation-head > div.check-head-content > paper-toggle-button");

	//workaround (without it, qref understanding closes fast when on first click to open it)
	if (qref_understanding_button.getAttribute("aria-pressed") == "true"){
		// if (!first_load){
			qref_understanding_button.click();
		// }
		// else {
		// 	first_load = false;
		// 	console.log("first_load false")
		// }
	}

	qref_understanding_button.onclick = function(){

		let paper_toggle_button = summary_path 
			.querySelector("#annotation-body > div:nth-child(1) > eval-qrewrite").shadowRoot
			.querySelector("eval-annotations").shadowRoot
			.querySelector("table:nth-child(2) > thead > tr > th > div.header-toggles > paper-toggle-button");
		
		let paper_icon_button = summary_path 
			.querySelector("#annotation-body > div:nth-child(1) > eval-qrewrite").shadowRoot
			.querySelector("eval-annotations").shadowRoot
			.querySelector("div:nth-child(3) > div.table-header > div.header-toggles > paper-icon-button");
		
		paper_toggle_button.click();
		paper_icon_button.click();

		let qref_mentions = summary_path 
			.querySelector("#annotation-body > div:nth-child(1) > eval-qrewrite").shadowRoot
			.querySelector("eval-annotations").shadowRoot
			.querySelector("#qref-elem > div > span > div.qref > details:nth-child(1)");
		
		qref_mentions.toggleAttribute("open");

		let mentions_node_list = summary_path 
				.querySelector("#annotation-body > div:nth-child(1) > eval-qrewrite").shadowRoot
				.querySelector("eval-annotations").shadowRoot
				.querySelectorAll("#qref-elem > div > span > div.qref > details:nth-child(1) > ul > li > ul > li > a")

		mentions_node_list.forEach((item) => {

			item.setAttribute('target', '_blank');
			
			var button_copy = document.createElement("paper-icon-button");

			button_copy.setAttribute("role","button");
			button_copy.setAttribute("class","copy-mid");
			button_copy.setAttribute("icon","content-copy")

			item.after(button_copy);

			button_copy.style.width = "20px";
			button_copy.style.height = "auto";
			button_copy.style.padding = "0";
			button_copy.style.margin = "2px 2px 0 6px";

			button_copy.onclick = function () {

				let mid = item.innerText;
				const el = document.createElement('textarea');
			    el.value = mid;
			    document.body.appendChild(el);
			    el.select();
			    document.execCommand('copy');
			    document.body.removeChild(el);

			    var s = document.createElement('script');
				s.src = chrome.runtime.getURL('trigger-paper.js'); //web_accessible_resources 
				s.onload = function() {
				    this.remove();
				};

				(document.head || document.documentElement).appendChild(s);


				let textarea = document
				.querySelector("#eval-app").shadowRoot
				.querySelector(eval_surface).shadowRoot
				.querySelector("eval-sxs-layout > eval-rating-panel").shadowRoot
				.querySelector("#comments").shadowRoot
				.querySelector("#textarea");


				if (textarea.value == ""){
					textarea.value = mid;
				}
				else{
					textarea.value += "\n" + mid;
				}


			};


		}); 

	};
};

// function main(){

// 	observeSummary(detect_surface());

// 	setTimeout(function(){
// 		triggerQueryUnderstanding();
// 	},0);

// };

// main();