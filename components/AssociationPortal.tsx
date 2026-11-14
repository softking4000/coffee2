"use client";

// ============================================================================
// 파일명: components/AssociationPortal.tsx
// 역할: KWAC(한국와인아카데미협의회) 14개 메뉴와 KCAC(한국커피아카데미협의회) 14개 메뉴를
//       완벽하게 처리하는 통합 자격검정·등록·신청 포털 컴포넌트입니다.
//       1) 검정시험 그룹 (4종): 응시현황(status), 시험접수(apply), 접수확인(verify), 합격확인(result)
//       2) 자격·기관등록 그룹 (4종): 자격증신청(cert-issue), 강사등록(instructor), 심사위원등록(judge), 검정기관등록(institution)
//       3) 교육·부가신청 그룹 (6종): 교육등록(education), 대회신청(contest), 교재신청(textbook), 증명서신청(proof), 연수신청(training), 문제은행신청(question-bank)
// ============================================================================

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wine,
  Coffee,
  Calendar,
  ClipboardCheck,
  SearchCheck,
  Award,
  FileBadge,
  GraduationCap,
  Scale,
  Building2,
  BookOpen,
  Trophy,
  FileText,
  Plane,
  HelpCircle,
  Lock,
  CheckCircle2,
  ChevronRight,
  Printer,
  Users,
  CreditCard,
  Sparkles,
} from "lucide-react";
import {
  MAIN_MENUS,
  ORG_INFO,
  QUALIFICATIONS,
  SAMPLE_EXAM_SCHEDULES,
} from "@/lib/menu-data";
import {
  submitExamApplication,
  findExamApplications,
  submitServiceRequest,
  findServiceRequests,
  ExamApplicationRecord,
  ServiceRequestRecord,
} from "@/lib/supabase";

interface AssociationPortalProps {
  association: "KWAC" | "KCAC";
}

// 10개 등록/신청 메뉴별 맞춤형 옵션 및 안내 설정
const SERVICE_META: Record<
  string,
  {
    titleKor: string;
    badge: string;
    desc: string;
    itemLabel: string;
    kwacOptions: string[];
    kcacOptions: string[];
    memoPlaceholder: string;
  }
