import { Component, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-accessibility',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accessibility.html',
  styleUrls: ['./accessibility.css']
})
export class AccessibilityComponent {
  isOpen = false;
  highContrast = false;
  grayscale = false;
  darkMode = false;
  fontSizeMultiplier = 1;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPreferences();
    }
  }

  togglePanel() {
    this.isOpen = !this.isOpen;
  }

  toggleHighContrast() {
    this.highContrast = !this.highContrast;
    // High contrast overrides dark mode visually - they don't mix well
    if (this.highContrast && this.darkMode) {
      this.darkMode = false;
      this.renderer.removeClass(document.body, 'a11y-dark');
    }
    if (isPlatformBrowser(this.platformId)) {
      if (this.highContrast) {
        this.renderer.addClass(document.body, 'a11y-high-contrast');
      } else {
        this.renderer.removeClass(document.body, 'a11y-high-contrast');
      }
      this.savePreferences();
    }
  }

  toggleGrayscale() {
    this.grayscale = !this.grayscale;
    if (isPlatformBrowser(this.platformId)) {
      if (this.grayscale) {
        this.renderer.addClass(document.body, 'a11y-grayscale');
      } else {
        this.renderer.removeClass(document.body, 'a11y-grayscale');
      }
      this.savePreferences();
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    // Dark mode and high contrast don't mix well
    if (this.darkMode && this.highContrast) {
      this.highContrast = false;
      this.renderer.removeClass(document.body, 'a11y-high-contrast');
    }
    if (isPlatformBrowser(this.platformId)) {
      if (this.darkMode) {
        this.renderer.addClass(document.body, 'a11y-dark');
      } else {
        this.renderer.removeClass(document.body, 'a11y-dark');
      }
      this.savePreferences();
    }
  }

  changeFontSize(step: number) {
    this.fontSizeMultiplier = parseFloat(
      Math.max(0.8, Math.min(2.0, this.fontSizeMultiplier + step)).toFixed(1)
    );
    if (isPlatformBrowser(this.platformId)) {
      // Apply to <html> element so that rem-based sizes scale correctly
      document.documentElement.style.fontSize = (this.fontSizeMultiplier * 100) + '%';
      // Apply CSS variable for manual overrides
      document.documentElement.style.setProperty('--a11y-font-multiplier', this.fontSizeMultiplier.toString());
      // Apply zoom to body for pixel-based scaling (fallback/complement)
      (document.body.style as any).zoom = this.fontSizeMultiplier.toString();

      this.savePreferences();
    }
  }

  resetSettings() {
    if (this.highContrast) this.toggleHighContrast();
    if (this.grayscale) this.toggleGrayscale();
    if (this.darkMode) this.toggleDarkMode();
    this.fontSizeMultiplier = 1;
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.style.fontSize = '';
      document.documentElement.style.setProperty('--a11y-font-multiplier', '1');
      (document.body.style as any).zoom = '1';
      this.savePreferences();
    }
  }

  private savePreferences() {
    localStorage.setItem('a11y-prefs', JSON.stringify({
      highContrast: this.highContrast,
      grayscale: this.grayscale,
      darkMode: this.darkMode,
      fontSizeMultiplier: this.fontSizeMultiplier
    }));
  }

  private loadPreferences() {
    const prefs = localStorage.getItem('a11y-prefs');
    if (!prefs) return;
    const parsed = JSON.parse(prefs);

    if (parsed.highContrast) this.toggleHighContrast();
    if (parsed.grayscale) this.toggleGrayscale();
    if (parsed.darkMode) this.toggleDarkMode();
    if (parsed.fontSizeMultiplier && parsed.fontSizeMultiplier !== 1) {
      this.fontSizeMultiplier = parsed.fontSizeMultiplier;
      document.documentElement.style.fontSize = (this.fontSizeMultiplier * 100) + '%';
      document.documentElement.style.setProperty('--a11y-font-multiplier', this.fontSizeMultiplier.toString());
      (document.body.style as any).zoom = this.fontSizeMultiplier.toString();
    }
  }
}
