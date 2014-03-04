/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* tutorial.js - http://fdavidcl.github.io/tutorial.js/
   Version 0.1 */

/**
 * Tutorial prototype
 * usage:
 *	* var mytut = new Tutorial(); - new object will be created, assuming:
 *		- An existing div.tutorialjs (or else the tutorial will be displayed in the body)
 *		- First JSON step to load is "first.json" on current directory
 *		- No back buttons will be displayed
 *
 *	* var mytut = new Tutorial("myfirststep.json"); - will assume everything except the first JSON file.
 *
 *	* var mytut = new Tutorial({
 *		  first: "myfirststep.json",
 *		  container: document.getElementById("tutorial_container"),
 *		  back_button: "Back",
 *		  enable_back: true
 *	  }); - all arguments are optional and will be given default values if not provided
 *
 *	mytut.start() will generate the HTML code and load the first step of the tutorial
 */
var Tutorial = function(args) {

	/**
	 * Hash prototype (not accesible from outside Tutorial)
	 */
	var Hash = function(hasharg) {
		if (typeof hasharg == "string") {
			return (location.hash.indexOf("#")==0 ? location.hash.split(":")[0] : "#") + ":" + hasharg;
		} else if (typeof hasharg == "object") {
			var current = ["", ""];
			var callbackfunction = hasharg.onchange ? hasharg.onchange : function(a){};

			var getHashes = function() {
				var h = location.hash;
				if (h.indexOf("#") > -1) h = h.replace("#", "");
				return (h.indexOf(":") > -1) ? h.split(":") : [h, ""];
			}

			this.get = function() {
				return current[1];
			}

			this.set = function(newright) {
				location.hash = "#" + current[0] + ":" + newright;
			}

			var handleChange = function() {
				var newhash = getHashes();

				if (newhash[1] != current[1]) {
					if (newhash[0] == current[0]) {
						current = newhash;
						callbackfunction(current[1]);
					} else { 
						current[0] = newhash[0];
						location.hash = "#" + newhash[0] + ":" + current[1];	// This launches a new hashchange event but 
																				// is discarded by this function.
					}
				} else if (newhash[0] != current[0]) {
					current = newhash;
				}
			};

			window.addEventListener("hashchange", handleChange);
			window.addEventListener("load", handleChange);
			handleChange();
		}

		return this;
	};

	var container, first, back_button, history, enable_back;

	var set_vars = function() {
		container = document.querySelector(".tutorialjs") ? document.querySelector(".tutorialjs") : document.querySelector("body");
		first = "first.json";
		back_button = "Back";
		history = [];
		enable_back = false; // No longer needed: users can use the 'back' button on the browser.

		if (args != null) {
			if (typeof args == "object") {
				if (args.container) container = args.container;
				if (args.first) first = args.first;
				if (args.back_button) back_button = args.back_button;
			} else if (typeof args == "string") {
				first = args;
			} // else Throw new Error...
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
				back.href = Hash(history[history.length - 1]);
				back.textContent = back_button;

			button_list.appendChild(back);
		}

		for (o in step.options) {
			var current_url = step.options[o];
			var nbut = document.createElement("a");
				nbut.className = "tutorialjs-button";
				nbut.innerHTML = o;
				nbut.href = /[^?#]+\.json/.test(current_url) ? Hash(current_url) : current_url;

			var br = document.createElement("br");

			button_list.appendChild(nbut);
			button_list.appendChild(br);
		}

		history.push(url);
	}

	this.start = function() {
		set_vars();
		gen_html();
		var hash_handler = new Hash({
			onchange: function(filename) {
				ajax_get(filename, display);
			}
		});
		if (hash_handler.get() == "") hash_handler.set(first); // or location.hash = Hash(first);
	};

	return this;
};