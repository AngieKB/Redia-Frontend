import { NgModule } from '@angular/core';
import { RecaptchaComponent } from './recaptcha.component';

/**
 * Drop-in replacement for ng-recaptcha, compatible with Angular 21+.
 * Exposes the same RecaptchaModule / RecaptchaFormsModule names so that
 * existing component imports need only change the path, not the symbol.
 */
@NgModule({
  imports: [RecaptchaComponent],
  exports: [RecaptchaComponent],
})
export class RecaptchaModule {}

@NgModule({
  imports: [RecaptchaComponent],
  exports: [RecaptchaComponent],
})
export class RecaptchaFormsModule {}
