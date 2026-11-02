import React from 'react';
import PropTypes from 'prop-types';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import { Dropdown } from '@openedx/paragon';
import LogoSlot from '@edx/frontend-component-header/dist/plugin-slots/LogoSlot';
import HeaderNotificationsSlot from '@edx/frontend-component-header/dist/plugin-slots/HeaderNotificationsSlot';
import LearningUserMenuToggleSlot from '@edx/frontend-component-header/dist/plugin-slots/LearningUserMenuToggleSlot';
import LearningUserMenuSlot from '@edx/frontend-component-header/dist/plugin-slots/LearningUserMenuSlot';

import MasqueradeBar from 'containers/MasqueradeBar';
import { useInitializeLearnerHome } from 'data/hooks';
import urls from 'data/services/lms/urls';

import ConfirmEmailBanner from './ConfirmEmailBanner';
import { useLearnerDashboardHeaderMenu, findCoursesNavClicked } from './hooks';
import messages from './messages';

import './index.scss';

const KlmsUserMenu = ({ username }) => {
  const intl = useIntl();
  const config = getConfig();
  const items = [
    {
      message: intl.formatMessage(messages.dashboard),
      href: `${config.LMS_BASE_URL}/dashboard`,
    },
    {
      message: intl.formatMessage(messages.profile),
      href: `${config.ACCOUNT_PROFILE_URL}/u/${username}`,
    },
    {
      message: intl.formatMessage(messages.account),
      href: config.ACCOUNT_SETTINGS_URL,
    },
    {
      message: intl.formatMessage(messages.signOut),
      href: config.LOGOUT_URL,
    },
  ];

  return (
    <Dropdown className="user-dropdown ml-3">
      <Dropdown.Toggle
        variant="outline-primary"
        aria-label={intl.formatMessage(messages.userOptionsDropdownLabel)}
      >
        <LearningUserMenuToggleSlot label={username} icon={faUserCircle} />
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-right">
        <LearningUserMenuSlot items={items} />
      </Dropdown.Menu>
    </Dropdown>
  );
};

KlmsUserMenu.propTypes = {
  username: PropTypes.string.isRequired,
};

export const LearnerDashboardHeader = () => {
  const intl = useIntl();
  const { authenticatedUser } = React.useContext(AppContext);
  const { data: learnerData } = useInitializeLearnerHome();
  const courseSearchUrl = learnerData?.platformSettings?.courseSearchUrl || '';

  const exploreCoursesClick = () => {
    findCoursesNavClicked(urls.baseAppUrl(courseSearchUrl));
  };

  const learnerHomeHeaderMenu = useLearnerDashboardHeaderMenu({
    courseSearchUrl,
    authenticatedUser,
    exploreCoursesClick,
  });
  const config = getConfig();

  return (
    <>
      <ConfirmEmailBanner />
      <header className="learning-header">
        <a className="sr-only sr-only-focusable" href="#main">
          {intl.formatMessage(messages.skipNavLink)}
        </a>
        <div className="container-xl py-2 d-flex align-items-center">
          <LogoSlot
            href={`${config.LMS_BASE_URL}/dashboard`}
            src={config.LOGO_URL}
            alt={config.SITE_NAME}
          />
          <nav className="nav flex-grow-1 align-items-center" aria-label="main">
            {learnerHomeHeaderMenu.mainMenu.map((item) => (
              <a
                key={`${item.type}-${item.content}`}
                className={`nav-link${item.isActive ? ' active' : ''}`}
                href={item.href}
                onClick={item.onClick}
              >
                {item.content}
              </a>
            ))}
          </nav>
          <HeaderNotificationsSlot />
          {authenticatedUser && (
            <KlmsUserMenu username={authenticatedUser.username} />
          )}
        </div>
      </header>
      <MasqueradeBar />
    </>
  );
};

LearnerDashboardHeader.propTypes = {};

export default LearnerDashboardHeader;
