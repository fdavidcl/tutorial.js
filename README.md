[tutorial.js](http://fdavidcl.github.io/tutorial.js/)
===========

**tutorial.js** lets you make extremely simple tutorials without any Javascript (or even HTML) knowledge necessary.

### Usage

Use this guide or follow [this tutorial](http://fdavidcl.github.io/tutorial.js/#:steps/second.json).

#### Setup

Download `tutorial.min.js` and include it as a script in an HTML file or simply load it from this repository:
```html
<script src="https://github.com/fdavidcl/tutorial.js/raw/master/tutorial.min.js"></script>
```

You can use the default CSS file to give text and buttons some style. Then just compose as many JSON files as you want, each one containing a *step* of the tutorial.

#### Tutorial prototype

* `var mytut = new Tutorial();` creates a new object, assuming:
	- An existing div.tutorialjs (or else the tutorial will be displayed in the body)
	- First JSON step to load is "first.json" on current directory
	- No back buttons will be displayed
* `var mytut = new Tutorial("myfirststep.json");` will assume everything except the first JSON file.
* ```
  var mytut = new Tutorial({
	  first: "myfirststep.json",
	  container: document.getElementById("tutorial_container"),
	  back_button: "Back",
	  enable_back: true
  }); 
  ```
  All arguments are optional and will be given default values if not provided.

`mytut.start()` will generate the HTML code and load the first step of the tutorial.

#### Using links to load steps

You can create custom links to steps and **tutorial.js** will automatically load them when clicked:

```html
<a href="#:stepfolder/first.json">Go to the first step</a>
```

**tutorial.js** uses the colon to separate the page hash from the current step. 
For example, if the tutorial is placed at `example.html#mytutorial` the steps will
be shown as `example.html#mytutorial:mystep.json`.