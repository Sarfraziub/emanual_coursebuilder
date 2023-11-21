import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { ViewCoursesComponent } from './view-courses/view-courses.component';
import { ViewCourseComponent } from './view-course/view-course.component';
import { CategoriesComponent } from './categories/categories.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    component: CategoriesComponent,
    path: '',
  },

  {
    component: CreateCourseComponent,
    path: 'create-course',
  },
  {
    component: NotFoundComponent,
    path: 'not-found',
  },
  {
    component: ViewCoursesComponent,
    path: 'view-courses',
  },
  {
    component: ViewCourseComponent,
    path: 'view-courses/:id',
  },
  {
    component: CreateCourseComponent,
    path: 'edit-courses/:id',
  },
  {
    component: HomeComponent,
    path: ':categoryName',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
