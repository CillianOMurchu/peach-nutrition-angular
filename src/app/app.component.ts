import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartDrawerComponent } from '@components/cart-drawer/cart-drawer.component';
import { NavbarComponent } from '@components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CartDrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'peach-nutrition';
}
