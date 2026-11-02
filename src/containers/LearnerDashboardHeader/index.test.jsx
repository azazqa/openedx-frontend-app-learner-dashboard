import { mergeConfig } from '@edx/frontend-platform';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { MemoryRouter } from 'react-router-dom';

import urls from 'data/services/lms/urls';
import LearnerDashboardHeader from '.';
import { findCoursesNavClicked } from './hooks';

const courseSearchUrl = '/course-search-url';

jest.mock('data/hooks', () => ({
  useInitializeLearnerHome: jest.fn().mockReturnValue({
    data: {
      platformSettings: {
        courseSearchUrl,
      },
    },
  }),
}));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  findCoursesNavClicked: jest.fn(),
}));

jest.mock('containers/MasqueradeBar', () => jest.fn(() => <div>MasqueradeBar</div>));
jest.mock('./ConfirmEmailBanner', () => jest.fn(() => <div>ConfirmEmailBanner</div>));

describe('LearnerDashboardHeader', () => {
  beforeEach(() => jest.clearAllMocks());
  it('renders and discover url is correct', () => {
    mergeConfig({ ORDER_HISTORY_URL: 'test-url' });
    render(<MemoryRouter><IntlProvider locale="en"><LearnerDashboardHeader /></IntlProvider></MemoryRouter>);
    expect(screen.getByText('ConfirmEmailBanner')).toBeInTheDocument();
    expect(screen.getByText('MasqueradeBar')).toBeInTheDocument();
    const discover = screen.getByRole('link', { name: '과정' });
    expect(discover).toHaveAttribute('href', urls.baseAppUrl(courseSearchUrl));
    discover.click();
    expect(findCoursesNavClicked).toHaveBeenCalledWith(urls.baseAppUrl(courseSearchUrl));
  });

  it('does not display a Help link', () => {
    mergeConfig({ SUPPORT_URL: 'http://localhost:18000/support' });
    render(<MemoryRouter><IntlProvider locale="en"><LearnerDashboardHeader /></IntlProvider></MemoryRouter>);
    expect(screen.queryByRole('link', { name: 'Help' })).not.toBeInTheDocument();
  });

  it('should display Programs link if it is enabled by configuration', () => {
    mergeConfig({ ENABLE_PROGRAMS: true });
    render(<MemoryRouter><IntlProvider locale="en"><LearnerDashboardHeader /></IntlProvider></MemoryRouter>);
    expect(screen.getByRole('link', { name: '프로그램' })).toBeInTheDocument();
  });

  it('should not display Discover New tab if it is disabled by configuration', () => {
    mergeConfig({ NON_BROWSABLE_COURSES: true });
    render(<MemoryRouter><IntlProvider locale="en"><LearnerDashboardHeader /></IntlProvider></MemoryRouter>);
    expect(screen.queryByRole('link', { name: '과정' })).not.toBeInTheDocument();
  });
});
