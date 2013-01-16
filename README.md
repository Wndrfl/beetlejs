# Beetlejuice

## Overview

A robust and extensible front-end bootstrap framework by WNDRFL.

## Why to use it

Modern web applications are becoming increasingly reliant on rich user interfaces. Beetlejuice helps by providing a strong platform on which your application's front-end can be built. The entire framework is built on the concept of complete reusability, which leads to less duplication of code.

- easily create your own reusable html/css/js UI elements
- setup up automatic interaction binding
- full event tracking system
- parent / child window communications
- MVC-esque architecture
- common UI & form element templates

## Installation
Installation of the Beetlejuice skeleton is a simple 4-step process.

1. Download a fresh copy of Beetlejuice
2. Extract into a public web directory
3. Include the /beetlejuice/css/bbb.css in the header
4. Include the /beetlejuice/compile.php as a Javascript file in the header

<pre>&lt;script src="/beetlejuice/compile.php"&gt;&lt;/script&gt;</pre>
	
## Create a New UI Element
A "UI element" to Beetlejuice is simply a set of behaviors that are bound to an existing DOM element. Beetlejuice parses the page according to your instructions, finds DOM elements matching your criteria, and binds each to its own set of behaviors.

It's important to note that to Beetlejuice, a "UI element" is actually DOM agnostic - simply put, it will perform the mandated behaviors on any element that fits the criteria you assign. This adds flexibility by allowing the same set of behaviors to be shared among DOM elements that are technically different, but that tend to act the same way.

Creating a new element is done by subclassing the BBB.ui.element "class" and adding its unique behaviors. When this is complete, the behaviors are ready to be bound to any DOM element on the page.

Let's walk through the creation of a simple UI Element that will attach to a DOM element and log a message in the console when clicked.

### 1. Create a file for the new element
Create a new file in the `/beetlejuice/ui/` folder called 'alertButton.js'.

### 2. Subclass BBB.ui.element
Inside the new file, tell Beetlejuice (accessible by the namespace BBB) to subclass the generic UI element, and name the subclass "ui.alertButton".

<pre>BBB.subclass('ui.element','ui.alertButton');</pre>

### 3. Add an optional constructor method
In line with the concept of "classes", Beetlejuice allows you to supply a function as the third argument, to be run upon instantiation of your new element. This method is __optional__, but let's have our new element print a message to the console upon instantiation.

<pre>BBB.subclass('ui.element','ui.alertButton',function(dom) {
	this.dom = dom;
	console.log('Constructing the alertButton!');
});</pre>

Let's explain something else that you see happening in the above example. The only argument passed into the construct is `dom`. In this case, `dom` refers to the DOM element itself that Beetlejuice is binding these behaviors to. It is a good practice to save this reference locally (as we do in the example), so that your behaviors can reference it later.

**Note:** If you don't supply a constructor, Beetlejuice will automatically make the DOM element available as `this.dom` in the same way we did above.

### 4. Add a custom behavior
The 4th and final argument supplied to BBB.subclass() is an object with custom behaviors (in the forms of methods and variables) that will define how the element exists.

<pre>BBB.subclass('ui.element','ui.alertButton',function(dom) {
	this.dom = dom;
	console.log('Constructing the alertButton!');
},{
	// Custom behaviors go here
});</pre>

Since we are making an element that logs an alert whenever it is clicked, we need to tell the element to monitor itself for any click events and to react accordingly.

To do this, we are going to take advantage of an *optional* method that Beetlejuice looks for and runs (when found) immediately after successfully constructing the element. This method is called `setupAndValidate()`.

<pre>BBB.subclass('ui.element','ui.alertButton',function(dom) {
	this.dom = dom;
	console.log('Constructing the alertButton!');
},{

	// will be run automatically
	setupAndValidate:function() {
	
		this.dom.onclick = function() {
			console.log('Hey! You clicked me!');
		}
		
		return true;
	}
});</pre>

Let's review what we did here.

First, we kicked off the method and named it `setupAndValidate`:

<pre>setupAndValidate:function() {</pre>

Next, we reference `this.dom` an assign it's `onclick` listener to a function that will display an alert (we'll explain more after):

<pre>
this.dom.onclick = function() {
    console.log('Hey! You clicked me!');
}
</pre>

You might be wondering where we got `this.dom`? When Beetlejuice binds your element to its corresponding DOM element, it saves a reference to that DOM element as `this.dom`. This way, whenever you need to reference the DOM, you can find it at `this.dom`.

The last thing we did was…

<pre>return true;</pre>

