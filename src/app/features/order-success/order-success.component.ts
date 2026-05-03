import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss',
})
export class OrderSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cart = inject(CartService);

  sessionId = this.route.snapshot.queryParamMap.get('session_id') ?? '';

  ngOnInit() {
    this.cart.clear();
  }
}
