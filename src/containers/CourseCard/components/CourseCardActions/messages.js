import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  beginCourse: {
    id: 'learner-dash.courseCard.actions.beginCourse',
    description: 'Course card begin-course button text',
    defaultMessage: 'Begin Course',
  },
  resume: {
    id: 'klms.learnerDashboard.courseCard.actions.resume',
    description: '강좌 카드 학습 버튼. 번역 저장소의 Resume 문구를 쓰지 않습니다.',
    defaultMessage: '학습하기',
  },
  viewCourse: {
    id: 'learner-dash.courseCard.actions.viewCourse',
    description: 'Course card view-course button text',
    defaultMessage: 'View Course',
  },
  selectSession: {
    id: 'learner-dash.courseCard.actions.selectSession',
    description: 'Course card select-session button text',
    defaultMessage: 'Select Session',
  },
});

export default messages;
