#!/usr/bin/env node

/**
 * RSS Feed Generator Script
 * 
 * 빌드 시점에 실행되어 모든 RSS 피드를 생성합니다.
 * - 언어별 전체 피드: /ko/rss.xml, /en/rss.xml
 * - 언어별 태그 피드: /ko/tag/{slug}/rss.xml, /en/tag/{slug}/rss.xml
 */

import fs from 'fs';
import path from 'path';
import { Locale, PostMeta } from '../src/types/post';
import { getAllPosts } from '../src/lib/mdx';
import { RSSGenerator, RSSChannel, RSSItem } from '../src/lib/rss';

// .env.local 파일 로드
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          process.env[key.trim()] = value;
        }
      }
    });
  }
}

// 환경 변수 로드
loadEnvFile();

/**
 * Feed Builder 설정 인터페이스
 */
interface FeedBuilderConfig {
  /** 사이트 기본 URL (예: https://yanlog.yanbert.com) */
  baseUrl: string;
  /** 사이트 이름 */
  siteName: string;
  /** 사이트 설명 */
  siteDescription: string;
  /** 피드에 포함할 최대 아이템 수 */
  maxItems: number;
}

/**
 * RSS Feed Builder 클래스
 * 
 * 빌드 시점에 정적 RSS 파일을 생성합니다.
 */
class FeedBuilder {
  private config: FeedBuilderConfig;
  private outputDir: string;

  constructor(config: FeedBuilderConfig) {
    this.config = config;
    this.outputDir = path.join(process.cwd(), 'public');
  }

  /**
   * 언어별 포스트 데이터 수집
   * 
   * - 기존 getAllPosts 함수 재사용
   * - draft 포스트는 이미 getAllPosts에서 제외됨
   * - 날짜 기준 내림차순 정렬은 이미 getAllPosts에서 처리됨
   * - 최신 20개로 제한
   * 
   * @param locale 언어 코드
   * @returns 포스트 메타데이터 배열 (최대 20개)
   */
  private getPostsForFeed(locale: Locale): PostMeta[] {
    const allPosts = getAllPosts(locale);
    
    // 최신 20개로 제한
    return allPosts.slice(0, this.config.maxItems);
  }

  /**
   * 언어와 태그로 포스트 필터링
   * 
   * - 특정 언어의 포스트만 선택
   * - 특정 태그를 포함하는 포스트만 선택
   * - draft 포스트는 이미 getAllPosts에서 제외됨
   * - 날짜 기준 내림차순 정렬 유지
   * - 최신 20개로 제한
   * 
   * @param locale 언어 코드
   * @param tag 태그 이름
   * @returns 필터링된 포스트 메타데이터 배열 (최대 20개)
   */
  private getPostsForTagFeed(locale: Locale, tag: string): PostMeta[] {
    const allPosts = getAllPosts(locale);
    
    // 특정 태그를 포함하는 포스트만 필터링
    const filteredPosts = allPosts.filter(post => 
      post.tags && post.tags.includes(tag)
    );
    
    // 최신 20개로 제한
    return filteredPosts.slice(0, this.config.maxItems);
  }

  /**
   * 언어별 고유 태그 목록 추출
   * 
   * - 해당 언어의 모든 포스트에서 태그 수집
   * - 중복 제거하여 고유 태그만 반환
   * - 알파벳 순으로 정렬
   * 
   * @param locale 언어 코드
   * @returns 고유 태그 배열 (알파벳 순 정렬)
   */
  private getUniqueTags(locale: Locale): string[] {
    const allPosts = getAllPosts(locale);
    
    // 모든 포스트의 태그를 하나의 배열로 수집
    const allTags = allPosts.flatMap(post => post.tags || []);
    
    // Set을 사용하여 중복 제거
    const uniqueTags = Array.from(new Set(allTags));
    
    // 알파벳 순으로 정렬
    return uniqueTags.sort();
  }

