import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LocalStorageUtils } from '../core/utils';
import { CourseService } from '../course.service';
import { CATEGORIES, COURSE_CONST, STORAGE_KEY } from '../create-course/data';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  courseId: number = 0;
  foundedCourse: any;

  constructor(
    private router: Router,
    private message: NzMessageService,
    private activateRoute: ActivatedRoute,
    private courseService: CourseService,
  ) {}
  mode!: string;
  eventName: string = '';
  categoryName!: string;
  editDisabled!: boolean;
  courses: any[] = [];
  foundCourse = {};
  categories: string[] = CATEGORIES;
  ngOnInit(): void {
    this.courseService.deleteCourseBuilderSteps();
    this.categoryName = this.courseService.getParamByName(
      this.activateRoute,
      'categoryName',
    );
    if (!this.categories.includes(this.categoryName)) {
      this.router.navigate(['/not-found']);
      return;
    }
    this.editDisabled = this.courseService.isEditDisabled();
    this.getCourseMode();
  }
  getCourseMode() {
    this.courseId = Number(
      this.courseService.getQueryParamByName(this.activateRoute, 'courseId') ||
        0,
    );
    this.courses = this.courseService.getCoursesFromLocalStorage();
    if (this.courseId > 0) {
      this.mode = COURSE_CONST.UPDATE_MODE;
      this.foundedCourse = this.courses.find(
        (course: any) => course.id === this.courseId,
      );
      this.eventName = (this.foundedCourse as any)?.title;
    }
  }
  handleSaveAndExit(): void {
    if (
      (this.mode === COURSE_CONST.CREATE_MODE ||
        this.mode === COURSE_CONST.UPDATE_MODE) &&
      this.eventName.trim().length < 1
    ) {
      this.message.warning('Please enter event name');
      return;
    }
    if (this.mode == COURSE_CONST.CREATE_MODE) {
      this.courseId = this.courseService.generateCourseId();
    }

    const course = {
      id: this.courseId,
      title: this.eventName.trim(),
      category: this.categoryName,
      version: 1,
      slides: [],
      status: 'not completed',
      path: '/view-courses/' + this.courseId,
      createdBy: 'admin',
      createdAt: new Date(),
      lastUpdatedBy: 'admin',
      lastUpdatedAt: new Date(),
    };
    if (this.mode == COURSE_CONST.CREATE_MODE) {
      this.courses.push(course);
    } else {
      const updateCourse = this.courses.find(
        (course: any) => course.id === this.courseId,
      );
      if (updateCourse.status == COURSE_CONST.COMPLETED) {
      } else {
        updateCourse.lastUpdatedAt = new Date();
        updateCourse.status = COURSE_CONST.NOT_COMPLETED;
        updateCourse.title = this.eventName.trim();
      }
    }
    this.courseService.saveToLocalStorage(STORAGE_KEY.COURSES, this.courses);
    if (this.mode == COURSE_CONST.UPDATE_MODE) {
      this.router.navigate(['/view-courses']);
    } else {
      this.goBackToHome();
    }
  }

  handleCreateNewCourse(): void {
    this.mode = 'CREATE';
  }

  handleNavigation(): void {
    if (
      (this.mode === COURSE_CONST.CREATE_MODE ||
        this.mode === COURSE_CONST.UPDATE_MODE) &&
      this.eventName.trim().length < 1
    ) {
      this.message.warning('Please enter event/course name');
      return;
    }
    if (this.mode == COURSE_CONST.UPDATE_MODE) {
      const updateCourse = this.courses.find(
        (course: any) => course.id === this.courseId,
      );
      updateCourse.status = COURSE_CONST.NOT_COMPLETED;
      updateCourse.title = this.eventName;
      this.courseService.saveToLocalStorage(STORAGE_KEY.COURSES, this.courses);
      this.router.navigate(['/edit-courses/' + this.courseId], {
        queryParams: { step: 2, slide: 1 },
      });
    } else {
      this.router.navigate(['/create-course'], {
        queryParams: {
          step: 1,
          'event-name': this.eventName,
          'category-name': this.categoryName,
        },
      });
    }
  }
  goBack(): void {
    this.mode = '';
  }
  goBackToHome(): void {
    this.router.navigate(['/']);
  }
  validateUpdateOrCreate() {
    return this.mode === 'CREATE' || this.mode === 'UPDATE';
  }
  notMode() {
    return !this.mode;
  }
}
