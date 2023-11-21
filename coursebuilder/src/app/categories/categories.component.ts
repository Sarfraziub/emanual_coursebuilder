import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { LocalStorageUtils } from "../core/utils";
@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent {
  constructor(
    private router: Router,
    private message: NzMessageService,
  ) {
    LocalStorageUtils.deleteFromLocalStorage("courseBuilderSteps");
  }
  mode!: string;
  eventName!: string;
  categories: any[] = [
    {
      name: "EDE Course Content",
      id: "edeCourseContent",
      disabled: false,
    },
    {
      name: "TBS Course Content",
      id: "tbsCourseContent",
      disabled: true,
    },
    {
      name: "BDL Course Content",
      id: "bdlCourseContent",
      disabled: true,
    },
    {
      name: "Quiz",
      id: "quiz",
      disabled: true,
    },
    {
      name: "Questionnaire",
      id: "questionnaire",
      disabled: true,
    },
    {
      name: "ETC",
      id: "etc",
      disabled: true,
    },
  ];
  categoryOnClick(id: string): void {
    this.router.navigate([`/${id}`]);
  }
}
