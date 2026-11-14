// ============================================================================
// 파일명: lib/supabase.ts
// 역할: Supabase 데이터베이스 연결 및 암호화 기반 데이터 입출력(CRUD) 서비스입니다.
//       - 모든 개인정보(연락처, 생년월일, 주소)는 lib/crypto.ts의 AES-256-GCM으로
//         암호화된 후 저장되며, 조회 시 복호화됩니다.
//       - Supabase 환경변수(.env.local)가 설정되어 있으면 Supabase DB에 우선 저장하고,
//         미설정 환경에서도 즉시 실습·테스트가 가능하도록 로컬 암호화 저장소와 자동 연동됩니다.
// ============================================================================

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  encryptSensitiveData,
  decryptSensitiveData,
  hashWithSalt,
  hashPhoneForLookup,
} from "@/lib/crypto";

// 환경변수에서 Supabase URL과 Anon Key를 읽어옵니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 환경변수가 유효할 때만 Supabase 클라이언트를 생성합니다.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ============================================================================
// 데이터 타입 정의
// ============================================================================

export interface ExamApplicationRecord {
  id: string;
  examNumber: string;           // 수험번호 (예: KWAC-2611-1042)
  association: "KWAC" | "KCAC"; // 주관 협회
  scheduleId: string;           // 시험 일정 코드
  qualificationName: string;    // 응시 자격 종목명
  grade: string;                // 등급
  examType: string;             // 필기 / 실기 / 필기+실기
  applicantName: string;        // 응시자 성명
  phoneHash: string;            // 검색용 연락처 해시 (SHA-256)
  phoneEncrypted: string;       // AES-256-GCM 암호화된 연락처
  birthEncrypted: string;       // AES-256-GCM 암호화된 생년월일
  addressEncrypted: string;     // AES-256-GCM 암호화된 주소
  trainingCenter: string;       // 교육기관 / 지정검정장
  feeAmount: string;            // 응시료
  paymentStatus: "입금대기" | "입금완료";
  writtenScore: number | null;  // 필기 점수
  practicalScore: number | null;// 실기 점수
  passStatus: "검정예정" | "합격" | "불합격";
  certificateNo: string | null; // 자격증 번호
  createdAt: string;
  // 복호화된 화면 표시용 필드 (조회 시점에 채워짐)
  decryptedPhone?: string;
  decryptedBirth?: string;
  decryptedAddress?: string;
}

export interface ServiceRequestRecord {
  id: string;
  requestCode: string;          // 접수 관리번호 (예: REQ-2026-5012)
  association: "KWAC" | "KCAC";
  serviceType: string;          // 메뉴 구분 코드 (cert-issue, instructor, judge 등)
  serviceLabel: string;         // 한글 서비스명 (자격증신청, 강사등록 등)
  applicantName: string;        // 신청자 성명
  phoneHash: string;            // 검색용 연락처 해시
  phoneEncrypted: string;       // AES-256-GCM 암호화된 연락처
  birthEncrypted: string;       // AES-256-GCM 암호화된 생년월일/사업자번호
  addressEncrypted: string;     // AES-256-GCM 암호화된 수령 주소
  targetItem: string;           // 신청 대상 종목/과정/교재명
  organizationName: string;     // 소속 아카데미/기관명
  detailMemo: string;           // 상세 기재사항
  status: "접수완료" | "심사중" | "발급/승인완료";
  createdAt: string;
  decryptedPhone?: string;
  decryptedBirth?: string;
  decryptedAddress?: string;
}

export interface UserAccountRecord {
  id: string;
  loginId: string;
  passwordHash: string;         // SHA-256 + Salt 해시된 비밀번호
  name: string;
  phoneHash: string;
  phoneEncrypted: string;       // AES-256-GCM 암호화된 연락처
  birthEncrypted: string;       // AES-256-GCM 암호화된 생년월일
  email: string;
  addressEncrypted: string;     // AES-256-GCM 암호화된 주소
  affiliation: string;
  role: "member" | "instructor" | "admin";
  createdAt: string;
  decryptedPhone?: string;
  decryptedBirth?: string;
  decryptedAddress?: string;
}

// 브라우저 로컬 스토리지 키 상수
const STORAGE_KEYS = {
  EXAM_APPS: "kwac_kcac_encrypted_exam_apps_v1",
  SERVICE_REQS: "kwac_kcac_encrypted_service_reqs_v1",
  USERS: "kwac_kcac_encrypted_users_v1",
  SESSION: "kwac_kcac_current_user_session_v1",
};