  /**
   * 모든 RSS 피드 생성
   * 
   * - 모든 언어에 대해 전체 피드 생성
   * - 모든 언어의 모든 태그에 대해 피드 생성
   * - 에러 처리 및 로깅
   * 
   * Requirements: 7.1, 7.3, 7.4
   */
  async generateAllFeeds(): Promise<void> {
    console.log('🚀 Starting RSS feed generation...');
    console.log(`📍 Base URL: ${this.config.baseUrl}`);
    console.log(`📁 Output directory: ${this.outputDir}`);
    console.log(`📊 Max items per feed: ${this.config.maxItems}`);
    console.log('');

    const startTime = Date.now();
    let totalFeeds = 0;
    let totalErrors = 0;

    try {
      // 언어별 전체 피드 생성
      const locales: Locale[] = ['ko', 'en'];
      
      for (const locale of locales) {
        try {
          // 전체 피드 생성
          await this.generateMainFeed(locale);
          totalFeeds++;
          
          // 태그별 피드 생성
          const tags = this.getUniqueTags(locale);
          await this.generateTagFeeds(locale);
          totalFeeds += tags.length;
          
        } catch (error) {
          totalErrors++;
          console.error(`❌ Failed to generate feeds for locale "${locale}":`, error);
          // 한 언어의 피드 생성 실패가 전체 빌드를 중단하지 않도록 계속 진행
        }
      }
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log('');
      console.log('📈 Generation Summary:');
      console.log(`   Total feeds generated: ${totalFeeds}`);
      console.log(`   Total errors: ${totalErrors}`);
      console.log(`   Duration: ${duration}s`);
      console.log('');
      
      if (totalErrors > 0) {
        console.warn('⚠️  RSS feed generation completed with errors');
        // 에러가 있어도 일부 피드는 생성되었으므로 빌드는 계속 진행
      } else {
        console.log('✅ RSS feed generation completed successfully!');
      }
      
    } catch (error) {
      console.error('❌ RSS feed generation failed with fatal error:', error);
      if (error instanceof Error) {
        console.error(`   Error message: ${error.message}`);
        console.error(`   Stack trace: ${error.stack}`);
      }
      throw error;
    }
  }

