import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LayerTwoModalComponent } from './components/layer-two-modal/layer-two-modal.component';
import {
  COMPLETION_NEXT_RULE,
  COURSE_CONST,
  STORAGE_KEY,
} from '../create-course/data';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LocalStorageUtils } from '../core/utils';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss'],
})
export class ViewCourseComponent implements OnInit {
  courseId: number = 0;
  slideIndex: number = 0;
  course: any;
  layerViewStatus: boolean[][] = [];
  imagesCount: number = 0;
  previewMode: boolean = false;
  slideParam: number = 0;
  stepParam: number = 0;
  flgCongratulation: boolean = false;
  courses: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NzModalService,
    private message: NzMessageService,
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    this.courseService.deleteCourseBuilderSteps();
    this.getSelectedCourseInfo();

    this.initLayerViewStatus();
  }

  editSlide(): void {
    // /edit-courses/Arsam?step=2&slide=1
    this.router.navigate([`/edit-courses/${this.courseId}`], {
      queryParams: {
        step: 2,
        slide: this.slideIndex + 1,
      },
    });
  }

  getSelectedCourseInfo() {
    this.courseId = Number(this.route.snapshot.paramMap.get(COURSE_CONST.ID));
    this.slideParam = Number(
      this.route.snapshot.queryParamMap.get(COURSE_CONST.SLIDE),
    );
    this.stepParam = Number(
      this.route.snapshot.queryParamMap.get(COURSE_CONST.STEP),
    );
    var previewModeParam = this.route.snapshot.queryParamMap.get(
      COURSE_CONST.PREVIEW_MODE,
    );
    if (previewModeParam !== null) {
      this.previewMode = previewModeParam === COURSE_CONST.TRUE;
    }

    this.slideIndex = this.slideParam
      ? parseInt(this.slideParam.toString(), 10) - 1
      : 0;

    this.course = this.getCourseByIdFromLocalStorage(this.courseId);
    var images = this.course.slides[this.slideIndex]?.stepTwo?.images;

    if (images != undefined) {
      this.imagesCount = images.length;
    }
    if (!this.course) {
      console.error('Course not found!');
      // Handle course not found scenario
    }
  }
  initLayerViewStatus(): void {
    this.layerViewStatus = this.course.slides.map((slide: any) =>
      slide.stepThree?.imageForms
        ? slide.stepThree?.imageForms?.map(() => false)
        : [],
    );
  }

  getCourseByIdFromLocalStorage(id: number): any {
    return this.courseService.getCourseByIdFromLocalStorage(id) || {};
  }
  goToNextSlide(): void {
    if (this.canNavigateToNextSlide()) {
      this.slideIndex++;
      this.updateSlideQueryParam();
    }
  }

  handleExit(): void {
    this.router.navigate(['/view-courses']);
  }
  deleteCourse(): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this page?',
    );
    if (confirmed) {
      this.courses = this.courseService.getCoursesFromLocalStorage();
      const course = this.courses.find((course) => course.id === this.courseId);
      if (course && course.id > 0) {
        course.slides.splice(this.slideIndex, 1);
        this.courseService.saveToLocalStorage(
          STORAGE_KEY.COURSES,
          this.courses,
        );
        this.router.navigate(['/']);
      }
    }
  }

  handleNavigation(): void {
    if (this.canNavigateToNextSlide()) {
      // Navigate to the next slide
      this.goToNextSlide();
    } else if (this.isLastSlide() && this.isCurrentSlideFullyViewed()) {
      // Navigate to view-courses if on the last slide and all layers have been viewed
      if (this.previewMode) {
        const queryParams = {
          fromPreviewMode: COURSE_CONST.TRUE,
          step: this.stepParam,
          slide: this.slideParam,
        };
        this.router.navigate(['/edit-courses/' + this.courseId], {
          queryParams: queryParams,
        });
      } else {
        this.flgCongratulation = true;
        //this.router.navigate(['/']);
      }
    }
  }

  canNavigateToNextSlide(): boolean {
    return !this.isLastSlide() && this.isCurrentSlideFullyViewed();
  }

  isLastSlide(): boolean {
    return this.slideIndex === this.course.slides.length - 1;
  }

  isCurrentSlideFullyViewed(): boolean {
    this.courses = [];
    this.courses = this.courseService.getCoursesFromLocalStorage();
    const course = this.courses.find((course) => course.id === this.courseId);
    const enabledNext = course.slides[this.slideIndex].stepOne.enabledNext;
    if (enabledNext == COMPLETION_NEXT_RULE.PAGE_LOADED) {
      if (!this.previewMode) this.updateLastSlide();
      return true;
    } else if (enabledNext == COMPLETION_NEXT_RULE.LAYER_2_COMPLETED) {
      const currentSlideLayers = this.layerViewStatus[this.slideIndex];
      const result = currentSlideLayers.every((layer) => layer);
      if (result) {
        this.updateLastSlide();
      }
      return result;
    }
    if (!this.previewMode) this.updateLastSlide();
    return true;
  }

  updateLastSlide() {
    this.courses = [];
    this.courses = this.courseService.getCoursesFromLocalStorage();
    const course = this.courses.find((course) => course.id === this.courseId);
    if (
      (course.lastPageCompleted == undefined ? 0 : course.lastPageCompleted) <
      this.slideIndex + 1
    ) {
      course.lastPageCompleted = this.slideIndex + 1;
      course.completionPercentage = (
        (course.lastPageCompleted / course.slides.length) *
        100
      ).toFixed(2);
      this.courseService.deleteFromLocalStorage(STORAGE_KEY.COURSES);
      this.courseService.saveToLocalStorage(STORAGE_KEY.COURSES, this.courses);
    }
  }

  goToPreviousSlide(): void {
    if (this.slideIndex > 0) {
      this.slideIndex--;
      this.updateSlideQueryParam();
    }
  }

  private updateSlideQueryParam(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { slide: this.slideIndex + 1 },
      queryParamsHandling: 'merge',
    });
    var images = this.course.slides[this.slideIndex]?.stepTwo?.images;
    if (images != undefined) {
      this.imagesCount = images.length;
    } else {
      this.imagesCount = 0;
    }
  }

  showLayerTwoContent(index: number): void {
    const layerTwoContent =
      this.course.slides[this.slideIndex]?.stepThree?.imageForms?.[index];
    if (!layerTwoContent) {
      console.error('Layer 2 content not found!');
      return;
    }

    this.modalService.create({
      nzTitle: `${layerTwoContent?.pageTitle}`,
      nzContent: LayerTwoModalComponent, // You will create this component
      nzData: {
        text: layerTwoContent.editor,
        image: layerTwoContent.image,
      },
      nzFooter: null,
      nzMaskClosable: false,
    });
    this.layerViewStatus[this.slideIndex][index] = true;
  }
  validateCongrat() {
    return !this.flgCongratulation;
  }
  slideViewValidation() {
    return this.course.slides[this.slideIndex] && !this.flgCongratulation;
  }
  imageCount0() {
    return this.imagesCount == 0;
  }
  imageCount1() {
    return this.imagesCount == 1;
  }
  imageCount2() {
    return this.imagesCount == 2;
  }
  imageCount2Or1() {
    return this.imagesCount == 1 || this.imagesCount == 2;
  }
  imageCountGreaterThan2() {
    return this.imagesCount > 2;
  }
  slideViewValidation2() {
    return (
      this.course.slides[this.slideIndex]?.stepTwo?.images &&
      this.course.slides[this.slideIndex]?.stepTwo?.images.length > 0
    );
  }
}