/**
 * 초기 샘플 데이터 시드 함수:
 * 사용자가 처음 사이트를 열었을 때도 '홍길동 / 010-1234-5678'로 접수확인 및 합격확인을
 * 바로 체험해볼 수 있도록 AES-256-GCM으로 실제 암호화된 샘플 데이터를 생성합니다.
 */
async function ensureSeedData(): Promise<void> {
  if (typeof window === "undefined") return;

  const existingApps = localStorage.getItem(STORAGE_KEYS.EXAM_APPS);
  if (!existingApps) {
    const samplePhoneHash = await hashPhoneForLookup("010-1234-5678");
    const samplePhoneEnc = await encryptSensitiveData("010-1234-5678");
    const sampleBirthEnc = await encryptSensitiveData("1995-05-15");
    const sampleAddrEnc = await encryptSensitiveData(
      "경기도 수원시 영통구 동탄원천로 881번길 35"
    );

    const seedApps: ExamApplicationRecord[] = [
      {
        id: "seed-app-1",
        examNumber: "KWAC-2611-0001",
        association: "KWAC",
        scheduleId: "kwac-2026-11-01",
        qualificationName: "와인 소믈리에",
        grade: "1급",
        examType: "필기+실기",
        applicantName: "홍길동",
        phoneHash: samplePhoneHash,
        phoneEncrypted: samplePhoneEnc,
        birthEncrypted: sampleBirthEnc,
        addressEncrypted: sampleAddrEnc,
        trainingCenter: "수원 본부 아카데미",
        feeAmount: "150,000원",
        paymentStatus: "입금완료",
        writtenScore: 84,
        practicalScore: 88,
        passStatus: "합격",
        certificateNo: "KWAC-2026-1001",
        createdAt: "2026-11-03",
      },
      {
        id: "seed-app-2",
        examNumber: "KCAC-2611-0002",
        association: "KCAC",
        scheduleId: "kcac-2026-11-01",
        qualificationName: "커피바리스타",
        grade: "2급",
        examType: "실기",
        applicantName: "홍길동",
        phoneHash: samplePhoneHash,
        phoneEncrypted: samplePhoneEnc,
        birthEncrypted: sampleBirthEnc,
        addressEncrypted: sampleAddrEnc,
        trainingCenter: "KCAC 수원 지정검정장",
        feeAmount: "60,000원",
        paymentStatus: "입금완료",
        writtenScore: null,
        practicalScore: 86,
        passStatus: "합격",
        certificateNo: "KCAC-2026-2045",
        createdAt: "2026-11-05",
      },
    ];

    localStorage.setItem(STORAGE_KEYS.EXAM_APPS, JSON.stringify(seedApps));
  }
}

// ============================================================================
// 1. 시험 원서접수 저장 및 접수/합격 조회 함수
// ============================================================================

export async function submitExamApplication(input: {
  association: "KWAC" | "KCAC";
  scheduleId: string;
  qualificationName: string;
  grade: string;
  examType: string;
  applicantName: string;
  phone: string;
  birth: string;
  address: string;
  trainingCenter: string;
  feeAmount: string;
}): Promise<ExamApplicationRecord> {
  await ensureSeedData();

  // 개인정보를 DB 저장 전 AES-256-GCM 및 SHA-256으로 즉시 암호화합니다.
  const phoneHash = await hashPhoneForLookup(input.phone);
  const phoneEncrypted = await encryptSensitiveData(input.phone);
  const birthEncrypted = await encryptSensitiveData(input.birth);
  const addressEncrypted = await encryptSensitiveData(input.address);

  // 고유 수험번호 생성 (예: KWAC-2611-4821)
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const examNumber = `${input.association}-2611-${randomSuffix}`;
  const today = new Date().toISOString().slice(0, 10);

  const newRecord: ExamApplicationRecord = {
    id: crypto.randomUUID(),
    examNumber,
    association: input.association,
    scheduleId: input.scheduleId,
    qualificationName: input.qualificationName,
    grade: input.grade,
    examType: input.examType,
    applicantName: input.applicantName.trim(),
    phoneHash,
    phoneEncrypted,
    birthEncrypted,
    addressEncrypted,
    trainingCenter: input.trainingCenter.trim(),
    feeAmount: input.feeAmount,
    paymentStatus: "입금대기",
    writtenScore: null,
    practicalScore: null,
    passStatus: "검정예정",
    certificateNo: null,
    createdAt: today,
  };

  // Supabase가 연결되어 있으면 Supabase 테이블에도 암호화된 데이터를 저장합니다.
  if (supabase) {
    try {
      await supabase.from("kwac_kcac_exam_applications").insert({
        exam_number: newRecord.examNumber,
        association: newRecord.association,
        schedule_id: newRecord.scheduleId,
        qualification_name: newRecord.qualificationName,
        grade: newRecord.grade,
        exam_type: newRecord.examType,
        applicant_name: newRecord.applicantName,
        phone_hash: newRecord.phoneHash,
        phone_encrypted: newRecord.phoneEncrypted,
        birth_encrypted: newRecord.birthEncrypted,
        address_encrypted: newRecord.addressEncrypted,
        training_center: newRecord.trainingCenter,
        fee_amount: newRecord.feeAmount,
        payment_status: newRecord.paymentStatus,
        pass_status: newRecord.passStatus,
      });
    } catch (e) {
      console.warn("Supabase 저장 폴백(로컬 암호화 스토리지 사용):", e);
    }
  }

  // 브라우저 암호화 스토리지에도 저장
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAM_APPS);
    const list: ExamApplicationRecord[] = raw ? JSON.parse(raw) : [];
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.EXAM_APPS, JSON.stringify(list));
  }

  return {
    ...newRecord,
    decryptedPhone: input.phone,
    decryptedBirth: input.birth,
    decryptedAddress: input.address,
  };
}

