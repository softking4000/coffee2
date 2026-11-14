// ============================================================================
// 파일명: lib/menu-data.ts
// 역할: 한국와인아카데미협의회(KWAC) 및 한국커피아카데미협의회(KCAC) 공식 웹사이트의
//       전체 메뉴 구조, 기관 정보, 자격검정 기준, 초기 안내 데이터를 통합 관리합니다.
// ============================================================================

export interface SubMenuItem {
  title: string;       // 서브메뉴 이름 (예: "시험접수")
  href: string;        // 이동할 경로 URL
  category?: string;   // 메뉴 그룹 분류 (시험 / 등록 / 신청 등)
  description?: string;// 초보자 및 사용자를 위한 메뉴 한 줄 설명
}

export interface MainMenuItem {
  id: string;          // 대메뉴 고유 ID
  title: string;       // 대메뉴 표시 이름
  subtitle: string;    // 영문 또는 보조 설명
  badgeColor?: string; // 테마 강조 색상 구분 ('wine' | 'coffee' | 'default')
  href: string;        // 대메뉴 대표 이동 경로
  subMenus: SubMenuItem[];
}

// 1. 공식 기관 정보 (푸터, 고객센터, 입금계좌 안내에 공통 사용)
export const ORG_INFO = {
  kwacName: "한국와인아카데미협의회",
  kwacEng: "Korea Wine Academy Council (KWAC)",
  kcacName: "한국커피아카데미협의회",
  kcacEng: "Korea Coffee Academy Council (KCAC)",
  president: "김대철",
  phones: ["02-2088-0154", "02-2088-0155"],
  email: "kdc8080@kakao.com",
  addressMain: "경기도 수원시 영통구 동탄원천로 881번길 35 (매탄3동)",
  addressSub: "경기도 수원시 영통구 권선로 820번길 18 (매탄동, 수인분당선 매탄권선역 4번 출구)",
  operatingHours: "평일 09:30 ~ 18:00 (점심시간 12:00 ~ 13:00 / 주말 및 공휴일 휴무)",
  bankAccounts: [
    {
      org: "한국와인아카데미협의회 (KWAC)",
      bank: "신한은행",
      accountNumber: "100-028-455336",
      holder: "한국와인아카데미협의회",
      theme: "wine",
    },
    {
      org: "한국커피아카데미협의회 (KCAC)",
      bank: "신한은행",
      accountNumber: "100-028-455457",
      holder: "한국커피아카데미협의회",
      theme: "coffee",
    },
  ],
};

