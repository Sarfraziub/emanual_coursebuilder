import { StepOneComponent } from './components/step-one/step-one.component';
import { StepThreeComponent } from './components/step-three/step-three.component';
import { StepTwoComponent } from './components/step-two/step-two.component';
import { StepZeroComponent } from './components/step-zero/step-zero.component';

export interface Option {
  label: string;
  value: string;
}

export interface Course {
  id: string; // unique identifier for each course
  name: string; // unique identifier for each course
  title: string; // the title or name of the course
  slides: Slide[]; // array of slides
  version: number; // versioning for edits
}

interface Slide {
  stepOneData: any; // data from Step One
  stepTwoData: any; // data from Step Two
  stepThreeData: any; // data from Step Three
}

export interface Steps {
  title: string;
  getComponent: () =>
    | StepOneComponent
    | StepTwoComponent
    | StepThreeComponent
    | StepZeroComponent;
}
