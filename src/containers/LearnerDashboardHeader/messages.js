import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  dashboard: {
    id: 'klms.header.userMenu.dashboard',
    defaultMessage: 'Dashboard',
    description: 'User menu dashboard link',
  },
  dashboardPersonal: {
    id: 'learnerVariantDashboard.menu.dashboardPersonal.label',
    defaultMessage: 'Personal',
    description: 'Link to personal dashboard in user menu',
  },
  dashboardSwitch: {
    id: 'learnerVariantDashboard.menu.dashboardSwitch.label',
    defaultMessage: 'SWITCH DASHBOARD',
    description: 'Switch Dashboard header in the user menu',
  },
  help: {
    id: 'learnerVariantDashboard.help.label',
    defaultMessage: 'Help',
    description: 'The text for the link to the Help Center',
  },
  profile: {
    id: 'klms.header.userMenu.profile',
    defaultMessage: 'Profile',
    description: 'User menu profile link',
  },
  viewPrograms: {
    id: 'learnerVariantDashboard.menu.viewPrograms.label',
    defaultMessage: 'View Programs',
    description: 'The text for the user menu View Programs navigation link.',
  },
  account: {
    id: 'klms.header.userMenu.account',
    defaultMessage: 'Account',
    description: 'User menu account link',
  },
  signOut: {
    id: 'klms.header.userMenu.logout',
    defaultMessage: 'Sign out',
    description: 'User menu sign-out link',
  },
  course: {
    id: 'learnerVariantDashboard.course',
    defaultMessage: 'Courses',
    description: 'Header link for switching to dashboard page.',
  },
  program: {
    id: 'learnerVariantDashboard.program',
    defaultMessage: 'Programs',
    description: 'Header link for switching to program page.',
  },
  discoverNew: {
    id: 'klms.header.courses',
    defaultMessage: 'Catalog',
    description: 'Top menu link to the course catalog. Korean text comes from the translation overrides (klms.header.courses).',
  },
  skipNavLink: {
    id: 'header.navigation.skipNavLink',
    defaultMessage: 'Skip to main content.',
    description: 'A link used by screen readers to allow users to skip to the main content of the page.',
  },
  userOptionsDropdownLabel: {
    id: 'header.menu.aria-label',
    defaultMessage: 'User Options',
    description: 'The aria-label for the user options dropdown.',
  },
  logoAltText: {
    id: 'learnerVariantDashboard.logoAltText',
    defaultMessage: 'edX, Inc. Dashboard',
    description: 'Alt text for the edX logo.',
  },
  collapseMenuOpenAltText: {
    id: 'learnerVariantDashboard.collapseMenuOpenAltText',
    defaultMessage: 'Menu',
    description: 'Alt text for the collapse menu icon when the menu is open.',
  },
  collapseMenuClosedAltText: {
    id: 'learnerVariantDashboard.collapseMenuClosedAltText',
    defaultMessage: 'Close',
    description: 'Alt text for the collapse menu icon when the menu is closed.',
  },
  career: {
    id: 'leanerDashboard.menu.career.label',
    defaultMessage: 'Career',
    description: 'The text for the user menu Career navigation link.',
  },
  newAlert: {
    id: 'header.menu.new.label',
    defaultMessage: 'New',
    description: 'The text announcing that an item in the user menu is New',
  },
});

export default messages;