> = {
  "cert-issue": {
    titleKor: "자격증 발급 신청",
    badge: "CERTIFICATE ISSUANCE",
    desc: "자격검정 최종 합격자를 대상으로 상장형 자격증(A4 케이스) 및 카드형 자격증(PVC) 신규/추가 발급을 신청합니다.",
    itemLabel: "발급 신청 자격종목 및 형태 선택",
    kwacOptions: [
      "와인 소믈리에 1급 (상장형 + 카드형 세트)",
      "와인 소믈리에 2급 (상장형 + 카드형 세트)",
      "와인 디켄팅 서비스 (상장형 + 카드형 세트)",
      "와인강사 1급·2급 (상장형 + 강사패키지)",
    ],
    kcacOptions: [
      "커피바리스타 1급 (상장형 + 카드형 세트)",
      "커피바리스타 2급 (상장형 + 카드형 세트)",
      "커피핸드드립 단일등급 (상장형 + 카드형 세트)",
      "커피라떼아트 1·2급 (상장형 + 카드형 세트)",
      "커피로스팅 / 커피향미 (상장형 + 카드형 세트)",
      "커피강사 1·2급 (상장형 + 강사패키지)",
    ],
    memoPlaceholder: "합격하신 수험번호(또는 취득년도)와 영문 성명(카드 표기용)을 입력해 주세요.",
  },
  instructor: {
    titleKor: "공인 강사 등록 신청",
    badge: "OFFICIAL INSTRUCTOR REGISTRATION",
    desc: "협의회 공인 와인강사·커피강사 신규 등록 및 자격 갱신을 신청합니다. 등록 완료 시 강사 위촉증명서 발급이 가능합니다.",
    itemLabel: "등록 강사 등급 및 분야",
    kwacOptions: [
      "KWAC 공인 와인강사 2급 신규등록",
      "KWAC 공인 와인강사 1급 신규등록",
      "KWAC 수석 와인강사 자격 갱신",
    ],
    kcacOptions: [
      "KCAC 공인 커피강사 2급 신규등록",
      "KCAC 공인 커피강사 1급 신규등록",
      "KCAC 수석 바리스타 강사 자격 갱신",
    ],
    memoPlaceholder: "보유 자격증 번호, 주요 강의 경력 및 현재 출강 중인 아카데미명을 입력해 주세요.",
  },
  judge: {
    titleKor: "실기 심사위원 등록 신청",
    badge: "OFFICIAL EXAM JUDGE REGISTRATION",
    desc: "정기 자격검정 실기 고사장 및 전국 경연대회 채점을 담당할 공식 심사위원 신규/갱신 위촉을 신청합니다.",
    itemLabel: "심사위원 위촉 신청 부문",
    kwacOptions: [
      "와인 소믈리에 블라인드 테이스팅 심사위원",
      "와인 디켄팅 서비스 실기 심사위원",
      "전국 와인 소믈리에 경연대회 심사위원",
    ],
    kcacOptions: [
      "커피바리스타 1·2급 실기 시연 심사위원",
      "커피핸드드립 · 라떼아트 실기 심사위원",
      "커피로스팅 · 센서리(향미) 기술 심사위원",
    ],
    memoPlaceholder: "1급/강사 자격번호, 심사위원 직무연수 수료 여부 및 활동 가능 지역을 입력해 주세요.",
  },
  institution: {
    titleKor: "공식 지정검정기관 등록 신청",
    badge: "OFFICIAL TEST CENTER REGISTRATION",
    desc: "전국 와인·커피 아카데미, 대학, 평생교육원 등을 공식 지정검정장(교육장 및 실기 고사장)으로 승인 신청합니다.",
    itemLabel: "지정검정기관 승인 신청 구분",
    kwacOptions: [
      "KWAC 와인 소믈리에·디켄팅 공식 지정검정장 신규지정",
      "KWAC 지정 교육기관 연간 갱신 및 현판 재교부",
    ],
    kcacOptions: [
      "KCAC 커피바리스타·핸드드립 공식 지정검정장 신규지정",
      "KCAC 로스팅·라떼아트·향미 전문 지정검정장 추가지정",
      "KCAC 지정 교육기관 연간 갱신 및 현판 재교부",
    ],
    memoPlaceholder: "교육기관 시설 규모(평수), 보유 장비(머신/그라인더 대수 또는 테이스팅 좌석 수), 전임강사 성명을 기재해 주세요.",
  },
  education: {
    titleKor: "정규 및 특별 교육과정 등록",
    badge: "ACADEMY EDUCATION PROGRAM",
    desc: "협의회 본부 및 지정 교육장에서 운영하는 자격검정 대비반, 블라인드 테이스팅 심화반, 센서리·로스팅 특강을 신청합니다.",
    itemLabel: "수강 희망 교육과정 선택",
    kwacOptions: [
      "와인 소믈리에 2급·1급 집중 자격대비 과정",
      "실전 블라인드 테이스팅(5품종/8품종) 마스터 클래스",
      "업장 실무 캔들 디켄팅 서비스 특강",
      "와인강사 티칭 스킬 및 강의발표 코칭 과정",
    ],
    kcacOptions: [
      "커피바리스타 2급·1급 실기 시연 완성 과정",
      "핸드드립 수율 제어 및 브루잉 레시피 과정",
      "프리푸어 라떼아트(하트·튤립·로제타) 집중반",
      "생두 디펙트 선별 및 로스팅 프로파일링 실습반",
    ],
    memoPlaceholder: "희망 수강 요일(평일 오전/오후, 주말반) 및 선수 학습 여부를 입력해 주세요.",
  },
  contest: {
    titleKor: "전국 경연대회 참가 신청",
    badge: "CHAMPIONSHIP & CONTEST ENTRY",
    desc: "한국와인아카데미협의회(KWAC) 및 한국커피아카데미협의회(KCAC)가 주관하는 전국 경연대회 선수 참가 원서를 접수합니다.",
    itemLabel: "대회 참가 부문 선택",
    kwacOptions: [
      "코리아 와인 소믈리에 챔피언십 (일반/프로부)",
      "전국 대학·아카데미 소믈리에 경연대회 (학생부)",
      "와인 블라인드 테이스팅 챌린지",
    ],
    kcacOptions: [
      "전국 바리스타 에스프레소 챔피언십",
      "코리아 브루어스(핸드드립) 컵 대회",
      "전국 라떼아트 배틀 챔피언십",
    ],
    memoPlaceholder: "참가 구분(개인전/단체전), 소속 학교/아카데미 및 지도강사 성명을 입력해 주세요.",
  },
  textbook: {
    titleKor: "공식 수험 교재 신청",
    badge: "OFFICIAL TEXTBOOK ORDER",
    desc: "자격검정 필기·실기 대비를 위한 협의회 공식 표준 수험서 및 실기 지침서를 온라인으로 주문 신청합니다.",
    itemLabel: "주문할 공식 교재 선택",
    kwacOptions: [
      "[공식교재] 와인 소믈리에 2급·1급 표준 이론서 (25,000원)",
      "[공식교재] 와인 블라인드 테이스팅 & 디켄팅 실기 바이블 (22,000원)",
      "[기관용] 와인 아카데미 강사용 표준 교안 세트 (45,000원)",
    ],
    kcacOptions: [
      "[공식교재] 커피바리스타 2급·1급 핵심 이론 및 실기 표준서 (23,000원)",
      "[공식교재] 스페셜티 핸드드립 · 로스팅 · 커피향미 워크북 (25,000원)",
      "[기관용] 커피강사 표준 강의 교안 및 실기 채점 가이드 (45,000원)",
    ],
    memoPlaceholder: "신청 권수(예: 5권)와 세금계산서/현금영수증 발행 필요 여부를 입력해 주세요.",
  },
  proof: {
    titleKor: "각종 증명서 발급 신청",
    badge: "OFFICIAL CERTIFICATE OF PROOF",
    desc: "자격 취득 확인서, 강사 경력증명서, 심사위원 위촉증명서, 세미나·연수 참석증명서를 온라인으로 발급 신청합니다.",
    itemLabel: "발급 신청 증명서 종류",
    kwacOptions: [
      "KWAC 자격취득 확인 증명서 (국문/영문)",
      "KWAC 와인강사 강의 경력증명서",
      "KWAC 실기 심사위원 위촉증명서",
      "KWAC 와인 세미나 · 산지연수 참석증명서",
    ],
    kcacOptions: [
      "KCAC 자격취득 확인 증명서 (국문/영문)",
      "KCAC 커피강사 강의 경력증명서",
      "KCAC 실기 심사위원 위촉증명서",
      "KCAC 커피 세미나 · 심사위원 연수 참석증명서",
    ],
    memoPlaceholder: "제출처(학교, 기관, 취업처 등), 필요한 부수 및 이메일 수령 주소를 입력해 주세요.",
  },
  training: {
    titleKor: "직무 연수 및 산지 투어 신청",
    badge: "PROFESSIONAL TRAINING & TOUR",
    desc: "강사·심사위원 정기 직무 보수교육과 국내외 와이너리 및 커피 산지 방문 연수 프로그램을 신청합니다.",
    itemLabel: "참가 희망 연수 프로그램",
    kwacOptions: [
      "KWAC 정기 심사위원 블라인드 캘리브레이션 연수",
      "국내 와이너리(영동·영천 등) 양조장 현장 연수",
      "해외 와인 산지(프랑스·이탈리아·칠레) 소믈리에 투어",
    ],
    kcacOptions: [
      "KCAC 정기 실기 심사위원 센서리 캘리브레이션 연수",
      "스페셜티 로스터리 커핑 & 머신 엔지니어링 직무연수",
      "해외 커피 산지(에티오피아·콜롬비아·과테말라) 농장 투어",
    ],
    memoPlaceholder: "참가 인원, 보유 자격 등급 및 기타 요청사항을 입력해 주세요.",
  },
  "question-bank": {
    titleKor: "필기 문제은행 신청",
    badge: "WRITTEN EXAM QUESTION BANK",
    desc: "자격검정 필기시험(60문항) 완벽 대비를 위한 과목별 기출 유형 문제은행 및 모의고사 자료를 신청합니다.",
    itemLabel: "신청할 문제은행 종목",
    kwacOptions: [
      "와인 소믈리에 2급 필기 예상 문제은행 (해설집 포함)",
      "와인 소믈리에 1급 심화 필기 문제은행 (해설집 포함)",
      "와인강사 1·2급 필기 기출유형 문제은행",
    ],
    kcacOptions: [
      "커피바리스타 1급 필기 예상 문제은행 (해설집 포함)",
      "커피로스팅 · 커피향미 필기 핵심 문제은행",
      "커피강사 1·2급 필기 기출유형 문제은행",
    ],
    memoPlaceholder: "수험생 개인 학습용 / 지정검정기관 단체 교육용 여부를 기재해 주세요.",
  },
};

