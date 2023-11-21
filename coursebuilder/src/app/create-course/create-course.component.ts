import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { StepOneComponent } from './components/step-one/step-one.component';
import { StepThreeComponent } from './components/step-three/step-three.component';
import { StepTwoComponent } from './components/step-two/step-two.component';
import { LocalStorageUtils } from '../core/utils';
import { Steps } from './create-course.interfaces';
import { StepZeroComponent } from './components/step-zero/step-zero.component';
import { CourseService } from '../course.service';
import { COURSE_CONST, SLIDE_STEP, STORAGE_KEY } from '../create-course/data';
@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss'],
})
export class CreateCourseComponent {
  @ViewChild(StepZeroComponent) stepZeroComponent!: StepZeroComponent;
  @ViewChild(StepOneComponent) stepOneComponent!: StepOneComponent;
  @ViewChild(StepTwoComponent) stepTwoComponent!: StepTwoComponent;
  @ViewChild(StepThreeComponent) stepThreeComponent!: StepThreeComponent;

  currentStep: number = 0;
  slideNumber: number = 0;
  courses: any[] = []; //courseList

  formData: any = {};
  courseTitle!: string;
  categoryName!: string;
  steps: Steps[] = [];
  slides: any[] = [];
  courseId: number = 0;
  slideParam: number = 0;
  stepParam: number = 0;
  flgPreview: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    this.getInfoCoureAddOrUpdate();
  }
  ngAfterViewInit(): void {
    this.formData =
      this.courseService.retrieveFromLocalStorage(
        STORAGE_KEY.COURSE_BUILDER_STEPS,
      ) || {};

    this.steps = [
      {
        title: SLIDE_STEP.ADD_NEW_SLIDE,
        getComponent: () => this.stepZeroComponent,
      },
      {
        title: SLIDE_STEP.SETUP_LAYER,
        getComponent: () => this.stepOneComponent,
      },
      {
        title: SLIDE_STEP.ADD_LAYER_ONE_CONFIG,
        getComponent: () => this.stepTwoComponent,
      },
    ];

    if (this.formData?.stepOne?.layer === COURSE_CONST.TWO) {
      this.steps.push({
        title: SLIDE_STEP.ADD_LAYER_ONE_CONFIG,
        getComponent: () => this.stepThreeComponent,
      });
    }

    this.cdr.detectChanges();
  }
  getInfoCoureAddOrUpdate() {
    this.courseId = Number(
      this.courseService.getParamByName(this.route, COURSE_CONST.ID) || 0,
    );
    this.slideParam = Number(
      this.courseService.getParamByName(this.route, COURSE_CONST.SLIDE) || 0,
    );
    this.stepParam = Number(
      this.courseService.getParamByName(this.route, COURSE_CONST.STEP) || 0,
    );
    if (this.courseId > 0) {
      this.courses =
        this.courseService.retrieveFromLocalStorage(STORAGE_KEY.COURSES) || [];
      const course = this.courses.filter(
        (course: any) => course.id == this.courseId,
      );
      if (course.length > 0) {
        this.flgPreview = true;
        this.courseTitle = course[0].title;
        this.categoryName = course[0].category;
        this.slides = course[0].slides;
        this.currentStep = 1;
        this.slideNumber = 0;
        this.route.queryParams.pipe(first()).subscribe((params) => {
          const stepFromQuery = Number(params[COURSE_CONST.STEP]);
          const slideNumberFromQuery = Number(params[COURSE_CONST.SLIDE]);
          if (stepFromQuery !== undefined && !isNaN(stepFromQuery)) {
            this.currentStep = stepFromQuery - 1;
          }
          if (
            slideNumberFromQuery !== undefined &&
            !isNaN(slideNumberFromQuery)
          ) {
            this.slideNumber = slideNumberFromQuery - 1;
          }
        });

        this.courseService.saveToLocalStorage(
          STORAGE_KEY.COURSE_BUILDER_STEPS,
          this.slides?.[this.slideNumber] || {},
        );
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.route.queryParams.pipe(first()).subscribe((params) => {
        const stepFromQuery = Number(params[COURSE_CONST.STEP]);
        const slideNumberFromQuery = Number(params[COURSE_CONST.SLIDE]);
        this.courseTitle = params[COURSE_CONST.EVENT_NAME];
        this.categoryName = params[COURSE_CONST.CATEGORY_NAME];
        if (stepFromQuery !== undefined && !isNaN(stepFromQuery)) {
          this.currentStep = stepFromQuery - 1;
        }
        if (
          slideNumberFromQuery !== undefined &&
          !isNaN(slideNumberFromQuery)
        ) {
          this.slideNumber = slideNumberFromQuery - 1;
        }
      });
    }
    // const fromPreviewMode = this.route.snapshot.queryParamMap.get('fromPreviewMode');
    // if(fromPreviewMode === 'true'){
    //   this.currentStep = 0;
    // }
  }
  handleSaveAndExitCallBack(): void {
    const currentComponent = this.steps[this.currentStep].getComponent();
    if (currentComponent) {
      currentComponent.submitForm();
    }
    this.saveSlides();
    this.saveCourseData();
    this.router.navigate(['/']);
  }
  handleFinishCallBack(): void {
    this.saveCourseData(true);
    this.router.navigate(['/view-courses']);
  }
  handlePreviewCallBack(): void {
    this.saveCourseData(false);
    const url = this.router
      .createUrlTree(['/view-courses/' + this.courseId], {
        queryParams: { previewMode: 'true' },
      })
      .toString();
    window.open(url, '_blank');
  }

  validateCurrentStep(): boolean {
    const currentComponent = this.steps[this.currentStep].getComponent();
    if (currentComponent) {
      return currentComponent.submitForm();
    }
    return false; // default return for other steps.
  }

  goBack(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateQueryParam();
    } else {
      if (
        this.slideNumber - 1 >= 0 &&
        this.slideNumber - 1 < this.slides.length
      ) {
        const slide = this.slides[this.slideNumber - 1];
        this.courseService.saveToLocalStorage(
          STORAGE_KEY.COURSE_BUILDER_STEPS,
          slide,
        );
        this.formData = slide;
        this.slideNumber--;
        if (slide?.stepThree?.imageForms) {
          this.currentStep = 3;
        } else {
          this.currentStep = 2;
          if (this.steps.length == 4) {
            this.steps.pop();
          }
        }
        this.updateQueryParam();
      } else {
        this.courseService.deleteFromLocalStorage(
          STORAGE_KEY.COURSE_BUILDER_STEPS,
        );
        this.router.navigate([`/${this.categoryName}`]);
      }
    }
  }

  handleSubmitCallBack(data: any, key: string) {
    this.formData[key] = data;
    if (key === COURSE_CONST.STEP_ONE_DATA) {
      if (data.layer === COURSE_CONST.TWO && this.steps.length < 4) {
        // Check if layer is '2' and if the third step isn't already present
        this.steps.push({
          title: SLIDE_STEP.ADD_LAYER_TWO_CONFIG,
          getComponent: () => this.stepThreeComponent,
        });
      } else if (data.layer !== COURSE_CONST.TWO && this.steps.length === 4) {
        // Check if layer isn't '2' and if the third step is present
        this.steps.pop();
      }
    }
  }

  goForward(): void {
    if (this.currentStep === this.steps.length - 1) {
      if (!this.handleCourseCompletion(true)) {
        return;
      }

      if (this.slideNumber < this.slides.length) {
        this.formData = this.slides[this.slideNumber];
        this.currentStep = 1;
        this.updateQueryParam();
        this.courseService.saveToLocalStorage(
          STORAGE_KEY.COURSE_BUILDER_STEPS,
          this.slides[this.slideNumber],
        );
      } else {
        this.saveCurrentSlide();
      }
      return;
    }
    if (
      this.validateCurrentStep() &&
      this.currentStep < this.steps.length - 1
    ) {
      this.currentStep++;
      this.updateQueryParam();
    }
  }
  saveCurrentSlide(): void {
    this.saveCourseData();
    this.flgPreview = true;
    this.currentStep = 0;
  }
  handleCourseCompletion(flgNext = false): boolean {
    const currentComponent = this.steps[this.currentStep].getComponent();
    if (currentComponent && currentComponent.submitForm()) {
      this.saveSlides(flgNext);
      return true;
    }
    return false;
  }
  saveSlides(flgNext = false): void {
    const courseBuilderSteps = this.courseService.retrieveFromLocalStorage(
      STORAGE_KEY.COURSE_BUILDER_STEPS,
    );

    if (this.slideNumber < this.slides.length) {
      this.slides[this.slideNumber] = courseBuilderSteps;
    } else {
      this.slides.push(courseBuilderSteps);
    }
    this.slideNumber++;

    this.courseService.deleteFromLocalStorage(STORAGE_KEY.COURSE_BUILDER_STEPS);
  }

  saveCourseData(flgFinish = false): void {
    const courses =
      this.courseService.retrieveFromLocalStorage(STORAGE_KEY.COURSES) || [];
    if (this.courseId < 1) {
      this.courseId = this.courseService.generateCourseId();
    }
    const slides = this.slides || [];

    const course = {
      id: this.courseId,
      title: this.courseTitle,
      category: this.categoryName,
      version: 1,
      slides: slides ? slides : [],
      status: flgFinish == true ? 'completed' : 'not completed',
      path: '/view-courses/' + this.courseId,
      lastPageCompleted: 0,
      createdBy: 'admin',
      createdAt: new Date(),
      lastUpdatedBy: 'admin',
      lastUpdatedAt: new Date(),
    };

    const foundedCourse = courses.find(
      (course: any) => course.id === this.courseId,
    );
    console.log(foundedCourse, this.slides);
    if (foundedCourse && slides) {
      foundedCourse.slides = slides;
      (foundedCourse.status =
        flgFinish == true ? 'completed' : 'not completed'),
        (foundedCourse.path = '/view-courses/' + this.courseId);
      foundedCourse.lastUpdatedAt = new Date();
    } else {
      this.courseId = this.courseId;
      courses.push(course);
    }
    this.courseService.saveToLocalStorage('courses', courses);
  }

  handleAddAnotherSlide(): void {
    // Trigger stepThreeComponent's submitForm()
    const courseBuilderSteps = this.courseService.retrieveFromLocalStorage(
      STORAGE_KEY.COURSE_BUILDER_STEPS,
    );
    if (this.currentStep == 0 && !courseBuilderSteps?.stepOne?.layerOptions) {
      this.currentStep = 1;
      return;
    }

    const currentComponent = this.steps[this.currentStep].getComponent();
    if (currentComponent && currentComponent.submitForm()) {
      // Step 1: Save the current slide progress
      this.saveCourseData();

      // Step 2: Clear the previous data from local storage

      // Steps 3 and 4: Reset the currentStep and update the query params
      this.steps = [
        {
          title: SLIDE_STEP.ADD_NEW_SLIDE,
          getComponent: () => this.stepZeroComponent,
        },
        {
          title: SLIDE_STEP.SETUP_LAYER,
          getComponent: () => this.stepOneComponent,
        },
        {
          title: SLIDE_STEP.ADD_LAYER_ONE_CONFIG,
          getComponent: () => this.stepTwoComponent,
        },
      ];
      this.currentStep = 1;
      this.updateQueryParam();
    } else {
      // Handle the case where the form submission in stepThreeComponent isn't valid
      console.error(
        'Failed to save the current slide. Please ensure all fields are correctly filled.',
      );
    }
  }

  updateQueryParam(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { step: this.currentStep + 1, slide: this.slideNumber + 1 },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
  validateStep(step: number) {
    return this.currentStep === step;
  }
  backButtonHide() {
    return this.currentStep >= 0;
  }
  nextButtonHide() {
    return this.currentStep > 0;
  }
}
