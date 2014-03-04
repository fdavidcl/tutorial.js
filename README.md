tutorial.js
===========

tutorial.js lets you make extremely simple tutorials without any Javascript (or even HTML) knowledge necessary.

### Usage

#### Tutorial prototype

* `var mytut = new Tutorial();` - new object will be created, assuming:
	- An existing div.tutorialjs (or else the tutorial will be displayed in the body)
	- First JSON step to load is "first.json" on current directory
	- No back buttons will be displayed
* `var mytut = new Tutorial("myfirststep.json");` - will assume everything except the first JSON file.
* var mytut = new Tutorial({
	  first: "myfirststep.json",
	  container: document.getElementById("tutorial_container"),
	  back_button: "Back",
	  enable_back: true
  }); - all arguments are optional and will be given default values if not provided

`mytut.start()` will generate the HTML code and load the first step of the tutorial