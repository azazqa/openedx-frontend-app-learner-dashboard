/* eslint-disable max-len */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';

import { MailtoLink, Hyperlink } from '@openedx/paragon';
import { CheckCircle } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { baseAppUrl } from 'data/services/lms/urls';
import { fetchCompletionCriteria } from 'data/services/lms/api';
import { learnerDashboardQueryKeys } from 'data/hooks/queryKeys';

import { useInitializeLearnerHome } from 'data/hooks';
import { utilHooks, useCourseData } from 'hooks';
import Banner from 'components/Banner';

import messages from './messages';

const { useFormatDate } = utilHooks;

const CompletionCriteriaBody = ({ criteria, formatMessage }) => {
  const weightsLine = (criteria.weights || [])
    .map((row) => `${row.type} ${row.percent}%`)
    .join(', ');
  return (
    <div data-testid="completion-criteria">
      <div className="font-weight-bold">{formatMessage(messages.completionCriteriaTitle)}</div>
      <div className="font-weight-bold">
        {formatMessage(messages.completionCriteriaPassScore, { passScore: criteria.pass_score })}
      </div>
      {weightsLine && (
        <div>{formatMessage(messages.completionCriteriaWeights, { weightsLine })}</div>
      )}
      <div>{formatMessage(messages.completionCriteriaScale)}</div>
    </div>
  );
};
CompletionCriteriaBody.propTypes = {
  criteria: PropTypes.shape({
    pass_score: PropTypes.number.isRequired,
    weights: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string.isRequired,
      percent: PropTypes.number.isRequired,
    })),
  }).isRequired,
  formatMessage: PropTypes.func.isRequired,
};

export const CertificateBanner = ({ cardId }) => {
  const { data: learnerHomeData } = useInitializeLearnerHome();
  const courseData = useCourseData(cardId);
  const {
    certificate = {},
    isVerified = false,
    isAudit = false,
    isPassing = false,
    isArchived = false,
    minPassingGrade = 0,
    progressUrl = '',
    courseId = '',
  } = useMemo(() => ({
    isVerified: courseData?.enrollment?.isVerified,
    isAudit: courseData?.enrollment?.isAudit,
    certificate: courseData?.certificate || {},
    isPassing: courseData?.gradeData?.isPassing,
    isArchived: courseData?.courseRun?.isArchived,
    minPassingGrade: Math.floor((courseData?.courseRun?.minPassingGrade ?? 0) * 100),
    progressUrl: baseAppUrl(courseData?.courseRun?.progressUrl || ''),
    courseId: courseData?.courseRun?.courseId || '',
  }), [courseData]);
  const { supportEmail, billingEmail } = useMemo(
    () => ({
      supportEmail: learnerHomeData?.platformSettings?.supportEmail,
      billingEmail: learnerHomeData?.platformSettings?.billingEmail,
    }),
    [learnerHomeData],
  );
  const { formatMessage } = useIntl();
  const formatDate = useFormatDate();
  const { data: criteriaByCourse, isFetched: criteriaFetched } = useQuery({
    queryKey: learnerDashboardQueryKeys.completionCriteria(),
    queryFn: fetchCompletionCriteria,
    retry: false,
  });
  const criteria = courseId && criteriaByCourse ? criteriaByCourse[courseId] : undefined;

  const emailLink = address => <MailtoLink to={address}>{address}</MailtoLink>;

  const passingGradeFallback = formatMessage(messages.passingGrade, { minPassingGrade });
  const certMinGradeFallback = formatMessage(messages.certMinGrade, { minPassingGrade });

  const renderCompletionCriteria = (fallback, fallbackVariant) => {
    if (criteriaFetched && criteria) {
      return (
        <Banner variant="success" icon={CheckCircle}>
          <CompletionCriteriaBody criteria={criteria} formatMessage={formatMessage} />
        </Banner>
      );
    }
    return <Banner variant={fallbackVariant}>{fallback}</Banner>;
  };

  if (certificate.isRestricted) {
    return (
      <Banner variant="danger">
        { supportEmail ? formatMessage(messages.certRestricted, { supportEmail: emailLink(supportEmail) }) : formatMessage(messages.certRestrictedNoEmail)}
        {isVerified && '  '}
        {isVerified && (billingEmail ? formatMessage(messages.certRefundContactBilling, { billingEmail: emailLink(billingEmail) }) : formatMessage(messages.certRefundContactBillingNoEmail))}
      </Banner>
    );
  }
  if (certificate.isDownloadable) {
    return (
      <Banner variant="success" icon={CheckCircle}>
        {formatMessage(messages.certReady)}
        {certificate.certPreviewUrl && (
          <>
            {'  '}
            <Hyperlink isInline destination={baseAppUrl(certificate.certPreviewUrl)}>
              {formatMessage(messages.viewCertificate)}
            </Hyperlink>
          </>
        )}
      </Banner>
    );
  }
  if (!isPassing) {
    if (isAudit) {
      return renderCompletionCriteria(passingGradeFallback);
    }
    if (isArchived) {
      return (
        <Banner variant="warning">
          {formatMessage(messages.notEligibleForCert)}
          {'  '}
          <Hyperlink isInline destination={progressUrl}>{formatMessage(messages.viewGrades)}</Hyperlink>
        </Banner>
      );
    }
    return renderCompletionCriteria(certMinGradeFallback, 'warning');
  }
  if (certificate.isEarned && new Date(certificate.availableDate) > new Date()) {
    return (
      <Banner>
        {formatMessage(
          messages.gradeAndCertReadyAfter,
          { availableDate: formatDate(certificate.availableDate) },
        )}
      </Banner>
    );
  }

  return null;
};
CertificateBanner.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CertificateBanner;
