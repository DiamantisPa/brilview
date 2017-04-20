import { Directive, AfterViewInit } from '@angular/core';
import { CompleterCmp } from 'ng2-completer';

@Directive({
    selector: '[completer-patch]'
})
export class CompleterPatchDirective implements AfterViewInit {

    constructor(private completer: CompleterCmp) {
    }

    ngAfterViewInit() {
        this.completer.ctrInput.nativeElement.setAttribute('type', 'text');
    }
}