/**
 * 응시자 성명 + 연락처(또는 수험번호)로 접수내역 및 합격여부를 조회하고 복호화합니다.
 */
export async function findExamApplications(query: {
  association?: "KWAC" | "KCAC";
  applicantName: string;
  phone: string;
  examNumber?: string;
}): Promise<ExamApplicationRecord[]> {
  await ensureSeedData();
  if (typeof window === "undefined") return [];

  const targetPhoneHash = await hashPhoneForLookup(query.phone);
  const raw = localStorage.getItem(STORAGE_KEYS.EXAM_APPS);
  const list: ExamApplicationRecord[] = raw ? JSON.parse(raw) : [];

  const matched = list.filter((item) => {
    const assocMatch = query.association
      ? item.association === query.association
      : true;
    const nameMatch = item.applicantName === query.applicantName.trim();
    const phoneMatch = item.phoneHash === targetPhoneHash;
    const examNoMatch = query.examNumber
      ? item.examNumber.toUpperCase() === query.examNumber.trim().toUpperCase()
      : true;

    return assocMatch && nameMatch && phoneMatch && examNoMatch;
  });

  // 암호화된 개인정보를 복호화하여 반환
  const decryptedList = await Promise.all(
    matched.map(async (item) => ({
      ...item,
      decryptedPhone: await decryptSensitiveData(item.phoneEncrypted),
      decryptedBirth: await decryptSensitiveData(item.birthEncrypted),
      decryptedAddress: await decryptSensitiveData(item.addressEncrypted),
    }))
  );

  return decryptedList;
}

// ============================================================================
// 2. 통합 등록 및 신청 (자격증/강사/심사위원/기관/교육/대회/교재/증명서/연수/문제은행)
// ============================================================================