We do this because `setupAndValidate()` **MUST** return either `true` or `false`. If it returns `false`, Beetlejuice will abort the setup of this specific instance of the element, print an error message to the console, and otherwise move on quietly.

### 5. Let's make this a little more flexible
It's great that we set up the element to pop the `alert` when clicked, but what if we wanted other events to create the exact same `alert` as well? The old fashioned way would be to do something like below:

<pre>BBB.subclass('ui.element','ui.alertButton',function(dom) {
	this.dom = dom;
	console.log('Constructing the alertButton!');
},{

	// will be run automatically
	setupAndValidate:function() {
	
		this.dom.onclick = function() {
			console.log('Hey! You clicked me!');
		}
		
		this.dom.onmouseover = function() {
			console.log('Hey! You clicked me!');
		}
		
		return true;
	}
});</pre>

This could quickly turn into a headache with an element that has anything more than a small about of behaviors. Let's try and refactor a little bit - by putting the logging function in a new custom behavior, we can separate it from it's different listeners, and consolidate our code a little:

<pre>BBB.subclass('ui.element','ui.alertButton',function(dom) {
	this.dom = dom;
	console.log('Constructing the alertButton!');
},{

	// will be run automatically
	setupAndValidate:function() {
	
		var self = this; // set a local copy of 'this'
	
		this.dom.onclick = function() {
			self.logMessage();
		}
		
		this.dom.onmouseover = function() {
			self.logMessage();
		}
		
		return true;
	},
	
	// method to print message to console
	logMessage:function() {
		console.log('Hey! You clicked me!');
	}
});</pre>

You'll notice 2 things about what we did above.

First, we added a local reference to `this` to solve the problem of scope when the element attempts to reference its own function:

<pre>var self = this;</pre>

Then, we moved the two occurances of the `console.log()` function to a *new* custom behavior called `logMessage()` and updated the event listeners in `setupAndValidate()` to reflect the changes.

<pre>
// will be run automatically
setupAndValidate:function() {

	var self = this; // set a local copy of 'this'

	this.dom.onclick = function() {
		self.logMessage();
	}
	
	this.dom.onmouseover = function() {
		self.logMessage();
	}
	
	return true;
},

// method to print message to console
logMessage:function() {
	console.log('Hey! You clicked me!');
}
</pre>

Now we can print the same message to the console from whatever custom behavior we'd like!

### 6. Tell Beetlejuice how to bind this element

Now that we have our behaviors set up, we need to bind them to DOM element(s). To do this, open up `/beetlejuice/core/elements.js`.

If you scroll to the bottom, you will see the following:

<pre>
elementTypes:[
	{ publicName:'BBB_sample_element', className:'ui.sampleElement'},
]
</pre>

This is the area that tells Beetlejuice how to bind its elements to the DOM. To add your new element to the binding process, you simply need to add a new object to the `elementTypes`:

<pre>
elementTypes:[
	{ publicName:'BBB_sample_element', className:'ui.sampleElement'},
	{ publicName:'alertButton`, className:'ui.alertButton'}
]
</pre>

Let's explain what just happened. Above, we added a *new object* to the `elementTypes` array with *two* keys: **publicName** and **className**.

**publicName:** This is the CSS class name that you will use in the DOM to indicate that you would like Beetlejuice to bind your new behaviors to it. In this case, according to what we indicated above, Beetlejuice would look for something like the below in the DOM:

<pre>
&lt;div class="alertButton"&gt;&lt;/div&gt;
</pre>

**className:** This is the Beetlejuice UI element name that you just created. In this case, you just created `ui.alertButton`.

### 7. Add the new element to the compiler
Now that Beetlejuice knows how to bind this element to the DOM, we need to add it to the compiler.

The compiler is what allows us to separate our code into easy-to-manage files during development, but treat the entire collection as a single file in production. 

It works by taking a list of files, putting them together, optionally optimizing for speed, and outputting as a Javascript file. This means that we need to keep the compiler informed of any new additions to the framework.

Open `/beetlejuice/compile.php`, scroll to the "UI elements" section and add the correct path to your new element file:

<pre>
//...

// UI elements
'js/ui/elements/alertButton.js'

//...
</pre>

### 8. Add a "Bindable" DOM element
Almost done! Beetlejuice is ready to use your new UI element, all you need to do is add a DOM element that fits the criteria you specified to Beetlejuice for binding.

Open up an HTML file somewhere (where Beetlejuice is installed) and add the following:

<pre>
&lt;div class="alertButton"&gt;&lt;/div&gt;
</pre>

### 9. Refresh the page, and try it!
