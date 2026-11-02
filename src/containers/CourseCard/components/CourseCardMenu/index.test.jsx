import { when } from 'jest-when';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { useCourseData } from 'hooks';
import * as hooks from './hooks';
import CourseCardMenu from '.';
import messages from './messages';

jest.mock('hooks', () => ({
  useCourseData: jest.fn(),
}));
jest.mock('./SocialShareMenu', () => jest.fn(() => <div>SocialShareMenu</div>));
jest.mock('containers/EmailSettingsModal', () => jest.fn(() => <div>EmailSettingsModal</div>));
jest.mock('./hooks', () => ({
  useEmailSettings: jest.fn(),
  useHandleToggleDropdown: jest.fn(),
  useOptionVisibility: jest.fn(),
}));

const props = {
  cardId: 'test-card-id',
};

const emailSettings = {
  isVisible: false,
  show: jest.fn().mockName('emailSettingShow'),
  hide: jest.fn().mockName('emailSettingHide'),
};

const mockHook = (fn, returnValue, options = {}) => {
  if (options.isCardHook) {
    when(fn).calledWith(props.cardId).mockReturnValue(returnValue);
  } else {
    when(fn).calledWith().mockReturnValue(returnValue);
  }
};

const handleToggleDropdown = jest.fn().mockName('hooks.handleToggleDropdown');

const mockHooks = (returnVals = {}) => {
  mockHook(
    hooks.useEmailSettings,
    returnVals.emailSettings ? returnVals.emailSettings : emailSettings,
  );
  mockHook(hooks.useHandleToggleDropdown, handleToggleDropdown, { isCardHook: true });
  mockHook(
    hooks.useOptionVisibility,
    {
      shouldShowDropdown: !!returnVals.shouldShowDropdown,
    },
    { isCardHook: true },
  );
  mockHook(
    useCourseData,
    {
      enrollment: {
        isEmailEnabled: !!returnVals.isEmailEnabled,
      },
    },
    { isCardHook: true },
  );
};

const renderComponent = () => render(<IntlProvider locale="en"><CourseCardMenu {...props} /></IntlProvider>);

describe('CourseCardMenu', () => {
  describe('hooks', () => {
    beforeEach(() => {
      mockHooks();
      renderComponent();
    });
    it('initializes local hooks', () => {
      when(hooks.useEmailSettings).expectCalledWith();
    });
    it('initializes hook data ', () => {
      when(useCourseData).expectCalledWith(props.cardId);
    });
  });
  describe('render', () => {
    it('renders null if showDropdown is false', () => {
      mockHooks();
      renderComponent();
      const dropdown = screen.queryByRole('button', { name: messages.dropdownAlt.defaultMessage });
      expect(dropdown).toBeNull();
    });
    describe('show dropdown', () => {
      it('renders the share menu without an unenroll action', async () => {
        mockHooks({
          shouldShowDropdown: true,
        });
        renderComponent();
        const user = userEvent.setup();
        const dropdown = screen.getByRole('button', { name: messages.dropdownAlt.defaultMessage });
        expect(dropdown).toBeInTheDocument();
        await user.click(dropdown);
        expect(screen.queryByRole('button', { name: messages.unenroll.defaultMessage })).toBeNull();
        expect(screen.getByText('SocialShareMenu')).toBeInTheDocument();
        expect(screen.queryByText('EmailSettingsModal')).toBeNull();
      });
      it('renders email settings without an unenroll action', async () => {
        mockHooks({
          shouldShowDropdown: true,
          isEmailEnabled: true,
        });
        renderComponent();
        const user = userEvent.setup();
        const dropdown = screen.getByRole('button', { name: messages.dropdownAlt.defaultMessage });
        await user.click(dropdown);
        expect(screen.queryByRole('button', { name: messages.unenroll.defaultMessage })).toBeNull();
        expect(screen.getByText('SocialShareMenu')).toBeInTheDocument();
        expect(screen.getByText('EmailSettingsModal')).toBeInTheDocument();
      });
    });
  });
});
