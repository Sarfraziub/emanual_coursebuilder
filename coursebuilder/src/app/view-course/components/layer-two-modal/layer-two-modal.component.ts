import { Component, Inject, Input } from '@angular/core';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-layer-two-modal',
  templateUrl: './layer-two-modal.component.html',
  styleUrls: ['./layer-two-modal.component.scss'],
})
export class LayerTwoModalComponent {
  text: string = '';
  image: string = '';

  constructor(@Inject(NZ_MODAL_DATA) public data: any) {
    this.text = data.text;
    this.image = data.image;
  }
}
