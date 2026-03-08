import { Component, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { AccessibilityComponent } from './shared/accessibility/accessibility'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AccessibilityComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('Redia-Frontend')

}