// 2. 원본 사이트(kwac-kcac.org)의 전체 네비게이션 메뉴 트리 완벽 반영
export const MAIN_MENUS: MainMenuItem[] = [
  {
    id: "about",
    title: "협의회 소개",
    subtitle: "ABOUT COUNCIL",
    badgeColor: "default",
    href: "/about?tab=intro",
    subMenus: [
      { title: "협의회 안내", href: "/about?tab=intro", description: "KWAC · KCAC 설립 목적 및 인사말" },
      { title: "로고 (CI/BI)", href: "/about?tab=logo", description: "협의회 공식 심볼 및 로고 가이드" },
      { title: "민간자격등록증", href: "/about?tab=registration", description: "정식 등록된 민간자격 인가 현황" },
      { title: "자격증 디자인", href: "/about?tab=certificate", description: "상장형 및 카드형 자격증 견본 안내" },
    ],
  },
  {
    id: "guide",
    title: "자격검정안내",
    subtitle: "EXAM GUIDE",
    badgeColor: "default",
    href: "/guide?tab=criteria",
    subMenus: [
      { title: "자격검정 기준", href: "/guide?tab=criteria", description: "와인·커피 종목별 필기/실기 합격 기준" },
      { title: "자격검정 응시료", href: "/guide?tab=fee", description: "등급별 필기·실기 검정료 및 발급비" },
      { title: "자격검정 절차", href: "/guide?tab=process", description: "원서접수부터 자격증 교부까지의 흐름" },
      { title: "강사 및 기관 등록 절차", href: "/guide?tab=instructor", description: "전문강사·심사위원·지정검정장 승인 절차" },
      { title: "검정자료 받기", href: "/guide?tab=downloads", description: "실기 규정집, 원서 양식 등 수험 자료실" },
    ],
  },
  {
    id: "kwac",
    title: "KWAC (와인)",
    subtitle: "한국와인아카데미협의회",
    badgeColor: "wine",
    href: "/kwac?menu=status",
    subMenus: [
      // [검정/시험 그룹]
      { title: "응시현황", href: "/kwac?menu=status", category: "검정시험", description: "진행 중인 와인 자격검정 일정 및 현황" },
      { title: "시험접수", href: "/kwac?menu=apply", category: "검정시험", description: "와인 소믈리에·디켄팅·강사 온라인 접수" },
      { title: "접수확인", href: "/kwac?menu=verify", category: "검정시험", description: "본인의 시험 접수 내역 및 수험표 확인" },
      { title: "합격확인", href: "/kwac?menu=result", category: "검정시험", description: "필기·실기 시험 점수 및 최종 합격 조회" },
      // [자격/등록 그룹]
      { title: "자격증신청", href: "/kwac?menu=cert-issue", category: "자격·기관등록", description: "합격자 자격증 신규 발급 및 재발급 신청" },
      { title: "와인강사등록", href: "/kwac?menu=instructor", category: "자격·기관등록", description: "KWAC 공인 와인강사 신규/갱신 등록" },
      { title: "심사위원등록", href: "/kwac?menu=judge", category: "자격·기관등록", description: "와인 실기시험 및 대회 심사위원 등록" },
      { title: "검정기관등록", href: "/kwac?menu=institution", category: "자격·기관등록", description: "공식 지정 교육기관 및 고사장 지정 신청" },
      // [교육/부가신청 그룹]
      { title: "와인교육등록", href: "/kwac?menu=education", category: "교육·부가신청", description: "아카데미 정규 및 특별 와인 교육 등록" },
      { title: "와인대회신청", href: "/kwac?menu=contest", category: "교육·부가신청", description: "코리아 와인 소믈리에 경연대회 참가 신청" },
      { title: "와인교재신청", href: "/kwac?menu=textbook", category: "교육·부가신청", description: "공식 와인 수험서 및 실기 표준 교재 구매" },
      { title: "와인증명서신청", href: "/kwac?menu=proof", category: "교육·부가신청", description: "경력·위촉·교육참석 증명서 온라인 발급" },
      { title: "와인연수신청", href: "/kwac?menu=training", category: "교육·부가신청", description: "국내외 와이너리 투어 및 직무 연수 신청" },
      { title: "문제은행신청", href: "/kwac?menu=question-bank", category: "교육·부가신청", description: "필기 기출 및 예상 문제은행 열람/신청" },
    ],
  },
  {
    id: "kcac",
    title: "KCAC (커피)",
    subtitle: "한국커피아카데미협의회",
    badgeColor: "coffee",
    href: "/kcac?menu=status",
    subMenus: [
      // [검정/시험 그룹]
      { title: "응시현황", href: "/kcac?menu=status", category: "검정시험", description: "진행 중인 커피 자격검정 일정 및 현황" },
      { title: "시험접수", href: "/kcac?menu=apply", category: "검정시험", description: "바리스타·핸드드립·로스팅·라떼아트 접수" },
      { title: "접수확인", href: "/kcac?menu=verify", category: "검정시험", description: "본인의 시험 접수 내역 및 수험표 확인" },
      { title: "합격확인", href: "/kcac?menu=result", category: "검정시험", description: "필기·실기 시험 점수 및 최종 합격 조회" },
      // [자격/등록 그룹]
      { title: "자격증신청", href: "/kcac?menu=cert-issue", category: "자격·기관등록", description: "합격자 자격증 신규 발급 및 재발급 신청" },
      { title: "커피강사등록", href: "/kcac?menu=instructor", category: "자격·기관등록", description: "KCAC 공인 커피강사 신규/갱신 등록" },
      { title: "심사위원등록", href: "/kcac?menu=judge", category: "자격·기관등록", description: "커피 실기시험 및 대회 심사위원 등록" },
      { title: "검정기관등록", href: "/kcac?menu=institution", category: "자격·기관등록", description: "공식 지정 교육기관 및 고사장 지정 신청" },
      // [교육/부가신청 그룹]
      { title: "커피교육등록", href: "/kcac?menu=education", category: "교육·부가신청", description: "아카데미 정규 및 스페셜티 커피 교육 등록" },
      { title: "커피대회신청", href: "/kcac?menu=contest", category: "교육·부가신청", description: "전국 바리스타·라떼아트 챔피언십 신청" },
      { title: "커피교재신청", href: "/kcac?menu=textbook", category: "교육·부가신청", description: "공식 바리스타 수험서 및 실기 교재 구매" },
      { title: "커피증명서신청", href: "/kcac?menu=proof", category: "교육·부가신청", description: "경력·위촉·교육참석 증명서 온라인 발급" },
      { title: "커피연수신청", href: "/kcac?menu=training", category: "교육·부가신청", description: "커피 산지 투어 및 심사위원 연수 신청" },
      { title: "문제은행신청", href: "/kcac?menu=question-bank", category: "교육·부가신청", description: "필기 기출 및 예상 문제은행 열람/신청" },
    ],
  },
  {
    id: "support",
    title: "고객센터",
    subtitle: "CUSTOMER CENTER",
    badgeColor: "default",
    href: "/support?tab=notice",
    subMenus: [
      { title: "공지사항", href: "/support?tab=notice", description: "협회 공식 소식 및 시험 일정 공고" },
      { title: "자주 묻는 질문 (FAQ)", href: "/support?tab=faq", description: "원서접수, 환불, 자격증 발급 관련 주요 답변" },
      { title: "자격증 재발급 신청", href: "/support?tab=reissue", description: "분실·훼손 자격증 빠른 재발급 안내" },
      { title: "증명서 발급 센터", href: "/support?tab=certificate-proof", description: "경력증명서, 위촉증명서, 참석증명서 발급" },
      { title: "오시는 길 및 계좌안내", href: "/support?tab=location", description: "수원 본부 약도(매탄권선역) 및 지정 계좌" },
    ],
  },
];

