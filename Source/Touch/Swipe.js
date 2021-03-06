/*
---

name: Swipe

description: Provides a custom swipe event for touch devices

authors: Christopher Beloch (@C_BHole), Christoph Pojer (@cpojer), Ian Collins (@3n)

license: MIT-style license.

requires: [Core/Element.Event, Custom-Event/Element.defineCustomEvent, Browser.Features.Touch]

provides: Swipe

...
*/

(function(){

var name = 'swipe',
	distanceKey = name + ':distance',
	cancelKey = name + ':cancelVertical',
	dflt = 50;

var start = {}, disabled, active;

var clean = function(){
	active = false;
};

var events = {

	touchstart: function(event){
		if (event.touches.length > 1) return;

		var touch = event.touches[0];
		active = true;
		start = {x: touch.pageX, y: touch.pageY};
	},
	
	touchmove: function(event){
		if (disabled || !active) return;
		
		var touch = event.changedTouches[0],
			end = {x: touch.pageX, y: touch.pageY};
		if (this.retrieve(cancelKey) && Math.abs(start.y - end.y) > 10) {
			active = false;
			return;
		}
		
		var distance = this.retrieve(distanceKey, dflt),
			deltaX = end.x - start.x,
			deltaY = end.y - start.y,
			direction = null;

		if(Math.abs(deltaX) < distance && Math.abs(deltaY) < distance) {
			return;
		}

		if(Math.abs(deltaX) > Math.abs(deltaY)) {
			direction = deltaX - distance < 0 ? 'left' : 'right';
		} else {
			direction = deltaY < -distance ? 'up' : 'down';
		}

		if (direction === null) {
			return;
		}

		event.preventDefault();
		active = false;
		event.direction = direction;
		event.start = start;
		event.end = end;

		this.fireEvent(name, event);
	},

	touchend: clean,
	touchcancel: clean

};

Element.defineCustomEvent(name, {

	onSetup: function(){
		this.addEvents(events);
	},

	onTeardown: function(){
		this.removeEvents(events);
	},

	onEnable: function(){
		disabled = false;
	},

	onDisable: function(){
		disabled = true;
		clean();
	}

});

})();
