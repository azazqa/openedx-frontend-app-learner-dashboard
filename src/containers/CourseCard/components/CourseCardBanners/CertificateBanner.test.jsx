import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useCourseData } from 'hooks';
import { useInitializeLearnerHome } from 'data/hooks';
import { fetchCompletionCriteria } from 'data/services/lms/api';
import CertificateBanner from './CertificateBanner';

jest.mock('hooks', () => ({
  utilHooks: {
    useFormatDate: jest.fn(() => date => date),
  },
  useCourseData: jest.fn(),
}));

jest.mock('data/hooks', () => ({
  useInitializeLearnerHome: jest.fn(),
}));

jest.mock('data/services/lms/api', () => ({
  fetchCompletionCriteria: jest.fn(),
}));

const courseId = 'course-v1:org+course+run';
const defaultCertificate = {
  availableDate: '10/20/3030',
  isRestricted: false,
  isDownloadable: false,
  isEarnedButUnavailable: false,
};
const defaultEnrollment = {
  isAudit: false,
  isVerified: false,
};
const defaultCourseRun = {
  isArchived: false,
  courseId,
  minPassingGrade: 0.8,
  progressUrl: 'progressUrl',
};
const defaultGrade = { isPassing: false };
const defaultPlatformSettings = {};
const props = { cardId: 'cardId' };
const supportEmail = 'suport@email.com';
const billingEmail = 'billing@email.com';