// 3. 자격검정 종목 상세 데이터 (원본 사이트의 실제 기준 100% 반영)
export interface QualificationSpec {
  id: string;
  association: "KWAC" | "KCAC";
  name: string;
  grade: string;
  writtenCriteria: string;
  practicalCriteria: string;
  writtenFee: string;
  practicalFee: string;
  certFee: string;
  summary: string;
}

export const QUALIFICATIONS: QualificationSpec[] = [
  // KWAC (와인 부문)
  {
    id: "wine-decanting",
    association: "KWAC",
    name: "와인 디켄팅 서비스",
    grade: "단일등급",
    writtenCriteria: "필기시험 없음 (면제)",
    practicalCriteria: "실기 60문항(항목) 중 48문항 이상 (100점 만점 중 80점 이상)",
    writtenFee: "-",
    practicalFee: "60,000원",
    certFee: "20,000원",
    summary: "와인 오픈, 브리딩, 캔들 디켄팅 및 서빙 매너의 전문 실무 능력을 평가합니다.",
  },
  {
    id: "wine-sommelier-2",
    association: "KWAC",
    name: "와인 소믈리에",
    grade: "2급",
    writtenCriteria: "필기 60문항 중 36문항 이상 (60점 이상)",
    practicalCriteria: "와인시음(블라인드 테이스팅) 500점 만점 중 300점 이상 (5품종 중 3품종 이상)",
    writtenFee: "40,000원",
    practicalFee: "70,000원",
    certFee: "20,000원",
    summary: "와인 기초 이론, 주요 산지 이해 및 대표 품종 블라인드 테이스팅 역량을 검정합니다.",
  },
  {
    id: "wine-sommelier-1",
    association: "KWAC",
    name: "와인 소믈리에",
    grade: "1급",
    writtenCriteria: "필기 60문항 중 42문항 이상 (70점 이상)",
    practicalCriteria: "와인시음 800점 중 560점(8품종 중 6품종) 이상 + 디켄팅서비스 100점 중 60점 이상",
    writtenFee: "50,000원",
    practicalFee: "100,000원",
    certFee: "20,000원",
    summary: "고급 소믈리에 이론, 정밀 블라인드 테이스팅(8품종) 및 업장 디켄팅 서비스를 종합 평가합니다.",
  },
  {
    id: "wine-instructor-2",
    association: "KWAC",
    name: "와인강사",
    grade: "2급",
    writtenCriteria: "필기 60문항 중 42문항 이상 (70점 이상)",
    practicalCriteria: "디켄팅서비스 100점 중 60점 이상 + 강의발표 100점 중 60점 이상",
    writtenFee: "50,000원",
    practicalFee: "100,000원",
    certFee: "30,000원",
    summary: "와인 아카데미 및 문화센터 등에서 와인 기초·중급 과정을 지도할 수 있는 강사 자격입니다.",
  },
  {
    id: "wine-instructor-1",
    association: "KWAC",
    name: "와인강사",
    grade: "1급",
    writtenCriteria: "필기 60문항 중 48문항 이상 (80점 이상)",
    practicalCriteria: "디켄팅서비스 100점 중 80점 이상 + 강의발표 100점 중 80점 이상",
    writtenFee: "60,000원",
    practicalFee: "120,000원",
    certFee: "30,000원",
    summary: "소믈리에 양성 과정 지도 및 심사위원 위촉 자격을 부여받는 최고 등급 와인 교육자 과정입니다.",
  },

  // KCAC (커피 부문)
  {
    id: "coffee-handdrip",
    association: "KCAC",
    name: "커피핸드드립",
    grade: "단일등급",
    writtenCriteria: "필기시험 없음 (면제)",
    practicalCriteria: "실기 100점 만점 중 80점 이상",
    writtenFee: "-",
    practicalFee: "50,000원",
    certFee: "20,000원",
    summary: "드리퍼별 추출 원리 이해와 수율 조절을 통한 균일한 핸드드립 브루잉 실력을 검정합니다.",
  },
  {
    id: "coffee-barista-2",
    association: "KCAC",
    name: "커피바리스타",
    grade: "2급",
    writtenCriteria: "필기시험 없음 (면제)",
    practicalCriteria: "실기 100점 만점 중 70점 이상 (에스프레소 2잔 + 카푸치노 2잔 시연)",
    writtenFee: "-",
    practicalFee: "60,000원",
    certFee: "20,000원",
    summary: "에스프레소 머신 및 그라인더 운용, 에스프레소 추출 및 벨벳 밀크 스티밍 실무를 평가합니다.",
  },
  {
    id: "coffee-barista-1",
    association: "KCAC",
    name: "커피바리스타",
    grade: "1급",
    writtenCriteria: "필기 60문항 중 48문항 이상 (80점 이상)",
    practicalCriteria: "실기 100점 만점 중 80점 이상 (분쇄도 세팅, 정밀 추출 및 베리에이션)",
    writtenFee: "40,000원",
    practicalFee: "80,000원",
    certFee: "20,000원",
    summary: "심화 커피학 이론과 그라인더 칼날 세팅, 향미 일관성 유지 등 수석 바리스타 역량을 검정합니다.",
  },
  {
    id: "coffee-latteart-2",
    association: "KCAC",
    name: "커피라떼아트",
    grade: "2급 / 1급",
    writtenCriteria: "필기시험 없음 (면제)",
    practicalCriteria: "2급: 실기 100점 중 70점 이상 / 1급: 실기 100점 중 80점 이상",
    writtenFee: "-",
    practicalFee: "60,000원 ~ 80,000원",
    certFee: "20,000원",
    summary: "하트, 튤립, 로제타 및 프리푸어 창작 패턴의 대칭성, 대비도, 밀크폼 완성도를 평가합니다.",
  },
  {
    id: "coffee-roasting-flavor",
    association: "KCAC",
    name: "커피로스팅 / 커피향미",
    grade: "전문과정",
    writtenCriteria: "필기 60문항 중 42문항 이상 (70점 이상)",
    practicalCriteria: "실기 100점 만점 중 70점 이상 (생두 결점두 선별·프로파일링 / 센서리 커핑)",
    writtenFee: "40,000원",
    practicalFee: "80,000원",
    certFee: "20,000원",
    summary: "생두의 물리·화학적 특성 이해, 배전도 제어(로스팅) 및 아로마·커핑 관능 평가(향미) 자격입니다.",
  },
  {
    id: "coffee-instructor",
    association: "KCAC",
    name: "커피강사",
    grade: "2급 / 1급",
    writtenCriteria: "2급: 60문항 중 42문항 이상 / 1급: 60문항 중 48문항 이상",
    practicalCriteria: "2급: 실기 100점 중 70점 이상 / 1급: 실기 100점 중 80점 이상",
    writtenFee: "50,000원 ~ 60,000원",
    practicalFee: "100,000원 ~ 120,000원",
    certFee: "30,000원",
    summary: "커피 교육기관 및 학교에서 바리스타 과정을 지도하고 실기 평가를 수행할 수 있는 강사 자격입니다.",
  },
];

