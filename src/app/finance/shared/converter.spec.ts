// tslint:disable:no-magic-numbers
import {async} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/take';

import {Rates} from './rates';
import {Converter} from './converter';
import {Currency} from './currencies';


describe('Angular Lab', () => {
	describe('Converter', () => {
		let converter: Converter;
		const timestamp = Date.now() / 1000;
		beforeEach(() => {
			const rates = new Rates({
				timestamp,
				disclaimer: '',
				license: '',
				base: 'USD',
				rates: {
					EUR: 0.5
			}});
			converter = new Converter(Observable.create((observer: Observer<Rates>) => {
				observer.next(rates);
			}));
		});

		it('should have {input, output, freshness} properties', () => {
			for (const prop of [converter.input, converter.output, converter.freshness]) {
				expect(prop).not.toBeUndefined();
			}
			expect(converter.input instanceof BehaviorSubject)
				.toBeTruthy();
			for (const prop of [converter.output, converter.freshness]) {
				expect(prop instanceof Observable)
					.toBeTruthy();
			}
		});

		it('should emit the freshness of conversion rates via #freshness property', async(() => {
			converter.freshness.subscribe((date) => {
				expect(date instanceof Date)
					.toBeTruthy();
				expect(date.getTime())
					.toEqual(timestamp * 1000);
			});
		}));

		it('should convert an array of values from one Currency to another', async(() => {
			const usd = new Currency('USD', 'US Dollar');
			const euro = new Currency('EUR', 'Euro');

			const obs = converter.output.take(1);
			const obsSpy = jasmine.createSpy('convert');
			obs.subscribe(([value]) => {
				expect(value).toEqual(0.5);
				obsSpy();
			});

			converter.input.next([{
				value: 1,
				from: usd,
				to: euro
			}]);

			expect(obsSpy)
				.toHaveBeenCalled();
		}));

		it('should not emit values if the same input is sent', async(() => {
			const from = new Currency('USD', 'US Dollar');
			const to = new Currency('EUR', 'Euro');

			let count = 0;
			converter.output.take(2)
				.subscribe(([value]) => {
					expect(value).toEqual(0.5);
					count++;
				});

			const input = {from, to, value: 1};
			converter.input.next([input]);
			converter.input.next([input]);

			expect(count).toEqual(1);
		}));
	});
});