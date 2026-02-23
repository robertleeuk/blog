/**
 * Feed Builder 단위 테스트
 * 
 * Task 2.2: 포스트 데이터 수집 로직 검증
 */

import { FeedBuilder, FeedBuilderConfig } from '../generate-rss';
import { getAllPosts } from '../../src/lib/mdx';
import { Locale } from '../../src/types/post';

// getAllPosts 함수 모킹
jest.mock('../../src/lib/mdx', () => ({
  getAllPosts: jest.fn(),
}));

const mockGetAllPosts = getAllPosts as jest.MockedFunction<typeof getAllPosts>;

describe('FeedBuilder - 포스트 데이터 수집', () => {
  let builder: FeedBuilder;
  const config: FeedBuilderConfig = {
    baseUrl: 'https://test.example.com',
    siteName: 'Test Blog',
    siteDescription: 'Test Description',
    maxItems: 20,
  };

  beforeEach(() => {
    builder = new FeedBuilder(config);
    jest.clearAllMocks();
  });

  describe('getPostsForFeed', () => {
    it('getAllPosts를 재사용하여 포스트를 가져온다', () => {
      const mockPosts = [
        {
          title: 'Post 1',
          date: '2025-02-17',
          description: 'Description 1',
          tags: ['tag1'],
          slug: 'post-1',
          locale: 'ko' as Locale,
        },
      ];
      mockGetAllPosts.mockReturnValue(mockPosts);

      // private 메서드 테스트를 위해 any 타입 사용
      const posts = (builder as any).getPostsForFeed('ko');

      expect(mockGetAllPosts).toHaveBeenCalledWith('ko');
      expect(posts).toEqual(mockPosts);
    });

    it('최신 20개로 제한한다', () => {
      // 25개의 포스트 생성
      const mockPosts = Array.from({ length: 25 }, (_, i) => ({
        title: `Post ${i + 1}`,
        date: `2025-02-${String(17 - i).padStart(2, '0')}`,
        description: `Description ${i + 1}`,
        tags: ['tag1'],
        slug: `post-${i + 1}`,
        locale: 'ko' as Locale,
      }));
      mockGetAllPosts.mockReturnValue(mockPosts);

      const posts = (builder as any).getPostsForFeed('ko');

      expect(posts).toHaveLength(20);
      expect(posts[0].title).toBe('Post 1');
      expect(posts[19].title).toBe('Post 20');
    });

    it('20개 미만의 포스트는 모두 반환한다', () => {
      const mockPosts = Array.from({ length: 10 }, (_, i) => ({
        title: `Post ${i + 1}`,
        date: `2025-02-${String(17 - i).padStart(2, '0')}`,
        description: `Description ${i + 1}`,
        tags: ['tag1'],
        slug: `post-${i + 1}`,
        locale: 'ko' as Locale,
      }));
      mockGetAllPosts.mockReturnValue(mockPosts);

      const posts = (builder as any).getPostsForFeed('ko');

      expect(posts).toHaveLength(10);
    });

    it('draft 포스트는 getAllPosts에서 이미 제외되어 있다', () => {
      // getAllPosts는 이미 draft를 필터링하므로 draft가 없는 포스트만 반환
      const mockPosts = [
        {
          title: 'Published Post',
          date: '2025-02-17',
          description: 'Description',
          tags: ['tag1'],
          slug: 'published-post',
          locale: 'ko' as Locale,
        },
      ];
      mockGetAllPosts.mockReturnValue(mockPosts);

      const posts = (builder as any).getPostsForFeed('ko');

      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Published Post');
    });
  });

  describe('getPostsForTagFeed', () => {
    it('특정 태그를 포함하는 포스트만 필터링한다', () => {
      const mockPosts = [
        {
          title: 'Post 1',
          date: '2025-02-17',
          description: 'Description 1',
          tags: ['aws', 'cloud'],
          slug: 'post-1',
          locale: 'ko' as Locale,
        },
        {
          title: 'Post 2',
          date: '2025-02-16',
          description: 'Description 2',
          tags: ['kiro', 'developer'],
          slug: 'post-2',
          locale: 'ko' as Locale,
        },
        {
          title: 'Post 3',
          date: '2025-02-15',
          description: 'Description 3',
          tags: ['aws', 'infrastructure'],
          slug: 'post-3',
          locale: 'ko' as Locale,
        },
      ];
      mockGetAllPosts.mockReturnValue(mockPosts);

      const posts = (builder as any).getPostsForTagFeed('ko', 'aws');

      expect(posts).toHaveLength(2);
      expect(posts[0].title).toBe('Post 1');
      expect(posts[1].title).toBe('Post 3');
    });

    it('태그가 없는 포스트는 제외한다', () => {
      const mockPosts = [
        {
          title: 'Post 1',
          date: '2025-02-17',
          description: 'Description 1',
          tags: ['aws'],
          slug: 'post-1',
          locale: 'ko' as Locale,
        },
        {
          title: 'Post 2',
          date: '2025-02-16',
          description: 'Description 2',
          tags: [],
          slug: 'post-2',
          locale: 'ko' as Locale,
        },
      ];
      mockGetAllPosts.mockReturnValue(mockPosts);

      const posts = (builder as any).getPostsForTagFeed('ko', 'aws');

      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Post 1');
    });

    it('태그별 피드도 최신 20개로 제한한다', () => {
      // 25개의 포스트 생성 (모두 같은 태그)
      const mockPosts = Array.from({ length: 25 }, (_, i) => ({
        title: `Post ${i + 1}`,
        date: `2025-02-${String(17 - i).padStart(2, '0')}`,
        description: `Description ${i + 1}`,
        tags: ['aws'],
        slug: `post-${i + 1}`,
        locale: 'ko' as Locale,
      }));
      mockGetAllPosts.mockReturnValue(mockPosts);

      const posts = (builder as any).getPostsForTagFeed('ko', 'aws');

      expect(posts).toHaveLength(20);
    });

    it('날짜 기준 내림차순 정렬을 유지한다', () => {
      const mockPosts = [
        {
          title: 'Post 1',
          date: '2025-02-17',
          description: 'Description 1',
          tags: ['aws'],
          slug: 'post-1',
          locale: 'ko' as Locale,
        },
        {
          title: 'Post 2',
          date: '2025-02-16',
          description: 'Description 2',
          tags: ['aws'],
          slug: 'post-2',
          locale: 'ko' as Locale,
        },
        {
          title: 'Post 3',
          date: '2025-02-15',
          description: 'Description 3',
          tags: ['aws'],
          slug: 'post-3',
          locale: 'ko' as Locale,
        },
      ];
      mockGetAllPosts.mockReturnValue(mockPosts);

      const posts = (builder as any).getPostsForTagFeed('ko', 'aws');

      expect(posts[0].date).toBe('2025-02-17');
      expect(posts[1].date).toBe('2025-02-16');
      expect(posts[2].date).toBe('2025-02-15');
    });

    it('해당 태그가 없으면 빈 배열을 반환한다', () => {
      const mockPosts = [
        {
          title: 'Post 1',
          date: '2025-02-17',
          description: 'Description 1',
          tags: ['kiro'],
          slug: 'post-1',
          locale: 'ko' as Locale,
        },
      ];
      mockGetAllPosts.mockReturnValue(mockPosts);

      const posts = (builder as any).getPostsForTagFeed('ko', 'aws');

      expect(posts).toHaveLength(0);
    });
  });
});
