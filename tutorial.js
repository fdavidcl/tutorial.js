/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var Tutorial = function(args) {
	// Default option values
	var container, first, back_button, history;

	var set_vars = function() {
		container = document.querySelector(".tutorialjs") ? document.querySelector(".tutorialjs") : document.querySelector("body");
		first = "first.json";
		back_button = "Back";
		history = [];

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

	var gen_html = function() {
		var w = document.createElement("div");
			w.className = "tutorialjs-wrapper";
		var b = document.createElement("a");
			b.className = "tutorialjs-button tutorialjs-back tutorialjs-hide";
			b.href = "javascript:;";
			b.textContent = back_button;
			b.onclick = this.go_back;
		var s = document.createElement("div");
			s.className = "tutorialjs-step";
		var h = document.createElement("header");
			h.className = "tutorialjs-header";
		var t = document.createElement("div");
			t.className = "tutorialjs-text";
		var o = document.createElement("div");
			o.className = "tutorialjs-options";
		var i = document.createElement("img");
			i.className = "tutorialjs-image";

		s.appendChild(h);
		s.appendChild(t);
		s.appendChild(o);
		w.appendChild(b);
		w.appendChild(s);
		w.appendChild(i);
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

	this.go_back = function() {
		history.pop(); // Remove current step from history
		ajax_get(history.pop(), display);
		if (history.length == 1) document.querySelector(".tutorialjs-back").classList.addClass("tutorialjs-hide");
	}

	var display = function(url, step) {
		container.querySelector(".tutorialjs-header").textContent = step.title;
		container.querySelector(".tutorialjs-text").innerHTML = step.text;
		container.querySelector(".tutorialjs-image").src = step.image;

		for (o in step.options) {
			var nbut = document.createElement("a");
			nbut.innerHTML = o;

			if (step.options[o].test(/[^?#]+\.json/)) {
				nbut.href = "javascript:;";
				nbut.onclick = function() {
					ajax_get(step.url, display);
				};
			} else {
				nbut.href = step.url;
			}

			container.querySelector(".tutorialjs-options").appendChild(nbut)
		}

		history.push(url);
		if (history.length > 1) document.querySelector(".tutorialjs-back").classList.removeClass("tutorialjs-hide");
	}

	this.start = function() {
		set_vars();
		gen_html();
		ajax_get(first, display);
	};

};