// 4. 메인 페이지 및 응시현황 초기 표시용 시험 일정 샘플 데이터
export interface ExamScheduleItem {
  id: string;
  association: "KWAC" | "KCAC";
  round: string;
  title: string;
  examType: "필기" | "실기" | "필기+실기";
  applyStart: string;
  applyEnd: string;
  examDate: string;
  resultDate: string;
  location: string;
  status: "접수중" | "접수예정" | "접수마감";
  currentApplicants: number;
  maxCapacity: number;
}

export const SAMPLE_EXAM_SCHEDULES: ExamScheduleItem[] = [
  {
    id: "kwac-2026-11-01",
    association: "KWAC",
    round: "제2026-11회",
    title: "와인 소믈리에 2급 · 1급 정기 자격검정",
    examType: "필기+실기",
    applyStart: "2026-11-01",
    applyEnd: "2026-11-22",
    examDate: "2026-11-28",
    resultDate: "2026-12-04",
    location: "수원 본부 고사장 및 전국 지정검정장",
    status: "접수중",
    currentApplicants: 42,
    maxCapacity: 60,
  },
  {
    id: "kwac-2026-11-02",
    association: "KWAC",
    round: "제2026-12회",
    title: "와인 디켄팅 서비스 & 와인강사 2급 실기검정",
    examType: "실기",
    applyStart: "2026-11-05",
    applyEnd: "2026-11-25",
    examDate: "2026-12-05",
    resultDate: "2026-12-11",
    location: "수원 영통구 KWAC 전용 테이스팅 룸",
    status: "접수중",
    currentApplicants: 19,
    maxCapacity: 30,
  },
  {
    id: "kcac-2026-11-01",
    association: "KCAC",
    round: "제2026-24회",
    title: "커피바리스타 2급 · 1급 정기 실기/필기 검정",
    examType: "필기+실기",
    applyStart: "2026-11-01",
    applyEnd: "2026-11-24",
    examDate: "2026-11-29",
    resultDate: "2026-12-05",
    location: "전국 KCAC 공인 지정검정기관",
    status: "접수중",
    currentApplicants: 78,
    maxCapacity: 100,
  },
  {
    id: "kcac-2026-11-02",
    association: "KCAC",
    round: "제2026-25회",
    title: "커피핸드드립 · 커피라떼아트 · 커피로스팅 정기검정",
    examType: "실기",
    applyStart: "2026-11-10",
    applyEnd: "2026-11-30",
    examDate: "2026-12-06",
    resultDate: "2026-12-12",
    location: "수원 본부 실습장 및 지역 지정검정장",
    status: "접수중",
    currentApplicants: 34,
    maxCapacity: 50,
  },
  {
    id: "kcac-2026-12-01",
    association: "KCAC",
    round: "제2026-26회",
    title: "2026년 동계 커피강사(1·2급) 및 심사위원 자격검정",
    examType: "필기+실기",
    applyStart: "2026-11-20",
    applyEnd: "2026-12-10",
    examDate: "2026-12-19",
    resultDate: "2026-12-26",
    location: "수원 본부 대교육장 (매탄권선역 4번 출구)",
    status: "접수예정",
    currentApplicants: 12,
    maxCapacity: 40,
  },
];

