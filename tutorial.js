/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* tutorial.js
   Version 0.1 */

/* TODO
	Support changing step with location.hash
	*/

var Tutorial = function(args) {
	// Default option values
	var container, first, back_button, history, enable_back;

	var set_vars = function() {
		container = document.querySelector(".tutorialjs") ? document.querySelector(".tutorialjs") : document.querySelector("body");
		first = "first.json";
		back_button = "Back";
		history = [];
		enable_back = true;

		if (args != null) {
			if (typeof args == "object") {
				if (args.container) container = args.container;
				if (args.first) first = args.first;
				if (args.back_button) back_button = args.back_button;
			} else if (typeof args == "string") {
				first = args;
			}
		}
	}

	var go_back = function() {
		history.pop(); // Remove current step from history
		ajax_get(history.pop(), display);
		if (history.length < 2) this.classList.add("tutorialjs-hide");
	}

	var gen_html = function() {
		var w = document.createElement("div");
			w.className = "tutorialjs-wrapper";
		var s = document.createElement("div");
			s.className = "tutorialjs-step";
		var h = document.createElement("div");
			h.className = "tutorialjs-header";
		var t = document.createElement("div");
			t.className = "tutorialjs-text";
		var o = document.createElement("div");
			o.className = "tutorialjs-options";
		var i = document.createElement("img");
			i.className = "tutorialjs-image";

		s.appendChild(t);
		s.appendChild(o);
		w.appendChild(h);
		w.appendChild(i);
		w.appendChild(s);
		container.appendChild(w);
	}

	var ajax_get = function(url, callback) {
		if (window.XMLHttpRequest) {
			var xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				callback(url, JSON.parse(xmlhttp.responseText));
				//console.log(xmlhttp.responseText);
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}

	var display = function(url, step) {
		container.querySelector(".tutorialjs-header").textContent = step.title;
		container.querySelector(".tutorialjs-text").innerHTML = step.text;
		container.querySelector(".tutorialjs-image").src = step.image;

		var button_list = container.querySelector(".tutorialjs-options");
		button_list.innerHTML = ""; // Remove older buttons

		if (history.length > 0 && enable_back) { 
			var back = document.createElement("a");
				back.className = "tutorialjs-button tutorialjs-back";
				back.href = "javascript:;";
				back.textContent = back_button;
				back.onclick = go_back;

			button_list.appendChild(back);
		}

		for (o in step.options) {
			var current_url = step.options[o];
			var nbut = document.createElement("a");
			nbut.className = "tutorialjs-button";
			nbut.innerHTML = o;

			if (/[^?#]+\.json/.test(current_url)) {
				nbut.href = "javascript:;";
				nbut.setAttribute("data-url", current_url);
				nbut.onclick = function() {
					var b = this;
					b.classList.add("tutorialjs-loading");
					ajax_get(this.getAttribute("data-url"), function(u, s) {
						display(u, s);
						b.classList.remove("tutorialjs-loading");
					});
				};
			} else {
				nbut.href = current_url;
			}

			var br = document.createElement("br");

			button_list.appendChild(nbut);
			button_list.appendChild(br);
		}

		history.push(url);
		if (history.length > 1) document.querySelector(".tutorialjs-back").classList.remove("tutorialjs-hide");
	}

	this.start = function() {
		set_vars();
		gen_html();
		ajax_get(first, display);
	};

};