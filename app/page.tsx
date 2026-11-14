"use client";

// ============================================================================
// 파일명: app/page.tsx
// 역할: https://www.kwac-kcac.org/user/index.php 에 대응하는 메인 홈페이지입니다.
//       1) KWAC(와인) & KCAC(커피) 메인 히어로 배너 슬라이더
//       2) 8대 핵심 서비스 원클릭 빠른 메뉴 바
//       3) 실시간 자격검정 응시현황/접수 보드 & 공지사항 프리뷰
//       4) 와인(KWAC) · 커피(KCAC) 14개 전체 업무 바로가기 허브
//       5) 자격검정 종목별 필기/실기 합격기준 요약 쇼케이스
// ============================================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Wine,
  Coffee,
  ClipboardCheck,
  SearchCheck,
  Award,
  FileBadge,
  BookOpen,
  Building2,
  GraduationCap,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Bell,
  PhoneCall,
  CreditCard,
  CheckCircle2,
  Users,
} from "lucide-react";
import {
  MAIN_MENUS,
  ORG_INFO,
  QUALIFICATIONS,
  SAMPLE_EXAM_SCHEDULES,
  SAMPLE_NOTICES,
} from "@/lib/menu-data";

export default function HomePage() {
  // 히어로 배너 슬라이드 번호 상태 (0, 1, 2)
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  // 실시간 응시현황 필터 탭 ('ALL' | 'KWAC' | 'KCAC')
  const [scheduleFilter, setScheduleFilter] = useState<"ALL" | "KWAC" | "KCAC">("ALL");
  // 자격검정 종목 쇼케이스 필터 탭 ('KWAC' | 'KCAC')
  const [qualTab, setQualTab] = useState<"KWAC" | "KCAC">("KWAC");

  // 히어로 배너 슬라이드 데이터 정의
  const heroSlides = [
    {
      id: "kwac-hero",
      badge: "KOREA WINE ACADEMY COUNCIL (KWAC)",
      title: "한국와인아카데미협의회",
      subtitle: "대한민국 와인 문화를 선도하는 정식 등록 민간자격 검정기관",
      desc: "와인 소믈리에(1·2급), 와인 디켄팅 서비스, 와인강사(1·2급) 자격검정부터 심사위원 위촉, 와인 경연대회 및 산지 연수까지 통합 지원합니다.",
      bgClass: "from-[#4a181e] via-[#722F37] to-[#2c1216]",
      primaryBtn: { label: "KWAC 와인 시험접수", href: "/kwac?menu=apply" },
      secondaryBtn: { label: "와인 합격확인 조회", href: "/kwac?menu=result" },
    },
    {
      id: "kcac-hero",
      badge: "KOREA COFFEE ACADEMY COUNCIL (KCAC)",
      title: "한국커피아카데미협의회",
      subtitle: "체계적인 실무 중심 스페셜티 커피 전문가 양성 및 자격검정",
      desc: "커피바리스타(1·2급), 커피핸드드립, 커피라떼아트(1·2급), 커피로스팅, 커피향미, 커피강사(1·2급) 온라인 원서접수 및 자격증 발급 플랫폼입니다.",
      bgClass: "from-[#2b1817] via-[#4A2C2A] to-[#1e1211]",
      primaryBtn: { label: "KCAC 커피 시험접수", href: "/kcac?menu=apply" },
      secondaryBtn: { label: "커피 합격확인 조회", href: "/kcac?menu=result" },
    },
    {
      id: "integrated-hero",
      badge: "OFFICIAL INTEGRATED SERVICE PORTAL",
      title: "자격증 · 증명서 · 지정검정기관 통합 센터",
      subtitle: "강사 및 심사위원 등록, 검정기관 지정, 각종 증명서 온라인 즉시 신청",
      desc: "자격증 신규/재발급 신청은 물론 경력증명서, 위촉증명서, 세미나 참석증명서 발급과 공식 수험 교재·문제은행 신청을 원스톱으로 제공합니다.",
      bgClass: "from-stone-900 via-stone-800 to-[#3a2422]",
      primaryBtn: { label: "자격검정 합격기준 보기", href: "/guide?tab=criteria" },
      secondaryBtn: { label: "증명서 및 재발급 신청", href: "/support?tab=certificate-proof" },
    },
  ];

  // 빠른 아이콘 메뉴 8종 정의
  const quickLinks = [
    {
      title: "시험 원서접수",
      sub: "와인·커피 온라인 접수",
      href: "/kwac?menu=apply",
      icon: ClipboardCheck,
      color: "bg-rose-50 text-[#722F37] border-rose-200",
    },
    {
      title: "접수내역 확인",
      sub: "수험번호·수험표 조회",
      href: "/kwac?menu=verify",
      icon: SearchCheck,
      color: "bg-amber-50 text-[#4A2C2A] border-amber-200",
    },
    {
      title: "합격자 발표조회",
      sub: "필기·실기 점수 확인",
      href: "/kwac?menu=result",
      icon: Award,
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      title: "자격증 발급신청",
      sub: "신규 및 재발급 신청",
      href: "/kwac?menu=cert-issue",
      icon: FileBadge,
      color: "bg-purple-50 text-purple-800 border-purple-200",
    },
    {
      title: "강사·심사위원 등록",
      sub: "전문강사 및 심사위원",
      href: "/kwac?menu=instructor",
      icon: GraduationCap,
      color: "bg-blue-50 text-blue-800 border-blue-200",
    },
    {
      title: "지정검정기관 등록",
      sub: "전국 고사장 승인 신청",
      href: "/kwac?menu=institution",
      icon: Building2,
      color: "bg-stone-100 text-stone-800 border-stone-300",
    },
    {
      title: "교재·문제은행 신청",
      sub: "공식 수험서 및 기출문제",
      href: "/kcac?menu=textbook",
      icon: BookOpen,
      color: "bg-orange-50 text-orange-800 border-orange-200",
    },
    {
      title: "오시는 길·계좌",
      sub: "매탄권선역 4번출구",
      href: "/support?tab=location",
      icon: MapPin,
      color: "bg-teal-50 text-teal-800 border-teal-200",
    },
  ];

  // 선택된 필터에 따른 시험 일정 목록 필터링
  const filteredSchedules = SAMPLE_EXAM_SCHEDULES.filter((item) =>
    scheduleFilter === "ALL" ? true : item.association === scheduleFilter
  );

  // KWAC 메뉴와 KCAC 메뉴 추출
  const kwacMenu = MAIN_MENUS.find((m) => m.id === "kwac");
  const kcacMenu = MAIN_MENUS.find((m) => m.id === "kcac");

  const activeSlide = heroSlides[currentSlide];

  return (
    <div className="space-y-14 pb-10">
      {/* =====================================================================
          섹션 1: 메인 히어로 배너 슬라이더
      ===================================================================== */}
      <section className={`relative bg-gradient-to-r ${activeSlide.bgClass} text-white overflow-hidden transition-colors duration-500`}>
        {/* 장식용 배경 패턴 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 좌측 슬라이드 텍스트 및 액션 버튼 */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-xs font-bold tracking-wider text-amber-200">
                <Award className="w-3.5 h-3.5" />
                <span>{activeSlide.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                {activeSlide.title}
              </h1>

              <p className="text-base sm:text-xl font-semibold text-amber-100">
                {activeSlide.subtitle}
              </p>

              <p className="text-sm sm:text-base text-stone-200 max-w-2xl leading-relaxed">
                {activeSlide.desc}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={activeSlide.primaryBtn.href}
                  className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-sm shadow-lg transition-all flex items-center gap-2"
                >
                  <span>{activeSlide.primaryBtn.label}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href={activeSlide.secondaryBtn.href}
                  className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-sm transition-all"
                >
                  {activeSlide.secondaryBtn.label}
                </Link>
              </div>

              {/* 슬라이드 인디케이터 컨트롤 */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))
                  }
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20"
                  aria-label="이전 배너"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  {heroSlides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        currentSlide === idx ? "w-8 bg-amber-400" : "w-2.5 bg-white/40"
                      }`}
                      aria-label={`배너 ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))
                  }
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20"
                  aria-label="다음 배너"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 우측: KWAC & KCAC 바로가기 듀얼 카드 */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* KWAC 와인 바로가기 카드 */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 hover:bg-white/15 transition-all">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-200">
                    <Wine className="w-4 h-4" /> KWAC 와인 자격검정
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/30 border border-rose-300/30 text-white font-semibold">
                    상시 운영
                  </span>
                </div>
                <h3 className="text-lg font-extrabold mt-1.5">한국와인아카데미협의회</h3>
                <p className="text-xs text-stone-200 mt-1">
                  소믈리에(1·2급) · 디켄팅서비스 · 와인강사(1·2급)
                </p>
                <div className="grid grid-cols-3 gap-1.5 mt-3.5 text-center text-xs font-bold">
                  <Link
                    href="/kwac?menu=apply"
                    className="py-2 rounded-lg bg-[#722F37] hover:bg-[#5c232a] text-white transition-colors"
                  >
                    시험접수
                  </Link>
                  <Link
                    href="/kwac?menu=verify"
                    className="py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                  >
                    접수확인
                  </Link>
                  <Link
                    href="/kwac?menu=result"
                    className="py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                  >
                    합격확인
                  </Link>
                </div>
              </div>

              {/* KCAC 커피 바로가기 카드 */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 hover:bg-white/15 transition-all">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-200">
                    <Coffee className="w-4 h-4" /> KCAC 커피 자격검정
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/30 border border-amber-300/30 text-white font-semibold">
                    상시 운영
                  </span>
                </div>
                <h3 className="text-lg font-extrabold mt-1.5">한국커피아카데미협의회</h3>
                <p className="text-xs text-stone-200 mt-1">
                  바리스타 · 핸드드립 · 라떼아트 · 로스팅 · 향미 · 강사
                </p>
                <div className="grid grid-cols-3 gap-1.5 mt-3.5 text-center text-xs font-bold">
                  <Link
                    href="/kcac?menu=apply"
                    className="py-2 rounded-lg bg-[#4A2C2A] hover:bg-[#38201f] text-amber-100 transition-colors"
                  >
                    시험접수
                  </Link>
                  <Link
                    href="/kcac?menu=verify"
                    className="py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                  >
                    접수확인
                  </Link>
                  <Link
                    href="/kcac?menu=result"
                    className="py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                  >
                    합격확인
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          섹션 2: 8대 핵심 서비스 원클릭 빠른 메뉴 바
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {quickLinks.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col items-center text-center p-3 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform ${item.color}`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-stone-900 group-hover:text-[#722F37]">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5">{item.sub}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          섹션 3: 실시간 시험 응시현황/일정 & 공지사항/계좌 대시보드
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 좌측(7칸): 실시간 자격검정 응시현황 및 원서접수 보드 */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#722F37]" />
                  <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
                    실시간 자격검정 응시현황 및 접수
                  </h2>
                </div>

                {/* 협회 필터 탭 버튼 */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setScheduleFilter("ALL")}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      scheduleFilter === "ALL"
                        ? "bg-stone-900 text-white"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    전체
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleFilter("KWAC")}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      scheduleFilter === "KWAC"
                        ? "bg-[#722F37] text-white"
                        : "text-stone-600 hover:text-[#722F37]"
                    }`}
                  >
                    KWAC (와인)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleFilter("KCAC")}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      scheduleFilter === "KCAC"
                        ? "bg-[#4A2C2A] text-white"
                        : "text-stone-600 hover:text-[#4A2C2A]"
                    }`}
                  >
                    KCAC (커피)
                  </button>
                </div>
              </div>

              {/* 시험 일정 리스트 */}
              <div className="divide-y divide-stone-100 mt-2">
                {filteredSchedules.map((exam) => {
                  const isWine = exam.association === "KWAC";
                  const percent = Math.round((exam.currentApplicants / exam.maxCapacity) * 100);

                  return (
                    <div
                      key={exam.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/80 px-2 rounded-lg transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[11px] font-extrabold px-2 py-0.5 rounded text-white ${
                              isWine ? "bg-[#722F37]" : "bg-[#4A2C2A]"
                            }`}
                          >
                            {exam.association}
                          </span>
                          <span className="text-xs font-bold text-stone-500">{exam.round}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold">
                            {exam.examType}
                          </span>
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                              exam.status === "접수중"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {exam.status}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-extrabold text-stone-900">
                          {exam.title}
                        </h3>
                        <p className="text-xs text-stone-500">
                          접수기간: {exam.applyStart} ~ {exam.applyEnd} |{" "}
                          <strong className="text-stone-700">시험일: {exam.examDate}</strong>
                        </p>
                      </div>

                      {/* 우측 응시인원 현황 및 바로 접수 버튼 */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-xs text-stone-500 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            응시현황:{" "}
                            <strong className="text-stone-900">
                              {exam.currentApplicants}/{exam.maxCapacity}명
                            </strong>{" "}
                            ({percent}%)
                          </span>
                          <div className="w-28 h-1.5 bg-stone-200 rounded-full overflow-hidden mt-1">
                            <div
                              className={`h-full rounded-full ${
                                isWine ? "bg-[#722F37]" : "bg-[#4A2C2A]"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>

                        <Link
                          href={
                            isWine
                              ? `/kwac?menu=apply&examId=${exam.id}`
                              : `/kcac?menu=apply&examId=${exam.id}`
                          }
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition-colors ${
                            isWine
                              ? "bg-[#722F37] hover:bg-[#59232a]"
                              : "bg-[#4A2C2A] hover:bg-[#361f1e]"
                          }`}
                        >
                          원서접수 신청
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>• 지정검정기관별 상시 검정 일정은 각 협회 응시현황에서 확인 가능합니다.</span>
              <Link
                href="/kwac?menu=status"
                className="font-bold text-[#722F37] hover:underline flex items-center gap-0.5"
              >
                전체 일정 보기 <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 우측(5칸): 최신 공지사항 & 고객센터/입금계좌 안내 */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* 공지사항 박스 */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
              <div className="flex items-center justify-between pb-3.5 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#4A2C2A]" />
                  <h2 className="text-lg font-extrabold text-stone-900">공지사항 및 시험공고</h2>
                </div>
                <Link
                  href="/support?tab=notice"
                  className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-0.5"
                >
                  더보기 <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <ul className="divide-y divide-stone-100 mt-2">
                {SAMPLE_NOTICES.map((notice) => (
                  <li key={notice.id} className="py-2.5">
                    <Link
                      href={`/support?tab=notice&id=${notice.id}`}
                      className="group flex items-start justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                            notice.isImportant
                              ? "bg-rose-100 text-[#722F37]"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {notice.category}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-stone-800 group-hover:text-[#722F37] group-hover:font-bold truncate">
                          {notice.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 shrink-0">{notice.date}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 고객센터 및 공식 입금계좌 카드 */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    CUSTOMER & BANK INFO
                  </span>
                  <h3 className="text-lg font-extrabold mt-0.5">
                    고객센터 및 공식 입금계좌 안내
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-lg sm:text-xl font-black text-amber-300">
                <span>{ORG_INFO.phones[0]}</span>
                <span className="text-stone-500">/</span>
                <span>{ORG_INFO.phones[1]}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {ORG_INFO.bankAccounts.map((acc) => (
                  <div
                    key={acc.accountNumber}
                    className="p-3 rounded-xl bg-white/10 border border-white/15"
                  >
                    <div className="flex items-center gap-1 text-[11px] text-amber-200 font-bold">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{acc.org}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-extrabold text-white mt-1">
                      {acc.bank} {acc.accountNumber}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          섹션 4: KWAC(와인 14개 메뉴) & KCAC(커피 14개 메뉴) 전체 업무 허브
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-extrabold tracking-widest uppercase text-[#722F37]">
            INTEGRATED SERVICE DIRECTORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            협회별 전체 서비스 한눈에 바로가기
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            기존 사이트(kwac-kcac.org)의 KWAC 14개 업무와 KCAC 14개 업무를 원하는 항목으로 즉시 이동하여 처리하실 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* KWAC (한국와인아카데미협의회) 14개 전체 메뉴 카드 */}
          <div className="bg-white rounded-2xl border-2 border-[#722F37]/20 shadow-xs overflow-hidden">
            <div className="bg-gradient-to-r from-[#722F37] to-[#521e24] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                  <Wine className="w-6 h-6 text-rose-200" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">KWAC 한국와인아카데미협의회</h3>
                  <p className="text-xs text-rose-100">
                    와인 자격검정 · 강사/심사위원 · 교육/대회/교재/증명서 (14개 메뉴)
                  </p>
                </div>
              </div>
              <Link
                href="/kwac?menu=status"
                className="px-3 py-1.5 rounded-lg bg-white text-[#722F37] text-xs font-extrabold hover:bg-rose-50"
              >
                바로가기
              </Link>
            </div>

            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {kwacMenu?.subMenus.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className="p-3 rounded-xl border border-stone-200 hover:border-[#722F37] hover:bg-rose-50/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#722F37]">
                      {sub.title}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#722F37]" />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">{sub.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* KCAC (한국커피아카데미협의회) 14개 전체 메뉴 카드 */}
          <div className="bg-white rounded-2xl border-2 border-[#4A2C2A]/20 shadow-xs overflow-hidden">
            <div className="bg-gradient-to-r from-[#4A2C2A] to-[#2e1a19] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-amber-200" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">KCAC 한국커피아카데미협의회</h3>
                  <p className="text-xs text-amber-100">
                    커피 자격검정 · 강사/심사위원 · 교육/대회/교재/증명서 (14개 메뉴)
                  </p>
                </div>
              </div>
              <Link
                href="/kcac?menu=status"
                className="px-3 py-1.5 rounded-lg bg-amber-100 text-[#4A2C2A] text-xs font-extrabold hover:bg-white"
              >
                바로가기
              </Link>
            </div>

            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {kcacMenu?.subMenus.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className="p-3 rounded-xl border border-stone-200 hover:border-[#4A2C2A] hover:bg-amber-50/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#4A2C2A]">
                      {sub.title}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#4A2C2A]" />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">{sub.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          섹션 5: 종목별 자격검정 합격기준 요약 쇼케이스
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="text-xs font-extrabold text-[#722F37] uppercase tracking-wider">
                OFFICIAL QUALIFICATION STANDARDS
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                주관 자격검정 종목 및 합격 기준 안내
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQualTab("KWAC")}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all ${
                  qualTab === "KWAC"
                    ? "bg-[#722F37] text-white shadow-sm"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <Wine className="w-4 h-4" /> KWAC 와인 자격종목 (5종)
              </button>
              <button
                type="button"
                onClick={() => setQualTab("KCAC")}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all ${
                  qualTab === "KCAC"
                    ? "bg-[#4A2C2A] text-amber-100 shadow-sm"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <Coffee className="w-4 h-4" /> KCAC 커피 자격종목 (6종)
              </button>
            </div>
          </div>

          {/* 자격 종목 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {QUALIFICATIONS.filter((q) => q.association === qualTab).map((item) => {
              const isWine = item.association === "KWAC";
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-stone-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow bg-[#faf8f5]/60"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-md text-white ${
                          isWine ? "bg-[#722F37]" : "bg-[#4A2C2A]"
                        }`}
                      >
                        {item.association} 공인자격
                      </span>
                      <span className="text-xs font-bold text-stone-600 bg-white px-2.5 py-1 rounded-md border border-stone-200">
                        등급: {item.grade}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-stone-900">
                      {item.name}{" "}
                      <span className="text-sm font-bold text-stone-500">({item.grade})</span>
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed">{item.summary}</p>

                    <div className="p-3 rounded-lg bg-white border border-stone-200 space-y-1.5 text-xs">
                      <p className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-stone-800">필기기준:</strong>{" "}
                          {item.writtenCriteria}
                        </span>
                      </p>
                      <p className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-stone-800">실기기준:</strong>{" "}
                          {item.practicalCriteria}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-between">
                    <Link
                      href="/guide?tab=criteria"
                      className="text-xs font-bold text-stone-600 hover:text-stone-900"
                    >
                      상세 검정기준표 →
                    </Link>
                    <Link
                      href={isWine ? "/kwac?menu=apply" : "/kcac?menu=apply"}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold text-white ${
                        isWine
                          ? "bg-[#722F37] hover:bg-[#59232a]"
                          : "bg-[#4A2C2A] hover:bg-[#361f1e]"
                      }`}
                    >
                      시험 접수하기
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

