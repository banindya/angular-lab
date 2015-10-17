import {
	ElementRef,
	Directive,
	OnDestroy
} from 'angular2/angular2';

import { isNativeShadowDomSupported } from '../../common/lang';
import { Icon } from '../services';

@Directive({
	selector: '[logo]'
})

export class Logo implements OnDestroy {
	el;
	constructor(elementRef: ElementRef,	icon: Icon) {
		this.el = elementRef.nativeElement;
		if (isNativeShadowDomSupported) this.el = this.el.createShadowRoot();
		icon.get('media/ng.svg').subscribe((svg) => {
			this.el.appendChild(svg);
		});
	}
	onDestroy() {
		let svg = this.el.querySelector('svg');
		if (svg) this.el.removeChild(svg);
	}
}