#!/usr/bin/env node

/**
 * Kiro Hook: 이미지 WebP 변환 처리
 * 사용자가 동의하면 WebP 변환을 실행하고 원본 파일을 삭제합니다.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// 명령줄 인자에서 파일 경로 받기
const filePath = process.argv[2];
const userResponse = process.argv[3]; // 'yes' 또는 'no'

if (!filePath) {
  console.error('❌ 파일 경로가 제공되지 않았습니다.');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`❌ 파일을 찾을 수 없습니다: ${filePath}`);
  process.exit(1);
}

const ext = path.extname(filePath).toLowerCase();
const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.tiff'];

if (!supportedFormats.includes(ext)) {
  console.log(`⚠️  지원하지 않는 형식입니다: ${ext}`);
  process.exit(0);
}

// 사용자 응답 처리
if (userResponse === 'yes' || userResponse === 'y') {
  convertAndDeleteOriginal(filePath);
} else if (userResponse === 'no' || userResponse === 'n') {
  console.log('⏭️  변환을 건너뛰었습니다.');
  process.exit(0);
} else {
  // 대화형 모드
  askUserForConversion(filePath);
}

/**
 * 사용자에게 변환 여부를 묻습니다.
 */
function askUserForConversion(filePath) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const fileName = path.basename(filePath);
  const fileSize = (fs.statSync(filePath).size / 1024).toFixed(1);

  rl.question(
    `\n🖼️  ${fileName} (${fileSize}KB)을(를) WebP로 변환하시겠습니까? (y/n): `,
    (answer) => {
      rl.close();

      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        convertAndDeleteOriginal(filePath);
      } else {
        console.log('⏭️  변환을 건너뛰었습니다.');
        process.exit(0);
      }
    }
  );
}

/**
 * 이미지를 WebP로 변환하고 원본 파일을 삭제합니다.
 */
function convertAndDeleteOriginal(filePath) {
  try {
    const dir = path.dirname(filePath);
    const fileName = path.parse(filePath).name;
    const webpPath = path.join(dir, fileName + '.webp');

    console.log(`\n⏳ 변환 중: ${path.basename(filePath)} → ${path.basename(webpPath)}`);

    // WebP 변환 시도
    try {
      execSync(`cwebp "${filePath}" -o "${webpPath}" -q 80`, { stdio: 'pipe' });
    } catch {
      // cwebp가 없으면 ImageMagick 사용
      execSync(`convert "${filePath}" -quality 80 "${webpPath}"`, { stdio: 'pipe' });
    }

    // 파일 크기 비교
    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const reduction = ((1 - webpSize / originalSize) * 100).toFixed(1);

    console.log(`✅ 변환 완료`);
    console.log(`   원본: ${(originalSize / 1024).toFixed(1)}KB`);
    console.log(`   WebP: ${(webpSize / 1024).toFixed(1)}KB`);
    console.log(`   감소: ${reduction}%\n`);

    // 원본 파일 삭제
    console.log(`🗑️  원본 파일 삭제: ${path.basename(filePath)}`);
    fs.unlinkSync(filePath);

    console.log(`✨ 완료! ${path.basename(webpPath)}를 사용하세요.\n`);
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ 변환 실패: ${error.message}`);
    console.error('\n⚠️  다음이 설치되어 있는지 확인하세요:');
    console.error('   - macOS: brew install webp imagemagick');
    console.error('   - Ubuntu: sudo apt-get install webp imagemagick');
    console.error('   - Windows: cwebp 또는 ImageMagick\n');
    process.exit(1);
  }
}
