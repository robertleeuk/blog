#!/usr/bin/env node

/**
 * 이미지를 WebP 형식으로 변환하는 스크립트
 * 사용법: node scripts/convert-images-to-webp.js [입력 디렉토리] [출력 디렉토리]
 * 기본값: public/images -> public/images
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 입력 및 출력 디렉토리 설정
const inputDir = process.argv[2] || path.join(__dirname, '../public/images');
const outputDir = process.argv[3] || inputDir;

// 지원하는 이미지 형식
const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.tiff'];

// 디렉토리 존재 확인
if (!fs.existsSync(inputDir)) {
  console.error(`❌ 입력 디렉토리를 찾을 수 없습니다: ${inputDir}`);
  process.exit(1);
}

// 출력 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 출력 디렉토리 생성: ${outputDir}`);
}

// 이미지 파일 찾기
const files = fs.readdirSync(inputDir);
const imageFiles = files.filter(file => {
  const ext = path.extname(file).toLowerCase();
  return supportedFormats.includes(ext);
});

if (imageFiles.length === 0) {
  console.log(`⚠️  변환할 이미지 파일이 없습니다: ${inputDir}`);
  process.exit(0);
}

console.log(`🖼️  ${imageFiles.length}개의 이미지 파일을 찾았습니다.\n`);

let successCount = 0;
let errorCount = 0;

// 각 이미지 파일 변환
imageFiles.forEach((file, index) => {
  const inputPath = path.join(inputDir, file);
  const outputFileName = path.parse(file).name + '.webp';
  const outputPath = path.join(outputDir, outputFileName);

  try {
    // ImageMagick 또는 cwebp를 사용하여 변환
    // cwebp가 설치되어 있으면 사용, 없으면 ImageMagick 사용
    try {
      execSync(`cwebp "${inputPath}" -o "${outputPath}" -q 80`, { stdio: 'pipe' });
    } catch {
      // cwebp가 없으면 ImageMagick 사용
      execSync(`convert "${inputPath}" -quality 80 "${outputPath}"`, { stdio: 'pipe' });
    }

    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;
    const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

    console.log(`✅ [${index + 1}/${imageFiles.length}] ${file}`);
    console.log(`   → ${outputFileName} (${(inputSize / 1024).toFixed(1)}KB → ${(outputSize / 1024).toFixed(1)}KB, ${reduction}% 감소)\n`);

    successCount++;
  } catch (error) {
    console.error(`❌ [${index + 1}/${imageFiles.length}] ${file}`);
    console.error(`   오류: ${error.message}\n`);
    errorCount++;
  }
});

// 결과 요약
console.log('━'.repeat(50));
console.log(`📊 변환 완료`);
console.log(`   성공: ${successCount}개`);
console.log(`   실패: ${errorCount}개`);
console.log(`   총합: ${imageFiles.length}개`);
console.log('━'.repeat(50));

if (errorCount > 0) {
  console.log('\n⚠️  주의: cwebp 또는 ImageMagick이 설치되어 있지 않을 수 있습니다.');
  console.log('   설치 방법:');
  console.log('   - macOS: brew install webp imagemagick');
  console.log('   - Ubuntu: sudo apt-get install webp imagemagick');
  console.log('   - Windows: https://developers.google.com/speed/webp/download');
  process.exit(1);
}

process.exit(0);
