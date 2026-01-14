# 스크립트 가이드

## 이미지 WebP 변환 스크립트

이미지를 WebP 형식으로 변환하여 웹 성능을 개선합니다.

### 설치 요구사항

WebP 변환을 위해 다음 중 하나가 필요합니다:

**macOS:**
```bash
brew install webp imagemagick
```

**Ubuntu/Debian:**
```bash
sudo apt-get install webp imagemagick
```

**Windows:**
- [cwebp 다운로드](https://developers.google.com/speed/webp/download)
- 또는 [ImageMagick 설치](https://imagemagick.org/script/download.php)

### 사용 방법

#### 1. 기본 사용 (public/images 디렉토리)
```bash
npm run convert:webp
```

#### 2. 특정 디렉토리 변환
```bash
node scripts/convert-images-to-webp.js [입력 디렉토리] [출력 디렉토리]
```

**예시:**
```bash
# content/posts 디렉토리의 이미지 변환
node scripts/convert-images-to-webp.js content/posts content/posts

# 입력과 출력이 다른 경우
node scripts/convert-images-to-webp.js ./source-images ./public/images
```

### 기능

- ✅ JPG, JPEG, PNG, GIF, TIFF 형식 지원
- ✅ 자동 품질 최적화 (80% 품질)
- ✅ 파일 크기 감소율 표시
- ✅ 배치 처리 지원
- ✅ 오류 처리 및 상세 로그

### 출력 예시

```
🖼️  3개의 이미지 파일을 찾았습니다.

✅ [1/3] hero.jpg
   → hero.webp (245.3KB → 89.2KB, 63.6% 감소)

✅ [2/3] logo.png
   → logo.webp (45.1KB → 12.3KB, 72.7% 감소)

✅ [3/3] banner.gif
   → banner.webp (156.8KB → 52.1KB, 66.8% 감소)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 변환 완료
   성공: 3개
   실패: 0개
   총합: 3개
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 팁

1. **원본 이미지 백업**: 변환 전에 원본 이미지를 백업하세요.
2. **품질 조정**: 스크립트의 `-q 80` 값을 변경하여 품질을 조정할 수 있습니다.
   - 더 높은 품질: `-q 90` (파일 크기 증가)
   - 더 낮은 품질: `-q 70` (파일 크기 감소)
3. **자동화**: CI/CD 파이프라인에 이 스크립트를 추가하여 자동 변환할 수 있습니다.

### 문제 해결

**"cwebp: command not found" 오류**
- cwebp가 설치되지 않았습니다. 위의 설치 요구사항을 참고하세요.

**"convert: command not found" 오류**
- ImageMagick이 설치되지 않았습니다. 위의 설치 요구사항을 참고하세요.

**변환 후 이미지 품질이 좋지 않음**
- 스크립트의 품질 설정을 높여보세요 (`-q 85` 또는 `-q 90`)
