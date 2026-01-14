import { Post } from '@/types/post';

export type Platform = 'twitter' | 'linkedin' | 'devto' | 'medium';

export interface PublishTarget {
  platform: Platform;
  enabled: boolean;
}

export interface PublishResult {
  platform: Platform;
  success: boolean;
  url?: string;
  error?: string;
}

export interface PublishRecord {
  platform: Platform;
  publishedAt: string;
  url: string;
}

// 플랫폼별 문자 제한
const PLATFORM_LIMITS: Record<Platform, number> = {
  twitter: 280,
  linkedin: 3000,
  devto: 100000,
  medium: 100000,
};

// 플랫폼별 포맷 변환
export function formatForPlatform(post: Post, platform: Platform): string {
  const { title, description } = post.frontmatter;
  const limit = PLATFORM_LIMITS[platform];
  
  switch (platform) {
    case 'twitter': {
      // 트위터: 제목 + 설명 + 링크 (280자 제한)
      const link = `\n\n🔗 Read more`;
      const maxContentLength = limit - link.length;
      let content = `📝 ${title}\n\n${description}`;
      
      if (content.length > maxContentLength) {
        content = content.substring(0, maxContentLength - 3) + '...';
      }
      
      return content + link;
    }
    
    case 'linkedin': {
      // 링크드인: 더 긴 형식
      const tags = post.frontmatter.tags.map(t => `#${t}`).join(' ');
      return `📝 ${title}\n\n${description}\n\n${tags}\n\n🔗 Read the full article on my blog`;
    }
    
    case 'devto':
    case 'medium': {
      // Dev.to / Medium: 전체 콘텐츠
      const tags = post.frontmatter.tags.join(', ');
      return `---\ntitle: ${title}\ntags: ${tags}\n---\n\n${post.content}`;
    }
    
    default:
      return `${title}\n\n${description}`;
  }
}

// 포맷된 콘텐츠가 플랫폼 제한을 준수하는지 확인
export function validateFormatLength(content: string, platform: Platform): boolean {
  const limit = PLATFORM_LIMITS[platform];
  return content.length <= limit;
}

// 멀티 채널 배포 (실제 API 호출은 Nova Act 등으로 대체)
export async function publishToChannels(
  post: Post,
  targets: PublishTarget[]
): Promise<PublishResult[]> {
  const results: PublishResult[] = [];
  
  for (const target of targets) {
    if (!target.enabled) continue;
    
    try {
      const formattedContent = formatForPlatform(post, target.platform);
      
      if (!validateFormatLength(formattedContent, target.platform)) {
        results.push({
          platform: target.platform,
          success: false,
          error: `Content exceeds ${target.platform} character limit`,
        });
        continue;
      }
      
      // TODO: Nova Act API 호출로 실제 배포
      // 현재는 성공으로 시뮬레이션
      results.push({
        platform: target.platform,
        success: true,
        url: `https://${target.platform}.com/post/${post.slug}`,
      });
    } catch (error) {
      results.push({
        platform: target.platform,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  
  return results;
}