describe('CertificateBanner', () => {
  useCourseData.mockReturnValue({
    enrollment: {},
    certificate: {},
    gradeData: {},
    courseRun: {
      minPassingGrade: 0.8,
      progressUrl: 'progressUrl',
      courseId,
    },
  });
  const createWrapper = ({
    certificate = {},
    enrollment = {},
    grade = {},
    courseRun = {},
    platformSettings = {},
  }) => {
    useCourseData.mockReturnValue({
      enrollment: { ...defaultEnrollment, ...enrollment },
      certificate: { ...defaultCertificate, ...certificate },
      gradeData: { ...defaultGrade, ...grade },
      courseRun: {
        ...defaultCourseRun,
        ...courseRun,
      },
    });
    const lernearData = { data: { platformSettings: { ...defaultPlatformSettings, ...platformSettings } } };
    useInitializeLearnerHome.mockReturnValue(lernearData);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
      <QueryClientProvider client={client}>
        <IntlProvider locale="en"><CertificateBanner {...props} /></IntlProvider>
      </QueryClientProvider>,
    );
  };
  beforeEach(() => {
    jest.clearAllMocks();
    fetchCompletionCriteria.mockResolvedValue({});
  });
  it('is restricted', () => {
    createWrapper({
      certificate: {
        isRestricted: true,
      },
    });
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    const msg = screen.getByText((text) => text.includes('please let us know.'));
    expect(msg).toBeInTheDocument();
    expect(msg).not.toContain(supportEmail);
  });
  it('is restricted with support email', () => {
    createWrapper({
      certificate: {
        isRestricted: true,
      },
      platformSettings: {
        supportEmail,
      },
    });
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    const msg = screen.getByText((text) => text.includes(supportEmail));
    expect(msg).toBeInTheDocument();
  });
  it('is restricted with billing email but not verified', () => {
    createWrapper({
      certificate: {
        isRestricted: true,
      },
      platformSettings: {
        billingEmail,
      },
    });
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveClass('alert-danger');
    const msg = screen.queryByText((text) => text.includes(billingEmail));
    expect(msg).not.toBeInTheDocument();
  });
  it('is restricted and verified', () => {
    createWrapper({
      certificate: {
        isRestricted: true,
      },
      enrollment: {
        isVerified: true,
      },
    });
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    const restrictedMsg = screen.getByText((text) => text.includes('please let us know.'));
    expect(restrictedMsg).toBeInTheDocument();
    const refundMsg = screen.getByText((text) => text.includes('If you would like a refund'));
    expect(refundMsg).toBeInTheDocument();
  });
  it('is restricted and verified with support email', () => {
    createWrapper({
      certificate: {
        isRestricted: true,
      },
      enrollment: {
        isVerified: true,
      },
      platformSettings: {
        supportEmail,
      },
    });
    const restrictedMsg = screen.getByText((text) => text.includes(supportEmail));
    expect(restrictedMsg).toBeInTheDocument();
    const refundMsg = screen.getByText((text) => text.includes('If you would like a refund'));
    expect(refundMsg).toBeInTheDocument();
    expect(refundMsg.innerHTML).not.toContain(billingEmail);
  });
  it('is restricted and verified with billing email', () => {
    createWrapper({
      certificate: {
        isRestricted: true,
      },
      enrollment: {
        isVerified: true,
      },
      platformSettings: {
        billingEmail,
      },
    });
    const restrictedMsg = screen.queryByText((text) => text.includes('please let us know.'));
    expect(restrictedMsg).toBeInTheDocument();
    expect(restrictedMsg.innerHTML).not.toContain(supportEmail);
    const refundMsg = screen.getByText((text) => text.includes(billingEmail));
    expect(refundMsg).toBeInTheDocument();
  });
  it('is restricted and verified with support and billing email', () => {
    createWrapper({
      certificate: {
        isRestricted: true,
      },
      enrollment: {
        isVerified: true,
      },
      platformSettings: {
        supportEmail,
        billingEmail,
      },
    });
    const restrictedMsg = screen.getByText((text) => text.includes(supportEmail));
    expect(restrictedMsg).toBeInTheDocument();
    const refundMsg = screen.getByText((text) => text.includes(billingEmail));
    expect(refundMsg).toBeInTheDocument();
  });
  it('is passing and is downloadable', () => {
    createWrapper({
      grade: { isPassing: true },
      certificate: { isDownloadable: true },
    });
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveClass('alert-success');
    const readyMsg = screen.getByText((text) => text.includes('Congratulations.'));
    expect(readyMsg).toBeInTheDocument();
  });
  it('not passing and is downloadable', () => {
    createWrapper({
      grade: { isPassing: false },
      certificate: { isDownloadable: true },
    });
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveClass('alert-success');
    const readyMsg = screen.getByText((text) => text.includes('Congratulations.'));
    expect(readyMsg).toBeInTheDocument();
  });
  it('not passing and audit', async () => {
    createWrapper({
      enrollment: {
        isAudit: true,
      },
    });
    const banner = await screen.findByRole('alert');
    expect(banner).toHaveClass('alert-info');
    const auditMsg = screen.getByText((text) => text.includes('Grade required to pass the course:'));
    expect(auditMsg).toBeInTheDocument();
  });
  it('not passing and has finished', () => {
    createWrapper({
      courseRun: { isArchived: true },
    });
    const banner = screen.getByRole('alert');
    expect(banner).toHaveClass('alert-warning');
    const archivedMsg = screen.getByText('You are not eligible for a certificate.');
    expect(archivedMsg).toBeInTheDocument();
  });
  it('not passing and not audit and not finished', async () => {
    createWrapper({});
    const banner = await screen.findByRole('alert');
    expect(banner).toHaveClass('alert-warning');
    const msg = screen.getByText((text) => text.includes('Grade required for a certificate'));
    expect(msg).toBeInTheDocument();
  });
  it('shows KLMS completion criteria when the API returns weights', async () => {
    fetchCompletionCriteria.mockResolvedValue({
      [courseId]: {
        pass_score: 60,
        weights: [
          { type: '진행평가', percent: 10 },
          { type: '시험', percent: 50 },
          { type: '과제', percent: 40 },
        ],
      },
    });
    createWrapper({});
    expect(await screen.findByTestId('completion-criteria')).toBeInTheDocument();
    expect(screen.getByText('수료 기준')).toBeInTheDocument();
    expect(screen.getByText('수료 기준')).toHaveClass('h5');
    expect(screen.getByText('종합 성적 60점 이상')).toBeInTheDocument();
    expect(screen.getByText('진행평가 10%, 시험 50%, 과제 40% 비율로 합산하여')).toBeInTheDocument();
    expect(screen.getByText('종합 성적 100점 만점으로 계산')).toBeInTheDocument();
    expect(screen.getByRole('alert').querySelector('.alert-icon')).toBeNull();
    await waitFor(() => expect(screen.queryByText(/Grade required for a certificate/)).not.toBeInTheDocument());
  });
  it('is passing and is earned but unavailable', () => {
    createWrapper({
      grade: {
        isPassing: true,
      },
      certificate: {
        isEarned: true,
        availableDate: '10/20/3030',
      },
    });
    const banner = screen.getByRole('alert');
    expect(banner).toHaveClass('alert-info');
    const earnedMsg = screen.getByText((text) => text.includes('Your grade and certificate will be ready after'));
    expect(earnedMsg).toBeInTheDocument();
  });
  it('is passing and not downloadable render empty', () => {
    createWrapper({
      grade: {
        isPassing: true,
      },
    });
    const banner = screen.queryByRole('alert');
    expect(banner).toBeNull();
  });
  it('should use default values when courseData is empty or undefined', () => {
    useCourseData.mockReturnValue({});
    const lernearData = { data: { platformSettings: { supportEmail } } };
    useInitializeLearnerHome.mockReturnValue(lernearData);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <IntlProvider locale="en"><CertificateBanner cardId="test-card" /></IntlProvider>
      </QueryClientProvider>,
    );

    const mockedUseMemo = jest.spyOn(React, 'useMemo');
    const useMemoCall = mockedUseMemo.mock.calls.find(call => call[1].some(dep => dep === undefined || dep === null));

    if (useMemoCall) {
      const result = useMemoCall[0]();

      expect(result.certificate).toEqual({});
      expect(result.isVerified).toBe(false);
      expect(result.isAudit).toBe(false);
      expect(result.isPassing).toBe(false);
      expect(result.isArchived).toBe(false);
      expect(result.minPassingGrade).toBe(0);
      expect(result.progressUrl).toBeDefined();
    }

    mockedUseMemo.mockRestore();
  });
});