export default function AssociationPortal({ association }: AssociationPortalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isWine = association === "KWAC";

  // URL ?menu= 파라미터 확인 (기본값: 'status' 응시현황)
  const menuParam = searchParams.get("menu") || "status";
  const examIdParam = searchParams.get("examId") || "";

  const [activeMenu, setActiveMenu] = useState<string>(menuParam);

  useEffect(() => {
    setActiveMenu(menuParam);
  }, [menuParam]);

  // 현재 협회(KWAC 또는 KCAC)의 메뉴 목록 및 자격 종목 필터링
  const currentMenuObj = MAIN_MENUS.find(
    (m) => m.id === association.toLowerCase()
  );
  const assocSchedules = SAMPLE_EXAM_SCHEDULES.filter(
    (s) => s.association === association
  );
  const assocQualifications = QUALIFICATIONS.filter(
    (q) => q.association === association
  );

  // ==========================================================================
  // 상태 1: [시험접수(apply)] 폼 입력 상태
  // ==========================================================================
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(
    examIdParam || assocSchedules[0]?.id || ""
  );
  const [selectedQualId, setSelectedQualId] = useState<string>(
    assocQualifications[0]?.id || ""
  );
  const [selectedExamType, setSelectedExamType] = useState<string>("실기");
  const [applicantName, setApplicantName] = useState<string>("");
  const [applicantPhone, setApplicantPhone] = useState<string>("");
  const [applicantBirth, setApplicantBirth] = useState<string>("");
  const [applicantAddress, setApplicantAddress] = useState<string>("");
  const [trainingCenter, setTrainingCenter] = useState<string>("");
  const [submittedExamResult, setSubmittedExamResult] =
    useState<ExamApplicationRecord | null>(null);
  const [isSubmittingExam, setIsSubmittingExam] = useState<boolean>(false);

  // ==========================================================================
  // 상태 2: [접수확인(verify)] & [합격확인(result)] 조회 상태
  // ==========================================================================
  const [searchName, setSearchName] = useState<string>("");
  const [searchPhone, setSearchPhone] = useState<string>("");
  const [searchExamNo, setSearchExamNo] = useState<string>("");
  const [lookupResults, setLookupResults] = useState<ExamApplicationRecord[] | null>(
    null
  );
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // ==========================================================================
  // 상태 3: [10종 등록/신청 메뉴] 폼 입력 및 조회 상태
  // ==========================================================================
  const currentServiceMeta = SERVICE_META[activeMenu];
  const defaultTargetOption = currentServiceMeta
    ? isWine
      ? currentServiceMeta.kwacOptions[0]
      : currentServiceMeta.kcacOptions[0]
    : "";

  const [reqTargetItem, setReqTargetItem] = useState<string>(defaultTargetOption);
  const [reqName, setReqName] = useState<string>("");
  const [reqPhone, setReqPhone] = useState<string>("");
  const [reqBirthOrBiz, setReqBirthOrBiz] = useState<string>("");
  const [reqAddress, setReqAddress] = useState<string>("");
  const [reqOrgName, setReqOrgName] = useState<string>("");
  const [reqMemo, setReqMemo] = useState<string>("");
  const [submittedServiceReq, setSubmittedServiceReq] =
    useState<ServiceRequestRecord | null>(null);
  const [myServiceReqs, setMyServiceReqs] = useState<ServiceRequestRecord[] | null>(
    null
  );

  // 메뉴가 변경될 때 기본 선택 옵션 초기화
  useEffect(() => {
    const meta = SERVICE_META[activeMenu];
    if (meta) {
      setReqTargetItem(isWine ? meta.kwacOptions[0] : meta.kcacOptions[0]);
      setSubmittedServiceReq(null);
    }
    setSubmittedExamResult(null);
    setLookupResults(null);
  }, [activeMenu, isWine]);

  // 좌측 LNB 메뉴 전환 함수
  const handleMenuChange = (menuKey: string) => {
    setActiveMenu(menuKey);
    router.push(`/${association.toLowerCase()}?menu=${menuKey}`, { scroll: false });
  };

  // [시험접수] 제출 핸들러 (AES-256-GCM 개인정보 암호화 저장)
  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone || !applicantBirth || !trainingCenter) {
      alert("성명, 연락처, 생년월일, 지정교육기관명을 모두 입력해 주세요.");
      return;
    }

    setIsSubmittingExam(true);
    try {
      const qualObj =
        assocQualifications.find((q) => q.id === selectedQualId) ||
        assocQualifications[0];

      const feeStr =
        selectedExamType === "필기"
          ? qualObj.writtenFee !== "-"
            ? qualObj.writtenFee
            : qualObj.practicalFee
          : qualObj.practicalFee;

      const created = await submitExamApplication({
        association,
        scheduleId: selectedScheduleId,
        qualificationName: qualObj.name,
        grade: qualObj.grade,
        examType: selectedExamType,
        applicantName,
        phone: applicantPhone,
        birth: applicantBirth,
        address: applicantAddress || "현장 수령",
        trainingCenter,
        feeAmount: feeStr,
      });

      setSubmittedExamResult(created);
    } finally {
      setIsSubmittingExam(false);
    }
  };

  // [접수확인 / 합격확인] 조회 핸들러
  const handleLookupSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName || !searchPhone) {
      alert("조회하실 응시자 성명과 연락처를 입력해 주세요.");
      return;
    }
    setIsSearching(true);
    try {
      const found = await findExamApplications({
        association,
        applicantName: searchName,
        phone: searchPhone,
        examNumber: searchExamNo || undefined,
      });
      setLookupResults(found);
    } finally {
      setIsSearching(false);
    }
  };

  // 샘플 데이터(홍길동 / 010-1234-5678) 원클릭 자동 입력 및 조회
  const handleFillSampleLookup = async () => {
    setSearchName("홍길동");
    setSearchPhone("010-1234-5678");
    setSearchExamNo("");
    setIsSearching(true);
    try {
      const found = await findExamApplications({
        association,
        applicantName: "홍길동",
        phone: "010-1234-5678",
      });
      setLookupResults(found);
    } finally {
      setIsSearching(false);
    }
  };

  // [10종 등록/신청] 제출 핸들러
  const handleServiceReqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName || !reqPhone || ! currentServiceMeta) {
      alert("신청자 성명과 연락처를 입력해 주세요.");
      return;
    }

    const saved = await submitServiceRequest({
      association,
      serviceType: activeMenu,
      serviceLabel: currentServiceMeta.titleKor,
      applicantName: reqName,
      phone: reqPhone,
      birthOrBizNo: reqBirthOrBiz || "-",
      address: reqAddress || "-",
      targetItem: reqTargetItem,
      organizationName: reqOrgName || "개인 신청",
      detailMemo: reqMemo || "-",
    });

    setSubmittedServiceReq(saved);
    const list = await findServiceRequests({
      applicantName: reqName,
      phone: reqPhone,
    });
    setMyServiceReqs(list);
  };

  // 테마 색상 클래스
  const primaryBg = isWine ? "bg-[#722F37]" : "bg-[#4A2C2A]";
  const primaryText = isWine ? "text-[#722F37]" : "text-[#4A2C2A]";
  const primaryBorder = isWine ? "border-[#722F37]" : "border-[#4A2C2A]";

  return (
    <div className="pb-16">
      {/* 1. 상단 협회 전용 비주얼 배너 */}
      <section
        className={`py-12 sm:py-16 text-white bg-gradient-to-r ${
          isWine
            ? "from-[#4a181e] via-[#722F37] to-stone-900"
            : "from-[#2b1817] via-[#4A2C2A] to-stone-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-amber-200 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline">
              HOME
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{association}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>
              {currentMenuObj?.subMenus.find((s) => s.href.includes(`menu=${activeMenu}`))
                ?.title || "응시현황"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold flex items-center gap-3">
                {isWine ? (
                  <Wine className="w-8 h-8 text-rose-200" />
                ) : (
                  <Coffee className="w-8 h-8 text-amber-200" />
                )}
                <span>
                  {isWine ? ORG_INFO.kwacName : ORG_INFO.kcacName} ({association})
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 mt-2 max-w-2xl">
                {isWine
                  ? "와인 소믈리에(1·2급), 와인 디켄팅 서비스, 와인강사(1·2급) 자격검정 접수·조회 및 와인 강사/심사위원/기관/대회/교재/증명서 통합 창구입니다."
                  : "커피바리스타(1·2급), 핸드드립, 라떼아트(1·2급), 로스팅, 커피향미, 커피강사(1·2급) 자격검정 접수·조회 및 커피 강사/심사위원/기관/대회/교재/증명서 통합 창구입니다."}
              </p>
            </div>

            {/* 반대 협회 빠른 전환 버튼 */}
            <Link
              href={isWine ? `/kcac?menu=${activeMenu}` : `/kwac?menu=${activeMenu}`}
              className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-xs font-extrabold flex items-center gap-2 shrink-0 transition-colors"
            >
              {isWine ? (
                <>
                  <Coffee className="w-4 h-4 text-amber-200" />
                  <span>KCAC (커피협의회) 전환 →</span>
                </>
              ) : (
                <>
                  <Wine className="w-4 h-4 text-rose-200" />
                  <span>KWAC (와인협의회) 전환 →</span>
                </>
              )}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 본문 레이아웃: 좌측 14개 서브메뉴 LNB + 우측 기능 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 좌측 사이드바 (14개 전체 메뉴 네비게이션) */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className={`${primaryBg} text-white p-4`}>
            <p className="text-[11px] font-bold opacity-80">{association} MENU</p>
            <h2 className="text-base font-extrabold mt-0.5">
              {isWine ? "와인협의회 14대 메뉴" : "커피협의회 14대 메뉴"}
            </h2>
          </div>

          <div className="p-3 space-y-4">
            {["검정시험", "자격·기관등록", "교육·부가신청"].map((groupName) => {
              const groupItems =
                currentMenuObj?.subMenus.filter((s) => s.category === groupName) || [];
              return (
                <div key={groupName}>
                  <p className="px-2.5 text-[11px] font-extrabold text-stone-400 uppercase mb-1.5">
                    {groupName}
                  </p>
                  <div className="space-y-1">
                    {groupItems.map((sub) => {
                      const menuKey = sub.href.split("menu=")[1] || "status";
                      const isCurrent = activeMenu === menuKey;
                      return (
                        <button
                          key={sub.href}
                          type="button"
                          onClick={() => handleMenuChange(menuKey)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isCurrent
                              ? `${primaryBg} text-white shadow-xs`
                              : "text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          <span>{sub.title}</span>
                          <ChevronRight
                            className={`w-4 h-4 ${
                              isCurrent ? "text-white" : "text-stone-400"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* 우측 메인 작업 영역 (9칸) */}
        <div className="lg:col-span-9 space-y-6">
          {/* =================================================================
              메뉴 1: 응시현황 (status)
          ================================================================= */}
          {activeMenu === "status" && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
                <div>
                  <span className={`text-xs font-extrabold ${primaryText}`}>
                    EXAMINATION SCHEDULE & STATUS
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                    {association} 자격검정 응시현황 및 일정 안내
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    현재 접수 진행 중인 정기 자격검정 현황입니다. 원하는 회차의 [원서접수] 버튼을 클릭하면 즉시 접수 화면으로 이동합니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleMenuChange("apply")}
                  className={`px-5 py-2.5 rounded-xl ${primaryBg} text-white text-xs sm:text-sm font-extrabold shadow-sm cursor-pointer`}
                >
                  + 온라인 시험접수 바로가기
                </button>
              </div>

              <div className="space-y-4">
                {assocSchedules.map((exam) => {
                  const percent = Math.round(
                    (exam.currentApplicants / exam.maxCapacity) * 100
                  );
                  return (
                    <div
                      key={exam.id}
                      className="p-5 rounded-2xl border border-stone-200 bg-[#faf8f5]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-400 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-xs font-extrabold px-2.5 py-0.5 rounded text-white ${primaryBg}`}
                          >
                            {exam.round}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                            {exam.examType}
                          </span>
                          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {exam.status}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-extrabold text-stone-900">
                          {exam.title}
                        </h3>
                        <div className="text-xs text-stone-600 space-y-1">
                          <p>
                            • <strong>원서접수 기간:</strong> {exam.applyStart} ~ {exam.applyEnd}
                          </p>
                          <p>
                            • <strong>시험 시행일:</strong>{" "}
                            <span className="text-stone-900 font-bold">{exam.examDate}</span> |{" "}
                            <strong>합격자 발표일:</strong> {exam.resultDate}
                          </p>
                          <p>
                            • <strong>시행 고사장:</strong> {exam.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-xs text-stone-600 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            현재 응시현황:{" "}
                            <strong className="text-stone-900">
                              {exam.currentApplicants} / {exam.maxCapacity}명
                            </strong>{" "}
                            ({percent}%)
                          </span>
                          <div className="w-32 h-2 bg-stone-200 rounded-full overflow-hidden mt-1.5">
                            <div
                              className={`h-full ${primaryBg}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedScheduleId(exam.id);
                            handleMenuChange("apply");
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold text-white ${primaryBg} hover:opacity-90 cursor-pointer`}
                        >
                          이 회차 원서접수 →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================================
              메뉴 2: 시험접수 (apply) - AES-256-GCM 암호화 저장
          ================================================================= */}
          {activeMenu === "apply" && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-stone-200 pb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className={`text-xs font-extrabold ${primaryText}`}>
                    ONLINE EXAM APPLICATION
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                    {association} 자격검정 온라인 시험 원서접수
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    입력하신 연락처·생년월일·주소는 <strong>AES-256-GCM 암호화</strong>되어 안전하게 보호됩니다.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <Lock className="w-3.5 h-3.5" /> AES-256 개인정보 암호화 적용중
                </span>
              </div>

              {/* 접수 완료 시 수험표 발급 카드 표시 */}
              {submittedExamResult ? (
                <div className="p-6 sm:p-8 rounded-2xl border-2 border-emerald-500 bg-emerald-50/40 space-y-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-stone-900">
                        원서접수가 정상적으로 완료되었습니다!
                      </h3>
                      <p className="text-xs text-stone-600">
                        부여된 수험번호를 확인하시고 지정 계좌로 응시료를 납부해 주시기 바랍니다.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <p>
                      <strong className="text-stone-500">부여 수험번호:</strong>{" "}
                      <span className={`font-black ${primaryText}`}>
                        {submittedExamResult.examNumber}
                      </span>
                    </p>
                    <p>
                      <strong className="text-stone-500">응시 종목/등급:</strong>{" "}
                      <span className="font-bold text-stone-900">
                        {submittedExamResult.qualificationName} ({submittedExamResult.grade}) -{" "}
                        {submittedExamResult.examType}
                      </span>
                    </p>
                    <p>
                      <strong className="text-stone-500">응시자 성명:</strong>{" "}
                      {submittedExamResult.applicantName}
                    </p>
                    <p>
                      <strong className="text-stone-500">연락처(복호화 확인):</strong>{" "}
                      {submittedExamResult.decryptedPhone}
                    </p>
                    <p>
                      <strong className="text-stone-500">지정검정장:</strong>{" "}
                      {submittedExamResult.trainingCenter}
                    </p>
                    <p>
                      <strong className="text-stone-500">납부할 응시료:</strong>{" "}
                      <span className="font-extrabold text-rose-700">
                        {submittedExamResult.feeAmount}
                      </span>
                    </p>
                    <p className="sm:col-span-2 text-[11px] text-stone-400 break-all">
                      • DB 암호화 저장값 미리보기( 연락처): {submittedExamResult.phoneEncrypted}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchName(submittedExamResult.applicantName);
                        setSearchPhone(submittedExamResult.decryptedPhone || "");
                        handleMenuChange("verify");
                      }}
                      className={`px-5 py-2.5 rounded-xl ${primaryBg} text-white text-xs font-extrabold cursor-pointer`}
                    >
                      접수확인 및 수험표 보기로 이동 →
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmittedExamResult(null)}
                      className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-bold cursor-pointer"
                    >
                      추가 원서접수 작성
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleExamSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                        1. 응시 시험 회차 선택 *
                      </label>
                      <select
                        value={selectedScheduleId}
                        onChange={(e) => setSelectedScheduleId(e.target.value)}
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm bg-white font-medium"
                      >
                        {assocSchedules.map((s) => (
                          <option key={s.id} value={s.id}>
                            [{s.round}] {s.title} (시험일: {s.examDate})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                        2. 응시 자격 종목 및 등급 선택 *
                      </label>
                      <select
                        value={selectedQualId}
                        onChange={(e) => setSelectedQualId(e.target.value)}
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm bg-white font-medium"
                      >
                        {assocQualifications.map((q) => (
                          <option key={q.id} value={q.id}>
                            {q.name} ({q.grade}) - 실기:{q.practicalFee} / 필기:{q.writtenFee}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                        3. 검정 응시 구분 *
                      </label>
                      <select
                        value={selectedExamType}
                        onChange={(e) => setSelectedExamType(e.target.value)}
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm bg-white font-medium"
                      >
                        <option value="실기">실기검정 응시</option>
                        <option value="필기">필기검정 응시</option>
                        <option value="필기+실기">필기 + 실기 동시 응시</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                        4. 교육이수 지정검정기관(고사장)명 *
                      </label>
                      <input
                        type="text"
                        required
                        value={trainingCenter}
                        onChange={(e) => setTrainingCenter(e.target.value)}
                        placeholder="예: 수원 본부 고사장 / 강남 지정검정장"
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                        5. 응시자 성명 (한글) *
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="예: 홍길동"
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                        6. 휴대폰 연락처 (암호화 저장) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="예: 010-1234-5678"
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                        7. 생년월일 (암호화 저장) *
                      </label>
                      <input
                        type="date"
                        required
                        value={applicantBirth}
                        onChange={(e) => setApplicantBirth(e.target.value)}
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                        8. 자격증 수령 주소 (암호화 저장)
                      </label>
                      <input
                        type="text"
                        value={applicantAddress}
                        onChange={(e) => setApplicantAddress(e.target.value)}
                        placeholder="예: 경기도 수원시 영통구 동탄원천로 881번길 35"
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* 입금 계좌 안내 */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <CreditCard className={`w-4 h-4 ${primaryText}`} />
                      <span className="font-bold text-stone-800">
                        {association} 지정 응시료 입금계좌:
                      </span>
                      <span className="font-extrabold text-stone-900">
                        {isWine
                          ? "신한은행 100-028-455336 (한국와인아카데미협의회)"
                          : "신한은행 100-028-455457 (한국커피아카데미협의회)"}
                      </span>
                    </div>
                    <span className="text-stone-500">응시자 본인 성명으로 입금 요망</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingExam}
                    className={`w-full py-3.5 rounded-xl ${primaryBg} text-white font-extrabold text-sm shadow-md hover:opacity-95 transition-opacity cursor-pointer`}
                  >
                    {isSubmittingExam
                      ? "개인정보 암호화 및 원서접수 처리 중..."
                      : `${association} 온라인 시험 원서접수 완료하기`}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* =================================================================
              메뉴 3 & 4: 접수확인 (verify) 및 합격확인 (result)
          ================================================================= */}
          {(activeMenu === "verify" || activeMenu === "result") && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-5">
                <div>
                  <span className={`text-xs font-extrabold ${primaryText}`}>
                    {activeMenu === "verify"
                      ? "APPLICATION VERIFICATION"
                      : "PASS / SCORE ANNOUNCEMENT"}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                    {activeMenu === "verify"
                      ? `${association} 시험 접수확인 및 수험표 조회`
                      : `${association} 자격검정 합격확인 및 점수 조회`}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    원서접수 시 입력한 성명과 휴대폰 번호를 입력하시면 암호화된 데이터를 복호화하여 결과를 보여줍니다.
                  </p>
                </div>

                {/* 초보자 테스트용 원클릭 샘플 데이터 조회 버튼 */}
                <button
                  type="button"
                  onClick={handleFillSampleLookup}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-extrabold flex items-center gap-1.5 hover:bg-amber-100 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>샘플 수험생(홍길동) 원클릭 조회 체험</span>
                </button>
              </div>

              {/* 검색 폼 */}
              <form
                onSubmit={handleLookupSearch}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200"
              >
                <input
                  type="text"
                  required
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="응시자 성명 (예: 홍길동)"
                  className="rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm"
                />
                <input
                  type="tel"
                  required
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="연락처 (예: 010-1234-5678)"
                  className="rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm"
                />
                <input
                  type="text"
                  value={searchExamNo}
                  onChange={(e) => setSearchExamNo(e.target.value)}
                  placeholder="수험번호 (선택 입력)"
                  className="rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className={`rounded-lg ${primaryBg} text-white font-extrabold text-xs sm:text-sm py-2.5 cursor-pointer`}
                >
                  {isSearching ? "조회 중..." : "내역 조회하기"}
                </button>
              </form>

              {/* 조회 결과 표시 */}
              {lookupResults && (
                <div className="space-y-4">
                  {lookupResults.length === 0 ? (
                    <div className="p-8 text-center rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm text-stone-600">
                      입력하신 정보와 일치하는 {association} 접수/합격 내역이 없습니다. (우측 상단의{" "}
                      <strong>[샘플 수험생(홍길동) 원클릭 조회 체험]</strong> 버튼을 눌러보시거나{" "}
                      <strong>[시험접수]</strong>에서 먼저 접수해 보세요!)
                    </div>
                  ) : (
                    lookupResults.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-2xl border-2 ${primaryBorder}/30 bg-[#faf8f5] p-6 space-y-4`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-extrabold px-2.5 py-1 rounded text-white ${primaryBg}`}
                            >
                              수험번호: {item.examNumber}
                            </span>
                            <span className="text-xs font-bold text-stone-500">
                              접수일: {item.createdAt}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-extrabold px-2.5 py-1 rounded ${
                                item.paymentStatus === "입금완료"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              응시료: {item.paymentStatus}
                            </span>
                            <span
                              className={`text-xs font-extrabold px-2.5 py-1 rounded ${
                                item.passStatus === "합격"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : item.passStatus === "불합격"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-stone-200 text-stone-700"
                              }`}
                            >
                              결과: {item.passStatus}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                          <div>
                            <span className="text-stone-500">응시 종목 및 등급:</span>
                            <p className="font-extrabold text-stone-900 mt-0.5">
                              {item.qualificationName} ({item.grade}) [{item.examType}]
                            </p>
                          </div>
                          <div>
                            <span className="text-stone-500">성명 / 생년월일:</span>
                            <p className="font-bold text-stone-900 mt-0.5">
                              {item.applicantName} ({item.decryptedBirth})
                            </p>
                          </div>
                          <div>
                            <span className="text-stone-500">지정검정장 / 연락처:</span>
                            <p className="font-bold text-stone-900 mt-0.5">
                              {item.trainingCenter} ({item.decryptedPhone})
                            </p>
                          </div>
                        </div>

                        {/* 합격확인 탭일 때 점수 및 자격번호 상세 박스 추가 표시 */}
                        {activeMenu === "result" && (
                          <div className="p-4 rounded-xl bg-white border border-stone-200 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
                              <div>
                                <span className="text-stone-500">필기점수: </span>
                                <strong className="text-stone-900">
                                  {item.writtenScore !== null ? `${item.writtenScore}점` : "면제/해당없음"}
                                </strong>
                              </div>
                              <div>
                                <span className="text-stone-500">실기점수: </span>
                                <strong className="text-stone-900">
                                  {item.practicalScore !== null ? `${item.practicalScore}점` : "채점중"}
                                </strong>
                              </div>
                              <div>
                                <span className="text-stone-500">자격증 번호: </span>
                                <strong className={primaryText}>
                                  {item.certificateNo || "합격 발표 후 부여"}
                                </strong>
                              </div>
                            </div>

                            {item.passStatus === "합격" && (
                              <button
                                type="button"
                                onClick={() => handleMenuChange("cert-issue")}
                                className={`px-4 py-2 rounded-lg ${primaryBg} text-white text-xs font-extrabold cursor-pointer`}
                              >
                                자격증 발급 신청하기 →
                              </button>
                            )}
                          </div>
                        )}

                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>
                              {activeMenu === "verify" ? "수험표 인쇄" : "합격확인서 인쇄"}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              메뉴 5 ~ 14: 10대 자격·기관등록 및 교육·부가신청 통합 처리
          ================================================================= */}
          {currentServiceMeta && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-stone-200 pb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className={`text-xs font-extrabold ${primaryText}`}>
                    {currentServiceMeta.badge}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                    [{association}] {currentServiceMeta.titleKor}
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">{currentServiceMeta.desc}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <Lock className="w-3.5 h-3.5" /> 개인정보 AES-256 암호화 보호
                </span>
              </div>

              {submittedServiceReq && (
                <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      [{submittedServiceReq.serviceLabel}] 접수가 완료되었습니다! (접수번호:{" "}
                      {submittedServiceReq.requestCode})
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    신청항목: <strong>{submittedServiceReq.targetItem}</strong> | 신청자:{" "}
                    {submittedServiceReq.applicantName} ({submittedServiceReq.decryptedPhone})
                  </p>
                </div>
              )}

              <form onSubmit={handleServiceReqSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                      1. {currentServiceMeta.itemLabel} *
                    </label>
                    <select
                      value={reqTargetItem}
                      onChange={(e) => setReqTargetItem(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm bg-white font-semibold"
                    >
                      {(isWine
                        ? currentServiceMeta.kwacOptions
                        : currentServiceMeta.kcacOptions
                      ).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                      2. 신청자(또는 대표자) 성명 *
                    </label>
                    <input
                      type="text"
                      required
                      value={reqName}
                      onChange={(e) => setReqName(e.target.value)}
                      placeholder="예: 홍길동"
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                      3. 연락처 (AES-256 암호화 저장) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={reqPhone}
                      onChange={(e) => setReqPhone(e.target.value)}
                      placeholder="예: 010-1234-5678"
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                      4. 생년월일 또는 사업자등록번호 (암호화)
                    </label>
                    <input
                      type="text"
                      value={reqBirthOrBiz}
                      onChange={(e) => setReqBirthOrBiz(e.target.value)}
                      placeholder="예: 1995-05-15 또는 123-45-67890"
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                      5. 소속 아카데미 / 교육기관 / 학교명
                    </label>
                    <input
                      type="text"
                      value={reqOrgName}
                      onChange={(e) => setReqOrgName(e.target.value)}
                      placeholder="예: 수원 와인&커피 아카데미"
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                      6. 우편물(자격증·교재·증명서·현판) 수령 주소 (암호화 저장)
                    </label>
                    <input
                      type="text"
                      value={reqAddress}
                      onChange={(e) => setReqAddress(e.target.value)}
                      placeholder="예: 경기도 수원시 영통구 동탄원천로 881번길 35"
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-stone-700 mb-1.5">
                      7. 상세 기재사항
                    </label>
                    <textarea
                      rows={3}
                      value={reqMemo}
                      onChange={(e) => setReqMemo(e.target.value)}
                      placeholder={currentServiceMeta.memoPlaceholder}
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-xl ${primaryBg} text-white font-extrabold text-sm shadow-md hover:opacity-95 cursor-pointer`}
                >
                  [{association}] {currentServiceMeta.titleKor} 온라인 접수하기
                </button>
              </form>

              {/* 내 신청 내역 리스트 */}
              {myServiceReqs && myServiceReqs.length > 0 && (
                <div className="pt-4 border-t border-stone-200 space-y-2">
                  <h4 className="text-xs font-extrabold text-stone-700">
                    최근 신청 접수 내역 ({myServiceReqs.length}건)
                  </h4>
                  {myServiceReqs.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-extrabold text-stone-900">
                          [{r.serviceLabel}] {r.targetItem}
                        </span>
                        <span className="text-stone-500 ml-2">({r.requestCode})</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold">
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

