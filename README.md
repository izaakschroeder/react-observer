# react-observer

Respond to [most] events in React components.

![build status](http://img.shields.io/travis/izaakschroeder/react-observer/master.svg?style=flat)
![coverage](http://img.shields.io/coveralls/izaakschroeder/react-observer/master.svg?style=flat)
![license](http://img.shields.io/npm/l/react-observer.svg?style=flat)
![version](http://img.shields.io/npm/v/react-observer.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/react-observer.svg?style=flat)

Make React actually reactive.

This one is fairly specific to [most] right now - ideally it should support the ES7 observable interface, but this works. See the discussion [here](https://github.com/facebook/react/issues/3398).

## TODO
 * [ ] Tests
 * [ ] Runnable examples
 * [ ] Incorporate `invariant`

## Usage

Use it on DOM elements.

```javascript
import observer from 'react-observer';
import { fromEvent, map } from 'most';


@observer
class MyComponent extends Component {

	observe(props) {
		return {
			mouse: map((ev) => {
				return { x: ev.clientX, y: ev.clientY };
			}, fromEvent('mousedown', document))
		};
	}

	render() {
		<div>Position: ({this.mouse.x},{this.mouse.y})</div>
	}
}
```

Use it with [afflux].

```javascript
import observer from 'react-observer';
import { fromEvent, map } from 'most';


@observer
class MyComponent extends Component {

	observe(props) {
		return {
			user: this.stores.users.current
		};
	}

	render() {
		<div>User: {this.user.name}</div>
	}
}
```

Use it to make simple timers.

```javascript
import observer from 'react-observer';
import { create } from 'most';


@observer
class MyComponent extends Component {

	observe(props) {
		return {
			time: create(add => {
				const interval = setInterval(() => {
					add(new Date());
				}, 1000);
				return () => { clearInterval(interval); };
			})
		};
	}

	render() {
		<div>It is now: {this.time}</div>
	}
}
```

[afflux]: https://www.github.com/izaakschroeder/afflux
[most]: https://github.com/cujojs/most