  /**
   * 언어별 전체 피드 생성
   * 
   * - 해당 언어의 최신 포스트 20개를 RSS 피드로 생성
   * - /ko/rss.xml 또는 /en/rss.xml 경로에 저장
   * - RSSGenerator를 사용하여 RSS 2.0 XML 생성
   * 
   * Requirements: 2.1, 2.2, 2.3, 5.2
   * 
   * @param locale 언어 코드
   */
  async generateMainFeed(locale: Locale): Promise<void> {
    console.log(`📝 Generating main feed for locale: ${locale}`);
    
    try {
      // 포스트 데이터 수집
      const posts = this.getPostsForFeed(locale);
      console.log(`   Found ${posts.length} posts for ${locale}`);
      
      if (posts.length === 0) {
        console.log(`   ⚠️  No posts found for ${locale}, skipping feed generation`);
        return;
      }
      
      // RSS Generator 인스턴스 생성
      const generator = new RSSGenerator();
      
      // 채널 정보 생성
      const channel: RSSChannel = {
        title: this.config.siteName,
        link: `${this.config.baseUrl}/${locale}/`,
        description: this.config.siteDescription,
        language: locale,
        lastBuildDate: generator.formatDate(new Date().toISOString()),
      };
      
      // RSS 아이템 생성
      const items: RSSItem[] = posts.map(post => {
        const postUrl = `${this.config.baseUrl}/${locale}/blog/${post.slug}/`;
        
        // 이미지가 있으면 enclosure 추가
        const enclosure = post.image ? {
          url: post.image,
          type: this.getImageMimeType(post.image),
        } : undefined;
        
        return {
          title: post.title,
          link: postUrl,
          description: post.description,
          pubDate: generator.formatDate(post.date),
          guid: postUrl,
          categories: post.tags || [],
          enclosure,
        };
      });
      
      // RSS XML 생성
      const rssXml = generator.generate(channel, items);
      
      // 파일 저장
      const outputPath = path.join(this.outputDir, locale, 'rss.xml');
      this.ensureDirectoryExists(path.dirname(outputPath));
      
      fs.writeFileSync(outputPath, rssXml, 'utf-8');
      console.log(`   ✅ Generated: ${outputPath}`);
      
    } catch (error) {
      console.error(`   ❌ Failed to generate main feed for ${locale}:`, error);
      throw new Error(`Failed to generate main feed for ${locale}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * 이미지 URL에서 MIME 타입 추론
   * 
   * @param imageUrl 이미지 URL
   * @returns MIME 타입
   */
  private getImageMimeType(imageUrl: string): string {
    const ext = path.extname(imageUrl).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };
    
    return mimeTypes[ext] || 'image/jpeg';
  }
  
  /**
   * 디렉토리가 존재하지 않으면 생성
   * 
   * @param dirPath 디렉토리 경로
   */
  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * 언어별 태그 피드 생성
   * 
   * - 해당 언어의 모든 고유 태그에 대해 피드 생성
   * - 각 태그별로 generateTagFeed 호출
   * 
   * @param locale 언어 코드
   */
  async generateTagFeeds(locale: Locale): Promise<void> {
    console.log(`🏷️  Generating tag feeds for locale: ${locale}`);
    
    try {
      // 고유 태그 목록 추출
      const tags = this.getUniqueTags(locale);
      console.log(`   Found ${tags.length} unique tags for ${locale}`);
      
      if (tags.length === 0) {
        console.log(`   ⚠️  No tags found for ${locale}, skipping tag feed generation`);
        return;
      }
      
      // 각 태그별로 피드 생성
      let successCount = 0;
      let errorCount = 0;
      
      for (const tag of tags) {
        try {
          await this.generateTagFeed(locale, tag);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`   ❌ Failed to generate tag feed for "${tag}":`, error);
          // 한 태그의 피드 생성 실패가 다른 태그 피드 생성을 중단하지 않도록 계속 진행
        }
      }
      
      console.log(`   📊 Tag feeds summary: ${successCount} succeeded, ${errorCount} failed`);
      
    } catch (error) {
      console.error(`   ❌ Failed to generate tag feeds for ${locale}:`, error);
      throw new Error(`Failed to generate tag feeds for ${locale}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 특정 태그의 피드 생성
   * 
   * - 해당 언어와 태그를 가진 포스트만 필터링
   * - /ko/tag/{slug}/rss.xml 또는 /en/tag/{slug}/rss.xml 경로에 저장
   * - RSSGenerator를 사용하여 RSS 2.0 XML 생성
   * 
   * Requirements: 3.1, 3.2, 3.3, 3.4
   * 
   * @param locale 언어 코드
   * @param tag 태그 이름
   */
  async generateTagFeed(locale: Locale, tag: string): Promise<void> {
    try {
      // 언어와 태그로 포스트 필터링
      const posts = this.getPostsForTagFeed(locale, tag);
      
      if (posts.length === 0) {
        console.log(`   ⚠️  No posts found for tag "${tag}" in ${locale}, skipping`);
        return;
      }
      
      console.log(`   📝 Generating tag feed: ${locale}/${tag} (${posts.length} posts)`);
      
      // RSS Generator 인스턴스 생성
      const generator = new RSSGenerator();
      
      // 채널 정보 생성 (태그별 피드)
      const channel: RSSChannel = {
        title: `${this.config.siteName} - ${tag}`,
        link: `${this.config.baseUrl}/${locale}/tag/${tag}/`,
        description: `${this.config.siteDescription} - ${tag} 태그의 글`,
        language: locale,
        lastBuildDate: generator.formatDate(new Date().toISOString()),
      };
      
      // RSS 아이템 생성
      const items: RSSItem[] = posts.map(post => {
        const postUrl = `${this.config.baseUrl}/${locale}/blog/${post.slug}/`;
        
        // 이미지가 있으면 enclosure 추가
        const enclosure = post.image ? {
          url: post.image,
          type: this.getImageMimeType(post.image),
        } : undefined;
        
        return {
          title: post.title,
          link: postUrl,
          description: post.description,
          pubDate: generator.formatDate(post.date),
          guid: postUrl,
          categories: post.tags || [],
          enclosure,
        };
      });
      
      // RSS XML 생성
      const rssXml = generator.generate(channel, items);
      
      // 파일 저장 (/ko/tag/{slug}/rss.xml)
      const outputPath = path.join(this.outputDir, locale, 'tag', tag, 'rss.xml');
      this.ensureDirectoryExists(path.dirname(outputPath));
      
      fs.writeFileSync(outputPath, rssXml, 'utf-8');
      console.log(`   ✅ Generated: ${outputPath}`);
      
    } catch (error) {
      console.error(`   ❌ Failed to generate tag feed for ${locale}/${tag}:`, error);
      throw new Error(`Failed to generate tag feed for ${locale}/${tag}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * 환경 변수 로딩 및 검증
 */
function loadConfig(): FeedBuilderConfig {
  // NEXT_PUBLIC_BASE_URL 환경 변수 로딩
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yanlog.yanbert.com';
  
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.warn('⚠️  NEXT_PUBLIC_BASE_URL is not defined, using default:', baseUrl);
  }

  return {
    baseUrl,
    siteName: "YAN SO's Blog",
    siteDescription: '개인 기술 블로그',
    maxItems: 20,
  };
}

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    const config = loadConfig();
    const builder = new FeedBuilder(config);
    await builder.generateAllFeeds();
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// 스크립트 직접 실행 시에만 main 함수 호출
if (require.main === module) {
  main();
}

// 테스트를 위한 export
export { FeedBuilder, loadConfig };
export type { FeedBuilderConfig };
