import { Injectable } from '@angular/core';
import { LocalStorageUtils } from './core/utils';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor() {}

  deleteCourseBuilderSteps() {
    LocalStorageUtils.deleteFromLocalStorage('courseBuilderSteps');
  }
  getParamByName(activateRoute: ActivatedRoute, name: string): string {
    return activateRoute.snapshot.paramMap.get(name) || '';
  }
  getQueryParamByName(activateRoute: ActivatedRoute, name: string): string {
    let result = '';
    activateRoute.queryParams.subscribe((params) => {
      result = params[name];
    });
    return result;
  }
  isEditDisabled() {
    return LocalStorageUtils.retrieveFromLocalStorage('courses') ? false : true;
  }
  generateCourseId(): number {
    const courseId = LocalStorageUtils.generateCourseId() || 0;
    return Number(courseId);
  }
  getCoursesFromLocalStorage(): any[] {
    return LocalStorageUtils.retrieveFromLocalStorage('courses') || [];
  }
  saveToLocalStorage(key: string, data: any[]): void {
    LocalStorageUtils.saveToLocalStorage(key, data);
  }
  getCourseByIdFromLocalStorage(id: number): any {
    const courses: any[] =
      LocalStorageUtils.retrieveFromLocalStorage('courses') || [];
    return courses.find((course) => course.id === id);
  }
  deleteFromLocalStorage(key: string) {
    LocalStorageUtils.deleteFromLocalStorage(key);
  }
  retrieveFromLocalStorage(key: string) {
    try {
      return LocalStorageUtils.retrieveFromLocalStorage(key);
    } catch (error) {
      console.error(`Error retrieving course from local storage: ${error}`);
      return null;
    }
  }

  updateLocalStorageProperty(key: string, property: string, value: any) {
    try {
      LocalStorageUtils.updateLocalStorageProperty(key, property, value);
    } catch (error) {
      console.error(`Error update Property in local storage: ${error}`);
    }
  }
}
