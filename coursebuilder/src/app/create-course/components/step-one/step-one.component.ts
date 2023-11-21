import { Component, EventEmitter, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { Option } from '../../create-course.interfaces';
import {
  COMPLETION_NEXT_RULE,
  CompletionRule,
  LAYER_OPTIONS,
  COURSE_CONST,
  LAYER_ONE_AND_TWO_OPTIONS,
  LAYER_ONE_OPTIONS,
  LAYER_TWO_OPTIONS,
  STORAGE_KEY,
  PAGE_TYPE_OPTIONS,
} from '../../data';
import { CourseService } from '../../../course.service';
import { LocalStorageUtils } from '../../../core/utils';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
})
export class StepOneComponent {
  validateForm!: UntypedFormGroup;
  currentLayerOptions!: Option[];
  pageTypeOptions!: Option[];
  completionRuleOptions: Option[] = CompletionRule;
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: UntypedFormBuilder,
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    const savedData = this.courseService.retrieveFromLocalStorage(
      STORAGE_KEY.COURSE_BUILDER_STEPS,
    );

    const defaultLayer = savedData?.stepOne?.layer || COURSE_CONST.ONE;
    const defaultLayerOptions =
      savedData?.stepOne?.layerOptions || LAYER_OPTIONS.Text_Only;
    const enabledNext =
      savedData?.stepOne?.enabledNext || COMPLETION_NEXT_RULE.PAGE_LOADED;
    this.currentLayerOptions = LAYER_ONE_OPTIONS;
    this.pageTypeOptions = PAGE_TYPE_OPTIONS;
    if (defaultLayer == COURSE_CONST.TWO) {
      this.currentLayerOptions = LAYER_ONE_AND_TWO_OPTIONS;
      this.completionRuleOptions = CompletionRule;
    } else if (defaultLayer == COURSE_CONST.ONE) {
      this.completionRuleOptions = this.completionRuleOptions.slice(0, -1);
    }

    this.validateForm = this.fb.group({
      layer: [defaultLayer, [Validators.required]],
      layerOptions: [defaultLayerOptions, [Validators.required]],
      enabledNext: [enabledNext, [Validators.required]],
    });
  }

  submitForm(): boolean {
    if (this.validateForm.valid) {
      this.formSubmitted.emit(this.validateForm.value);
      this.courseService.updateLocalStorageProperty(
        STORAGE_KEY.COURSE_BUILDER_STEPS,
        COURSE_CONST.STEP_ONE,
        this.validateForm.value,
      );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    return this.validateForm.valid;
  }
  onLayerSelect(selectedValue: any): void {
    if (selectedValue == COURSE_CONST.TWO) {
      this.currentLayerOptions = LAYER_ONE_AND_TWO_OPTIONS;
      this.completionRuleOptions = CompletionRule;
      this.validateForm
        .get(COURSE_CONST.LAYER_OPTIONS)
        ?.setValue(LAYER_OPTIONS.L1_L2_OP_1);
      this.validateForm
        .get(COURSE_CONST.ENABLED_NEXT)
        ?.setValue(COMPLETION_NEXT_RULE.LAYER_2_COMPLETED);
    } else {
      this.currentLayerOptions = LAYER_ONE_OPTIONS;
      this.completionRuleOptions = this.completionRuleOptions.slice(0, -1);
      this.validateForm
        .get(COURSE_CONST.LAYER_OPTIONS)
        ?.setValue(LAYER_OPTIONS.Text_Only);
      this.validateForm
        .get(COURSE_CONST.ENABLED_NEXT)
        ?.setValue(COMPLETION_NEXT_RULE.PAGE_LOADED);
    }
  }
}
