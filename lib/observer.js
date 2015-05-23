/** @jsx createElement */

import { Component, createElement } from 'react';

// -----------------------------------------------------------------
// This block is extremely specific to `most` right now
// -----------------------------------------------------------------
import Observer from 'most/lib/sink/Observer';
import scheduler from 'most/lib/scheduler/defaultScheduler';

function observe(observable, value, end, error) {
	const observer = new Observer(value, end, error);
	return observable.source.run(observer, scheduler);
}

function isObservable(observable) {
	return !!observable.source;
}
// -----------------------------------------------------------------

// See: https://gist.githubusercontent.com/amccloud/d60aa92797b932f72649
export default function observer(Wrapped) {
	const getObservables = Wrapped.prototype.observe;

	if (!getObservables) {
		throw new Error('Components using observe must define observables.');
	}

	return class ObserverWrapper extends Component {

		_subscriptions = { }

		componentWillMount() {
			this._subscribe(this.props, this.context);
		}

		componentWillReceiveProps(nextProps, nextContext) {
			if (nextProps !== this.props || nextContext !== this.context) {
				this._subscribe(nextProps, nextContext);
			}
		}

		componentWillUnmount() {
			this._unsubscribe();
		}

		render() {
			return <Wrapped {...this.props} {...this.state} />;
		}

		_subscribe(props, context) {
			let subscriptions = {};
			let observables = getObservables(props, context);

			for (let key in observables) {
				let observable = observables[key];
				console.log(key,'obs?',isObservable(observable));
				if (!isObservable(observable)) {
					// __DEV__ && console.warn(`Observable '${key}' is not subscribable.`);
					continue;
				}

				subscriptions[key] = observe(
					observable,
					this._handleNext.bind(this, key),
					this._handleError.bind(this, key),
					this._handleCompleted.bind(this, key)
				);
			}

			this._unsubscribe();
			this._subscriptions = subscriptions;
		}

		_unsubscribe() {
			for (let key in this._subscriptions) {
				let subscription = this._subscriptions[key];

				if (!subscription.dispose) {
					// __DEV__ && console.warn(`Observable '${key}' subscription is not disposable.`);
					continue;
				}

				subscription.dispose();
			}

			this._subscriptions = {};
		}

		_handleNext(key, value) {
			let data = {};
			data[key] = value;
			this.setState(data);
		}

		_handleError(key, value) {

		}

		_handleCompleted(key, value) {

		}
	}
}
