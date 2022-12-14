import { Directive, OnInit, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Directive({
  selector: '[number-separator]',
  providers: [DecimalPipe]
})
export class NumberSeparatorDirective implements OnInit {
  chars = new RegExp('[.,]', 'g'); // we're going to remove commas and dots

  @HostListener('input', ['$event.target.value']) onInput(e: string) {
    this.format(e);
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
    if (event.clipboardData) {
      this.format(event.clipboardData.getData('text/plain'));
    }
  }

  constructor(private elSvc: ElementRef, private rendererSvc: Renderer2, private decimalPipeSvc: DecimalPipe) { }

  ngOnInit() {
    this.format(this.elSvc.nativeElement.value); // format any initial values
  }

  format(val: string) {
    // 1. test for non-number characters and replace/remove them
    const numberFormat = parseInt(String(val).replace(this.chars, ''), 10);

    // 2. format the number (add dot)
    const n = this.decimalPipeSvc.transform(numberFormat, '1.0', 'vi-VN');

    // 3. replace the input value with formatted numbers
    this.rendererSvc.setProperty(this.elSvc.nativeElement, 'value', n);
  }

}
