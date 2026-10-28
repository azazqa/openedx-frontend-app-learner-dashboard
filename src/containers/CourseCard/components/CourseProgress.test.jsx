import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useCourseData from 'hooks/useCourseData';
import { fetchProgressRates } from 'data/services/lms/api';

import CourseProgress from './CourseProgress';

jest.mock('hooks/useCourseData', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('data/services/lms/api', () => ({
  fetchProgressRates: jest.fn(),
}));

const courseId = 'course-v1:org+course+run';

const renderProgress = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <CourseProgress cardId="card-0" />
    </QueryClientProvider>,
  );
};

describe('CourseProgress', () => {
  beforeEach(() => {
    useCourseData.mockReturnValue({ courseRun: { courseId } });
  });

  it('shows the course rate to one decimal and fills the bar', async () => {
    fetchProgressRates.mockResolvedValue({ [courseId]: '12.5' });
    renderProgress();
    expect(await screen.findByText('12.5%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveStyle({ width: '12.5%' });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '12.5');
  });

  it('shows 0.0% when the course has no rate', async () => {
    fetchProgressRates.mockResolvedValue({});
    renderProgress();
    expect(await screen.findByText('0.0%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveStyle({ width: '0%' });
  });

  it('renders nothing until the rates arrive', async () => {
    let resolveRates;
    fetchProgressRates.mockReturnValue(new Promise((resolve) => {
      resolveRates = resolve;
    }));
    renderProgress();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    resolveRates({ [courseId]: '80.0' });
    await waitFor(() => expect(screen.getByText('80.0%')).toBeInTheDocument());
  });
});
