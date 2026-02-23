// 외부 링크 클릭 추적 - 이벤트 위임 방식
import { trackOutboundClick } from './tracking';
import type { DestinationType } from './types';

/**
 * URL에서 목적지 타입 분류
 */
function classifyDestination(url: string): DestinationType {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('github.com')) return 'github';
    if (hostname.includes('aws.amazon.com') || hostname.includes('amazonaws.com')) return 'aws';
    if (hostname.includes('kiro.dev') || hostname.includes('kiro.')) return 'kiro';
    if (hostname.includes('eventbrite.') || hostname.includes('meetup.') || hostname.includes('festa.')) return 'event';
    return 'other';
  } catch {
    return 'other';
  }
}

/**
 * 외부 링크 클릭 추적 시작
 * document 레벨 이벤트 위임으로 모든 외부 링크 감지
 */
export function startOutboundTracking(): () => void {
  function handleClick(e: MouseEvent): void {
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;

    const href = anchor.href;
    if (!href) return;

    try {
      const url = new URL(href);
      // 현재 호스트와 같으면 무시
      if (url.hostname === window.location.hostname) return;
      // mailto, tel 등 무시
      if (!url.protocol.startsWith('http')) return;

      trackOutboundClick({
        destination_url: href,
        source_path: window.location.pathname,
        destination_type: classifyDestination(href),
      });
    } catch {
      // 잘못된 URL 무시
    }
  }

  document.addEventListener('click', handleClick, { capture: true });

  return () => {
    document.removeEventListener('click', handleClick, { capture: true });
  };
}
