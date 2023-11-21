import { Option } from './create-course.interfaces';

export const SLIDE_STEP = {
  ADD_NEW_SLIDE: 'Add New Slide',
  SETUP_LAYER: 'Setup Layer',
  ADD_LAYER_ONE_CONFIG: 'Add Layer One Config',
  ADD_LAYER_TWO_CONFIG: 'Add Layer Two Config',
};
export const COMPLETION_NEXT_RULE = {
  PAGE_LOADED: 'PAGE_LOADED',
  LAYER_2_COMPLETED: 'LAYER_2_COMPLETED',
};
export const STORAGE_KEY = {
  COURSE_BUILDER_STEPS: 'courseBuilderSteps',
  COURSES: 'courses',
};
export const CATEGORIES = [
  'edeCourseContent',
  'tbsCourseContent',
  'bdlCourseContent',
  'quiz',
  'questionnaire',
  'etc',
];
export const COURSE_CONST = {
  ONE: '1',
  TWO: '2',
  ID: 'id',
  SLIDE: 'slide',
  STEP: 'step',
  EVENT_NAME: 'event-name',
  CATEGORY_NAME: 'category-name',
  STEP_ONE_DATA: 'stepOneData',
  UPDATE_MODE: 'UPDATE',
  CREATE_MODE: 'CREATE',
  COMPLETED: 'completed',
  NOT_COMPLETED: 'not completed',
  STEP_ONE: 'stepOne',
  LAYER_OPTIONS: 'layerOptions',
  ENABLED_NEXT: 'enabledNext',
  IMAGES: 'images',
  EDITOR: 'editor',
  PAGE_TITLE: 'pageTitle',
  STEP_TWO: 'stepTwo',
  STEP_THREE: 'stepThree',
  IMAGE_FORMS: 'imageForms',
  IMAGE: 'image',
  PREVIEW_MODE: 'previewMode',
  TRUE: 'true',
};

export const LAYER_OPTIONS = {
  Text_Only: 'L1-0P-1',
  L1_L2_OP_1: 'L1-L2-OP-1',
  L1_OP_2: 'L1-OP-2',
  L1_OP_3: 'L1-OP-3',
};

export const LAYER_ONE_OPTIONS: Option[] = [
  {
    label: 'Text Only',
    value: 'L1-0P-1',
  },
  {
    label: 'Text and up to 3 Static Image(s) / Icon(s)',
    value: 'L1-OP-2',
  },
];
export const PAGE_TYPE_OPTIONS: Option[] = [
  {
    label: 'Layer 1',
    value: '1',
  },
  {
    label: 'Layer 1 and 2',
    value: '2',
  },
];

export const LAYER_ONE_AND_TWO_OPTIONS: Option[] = [
  {
    label: 'Text and up to 3 Clickable Image(s) / Icon(s)',
    value: 'L1-L2-OP-1',
  },
];
export const LAYER_TWO_OPTIONS: Option[] = [
  {
    label: 'Text Only',
    value: 'L1-0P-1',
  },
];

export const CompletionRule: Option[] = [
  {
    label: 'When Layer 1 is loaded(In any session)',
    value: COMPLETION_NEXT_RULE.PAGE_LOADED,
  },
  {
    label: 'When all Layer 2 pages are loaded (In any session)',
    value: COMPLETION_NEXT_RULE.LAYER_2_COMPLETED,
  },
];