// 5. 공지사항 초기 샘플 데이터
export interface NoticeItem {
  id: number;
  category: "공통" | "KWAC(와인)" | "KCAC(커피)" | "시험공고";
  title: string;
  date: string;
  views: number;
  isImportant: boolean;
  content: string;
}

export const SAMPLE_NOTICES: NoticeItem[] = [
  {
    id: 1,
    category: "시험공고",
    title: "[공고] 2026년도 하반기 KWAC(와인) · KCAC(커피) 정기 자격검정 시험 일정 안내",
    date: "2026-11-02",
    views: 1284,
    isImportant: true,
    content: "한국와인아카데미협의회(KWAC) 및 한국커피아카데미협의회(KCAC)의 2026년 하반기 정기 자격검정 일정을 안내드립니다. 응시자는 접수 기간 내 온라인 원서접수 및 응시료 입금을 완료해 주시기 바랍니다.",
  },
  {
    id: 2,
    category: "KWAC(와인)",
    title: "와인 소믈리에 1급·2급 실기 블라인드 테이스팅 시음 규정 및 디켄팅 채점 기준표",
    date: "2026-10-28",
    views: 842,
    isImportant: true,
    content: "와인 소믈리에 2급(5품종 중 3품종 이상) 및 1급(8품종 중 6품종 이상 + 디켄팅 서비스) 실기시험 채점 기준표가 자료실에 업데이트되었습니다.",
  },
  {
    id: 3,
    category: "KCAC(커피)",
    title: "커피바리스타 2급·1급 및 커피핸드드립 실기 규정집 최신 개정판 배포 안내",
    date: "2026-10-21",
    views: 965,
    isImportant: false,
    content: "KCAC 공인 검정기관 및 수험생을 위한 바리스타 실기 시연 규정집이 개정되었습니다. 자격검정안내 > 검정자료 받기 메뉴에서 내려받으실 수 있습니다.",
  },
  {
    id: 4,
    category: "공통",
    title: "자격증 신규 발급, 재발급 및 각종 증명서(경력·위촉·참석) 온라인 신청 안내",
    date: "2026-10-15",
    views: 630,
    isImportant: false,
    content: "합격 확인 후 상장형 및 카드형 자격증 신청이 가능하며, 강사 및 심사위원을 위한 경력증명서·위촉증명서·연수 참석증명서도 홈페이지에서 즉시 신청하실 수 있습니다.",
  },
  {
    id: 5,
    category: "공통",
    title: "공식 지정 검정기관(교육장) 신규 지정 승인 및 현판 교부 절차 안내",
    date: "2026-10-08",
    views: 519,
    isImportant: false,
    content: "전국 와인 및 커피 아카데미 운영 기관을 대상으로 공식 지정 검정장 신청을 상시 접수하고 있습니다. 시설 기준을 확인하신 후 검정기관등록 메뉴에서 신청해 주세요.",
  },
];

