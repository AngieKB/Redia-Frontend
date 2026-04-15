import {
  Component,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  NgZone,
} from '@angular/core';

declare const grecaptcha: any;

@Component({
  selector: 're-captcha',
  standalone: true,
  template: `<div #recaptchaContainer></div>`,
})
export class RecaptchaComponent implements AfterViewInit, OnDestroy {
  @Input() siteKey: string = '';
  @Output() resolved = new EventEmitter<string | null>();
  @ViewChild('recaptchaContainer') container!: ElementRef;

  private widgetId: number | null = null;
  private checkInterval: any = null;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.loadScript().then(() => {
      this.ngZone.runOutsideAngular(() => {
        this.widgetId = grecaptcha.render(this.container.nativeElement, {
          sitekey: this.siteKey,
          callback: (token: string) => {
            this.ngZone.run(() => this.resolved.emit(token));
          },
          'expired-callback': () => {
            this.ngZone.run(() => this.resolved.emit(null));
          },
        });
      });
    });
  }

  ngOnDestroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  private loadScript(): Promise<void> {
    return new Promise((resolve) => {
      const waitForReady = () => {
        this.checkInterval = setInterval(() => {
          if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
            clearInterval(this.checkInterval);
            resolve();
          }
        }, 100);
      };

      if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
        resolve();
        return;
      }

      const existingScript = document.querySelector(
        'script[src*="recaptcha/api.js"]'
      );
      if (!existingScript) {
        const script = document.createElement('script');
        script.src =
          'https://www.google.com/recaptcha/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      waitForReady();
    });
  }
}
