import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core'

@Directive({
  selector: '[getIntNum]'
})
export class GetIntNumDirective {
  @Input() getIntNum: any;
  // @Input() num:any
  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getIntNum = Number(this.getIntNum)
  }
}
