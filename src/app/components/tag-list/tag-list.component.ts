import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  template: `
    <div class="tag-list" [class.tag-list--hoverable]="hoverable()">
      @for (tag of tags(); track tag) {
        <span class="tag-list__tag">{{ tag }}</span>
      }
    </div>
  `,
  styleUrl: './tag-list.component.scss',
})
export class TagListComponent {
  tags = input.required<string[]>();
  /** Adds the soft raise + glow hover affordance (still not clickable). */
  hoverable = input(false);
}