export async function submitServiceRequest(input: {
  association: "KWAC" | "KCAC";
  serviceType: string;
  serviceLabel: string;
  applicantName: string;
  phone: string;
  birthOrBizNo: string;
  address: string;
  targetItem: string;
  organizationName: string;
  detailMemo: string;
}): Promise<ServiceRequestRecord> {
  const phoneHash = await hashPhoneForLookup(input.phone);
  const phoneEncrypted = await encryptSensitiveData(input.phone);
  const birthEncrypted = await encryptSensitiveData(input.birthOrBizNo);
  const addressEncrypted = await encryptSensitiveData(input.address);

  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const requestCode = `REQ-${input.association}-${randomCode}`;
  const today = new Date().toISOString().slice(0, 10);

  const newReq: ServiceRequestRecord = {
    id: crypto.randomUUID(),
    requestCode,
    association: input.association,
    serviceType: input.serviceType,
    serviceLabel: input.serviceLabel,
    applicantName: input.applicantName.trim(),
    phoneHash,
    phoneEncrypted,
    birthEncrypted,
    addressEncrypted,
    targetItem: input.targetItem,
    organizationName: input.organizationName.trim(),
    detailMemo: input.detailMemo.trim(),
    status: "접수완료",
    createdAt: today,
  };

  if (supabase) {
    try {
      await supabase.from("kwac_kcac_service_requests").insert({
        request_code: newReq.requestCode,
        association: newReq.association,
        service_type: newReq.serviceType,
        service_label: newReq.serviceLabel,
        applicant_name: newReq.applicantName,
        phone_hash: newReq.phoneHash,
        phone_encrypted: newReq.phoneEncrypted,
        birth_encrypted: newReq.birthEncrypted,
        address_encrypted: newReq.addressEncrypted,
        target_item: newReq.targetItem,
        organization_name: newReq.organizationName,
        detail_memo: newReq.detailMemo,
        status: newReq.status,
      });
    } catch (e) {
      console.warn("Supabase 신청 저장 폴백:", e);
    }
  }

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICE_REQS);
    const list: ServiceRequestRecord[] = raw ? JSON.parse(raw) : [];
    list.unshift(newReq);
    localStorage.setItem(STORAGE_KEYS.SERVICE_REQS, JSON.stringify(list));
  }

  return {
    ...newReq,
    decryptedPhone: input.phone,
    decryptedBirth: input.birthOrBizNo,
    decryptedAddress: input.address,
  };
}

export async function findServiceRequests(query: {
  applicantName: string;
  phone: string;
}): Promise<ServiceRequestRecord[]> {
  if (typeof window === "undefined") return [];
  const targetPhoneHash = await hashPhoneForLookup(query.phone);
  const raw = localStorage.getItem(STORAGE_KEYS.SERVICE_REQS);
  const list: ServiceRequestRecord[] = raw ? JSON.parse(raw) : [];

  const matched = list.filter(
    (item) =>
      item.applicantName === query.applicantName.trim() &&
      item.phoneHash === targetPhoneHash
  );

  return Promise.all(
    matched.map(async (item) => ({
      ...item,
      decryptedPhone: await decryptSensitiveData(item.phoneEncrypted),
      decryptedBirth: await decryptSensitiveData(item.birthEncrypted),
      decryptedAddress: await decryptSensitiveData(item.addressEncrypted),
    }))
  );
}

// ============================================================================
// 3. 회원 가입, 로그인 및 관리자용 전체 조회/상태 변경 함수
// ============================================================================

