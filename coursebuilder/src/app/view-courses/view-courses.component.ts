import { Component, OnInit } from '@angular/core';
import { LocalStorageUtils } from '../core/utils';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CourseService } from '../course.service';
import { COURSE_CONST, STORAGE_KEY } from '../create-course/data';

@Component({
  selector: 'app-view-courses',
  templateUrl: './view-courses.component.html',
  styleUrls: ['./view-courses.component.scss'],
})
export class ViewCoursesComponent implements OnInit {
  courses: any[] = [];
  styleObject: any;
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private courseService: CourseService,
  ) {}
  ngOnInit(): void {
    this.courseService.deleteCourseBuilderSteps();
    this.courses = this.courseService.getCoursesFromLocalStorage() || [];
    this.setStyle();
  }
  setStyle() {
    this.styleObject = this.courseService.getStyle();
    document.documentElement.style.setProperty(
      '--bgColorPrevBtn',
      this.styleObject.bgColorPrevBtn,
    );
    document.documentElement.style.setProperty(
      '--bgColorIcon',
      this.styleObject.bgColorIcon,
    );
  }

  editCourse(id: any) {
    this.router.navigate(['/edeCourseContent'], {
      queryParams: { courseId: id },
    });
  }
  duplicateCourse(id: any) {
    const foundedCourse = this.courses.find((course: any) => course.id === id);
    const copyObject = { ...foundedCourse };
    copyObject.status = COURSE_CONST.NOT_COMPLETED;
    copyObject.lastPageCompleted = 0;
    copyObject.completionPercentage = 0;
    copyObject.id = LocalStorageUtils.generateCourseId();
    copyObject.path = '/view-courses/' + copyObject.id;
    copyObject.version = foundedCourse.version + 1;
    foundedCourse.duplicated = true;
    this.courses.push(copyObject);
    var newCourses = [...this.courses];
    this.courses = newCourses;
    this.courseService.saveToLocalStorage('courses', this.courses);
  }
  deleteCourse(id: any) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this course?',
    );
    if (confirmed) {
      const foundedCourse = this.courses.find(
        (course: any) => course.id === id,
      );
      if (foundedCourse) {
        const indexToRemove = this.courses.indexOf(foundedCourse);
        if (indexToRemove !== -1) {
          this.courses.splice(indexToRemove, 1);
        }
      }
      this.courseService.saveToLocalStorage(STORAGE_KEY.COURSES, this.courses);
      var newCourses = [...this.courses];
      this.courses = newCourses;
    }
  }
  slideLength(data: any) {
    return data?.slides?.length;
  }
  checkCompletedStatus(data: any) {
    return data.status != 'completed';
  }
  checkForDuplicte(data: any) {
    return data.status == 'completed' && data.duplicated !== true;
  }
}
