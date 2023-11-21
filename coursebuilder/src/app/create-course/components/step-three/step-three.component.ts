import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormArray,
  Validators,
  FormGroup,
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
} from '../../data';
import { CourseService } from '../../../course.service';
import { CommonUtils } from '../../../core/utils';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss'],
})
export class StepThreeComponent implements OnInit {
  validateForm!: UntypedFormGroup;
  validateFormTitle!: UntypedFormGroup;
  courseBuilderSteps: any;
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  layerTwoOptions!: Option[];

  panels: any[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private courseService: CourseService,
  ) {}

  ngOnInit() {
    this.courseBuilderSteps =
      this.courseService.retrieveFromLocalStorage(
        STORAGE_KEY.COURSE_BUILDER_STEPS,
      ) || [];
    const images: string[] = this.courseBuilderSteps?.stepTwo?.images || [];
    this.layerTwoOptions = LAYER_TWO_OPTIONS;
    images.forEach((image, index) => {
      this.panels.push({
        active: true, //index === 0,
        name: `Image-${index + 1}`,
        imageUrl: image,
      });
    });

    this.validateForm = this.fb.group({
      imageForms: this.fb.array([]),
    });

    this.initFormArray();
  }

  getFormGroupAtIndex(index: number): FormGroup {
    return (this.validateForm.get(COURSE_CONST.IMAGE_FORMS) as FormArray).at(
      index,
    ) as FormGroup;
  }

  private initFormArray() {
    const imageForms = this.validateForm.get(
      COURSE_CONST.IMAGE_FORMS,
    ) as FormArray;
    // const courseBuilderSteps: any = this.courseService.retrieveFromLocalStorage('courseBuilderSteps') || [];
    const imageFormsData: any[] =
      this.courseBuilderSteps?.stepThree?.imageForms || [];

    this.panels.forEach((panel, index) => {
      const formGroup = this.fb.group({
        editor: [imageFormsData?.[index]?.editor, [Validators.required]],
        image: panel.imageUrl,
        pageTitle: [imageFormsData?.[index]?.pageTitle, [Validators.required]],
        layer2Options: [LAYER_OPTIONS.Text_Only, [Validators.required]],
      });
      imageForms.push(formGroup);
    });
  }

  handleImageUpload(event: any, index: number) {
    CommonUtils.getBase64(event.file.originFileObj)
      .then((base64String: any) => {
        const base64Url = base64String as string; // Type assertion here
        const imageForms = this.validateForm.get(
          COURSE_CONST.IMAGE_FORMS,
        ) as FormArray;
        const formGroup = imageForms.at(index) as FormGroup;
        formGroup.get(COURSE_CONST.IMAGE)?.setValue(base64Url);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  submitForm(): boolean {
    if (this.validateForm.valid) {
      const stepThree = this.validateForm.value;
      // Save to local storage
      this.courseService.updateLocalStorageProperty(
        STORAGE_KEY.COURSE_BUILDER_STEPS,
        COURSE_CONST.STEP_THREE,
        this.validateForm.value,
      );
      // Emit the form data for any parent component or service that might be listening
      this.formSubmitted.emit(stepThree);
    } else {
      const imageFormsArray = this.validateForm.get(
        COURSE_CONST.IMAGE_FORMS,
      ) as FormArray;
      for (let i = 0; i < imageFormsArray.length; i++) {
        const formGroup = imageFormsArray.at(i) as FormGroup;

        for (const controlName in formGroup.controls) {
          if (formGroup.controls.hasOwnProperty(controlName)) {
            formGroup.get(controlName)?.markAsTouched();
            formGroup.get(controlName)?.updateValueAndValidity();
          }
        }
      }
    }
    return this.validateForm.valid;
  }
}
