# Beetlejuice.js

## Overview

A simple and extensible Javascript framework starter kit by WNDRFL.

## Why to use it

Beetlejuice.js provides a strong and flexible "starter kit" for the development of a custom Javascript framework. Unlike jQuery, Beetlejuice.js isn't a library - instead its purpose is to make it easier to create rich networks of objects.

Out of the box, Beetlejuice.js...

- is less than 10kb
- provides an easy and extensible namespace with scaffolding for the creation of rich objects
- supports simulated object "inheritance"
- supports communication between objects via events
- is packaged with common tools to make the creation of your robust objects easier

In addition, Beetlejuice.js supports third party plugins, which opens the door to anything.

Schwing.

## Installation
Installation of the Beetlejuice skeleton is a simple 3-step process.

1. Download a fresh copy of Beetlejuice
2. Extract into a public web directory
3. Include the `beetlejuice.min.js` as a Javascript file in the header

<pre>&lt;script src="/path/to/beetlejuice.min.js"&gt;&lt;/script&gt;</pre>

## Create your first object

Okay, this is going to be easy, watch:

<pre>
// Create the object
___.namespace({
	namespace: 'sampleObject',
	construct: function() {

		// this is the constructor area

	}, 
	proto: {

		// this is the prototype area

	}
});

// Use the object - schwing.
var obj = new ___.sampleObject();
</pre>

There you have it, your first Beetlejuice.js object. It's simple, took about 10 seconds to type, and is currently completely useless...so let's make it do something more:

<pre>
// Create the object
___.namespace({
	namespace: 'car',
	construct: function(color) {

		// this is the constructor area
		this.color = color;
		this.turnOn();

	}, 
	proto: {

		// this is the prototype area
		turnOn:function() {
			console.log('Starting engine...');
		},

		driveTo:function(place) {
			console.log('Driving to: '+place);
		}
	}
});

// Use the object - schwing.
var car = new ___.car('silver');
car.driveTo('grocery store');
</pre>

That's a little better. We now have an object that at least does something. Now, let me explain how it worked. 

To create a "class" in Beetlejuice.js, you simply need to call the `___.namespace();` method. We did this in the first line.

The `___.namespace();` method accepts 3 arguments: the namespace, an optional construct function, and a prototype object:

<pre>___.namespace({namespace,construct,prototype});</pre>

- <b>namespace:</b> <i>String</i> The namespace to be used for this "class" within Beetlejuice.js
- <b>construct:</b> <i>Function (optional)</i> A function to be run upon instantiation
- <b>prototype:</b> <i>Object</i> The main functionality of the "class" in JSON format

Next, we added a little magic to the `construct` function, to have it run some logic upon instantiation. <b>Note: two things happen</b> with `construct` functions:

1. they can be passed arguments when instantiating the object
2. they will <b>automatically</b> be called as soon as the object is instantiated

Finally, we added two methods to the `prototype` area. Unlike the `construct` function, these methods will be called only when they are specifically called.

## Inheritance

Beetlejuice.js also supports psuedo-inheritence between objects, via `___.namespace();`. Here's how that might look, if we wanted to "subclass" the "class" we created above:

<pre>
// Create the "subclassed" object, notice the "extend" parameter
___.namespace({
	namespace: 'car',
	extend: 'car.ferrari',
	construct: function() {

		// This is the constructor area
		this.radio=null;
		this.blastTechno();

	},
	proto: {

		// This is the prototype area
		blastTechno:function() {
			this.radio = setInterval(function() {
				console.log('UNZ KATZ');
			},1000);
		},

		stopTechno:function() {
			clearInterval(this.radio);
		}
	}
});

var ferrari = new ___.car.ferrari('orange');
this.turnOn();
ferrari.driveTo('club'); 
ferrari.blastTechno();
</pre>

As you can see here, we wanted to create a similar, yet more specific class of `car`. This new "class" would want to share the same `prototype` that `___.car` has, but it also has special methods that it needs which are specific to this type of `car` only.

To do this, we used `___.namespace();` to allow the Ferrari to inherit from `car`'s prototype.

The only thing we had to do to do this was include an `extend` parameter when creating the new namespace. Easy huh?

Things to note about subclassing:

1. if there are any duplicate methods or variables between the subclass and the parent, the subclass' method with <b>overwrite</b> the parent's method or variables.
2. the same applies with constructor methods - if a constructor method is supplied with the subclass, it will <b>overwrite</b> the parent's constructor (the parent's constructor will never be called).
3. a good practice when naming a subclass is to append it to the name of the parent, separated by a dot ("plant.flower"), however it is not necessary (you could just do "flower").

Schwing.