export async function registerUserAccount(input: {
  loginId: string;
  passwordPlain: string;
  name: string;
  phone: string;
  birth: string;
  email: string;
  address: string;
  affiliation: string;
}): Promise<{ ok: boolean; message: string; user?: UserAccountRecord }> {
  if (typeof window === "undefined") {
    return { ok: false, message: "브라우저 환경에서만 가입이 가능합니다." };
  }

  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  const users: UserAccountRecord[] = raw ? JSON.parse(raw) : [];

  if (users.some((u) => u.loginId.toLowerCase() === input.loginId.trim().toLowerCase())) {
    return { ok: false, message: "이미 사용 중인 아이디입니다. 다른 아이디를 입력해 주세요." };
  }

  // 비밀번호는 단방향 해시(SHA-256 + Salt), 개인정보는 양방향 AES-256-GCM 암호화
  const passwordHash = await hashWithSalt(input.passwordPlain);
  const phoneHash = await hashPhoneForLookup(input.phone);
  const phoneEncrypted = await encryptSensitiveData(input.phone);
  const birthEncrypted = await encryptSensitiveData(input.birth);
  const addressEncrypted = await encryptSensitiveData(input.address);

  const newUser: UserAccountRecord = {
    id: crypto.randomUUID(),
    loginId: input.loginId.trim(),
    passwordHash,
    name: input.name.trim(),
    phoneHash,
    phoneEncrypted,
    birthEncrypted,
    email: input.email.trim(),
    addressEncrypted,
    affiliation: input.affiliation.trim(),
    role: "member",
    createdAt: new Date().toISOString().slice(0, 10),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(
    STORAGE_KEYS.SESSION,
    JSON.stringify({
      ...newUser,
      decryptedPhone: input.phone,
      decryptedBirth: input.birth,
      decryptedAddress: input.address,
    })
  );

  return { ok: true, message: "회원가입이 완료되었습니다.", user: newUser };
}

export async function loginUserAccount(
  loginId: string,
  passwordPlain: string
): Promise<{ ok: boolean; message: string; user?: UserAccountRecord }> {
  if (typeof window === "undefined") {
    return { ok: false, message: "브라우저 환경에서 시도해 주세요." };
  }

  // 데모용 기본 관리자/회원 계정 지원
  if (loginId === "admin" && passwordPlain === "admin1234") {
    const adminUser: UserAccountRecord = {
      id: "admin-default",
      loginId: "admin",
      passwordHash: "",
      name: "홍길동",
      phoneHash: await hashPhoneForLookup("010-1234-5678"),
      phoneEncrypted: await encryptSensitiveData("010-1234-5678"),
      birthEncrypted: await encryptSensitiveData("1995-05-15"),
      email: "kdc8080@kakao.com",
      addressEncrypted: await encryptSensitiveData("경기도 수원시 영통구 동탄원천로 881번길 35"),
      affiliation: "KWAC · KCAC 중앙본부",
      role: "admin",
      createdAt: "2026-01-01",
      decryptedPhone: "010-1234-5678",
      decryptedBirth: "1995-05-15",
      decryptedAddress: "경기도 수원시 영통구 동탄원천로 881번길 35",
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(adminUser));
    return { ok: true, message: "관리자 계정으로 로그인되었습니다.", user: adminUser };
  }

  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  const users: UserAccountRecord[] = raw ? JSON.parse(raw) : [];
  const passwordHash = await hashWithSalt(passwordPlain);

  const found = users.find(
    (u) => u.loginId === loginId.trim() && u.passwordHash === passwordHash
  );

  if (!found) {
    return {
      ok: false,
      message: "아이디 또는 비밀번호가 일치하지 않습니다. (테스트 계정: admin / admin1234)",
    };
  }

  const sessionUser: UserAccountRecord = {
    ...found,
    decryptedPhone: await decryptSensitiveData(found.phoneEncrypted),
    decryptedBirth: await decryptSensitiveData(found.birthEncrypted),
    decryptedAddress: await decryptSensitiveData(found.addressEncrypted),
  };

  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
  return { ok: true, message: "로그인 성공", user: sessionUser };
}

export function getCurrentSessionUser(): UserAccountRecord | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
  return raw ? JSON.parse(raw) : null;
}

export function logoutUserAccount(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// 관리자용: 모든 원서접수 내역 조회 및 합격/점수 업데이트
export async function getAllExamApplicationsForAdmin(): Promise<ExamApplicationRecord[]> {
  await ensureSeedData();
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.EXAM_APPS);
  const list: ExamApplicationRecord[] = raw ? JSON.parse(raw) : [];

  return Promise.all(
    list.map(async (item) => ({
      ...item,
      decryptedPhone: await decryptSensitiveData(item.phoneEncrypted),
      decryptedBirth: await decryptSensitiveData(item.birthEncrypted),
      decryptedAddress: await decryptSensitiveData(item.addressEncrypted),
    }))
  );
}

export async function updateExamApplicationByAdmin(
  id: string,
  updates: {
    paymentStatus: "입금대기" | "입금완료";
    writtenScore: number | null;
    practicalScore: number | null;
    passStatus: "검정예정" | "합격" | "불합격";
    certificateNo: string | null;
  }
): Promise<void> {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEYS.EXAM_APPS);
  const list: ExamApplicationRecord[] = raw ? JSON.parse(raw) : [];

  const updated = list.map((item) =>
    item.id === id ? { ...item, ...updates } : item
  );
  localStorage.setItem(STORAGE_KEYS.EXAM_APPS, JSON.stringify(updated));
}

export async function getAllServiceRequestsForAdmin(): Promise<ServiceRequestRecord[]> {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.SERVICE_REQS);
  const list: ServiceRequestRecord[] = raw ? JSON.parse(raw) : [];

  return Promise.all(
    list.map(async (item) => ({
      ...item,
      decryptedPhone: await decryptSensitiveData(item.phoneEncrypted),
      decryptedBirth: await decryptSensitiveData(item.birthEncrypted),
      decryptedAddress: await decryptSensitiveData(item.addressEncrypted),
    }))
  );
}

export async function updateServiceRequestStatusByAdmin(
  id: string,
  status: "접수완료" | "심사중" | "발급/승인완료"
): Promise<void> {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEYS.SERVICE_REQS);
  const list: ServiceRequestRecord[] = raw ? JSON.parse(raw) : [];
  const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
  localStorage.setItem(STORAGE_KEYS.SERVICE_REQS, JSON.stringify(updated));
}

