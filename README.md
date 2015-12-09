# Beetlejs

## Overview

A simple and extensible Javascript framework kernel.

## Why to use it

Beetlejs.js provides a strong and flexible "starter kit" for the development of a custom Javascript framework. Unlike jQuery, Beetlejs.js isn't a library - instead its purpose is to make it easier to create rich networks of objects.

Out of the box, Beetlejs.js...

- is 3kb (minified)
- provides an easy and extensible namespace with scaffolding for the creation of rich objects
- supports simulated object "inheritance"
- supports internal communication between objects via events

In addition, Beetlejs.js supports third party plugins, which opens the door to anything.

Schwing.

## Installation

### Install with npm
You can use beetlejs as an npm module with:

`npm install beetlejs`

After installing, you can:

```javascript
require('beetlejs');
var app = window.app = new ___();
```

### Install beetlejs.js as a file
Installation of the Beetlejs skeleton is a simple 3-step process.

1. Download a fresh copy of Beetlejs
2. Extract into a public web directory
3. Include the `beetlejs.min.js` as a Javascript file

<pre>&lt;script src="/path/to/beetlejs.min.js"&gt;&lt;/script&gt;</pre>

## Create your first extension

Okay, this is going to be easy, watch:

```javascript
// Create the extension
app.extend('myservice', {
	
	sayHello: function() {
		alert('hallo squirreled');
	}

});

// Now you can use the service - schwing.
app.myservice.sayHello();
```

There you have it, your first Beetlejs.js extension. It's simple, and it took about 10 seconds to type.


## Create your first entity

In Beetlejs, an entity is a newable object that lives within the Beetlejs namespace, and is typically interacted with the same way a traditional model would be interacted with.

```javascript
// Create the entity
app.entity('car',{

	// Constructor
	initialize: function() {
	
	},
	
	turnOn:function() {
		console.log('Starting engine...');
	},

	driveTo:function(place) {
		console.log('Driving to: '+place);
	}

});

// Use the object - schwing.
var car = new app.car('silver');
car.driveTo('grocery store');
```

That's neat. We now have an object that does something. Let me explain how it worked:

To create an `entity` in beetlejs.js, you simply need to call the `app.entity();` method. We did this in the first line.

The `app.entity();` method accepts 3 arguments: the namespace, a prototype object, and the name of an object to inherit from (we didn't do this in the above example, and we'll explain this later):

```javascript
app.entity({namespace,construct,prototype});
```

- <b>namespace:</b> <i>String</i> The namespace to be used for this `entity` within Beetlejs.js
- <b>prototype:</b> <i>Object</i> The main functionality of the `entity` in JSON format
- <b>extend:</b> <i>String</i> The namespace of another `entity` to inherit from

Next, we added a little magic to the prototype, to have it run some logic upon instantiation. This special black magic was the `initialize` function. This function is automatically called when the entity is instantiated, and is passed all the arguments that are passed to the constructor.

Finally, we added two more methods to the `prototype` area. Unlike the `initialize` function, these methods will be called only when they are specifically called.

## Inheritance

Beetlejs.js also supports psuedo-inheritence between objects, via `app.entity();`. Here's how that might look, if we wanted to "subclass" the "class" we created above:

```javascript
// Create the "subclassed" object, notice the "car" string passed as the third argument
app.entity('car.ferrari',{

	// Constructor
	initialize: function() {

		this.radio=null;
		this.blastTechno();

	},

	// This is the prototype area
	blastTechno:function() {
		this.radio = setInterval(function() {
			console.log('UNZ KATZ');
		},1000);
	},

	stopTechno:function() {
		clearInterval(this.radio);
	}

},'car');

var ferrari = new app.car.ferrari('orange');
this.turnOn();
ferrari.driveTo('club'); 
ferrari.blastTechno();
```

As you can see here, we wanted to create a similar, yet more specific version of `car`. This new `entity` would want to share the same `prototype` that `app.car` has, but it also has special methods that it needs which are specific to this type of `car` only.

To do this, we used `app.entity();` to allow the Ferrari to inherit from `car`'s prototype.

The only thing we had to do to do this was pass a third parameter with the name of the parent entity when creating the new namespace. Easy huh?

Things to note about subclassing:

1. if there are any duplicate methods or variables between the subclass and the parent, the subclass' method will <b>overwrite</b> the parent's method or variables.
2. the same applies with constructor methods - if a constructor method is supplied with the subclass, it will <b>overwrite</b> the parent's constructor (the parent's constructor will never be called).
3. even though the methods of the parent will be overwritten, we make them available for use as this.prototype.__super__.<method>

As final note, it is a good practice when naming a subclass is to append it to the name of the parent, separated by a dot ("plant.flower"), however it is not necessary (you could just do "flower" or "this.is.a.ridiculously.stupid.namespace.flower").