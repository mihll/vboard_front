import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appMatBadgeIcon]'
})
export class MatBadgeIconDirective {

  @Input()
  set appMatBadgeIcon(icon: string) {
    const badge = this.el.nativeElement.querySelector('.mat-badge-content');
    if (icon) {
      badge.style.display = 'flex';
      badge.style.alignItems = 'center';
      badge.style.justifyContent = 'center';
      badge.innerHTML = `<i class="material-icons" style="font-size: 17px">${icon}</i>`;
    } else if (badge) {
      badge.style.display = 'none';
      badge.innerHTML = ``;
    }
  }

  constructor(private el: ElementRef) {
  }
}
