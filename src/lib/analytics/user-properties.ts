// 사용자 속성 관리 - localStorage 기반 first-touch 및 재방문 감지
import { identifyUser, setUserPropertyOnce } from './amplitude';
import { parseUtmParams } from './utm';
import type { UserProperties } from './types';

const STORAGE_KEY = 'yanlog_user_props';

function loadProps(): Partial<UserProperties> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProps(props: Partial<UserProperties>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(props));
  } catch {
    // localStorage 접근 불가 시 무시
  }
}

/**
 * 사용자 속성 초기화 및 Amplitude 동기화
 * - first-touch 속성은 최초 1회만 설정
 * - 재방문 여부 업데이트
 */
export function initUserProperties(): void {
  const props = loadProps();
  const utm = parseUtmParams();
  const now = Date.now();

  // first-touch: 최초 방문 시에만 기록
  if (!props.first_visit_timestamp) {
    props.first_visit_timestamp = now;
    props.first_referrer = document.referrer || 'direct';
    props.first_utm_source = utm.utm_source || 'none';
    props.is_returning_user = false;
    props.total_posts_engaged = 0;
    props.last_engaged_category = '';
  } else {
    // 재방문자 표시
    props.is_returning_user = true;
  }

  saveProps(props);

  // Amplitude에 first-touch 속성 동기화 (setOnce)
  setUserPropertyOnce('first_visit_timestamp', props.first_visit_timestamp);
  setUserPropertyOnce('first_referrer', props.first_referrer || 'direct');
  setUserPropertyOnce('first_utm_source', props.first_utm_source || 'none');

  // 변경 가능한 속성은 매번 업데이트
  identifyUser({
    is_returning_user: props.is_returning_user,
    total_posts_engaged: props.total_posts_engaged ?? 0,
    last_engaged_category: props.last_engaged_category || '',
  });
}

/**
 * 포스트 참여 시 사용자 속성 업데이트
 */
export function recordPostEngagement(category: string): void {
  const props = loadProps();
  props.total_posts_engaged = (props.total_posts_engaged ?? 0) + 1;
  props.last_engaged_category = category;
  saveProps(props);

  identifyUser({
    total_posts_engaged: props.total_posts_engaged,
    last_engaged_category: category,
  });
}
