// ============================================================================
// 파일명: lib/crypto.ts
// 역할: 수험생 및 회원의 민감한 개인정보(연락처, 생년월일, 주소 등)와 비밀번호를
//       데이터베이스에 전달 및 저장하기 전에 암호화하는 보안 유틸리티입니다.
//       1) AES-256-GCM 양방향 암호화 및 복호화 (Web Crypto API 표준 사용)
//       2) SHA-256 + Salt 기반 비밀번호 단방향 해싱
//       3) 화면 표시용 개인정보 마스킹(별표 처리) 함수
// ============================================================================

// 암호화 키 생성을 위한 기본 시크릿 구문 (환경변수가 있으면 우선 사용)
const SECRET_PASSPHRASE =
  process.env.NEXT_PUBLIC_CRYPTO_SECRET ||
  "KWAC_KCAC_OFFICIAL_SECURITY_KEY_2026_AES256_GCM";

// 비밀번호 해싱 시 레인보우 테이블 공격을 방지하기 위한 고유 솔트(Salt) 값
const PASSWORD_SALT = "KWAC_KCAC_SALT_2026_#WINE_COFFEE#";

/**
 * 내부 보조 함수: 문자열 시크릿 키를 Web Crypto API의 AES-GCM 256비트 키 객체로 변환합니다.
 */
async function getAesKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = encoder.encode(SECRET_PASSPHRASE);

  // 시크릿 문자열을 SHA-256으로 해싱하여 정확히 256비트(32바이트) 길이의 키로 만듭니다.
  const hashBuffer = await crypto.subtle.digest("SHA-256", keyMaterial);

  return crypto.subtle.importKey(
    "raw",
    hashBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * 내부 보조 함수: Uint8Array 바이트 배열을 Base64 문자열로 변환합니다.
 */
function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * 내부 보조 함수: Base64 문자열을 Uint8Array 바이트 배열로 복원합니다.
 */
function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * 1. 개인정보 양방향 암호화 함수 (AES-256-GCM)
 * - 수험생의 전화번호, 생년월일, 상세주소 등을 DB에 저장하기 전에 암호화합니다.
 * - 매 암호화마다 무작위 12바이트 IV(초기화 벡터)를 생성하여 같은 값이라도 매번 다른 암호문이 됩니다.
 * - 반환 형식: "ENCv1:<Base64_IV>:<Base64_CipherText>"
 */
export async function encryptSensitiveData(plainText: string): Promise<string> {
  if (!plainText || plainText.trim() === "") return "";

  try {
    const key = await getAesKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText.trim());

    // 12바이트 난수 초기화 벡터(IV) 생성
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // AES-GCM 알고리즘으로 암호화 수행
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const ivBase64 = bytesToBase64(iv);
    const cipherBase64 = bytesToBase64(new Uint8Array(encryptedBuffer));

    return `ENCv1:${ivBase64}:${cipherBase64}`;
  } catch (error) {
    console.error("개인정보 암호화 중 오류 발생:", error);
    throw new Error("민감 데이터 암호화 처리에 실패했습니다.");
  }
}

/**
 * 2. 개인정보 복호화 함수 (AES-256-GCM)
 * - DB에서 불러온 "ENCv1:..." 형식의 암호문을 원래의 평문으로 안전하게 복원합니다.
 */
export async function decryptSensitiveData(cipherText: string): Promise<string> {
  if (!cipherText) return "";
  // 암호화된 형식(ENCv1:)이 아니면 그대로 반환
  if (!cipherText.startsWith("ENCv1:")) return cipherText;

  try {
    const parts = cipherText.split(":");
    if (parts.length !== 3) return cipherText;

    const iv = base64ToBytes(parts[1]);
    const encryptedBytes = base64ToBytes(parts[2]);
    const key = await getAesKey();

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv as BufferSource },
      key,
      encryptedBytes as BufferSource
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error("개인정보 복호화 중 오류 발생:", error);
    return "[복호화 보호 데이터]";
  }
}

/**
 * 3. 비밀번호 및 조회용 연락처 단방향 해시 함수 (SHA-256 + Salt)
 * - 비밀번호나 검색용 식별자(연락처 해시 등)를 복호화 불가능한 64자리 16진수 해시로 변환합니다.
 */
export async function hashWithSalt(rawValue: string): Promise<string> {
  const normalized = rawValue.replace(/\s+/g, "").trim();
  const encoder = new TextEncoder();
  const saltedData = encoder.encode(`${PASSWORD_SALT}:${normalized}`);

  const hashBuffer = await crypto.subtle.digest("SHA-256", saltedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * 4. 전화번호 숫자 정규화 후 검색용 해시 생성 함수
 * - 예: "010-1234-5678" 과 "01012345678" 이 동일한 해시값을 갖도록 숫자만 추출해 해싱합니다.
 */
export async function hashPhoneForLookup(phone: string): Promise<string> {
  const digitsOnly = phone.replace(/[^0-9]/g, "");
  return hashWithSalt(`PHONE_${digitsOnly}`);
}

/**
 * 5. 화면 표시용 전화번호 마스킹 함수 (예: 010-1234-5678 -> 010-****-5678)
 */
export function maskPhoneNumber(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-****-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-***-${digits.slice(6)}`;
  }
  return phone;
}

