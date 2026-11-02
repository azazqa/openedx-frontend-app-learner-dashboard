import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  courseStatus: {
    id: 'learner-dash.courseListFilters.courseStatus',
    description: 'course status filter form heading',
    defaultMessage: 'Course Status',
  },
  inProgress: {
    id: 'learner-dash.courseListFilters.inProgress',
    description: 'in-progress filter checkbox label for course list filters',
    defaultMessage: 'In-Progress',
  },
  notStarted: {
    id: 'learner-dash.courseListFilters.notStarted',
    description: 'Not-Started filter checkbox label for course list filters',
    defaultMessage: 'Not Started',
  },
  done: {
    id: 'learner-dash.courseListFilters.done',
    description: 'done filter checkbox label for course list filters',
    defaultMessage: 'Done',
  },
  notEnrolled: {
    id: 'learner-dash.courseListFilters.notEnrolled',
    description: 'not-enrolled filter checkbox label for course list filters',
    defaultMessage: 'Not Enrolled',
  },
  upgraded: {
    id: 'learner-dash.courseListFilters.upgraded',
    description: 'upgraded filter checkbox label for course list filters',
    defaultMessage: 'Upgraded',
  },
  clearAll: {
    id: 'learner-dash.courseListFilters.clearAll',
    description: 'clear all filters button text',
    defaultMessage: 'Clear all',
  },
  sort: {
    id: 'learner-dash.courseListFilters.sort',
    description: 'Sort radio form heading',
    defaultMessage: 'Sort',
  },
  sortLastEnrolled: {
    id: 'learner-dash.courseListFilters.sortLastEnrolled',
    description: 'Last enrolled sort option text',
    defaultMessage: 'Last enrolled',
  },
  sortTitle: {
    id: 'learner-dash.courseListFilters.sortTitle',
    description: 'Title sort option text',
    defaultMessage: 'Title (A-Z)',
  },
  refine: {
    id: 'klms.learnerDashboard.courseListFilters.refine',
    description: '강좌 목록 필터 버튼. 번역 저장소의 Refine 문구를 쓰지 않습니다.',
    defaultMessage: '필터',
  },
});

export default messages;
