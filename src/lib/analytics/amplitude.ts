// Amplitude 초기화 - 클라이언트 전용 싱글톤
import * as amplitude from '@amplitude/analytics-browser';

let initialized = false;

export function initAmplitude(): void {
  if (initialized || typeof window === 'undefined') return;

  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_KEY;
  if (!apiKey) {
    console.warn('[Analytics] NEXT_PUBLIC_AMPLITUDE_KEY가 설정되지 않았습니다.');
    return;
  }

  amplitude.init(apiKey, {
    // 기본 자동 추적 비활성화 - 커스텀 이벤트만 사용
    autocapture: false,
  });

  initialized = true;
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (!initialized) return;
  amplitude.track(eventName, properties);
}

export function identifyUser(properties: Record<string, unknown>): void {
  if (!initialized) return;
  const identify = new amplitude.Identify();
  for (const [key, value] of Object.entries(properties)) {
    identify.set(key, value as amplitude.Types.ValidPropertyType);
  }
  amplitude.identify(identify);
}

export function setUserPropertyOnce(key: string, value: amplitude.Types.ValidPropertyType): void {
  if (!initialized) return;
  const identify = new amplitude.Identify();
  identify.setOnce(key, value);
  amplitude.identify(identify);
}
