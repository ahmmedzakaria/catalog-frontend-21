import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CatalogFacade } from '../core/catalog-facade';
import { SeoService } from '../core/seo.service';

@Component({
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  template: `
    <section class="page-hero page-hero--compact"><div class="container"><p class="eyebrow">Contact</p><h1>Discuss your requirements</h1><p class="lead">Tell us what you are planning. This Phase 1 form validates locally and does not send or persist data.</p></div></section>
    <div class="section container contact-grid">
      @if (facade.site$ | async; as site) { <aside class="surface-card"><h2>Contact details</h2><p><strong>Email</strong><br><a [href]="'mailto:' + site.contact.email">{{ site.contact.email }}</a></p><p><strong>Phone</strong><br><a [href]="'tel:' + site.contact.phone">{{ site.contact.phone }}</a></p><p><strong>Location</strong><br>{{ site.contact.address }}</p></aside> }
      <section>
        @if (submitted()) { <div class="state-panel" role="status"><h2>Fixture enquiry validated</h2><p>No information was transmitted or stored. Production submission arrives in Phase 4.</p><button class="button button--secondary" type="button" (click)="reset()">Create another fixture enquiry</button></div> }
        @else { <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="form-grid"><label>Full name<input formControlName="name" autocomplete="name" [attr.aria-invalid]="invalid('name')"></label><label>Email<input type="email" formControlName="email" autocomplete="email" [attr.aria-invalid]="invalid('email')"></label></div>
          <label>Organization<input formControlName="organization" autocomplete="organization"></label>
          <label>Subject<input formControlName="subject"></label>
          <label>Message<textarea formControlName="message" rows="6" [attr.aria-invalid]="invalid('message')"></textarea></label>
          <label class="check-field"><input type="checkbox" formControlName="consent"><span>I agree that the production site may use these details to respond to my enquiry.</span></label>
          @if (attempted() && form.invalid) { <p class="form-error" role="alert">Complete the required name, valid email, message, and consent fields.</p> }
          <button class="button" type="submit">Validate fixture enquiry</button>
        </form> }
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
  readonly facade = inject(CatalogFacade);
  readonly attempted = signal(false);
  readonly submitted = signal(false);
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(120)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    organization: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(160)] }),
    subject: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(160)] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10), Validators.maxLength(2000)] }),
    consent: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  constructor() {
    const product = inject(ActivatedRoute).snapshot.queryParamMap.get('product');
    if (product) this.form.controls.subject.setValue(`Quote request: ${product}`);
    inject(SeoService).apply({ title: 'Contact | NexaCore Solutions', description: 'Discuss an infrastructure project or request a product quotation.', canonicalPath: '/contact' });
  }

  invalid(control: 'name' | 'email' | 'message'): boolean { return this.attempted() && this.form.controls[control].invalid; }
  submit(): void { this.attempted.set(true); this.form.markAllAsTouched(); if (this.form.valid) this.submitted.set(true); }
  reset(): void { this.form.reset(); this.attempted.set(false); this.submitted.set(false); }
}
