/** Normalized name for matching logs without employee_id (same idea as AttendanceLogsPage). */
export function normName(s) {
  return (s || '').trim().toLowerCase();
}

function actionIsIn(action) {
  return String(action || '').trim().toUpperCase() === 'IN';
}

function actionIsOut(action) {
  return String(action || '').trim().toUpperCase() === 'OUT';
}

/** Segments longer than this are treated as invalid (e.g. missing OUT); not counted. */
const MAX_SESSION_MS = 16 * 60 * 60 * 1000;

/**
 * Sum completed IN→OUT segments (chronological). Ignores OUT without IN; ignores trailing IN with no OUT.
 * Duplicate IN before OUT: replace open IN (new segment anchor).
 * IN→OUT gaps over 16 hours are ignored (not added).
 */
function segmentHoursFromSortedLogs(sortedLogs) {
  let pendingInMs = null;
  let totalMs = 0;

  for (const log of sortedLogs) {
    const ts = new Date(log.timestamp).getTime();
    if (Number.isNaN(ts)) continue;

    if (actionIsIn(log.action)) {
      pendingInMs = ts;
    } else if (actionIsOut(log.action)) {
      if (pendingInMs == null) continue;
      const segmentMs = ts - pendingInMs;
      if (segmentMs > 0 && segmentMs <= MAX_SESSION_MS) {
        totalMs += segmentMs;
      }
      pendingInMs = null;
    }
  }

  return totalMs / (1000 * 60 * 60);
}

/** Group key: `id:<uuid>` or `name:<normalized>` */
function bucketKeyForLog(log) {
  const hasId = log.employee_id != null && log.employee_id !== '';
  if (hasId) return `id:${String(log.employee_id)}`;
  const nk = normName(log.employee_name);
  if (!nk) return null;
  return `name:${nk}`;
}

/**
 * Returns map bucketKey -> hours (float), from pairing IN/OUT within each bucket.
 */
export function buildHoursByLogBucket(logs) {
  if (!Array.isArray(logs) || logs.length === 0) return {};

  const buckets = new Map();
  for (const log of logs) {
    const key = bucketKeyForLog(log);
    if (!key) continue;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(log);
  }

  const hoursByBucketKey = {};
  for (const [key, arr] of buckets) {
    const sorted = [...arr].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    hoursByBucketKey[key] = segmentHoursFromSortedLogs(sorted);
  }
  return hoursByBucketKey;
}

/** Hours from logs for one roster employee (id match, then name). */
export function logDerivedHoursForEmployee(emp, hoursByBucketKey) {
  const id = emp.id ?? emp.employee_id;
  if (id != null && id !== '') {
    const k = `id:${String(id)}`;
    if (Object.prototype.hasOwnProperty.call(hoursByBucketKey, k)) {
      return hoursByBucketKey[k];
    }
  }
  const nk = normName(emp.name || emp.employee_name || '');
  if (nk) {
    const k = `name:${nk}`;
    if (Object.prototype.hasOwnProperty.call(hoursByBucketKey, k)) {
      return hoursByBucketKey[k];
    }
  }
  return 0;
}
