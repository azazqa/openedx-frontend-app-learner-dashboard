import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';

import { learnerDashboardQueryKeys } from 'data/hooks/queryKeys';
import { fetchProgressRates } from 'data/services/lms/api';
import useCourseData from 'hooks/useCourseData';

export const CourseProgress = ({ cardId }) => {
  const courseData = useCourseData(cardId);
  const courseId = courseData?.courseRun?.courseId;
  const { data, isFetched } = useQuery({
    queryKey: learnerDashboardQueryKeys.progress(),
    queryFn: fetchProgressRates,
    retry: false,
  });
  if (!isFetched) {
    return null;
  }
  const raw = courseId ? data?.[courseId] : undefined;
  const parsed = Number(raw);
  const percent = Number.isFinite(parsed) ? parsed : 0;
  const width = Math.min(Math.max(percent, 0), 100);
  const label = `${percent.toFixed(1)}%`;

  return (
    <div className="d-flex align-items-center gap-2 mt-2" data-testid="CourseProgress">
      <span className="fw-bold">{label}</span>
      <div className="progress flex-grow-1" style={{ height: 10 }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${width}%` }}
          aria-valuenow={width}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="진도율"
        />
      </div>
    </div>
  );
};

CourseProgress.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseProgress;
