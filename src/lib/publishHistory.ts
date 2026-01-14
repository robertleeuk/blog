import fs from 'fs';
import path from 'path';
import { Platform, PublishRecord } from './publisher';

const HISTORY_FILE = path.join(process.cwd(), 'data/publish-history.json');

interface PublishHistory {
  posts: {
    [slug: string]: {
      publishedAt: string;
      channels: PublishRecord[];
    };
  };
}

// 이력 파일 읽기
function readHistory(): PublishHistory {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const content = fs.readFileSync(HISTORY_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Failed to read publish history:', error);
  }
  return { posts: {} };
}

// 이력 파일 쓰기
function writeHistory(history: PublishHistory): void {
  const dir = path.dirname(HISTORY_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// 배포 이력 저장
export function savePublishRecord(
  slug: string,
  platform: Platform,
  url: string
): void {
  const history = readHistory();
  
  if (!history.posts[slug]) {
    history.posts[slug] = {
      publishedAt: new Date().toISOString(),
      channels: [],
    };
  }
  
  // 기존 플랫폼 기록 업데이트 또는 새로 추가
  const existingIndex = history.posts[slug].channels.findIndex(
    (c) => c.platform === platform
  );
  
  const record: PublishRecord = {
    platform,
    publishedAt: new Date().toISOString(),
    url,
  };
  
  if (existingIndex >= 0) {
    history.posts[slug].channels[existingIndex] = record;
  } else {
    history.posts[slug].channels.push(record);
  }
  
  writeHistory(history);
}

// 특정 포스트의 배포 이력 조회
export function getPublishHistory(slug: string): PublishRecord[] {
  const history = readHistory();
  return history.posts[slug]?.channels || [];
}

// 특정 플랫폼에 배포되었는지 확인
export function isPublishedTo(slug: string, platform: Platform): boolean {
  const records = getPublishHistory(slug);
  return records.some((r) => r.platform === platform);
}

// 모든 배포 이력 조회
export function getAllPublishHistory(): PublishHistory {
  return readHistory();
}
