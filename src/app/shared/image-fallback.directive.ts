import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({ selector: 'img[catalogImageFallback]', standalone: true })
export class ImageFallbackDirective {
  readonly fallbackSrc = input('/assets/catalog/placeholder.svg');
  private readonly element = inject<ElementRef<HTMLImageElement>>(ElementRef);

  @HostListener('error')
  useFallback(): void {
    const image = this.element.nativeElement;
    if (image.src.endsWith(this.fallbackSrc())) return;
    image.src = this.fallbackSrc();
    image.dataset['degraded'] = 'true';
  }
}
