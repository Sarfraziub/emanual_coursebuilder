import { Component, EventEmitter, Output } from '@angular/core';

import { Option } from '../../create-course.interfaces';
import {
  FormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  LAYER_OPTIONS,
  COURSE_CONST,
  LAYER_ONE_AND_TWO_OPTIONS,
  LAYER_ONE_OPTIONS,
  STORAGE_KEY,
} from '../../data';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { CourseService } from '../../../course.service';
import { CommonUtils } from '../../../core/utils';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
})
export class StepTwoComponent {
  validateForm!: UntypedFormGroup;
  currentLayerOptions!: Option[];
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();
  selectedOption: Option | null = null;
  fileList: NzUploadFile[] = [];
  totalParts: string = COURSE_CONST.ONE;
  isFormSubmit: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    this.isFormSubmit = false;
    const step1 =
      this.courseService.retrieveFromLocalStorage(
        STORAGE_KEY.COURSE_BUILDER_STEPS,
      ).stepOne || null;
    if (step1) {
      this.totalParts = step1.layer;

      this.selectedOption =
        [...LAYER_ONE_OPTIONS, ...LAYER_ONE_AND_TWO_OPTIONS].find(
          (option) => option.value === step1.layerOptions,
        ) || null;
      if (this.selectedOption) {
        this.setupFormBasedOnSelectedOption();
      }
      this.populateImagesFromLocalStorage();
    }
  }

  handleImageRemove = (file: NzUploadFile): Observable<boolean> => {
    return new Observable((observer) => {
      // Remove from fileList
      this.fileList = this.fileList.filter((f) => f.uid !== file.uid);

      // Remove from the form array
      const imagesArray = this.validateForm.get(
        COURSE_CONST.IMAGES,
      ) as FormArray;
      const imageIndex = imagesArray.value.findIndex(
        (img: any) => img === file.url,
      );
      if (imageIndex > -1) {
        imagesArray.removeAt(imageIndex);
      }

      observer.next(true);
      observer.complete();
    });
  };

  private populateImagesFromLocalStorage(): void {
    const courseBuilderSteps: any =
      this.courseService.retrieveFromLocalStorage(
        STORAGE_KEY.COURSE_BUILDER_STEPS,
      ) || [];
    const editorText: string = courseBuilderSteps?.stepTwo?.editor || '';
    const pageTitle: string = courseBuilderSteps?.stepTwo?.pageTitle || '';
    //
    this.validateForm.get(COURSE_CONST.EDITOR)?.setValue(editorText);
    this.validateForm.get(COURSE_CONST.PAGE_TITLE)?.setValue(pageTitle);

    let storedImages: string[] = [];
    if (courseBuilderSteps?.stepTwo?.images) {
      storedImages = [...courseBuilderSteps?.stepTwo.images];
    }

    const imagesArray = this.validateForm.get(COURSE_CONST.IMAGES) as FormArray;

    storedImages.forEach((base64Image, index) => {
      // Add to the form array
      imagesArray.push(this.fb.control(base64Image));

      // Add to fileList for display in nz-upload component
      this.fileList.push({
        uid: index.toString(),
        name: `Image-${index}.png`, // This is a dummy name, you can use actual names if stored
        status: 'done',
        url: base64Image,
        thumbUrl: base64Image,
      });
    });
  }

  private setupFormBasedOnSelectedOption(): void {
    switch (this.selectedOption?.value) {
      case LAYER_OPTIONS.Text_Only:
        this.validateForm = this.fb.group({
          pageTitle: ['', [Validators.required]],
          editor: ['', [Validators.required]], // Quill editor
        });
        break;
      case LAYER_OPTIONS.L1_OP_2:
        this.validateForm = this.fb.group({
          pageTitle: ['', [Validators.required]],
          editor: ['', [Validators.required]],
          images: this.fb.array(
            [],
            [Validators.required, Validators.minLength(1)],
          ), // Setup a form array to handle multiple image uploads
        });
        break;
      case LAYER_OPTIONS.L1_OP_3:
        this.validateForm = this.fb.group({
          pageTitle: ['', [Validators.required]],
          editor: ['', [Validators.required]],
          videos: this.fb.array(
            [],
            [Validators.required, Validators.minLength(1)],
          ), // Setup a form array to handle multiple video uploads
        });
        break;
      case LAYER_OPTIONS.L1_L2_OP_1:
        this.validateForm = this.fb.group({
          pageTitle: ['', [Validators.required]],
          editor: ['', [Validators.required]],
          images: this.fb.array(
            [],
            [Validators.required, Validators.minLength(1)],
          ), // Setup a form array to handle multiple image uploads
        });
        break;
      // ... Handle other options similarly
      default:
        this.validateForm = this.fb.group({
          pageTitle: ['', [Validators.required]],
          editor: ['', [Validators.required]],
        });
        break;
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    // Convert the file to Base64 for preview and store in the fileList
    CommonUtils.getBase64(file)
      .then((base64String: any) => {
        const base64Url = base64String as string; // Type assertion here

        file.url = base64Url; // Setting the preview URL for the file
        if (this.fileList.length < 3) {
          this.fileList = [...this.fileList, file]; // Add the file to the fileList for display

          // Save Base64 string to the form
          const imagesArray = this.validateForm.get(
            COURSE_CONST.IMAGES,
          ) as FormArray;
          imagesArray.push(this.fb.control(base64Url));
        }
      })
      .catch((e) => {
        console.error(e);
      });

    return false; // Prevent upload
  };

  submitForm(): boolean {
    this.isFormSubmit = true;
    if (this.validateForm.valid) {
      const stepTwo = this.validateForm.value;
      this.formSubmitted.emit(stepTwo);
      // Save to local storage
      this.courseService.updateLocalStorageProperty(
        STORAGE_KEY.COURSE_BUILDER_STEPS,
        COURSE_CONST.STEP_TWO,
        this.validateForm.value,
      );

      // Emit the form data for any parent component or service that might be listening
      this.formSubmitted.emit(stepTwo);
    } else {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsTouched();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    return this.validateForm.valid;
  }
  validateText() {
    return (
      this.validateForm.get('editor')?.hasError('required') &&
      this.validateForm?.get('editor')?.touched
    );
  }
  uploadImageDiv() {
    return (
      this.selectedOption?.value === LAYER_OPTIONS.L1_OP_2 ||
      this.selectedOption?.value === LAYER_OPTIONS.L1_L2_OP_1
    );
  }
  displayUploadValidation() {
    return this.isFormSubmit && !this.fileList.length;
  }
}
