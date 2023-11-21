import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-step-zero',
  templateUrl: './step-zero.component.html',
  styleUrls: ['./step-zero.component.scss'],
})
export class StepZeroComponent {
  @Output() addAnotherSlide: EventEmitter<any> = new EventEmitter();
  @Output() finish: EventEmitter<any> = new EventEmitter();
  @Output() preview: EventEmitter<any> = new EventEmitter();
  @Input() flgPreview: boolean = false;
  constructor(private router: Router) {}
  handleAddPage(): void {
    this.addAnotherSlide.emit();
  }

  handlePreview(): void {
    this.preview.emit();
  }
  handleExit(): void {
    this.router.navigate(['/']);
  }

  handleFinish(): void {
    this.finish.emit();
  }

  submitForm(): boolean {
    return true;
  }
}
