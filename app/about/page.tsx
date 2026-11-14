"use client";

// ============================================================================
// 파일명: app/about/page.tsx
// 역할: '1. 협의회 소개' 대메뉴의 4개 하위 메뉴를 통합 제공하는 페이지입니다.
//       - tab=intro        : 협의회 안내 (인사말, KWAC·KCAC 설립목적 및 주요업무)
//       - tab=logo         : 로고 (CI/BI 심볼 의미 및 전용 색상 가이드)
//       - tab=registration : 민간자격등록증 (정식 등록 민간자격 현황 및 등록증)
//       - tab=certificate  : 자격증 디자인 (상장형 자격증 및 카드형 자격증 견본)
// ============================================================================

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wine,
  Coffee,
  Award,
  Palette,
  FileCheck2,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { ORG_INFO, QUALIFICATIONS } from "@/lib/menu-data";

function AboutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") || "intro";

  // 현재 선택된 탭 상태 관리 ('intro' | 'logo' | 'registration' | 'certificate')
  const [activeTab, setActiveTab] = useState<string>(tabParam);

  // URL의 ?tab= 파라미터가 바뀔 때마다 화면 탭도 즉시 동기화합니다.
  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  // 탭 버튼 클릭 시 URL 주소와 화면 상태를 동시에 변경하는 함수
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/about?tab=${tabId}`, { scroll: false });
  };

  // 협의회 소개 4대 탭 목록 정의
  const tabs = [
    { id: "intro", label: "협의회 안내", icon: Building2 },
    { id: "logo", label: "로고 (CI/BI)", icon: Palette },
    { id: "registration", label: "민간자격등록증", icon: FileCheck2 },
    { id: "certificate", label: "자격증 디자인", icon: BadgeCheck },
  ];

  return (
    <div className="pb-16">
      {/* 1. 상단 서브 비주얼 배너 */}
      <section className="bg-gradient-to-r from-stone-900 via-[#4A2C2A] to-[#722F37] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-amber-200 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline">
              HOME
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>협의회 소개</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-2">
            협의회 소개 (KWAC · KCAC)
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 mt-2 max-w-2xl">
            한국와인아카데미협의회(KWAC)와 한국커피아카데미협의회(KCAC)는 대한민국 식음료(F&B) 산업을 이끌어갈 와인 및 커피 전문 인재를 양성하고 공정한 자격검정을 주관합니다.
          </p>
        </div>
      </section>

      {/* 2. 상단 탭 네비게이션 바 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? "bg-[#722F37] text-white shadow-sm"
                    : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 탭별 본문 컨텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* =================================================================
            탭 1: 협의회 안내 (intro)
        ================================================================= */}
        {activeTab === "intro" && (
          <div className="space-y-10">
            {/* 회장 인사말 카드 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-xs">
              <div className="max-w-4xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#722F37] text-xs font-extrabold">
                  <Sparkles className="w-3.5 h-3.5" /> GREETINGS
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3 leading-snug">
                  “체계적인 교육과 공정한 자격검정을 통해 대한민국 와인·커피 문화의 표준을 만들어 갑니다.”
                </h2>
                <div className="mt-5 space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed">
                  <p>
                    안녕하십니까. <strong>{ORG_INFO.kwacName}(KWAC)</strong> 및{" "}
                    <strong>{ORG_INFO.kcacName}(KCAC)</strong> 홈페이지를 방문해 주신 여러분을 진심으로 환영합니다.
                  </p>
                  <p>
                    오늘날 와인과 커피는 단순한 기호식품을 넘어 현대인의 라이프스타일과 외식 문화의 핵심 예술로 자리매김하였습니다. 이에 발맞추어 우리 협의회는 전국 유수의 와인 및 커피 전문 교육기관들과 뜻을 모아 표준화된 교육 커리큘럼과 실무 중심의 자격검정 체계를 구축하였습니다.
                  </p>
                  <p>
                    본 협의회는 이론에 치우치지 않는 현장 실무형 검정(블라인드 테이스팅, 디켄팅 서비스, 에스프레소 추출, 핸드드립, 라떼아트, 로스팅 및 관능 평가)을 통해 실력 있는 소믈리에와 바리스타, 그리고 전문 강사 및 심사위원을 배출하는 데 최선을 다하겠습니다.
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-500">
                      {ORG_INFO.kwacName} · {ORG_INFO.kcacName}
                    </p>
                    <p className="text-lg font-extrabold text-stone-900 mt-0.5">
                      회장 <span className="text-[#722F37]">{ORG_INFO.president}</span> 배상
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-[#722F37] text-white flex items-center justify-center">
                      <Wine className="w-5 h-5" />
                    </span>
                    <span className="w-10 h-10 rounded-full bg-[#4A2C2A] text-amber-100 flex items-center justify-center">
                      <Coffee className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* KWAC & KCAC 양대 협의회 핵심 업무 비교 카드 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* KWAC 소개 */}
              <div className="bg-white rounded-2xl border-2 border-[#722F37]/20 p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#722F37] text-white flex items-center justify-center">
                    <Wine className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-[#722F37]">KWAC</span>
                    <h3 className="text-xl font-extrabold text-stone-900">
                      {ORG_INFO.kwacName}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  국내 와인 산업 발전과 전문 소믈리에 및 와인 교육자 양성을 목적으로 설립된 협의회로서, 표준화된 테이스팅 및 서비스 규정을 보급합니다.
                </p>

                <div className="space-y-2.5 pt-2">
                  <h4 className="text-sm font-extrabold text-stone-900">주요 주관 업무 및 활동</h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#722F37] shrink-0 mt-0.5" />
                      <span>
                        <strong>자격검정 주관:</strong> 와인 디켄팅 서비스, 와인 소믈리에(2급/1급), 와인강사(2급/1급)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#722F37] shrink-0 mt-0.5" />
                      <span>
                        <strong>학술 및 교재:</strong> 와인 표준 수험 교재 및 실기 블라인드 테이스팅 문제은행 개발
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#722F37] shrink-0 mt-0.5" />
                      <span>
                        <strong>경연대회 및 투어:</strong> 전국 와인 소믈리에 경연대회 주관 및 국내외 와인 산지 연수 운영
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* KCAC 소개 */}
              <div className="bg-white rounded-2xl border-2 border-[#4A2C2A]/20 p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#4A2C2A] text-amber-100 flex items-center justify-center">
                    <Coffee className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-[#4A2C2A]">KCAC</span>
                    <h3 className="text-xl font-extrabold text-stone-900">
                      {ORG_INFO.kcacName}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  스페셜티 커피 시장 확대에 발맞추어 추출, 브루잉, 라떼아트, 로스팅 및 센서리(향미) 분야의 전문 바리스타와 커피 교육자를 양성합니다.
                </p>

                <div className="space-y-2.5 pt-2">
                  <h4 className="text-sm font-extrabold text-stone-900">주요 주관 업무 및 활동</h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A2C2A] shrink-0 mt-0.5" />
                      <span>
                        <strong>자격검정 주관:</strong> 커피핸드드립, 커피바리스타(2급/1급), 커피라떼아트(2급/1급), 커피로스팅, 커피향미, 커피강사(2급/1급)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A2C2A] shrink-0 mt-0.5" />
                      <span>
                        <strong>교육 및 교재:</strong> 커피학 개론, 실기 시연 표준 규정집 및 필기 문제은행 보급
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#4A2C2A] shrink-0 mt-0.5" />
                      <span>
                        <strong>챔피언십 및 연수:</strong> 바리스타·라떼아트 대회 개최, 심사위원 연수 및 커피 산지 방문 투어
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            탭 2: 로고 CI/BI (logo)
        ================================================================= */}
        {activeTab === "logo" && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 space-y-8">
            <div>
              <span className="text-xs font-extrabold text-[#722F37] uppercase tracking-wider">
                CORPORATE IDENTITY
              </span>
              <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
                협의회 공식 로고 (CI / BI) 안내
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2">
                한국와인아카데미협의회(KWAC)와 한국커피아카데미협의회(KCAC)의 상징 심볼과 전용 색상 체계입니다. 지정검정기관 현판 및 공식 문서 제작 시 표준 규정을 준수해 주시기 바랍니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* KWAC 로고 박스 */}
              <div className="rounded-2xl border border-stone-200 p-8 flex flex-col items-center text-center bg-stone-50/60">
                <div className="w-24 h-24 rounded-full bg-[#722F37] text-white flex flex-col items-center justify-center shadow-lg border-4 border-amber-300/80">
                  <Wine className="w-10 h-10 text-amber-200" />
                  <span className="text-[11px] font-black tracking-widest mt-1">KWAC</span>
                </div>
                <h3 className="text-lg font-extrabold text-stone-900 mt-5">
                  한국와인아카데미협의회 심볼마크
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Korea Wine Academy Council Official Emblem
                </p>
                <p className="text-xs text-stone-600 mt-4 leading-relaxed">
                  잘 숙성된 빈티지 레드 와인을 상징하는 <strong>딥 버건디(#722F37)</strong>와 최고의 권위를 상징하는 <strong>골드(#FBBF24)</strong>를 조화시켜 소믈리에의 전문성과 품격을 표현합니다.
                </p>
                <div className="mt-5 w-full p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700">전용 컬러 (Wine Burgundy)</span>
                  <span className="px-2.5 py-1 rounded bg-[#722F37] text-white font-mono font-bold">
                    #722F37 / RGB(114, 47, 55)
                  </span>
                </div>
              </div>

              {/* KCAC 로고 박스 */}
              <div className="rounded-2xl border border-stone-200 p-8 flex flex-col items-center text-center bg-stone-50/60">
                <div className="w-24 h-24 rounded-full bg-[#4A2C2A] text-amber-100 flex flex-col items-center justify-center shadow-lg border-4 border-amber-400/80">
                  <Coffee className="w-10 h-10 text-amber-300" />
                  <span className="text-[11px] font-black tracking-widest mt-1">KCAC</span>
                </div>
                <h3 className="text-lg font-extrabold text-stone-900 mt-5">
                  한국커피아카데미협의회 심볼마크
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Korea Coffee Academy Council Official Emblem
                </p>
                <p className="text-xs text-stone-600 mt-4 leading-relaxed">
                  깊고 진한 에스프레소 크레마와 로스팅 원두를 상징하는 <strong>에스프레소 브라운(#4A2C2A)</strong>을 사용하여 커피 전문가의 열정과 정교한 추출 기술을 형상화하였습니다.
                </p>
                <div className="mt-5 w-full p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700">전용 컬러 (Espresso Brown)</span>
                  <span className="px-2.5 py-1 rounded bg-[#4A2C2A] text-amber-100 font-mono font-bold">
                    #4A2C2A / RGB(74, 44, 42)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            탭 3: 민간자격등록증 (registration)
        ================================================================= */}
        {activeTab === "registration" && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
              <div>
                <span className="text-xs font-extrabold text-[#722F37] uppercase tracking-wider">
                  OFFICIAL REGISTERED QUALIFICATIONS
                </span>
                <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
                  민간자격등록증 현황 안내
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  KWAC 및 KCAC에서 시행하는 모든 자격 종목은 자격기본법 제17조에 의거하여 주무부처 및 한국직업능력연구원에 정식 등록된 민간자격입니다.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold shrink-0">
                <ShieldCheck className="w-4 h-4" />
                <span>자격기본법 정식 등록 완료</span>
              </div>
            </div>

            {/* 등록증 시각적 증명 카드 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {QUALIFICATIONS.map((qual, idx) => {
                const isWine = qual.association === "KWAC";
                return (
                  <div
                    key={qual.id}
                    className="rounded-xl border-2 border-stone-200 p-5 bg-[#faf8f5] relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                        <span className="text-[11px] font-bold text-stone-500">
                          민간자격등록증 (제2026-{100 + idx}호)
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white ${
                            isWine ? "bg-[#722F37]" : "bg-[#4A2C2A]"
                          }`}
                        >
                          {qual.association}
                        </span>
                      </div>

                      <div className="text-center py-3">
                        <Award
                          className={`w-9 h-9 mx-auto mb-2 ${
                            isWine ? "text-[#722F37]" : "text-[#4A2C2A]"
                          }`}
                        />
                        <h3 className="text-base font-extrabold text-stone-900">{qual.name}</h3>
                        <p className="text-xs text-stone-500 mt-0.5">등급구분: {qual.grade}</p>
                      </div>

                      <div className="text-xs bg-white p-3 rounded-lg border border-stone-200 space-y-1 text-stone-600">
                        <p>
                          <strong className="text-stone-800">자격관리기관:</strong>{" "}
                          {isWine ? ORG_INFO.kwacName : ORG_INFO.kcacName}
                        </p>
                        <p>
                          <strong className="text-stone-800">대표자:</strong> {ORG_INFO.president}
                        </p>
                        <p>
                          <strong className="text-stone-800">소재지:</strong> 경기도 수원시 영통구
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-stone-200 text-center text-[11px] font-bold text-emerald-700">
                      ✓ 정식 등록 민간자격 확인필
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================
            탭 4: 자격증 디자인 견본 (certificate)
        ================================================================= */}
        {activeTab === "certificate" && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 space-y-8">
            <div>
              <span className="text-xs font-extrabold text-[#722F37] uppercase tracking-wider">
                CERTIFICATE DESIGN PREVIEW
              </span>
              <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
                공식 자격증 디자인 안내 (상장형 & 카드형)
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                자격검정 최종 합격자에게 교부되는 공식 상장형 자격증과 휴대용 플라스틱(PVC) 자격증 카드 견본입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 1. 상장형 자격증 견본 */}
              <div className="rounded-2xl border-4 border-double border-amber-500/60 bg-[#fdfbf7] p-6 sm:p-8 shadow-md space-y-5">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <span className="text-xs font-bold text-stone-500">
                    제 KWAC-2026-0001 호
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-extrabold">
                    상장형 자격증 (A4 케이스형)
                  </span>
                </div>

                <div className="text-center space-y-3 py-4">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-widest text-stone-900">
                    자 격 증
                  </h3>
                  <p className="text-xs text-stone-500 uppercase tracking-widest">
                    CERTIFICATE OF QUALIFICATION
                  </p>

                  <div className="max-w-xs mx-auto text-left text-xs sm:text-sm space-y-1.5 py-4 border-y border-stone-200">
                    <p>
                      <strong className="inline-block w-20 text-stone-500">성 명:</strong> 홍 길 동
                    </p>
                    <p>
                      <strong className="inline-block w-20 text-stone-500">생년월일:</strong> 1995년 05월 15일
                    </p>
                    <p>
                      <strong className="inline-block w-20 text-stone-500">자격종목:</strong> 와인 소믈리에 / 커피바리스타
                    </p>
                    <p>
                      <strong className="inline-block w-20 text-stone-500">등 급:</strong> 1급 (Level 1)
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed px-4 pt-2">
                    위 사람은 본 협의회가 시행한 자격검정 시험에 소정의 기준을 통과하여 자격을 취득하였기에 이 증서를 수여합니다.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-stone-200">
                  <div className="text-xs text-stone-600">
                    <p className="font-bold text-stone-900">
                      {ORG_INFO.kwacName} · {ORG_INFO.kcacName}
                    </p>
                    <p className="mt-0.5">회장 {ORG_INFO.president}</p>
                  </div>
                  <div className="w-14 h-14 rounded-full border-2 border-red-700 text-red-700 flex items-center justify-center text-[11px] font-black leading-tight text-center">
                    협회장
                    <br />
                    직인날인
                  </div>
                </div>
              </div>

              {/* 2. 카드형 자격증 견본 */}
              <div className="flex flex-col justify-between space-y-6">
                <div className="rounded-2xl bg-gradient-to-br from-[#722F37] via-[#4A2C2A] to-stone-900 text-white p-6 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-300" />
                      <span className="text-sm font-extrabold tracking-wide">
                        KWAC · KCAC QUALIFICATION CARD
                      </span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-white/20 font-bold">
                      카드형 (PVC)
                    </span>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <div className="w-20 h-24 rounded-lg bg-white/15 border border-white/30 flex items-center justify-center text-xs text-amber-200 font-bold text-center">
                      증명사진
                      <br />
                      (3x4cm)
                    </div>
                    <div className="text-xs space-y-1.5">
                      <p className="text-base font-extrabold text-amber-300">
                        와인 소믈리에 1급 / 바리스타 1급
                      </p>
                      <p>성명: 홍길동 (Hong Gil Dong)</p>
                      <p>자격번호: KCAC-2026-10492</p>
                      <p>발급일자: 2026. 11. 13</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-stone-300">
                    <span>{ORG_INFO.kwacName} · {ORG_INFO.kcacName}</span>
                    <span>대표전화: {ORG_INFO.phones[0]}</span>
                  </div>
                </div>

                {/* 자격증 발급 및 재발급 안내 박스 */}
                <div className="rounded-2xl bg-stone-50 border border-stone-200 p-6 space-y-3">
                  <h4 className="text-base font-extrabold text-stone-900">
                    자격증 발급 및 재발급 신청 안내
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    • 합격자 발표 후 <strong>[KWAC 또는 KCAC &gt; 자격증신청]</strong> 메뉴에서 온라인으로 발급 신청이 가능합니다.
                    <br />• 분실 또는 훼손 시 고객센터의 <strong>[자격증 재발급 신청]</strong>을 통해 상장형/카드형 선택 신청이 가능합니다.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <Link
                      href="/kwac?menu=cert-issue"
                      className="px-4 py-2 rounded-lg bg-[#722F37] text-white text-xs font-bold hover:bg-[#59232a]"
                    >
                      KWAC 와인 자격증 신청
                    </Link>
                    <Link
                      href="/kcac?menu=cert-issue"
                      className="px-4 py-2 rounded-lg bg-[#4A2C2A] text-amber-100 text-xs font-bold hover:bg-[#361f1e]"
                    >
                      KCAC 커피 자격증 신청
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Next.js App Router에서 useSearchParams를 안전하게 사용하기 위해 Suspense로 감싸서 내보냅니다.
export default function AboutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-stone-500">
          협의회 소개 페이지를 불러오는 중입니다...
        </div>
      }
    >
      <AboutContent />
    </Suspense>
  );
}

