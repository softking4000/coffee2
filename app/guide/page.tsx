"use client";

// ============================================================================
// 파일명: app/guide/page.tsx
// 역할: '2. 자격검정안내' 대메뉴의 5개 하위 메뉴를 통합 제공하는 페이지입니다.
//       - tab=criteria   : 자격검정 기준 (와인/커피 전 종목 필기·실기 합격기준표)
//       - tab=fee        : 자격검정 응시료 (등급별 검정료, 발급비, 입금계좌, 환불규정)
//       - tab=process    : 자격검정 절차 (원서접수 ~ 자격증 교부 6단계 흐름)
//       - tab=instructor : 강사 및 기관 등록 절차 (강사·심사위원·지정검정장 승인 요건)
//       - tab=downloads  : 검정자료 받기 (실기 규정집, 채점표, 신청서 즉시 다운로드)
// ============================================================================

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wine,
  Coffee,
  ClipboardList,
  CreditCard,
  GitBranch,
  Building2,
  Download,
  ChevronRight,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";
import { ORG_INFO, QUALIFICATIONS } from "@/lib/menu-data";

function GuideContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") || "criteria";

  // 현재 활성화된 탭 상태 ('criteria' | 'fee' | 'process' | 'instructor' | 'downloads')
  const [activeTab, setActiveTab] = useState<string>(tabParam);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/guide?tab=${tabId}`, { scroll: false });
  };

  // 검정자료실 파일 다운로드 실행 함수 (브라우저에서 즉시 안내 문서 파일 다운로드)
  const handleDownloadFile = (fileName: string, docTitle: string, desc: string) => {
    const content = [
      "================================================================",
      `  ${ORG_INFO.kwacName} (KWAC) · ${ORG_INFO.kcacName} (KCAC)`,
      `  공식 수험 및 검정 자료: ${docTitle}`,
      "================================================================",
      "",
      `■ 문서 개요: ${desc}`,
      `■ 주관 기관: ${ORG_INFO.kwacName} / ${ORG_INFO.kcacName} (회장: ${ORG_INFO.president})`,
      `■ 대표 전화: ${ORG_INFO.phones.join(" / ")}`,
      `■ 본부 주소: ${ORG_INFO.addressMain}`,
      "",
      "[주요 안내 사항]",
      "1. 모든 실기 검정 응시자는 시험 시작 30분 전까지 지정 고사장에 입실하여 수험번호를 확인해야 합니다.",
      "2. 와인 소믈리에 및 디켄팅 실기 응시자는 흰색 셔츠, 정장 바지(또는 스커트), 앞치마 및 소믈리에 나이프를 지참합니다.",
      "3. 커피바리스타 및 핸드드립, 라떼아트 응시자는 위생 복장 및 개인 린넨(행주) 세트를 규정에 맞게 준비합니다.",
      "4. 세부 배점표 및 감점 기준은 본 협의회 자격검정 기준표를 따릅니다.",
      "================================================================",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: "criteria", label: "자격검정 기준", icon: ClipboardList },
    { id: "fee", label: "자격검정 응시료", icon: CreditCard },
    { id: "process", label: "자격검정 절차", icon: GitBranch },
    { id: "instructor", label: "강사·기관 등록절차", icon: Building2 },
    { id: "downloads", label: "검정자료 받기", icon: Download },
  ];

  // 검정자료실 다운로드 목록 데이터
  const downloadFiles = [
    {
      id: 1,
      category: "KWAC(와인)",
      title: "와인 소믈리에 1급·2급 및 와인 디켄팅 서비스 실기 시험 규정집",
      fileName: "KWAC_와인소믈리에_디켄팅_실기규정집.txt",
      size: "1.4 MB",
      date: "2026-10-28",
      desc: "블라인드 테이스팅(5품종/8품종) 시음표 작성 요령 및 캔들 디켄팅 서비스 채점 기준 안내",
    },
    {
      id: 2,
      category: "KCAC(커피)",
      title: "커피바리스타 1급·2급 실기 시연 규정집 및 채점 기준표",
      fileName: "KCAC_커피바리스타_실기채점기준표.txt",
      size: "2.1 MB",
      date: "2026-10-21",
      desc: "준비과정(5분), 시연과정(10분: 에스프레소 4잔·카푸치노 4잔), 정리과정(3분) 세부 채점표",
    },
    {
      id: 3,
      category: "KCAC(커피)",
      title: "커피핸드드립 · 커피라떼아트 · 커피로스팅 · 커피향미 검정 요강",
      fileName: "KCAC_핸드드립_라떼아트_로스팅_검정요강.txt",
      size: "1.8 MB",
      date: "2026-10-15",
      desc: "전공 심화 과정별 추출 레시피 제출 양식, 로스팅 프로파일 기록지 및 커핑 폼 양식",
    },
    {
      id: 4,
      category: "공통서식",
      title: "공식 지정검정기관(교육장·고사장) 신규 지정 승인 신청서 양식",
      fileName: "KWAC_KCAC_지정검정기관_승인신청서.txt",
      size: "680 KB",
      date: "2026-10-08",
      desc: "아카데미 시설 현황표, 머신/장비 보유 내역서 및 전임강사 등록 서식 포함",
    },
    {
      id: 5,
      category: "공통서식",
      title: "공인 강사(와인·커피) 및 실기 심사위원 위촉 등록 신청서",
      fileName: "KWAC_KCAC_강사_심사위원_등록신청서.txt",
      size: "540 KB",
      date: "2026-10-02",
      desc: "강의 경력 증명 및 심사위원 연수 수료자 등록용 공식 서식",
    },
  ];

  return (
    <div className="pb-16">
      {/* 1. 상단 서브 비주얼 배너 */}
      <section className="bg-gradient-to-r from-[#4A2C2A] via-stone-900 to-[#722F37] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-amber-200 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline">
              HOME
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>자격검정안내</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-2">
            자격검정 안내 및 수험 가이드
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 mt-2 max-w-2xl">
            한국와인아카데미협의회(KWAC) 및 한국커피아카데미협의회(KCAC)의 종목별 합격 기준, 응시료, 검정 절차 및 수험 자료를 확인하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* 2. 상단 5개 탭 네비게이션 바 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-2 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`py-3.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-[#4A2C2A] text-amber-100 shadow-sm"
                    : "bg-stone-50 text-stone-700 hover:bg-stone-100"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 탭별 본문 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* =================================================================
            탭 1: 자격검정 기준 (criteria)
        ================================================================= */}
        {activeTab === "criteria" && (
          <div className="space-y-10">
            {/* KWAC 와인 자격검정 기준표 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#722F37] text-white flex items-center justify-center">
                    <Wine className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
                      [KWAC] 한국와인아카데미협의회 자격검정 합격 기준표
                    </h2>
                    <p className="text-xs text-stone-500">
                      와인 디켄팅 서비스 · 와인 소믈리에(1·2급) · 와인강사(1·2급)
                    </p>
                  </div>
                </div>
                <Link
                  href="/kwac?menu=apply"
                  className="px-4 py-2 rounded-lg bg-[#722F37] text-white text-xs font-bold hover:bg-[#59232a]"
                >
                  와인 시험 원서접수 →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-rose-50/80 text-[#722F37] border-y border-rose-200">
                      <th className="py-3.5 px-4 font-extrabold">자격 종목명</th>
                      <th className="py-3.5 px-4 font-extrabold">등급</th>
                      <th className="py-3.5 px-4 font-extrabold">필기시험 합격 기준</th>
                      <th className="py-3.5 px-4 font-extrabold">실기시험 합격 기준</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {QUALIFICATIONS.filter((q) => q.association === "KWAC").map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50">
                        <td className="py-4 px-4 font-extrabold text-stone-900">{item.name}</td>
                        <td className="py-4 px-4 font-bold text-[#722F37]">{item.grade}</td>
                        <td className="py-4 px-4 text-stone-700">{item.writtenCriteria}</td>
                        <td className="py-4 px-4 text-stone-700 font-medium">
                          {item.practicalCriteria}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* KCAC 커피 자격검정 기준표 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#4A2C2A] text-amber-100 flex items-center justify-center">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-stone-900">
                      [KCAC] 한국커피아카데미협의회 자격검정 합격 기준표
                    </h2>
                    <p className="text-xs text-stone-500">
                      커피핸드드립 · 바리스타(1·2급) · 라떼아트(1·2급) · 로스팅 · 커피향미 · 커피강사(1·2급)
                    </p>
                  </div>
                </div>
                <Link
                  href="/kcac?menu=apply"
                  className="px-4 py-2 rounded-lg bg-[#4A2C2A] text-amber-100 text-xs font-bold hover:bg-[#361f1e]"
                >
                  커피 시험 원서접수 →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-amber-50/80 text-[#4A2C2A] border-y border-amber-200">
                      <th className="py-3.5 px-4 font-extrabold">자격 종목명</th>
                      <th className="py-3.5 px-4 font-extrabold">등급</th>
                      <th className="py-3.5 px-4 font-extrabold">필기시험 합격 기준</th>
                      <th className="py-3.5 px-4 font-extrabold">실기시험 합격 기준</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {QUALIFICATIONS.filter((q) => q.association === "KCAC").map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50">
                        <td className="py-4 px-4 font-extrabold text-stone-900">{item.name}</td>
                        <td className="py-4 px-4 font-bold text-[#4A2C2A]">{item.grade}</td>
                        <td className="py-4 px-4 text-stone-700">{item.writtenCriteria}</td>
                        <td className="py-4 px-4 text-stone-700 font-medium">
                          {item.practicalCriteria}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            탭 2: 자격검정 응시료 (fee)
        ================================================================= */}
        {activeTab === "fee" && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-8">
            <div>
              <span className="text-xs font-extrabold text-[#722F37] uppercase tracking-wider">
                EXAMINATION FEES & BANK ACCOUNT
              </span>
              <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
                종목별 자격검정 응시료 및 납부 계좌 안내
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                응시하는 협회(KWAC 와인 / KCAC 커피)에 맞춰 지정된 신한은행 계좌로 응시자 본인 성명으로 입금해 주시기 바랍니다.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-100 text-stone-800 border-y border-stone-300">
                    <th className="py-3.5 px-4 font-extrabold">주관협회</th>
                    <th className="py-3.5 px-4 font-extrabold">자격 종목</th>
                    <th className="py-3.5 px-4 font-extrabold">등급</th>
                    <th className="py-3.5 px-4 font-extrabold">필기 응시료</th>
                    <th className="py-3.5 px-4 font-extrabold">실기 응시료</th>
                    <th className="py-3.5 px-4 font-extrabold">자격증 발급비</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {QUALIFICATIONS.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50">
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-extrabold px-2 py-0.5 rounded text-white ${
                            item.association === "KWAC" ? "bg-[#722F37]" : "bg-[#4A2C2A]"
                          }`}
                        >
                          {item.association}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-stone-900">{item.name}</td>
                      <td className="py-3.5 px-4 font-semibold text-stone-700">{item.grade}</td>
                      <td className="py-3.5 px-4 text-stone-700">{item.writtenFee}</td>
                      <td className="py-3.5 px-4 font-bold text-stone-900">{item.practicalFee}</td>
                      <td className="py-3.5 px-4 text-stone-700">{item.certFee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 공식 입금계좌 안내 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ORG_INFO.bankAccounts.map((acc) => (
                <div
                  key={acc.accountNumber}
                  className={`p-5 rounded-xl border-2 ${
                    acc.theme === "wine"
                      ? "border-[#722F37]/30 bg-rose-50/40"
                      : "border-[#4A2C2A]/30 bg-amber-50/40"
                  }`}
                >
                  <span className="text-xs font-extrabold text-stone-600">{acc.org} 공식 계좌</span>
                  <p className="text-xl font-black text-stone-900 mt-1">
                    {acc.bank} {acc.accountNumber}
                  </p>
                  <p className="text-xs text-stone-600 mt-1">예금주: {acc.holder}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3 text-xs text-stone-600">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-stone-900">응시료 환불 규정 안내</p>
                <p>• 원서접수 마감일 전까지 취소 신청 시: 납부 응시료 100% 전액 환불</p>
                <p>• 원서접수 마감 이후 ~ 시험일 5일 전까지: 50% 환불 (이후 환불 불가)</p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            탭 3: 자격검정 절차 (process)
        ================================================================= */}
        {activeTab === "process" && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 space-y-8">
            <div>
              <span className="text-xs font-extrabold text-[#722F37] uppercase tracking-wider">
                STEP-BY-STEP PROCESS
              </span>
              <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
                자격검정 원서접수 및 자격증 취득 절차
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                온라인 원서접수부터 필기·실기 검정, 합격 확인 및 최종 자격증 교부까지 6단계로 진행됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  step: "STEP 01",
                  title: "온라인 원서접수",
                  desc: "KWAC(와인) 또는 KCAC(커피) 메뉴의 [시험접수]에서 응시 종목, 등급, 지정검정장을 선택하여 접수합니다.",
                },
                {
                  step: "STEP 02",
                  title: "응시료 납부 및 접수확인",
                  desc: "협회별 지정 신한은행 계좌로 응시료를 입금한 후 [접수확인] 메뉴에서 승인 상태 및 수험번호를 확인합니다.",
                },
                {
                  step: "STEP 03",
                  title: "필기시험 응시 (해당 종목)",
                  desc: "소믈리에 1·2급, 바리스타 1급, 로스팅, 향미, 강사 종목은 60문항 객관식 필기시험을 응시합니다. (일부 실기 단일종목 면제)",
                },
                {
                  step: "STEP 04",
                  title: "실기시험 응시 (시음·시연)",
                  desc: "지정 고사장에서 블라인드 테이스팅/디켄팅(와인) 또는 에스프레소 추출/핸드드립/라떼아트(커피) 실기를 평가받습니다.",
                },
                {
                  step: "STEP 05",
                  title: "합격자 발표 조회",
                  desc: "시험 종료 후 공지된 발표일에 [합격확인] 메뉴에서 성명과 연락처(또는 수험번호)로 합격 여부를 조회합니다.",
                },
                {
                  step: "STEP 06",
                  title: "자격증 발급 신청 및 교부",
                  desc: "[자격증신청] 메뉴에서 상장형 및 카드형 자격증을 신청하면 협회 심사 후 본부 또는 지정 교육기관으로 발송됩니다.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-6 rounded-2xl border border-stone-200 bg-[#faf8f5] space-y-2.5"
                >
                  <span className="inline-block text-xs font-black px-2.5 py-1 rounded bg-[#722F37] text-white">
                    {item.step}
                  </span>
                  <h3 className="text-base font-extrabold text-stone-900">{item.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================
            탭 4: 강사 및 기관 등록 절차 (instructor)
        ================================================================= */}
        {activeTab === "instructor" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 강사 및 심사위원 등록 절차 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-5">
              <span className="text-xs font-extrabold text-[#722F37]">
                INSTRUCTOR & JUDGE REGISTRATION
              </span>
              <h2 className="text-xl font-extrabold text-stone-900">
                공인 강사 및 실기 심사위원 등록 절차
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                본 협의회의 와인강사·커피강사 자격을 취득하거나 소정의 심사위원 직무 연수를 수료한 전문가는 공인 강사 및 실기 심사위원으로 등록할 수 있습니다.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#722F37] shrink-0 mt-0.5" />
                  <span>
                    <strong>1단계 (자격 요건 충족):</strong> 해당 분야 1급 자격 또는 강사(1·2급) 자격 취득 후 협회 주관 세미나·연수 이수
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#722F37] shrink-0 mt-0.5" />
                  <span>
                    <strong>2단계 (온라인 등록 신청):</strong> KWAC/KCAC 메뉴 내 [강사등록] 또는 [심사위원등록]에서 이력 및 자격번호 입력
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#722F37] shrink-0 mt-0.5" />
                  <span>
                    <strong>3단계 (심사 및 위촉장 교부):</strong> 협의회 심의위원회 승인 후 공식 위촉증명서 발급 및 실기 고사장 심사위원 배정
                  </span>
                </li>
              </ul>

              <div className="pt-3 flex flex-wrap gap-2">
                <Link
                  href="/kwac?menu=instructor"
                  className="px-4 py-2 rounded-lg bg-[#722F37] text-white text-xs font-bold"
                >
                  와인강사·심사위원 등록하기
                </Link>
                <Link
                  href="/kcac?menu=instructor"
                  className="px-4 py-2 rounded-lg bg-[#4A2C2A] text-amber-100 text-xs font-bold"
                >
                  커피강사·심사위원 등록하기
                </Link>
              </div>
            </div>

            {/* 지정검정기관(교육장) 등록 절차 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-5">
              <span className="text-xs font-extrabold text-[#4A2C2A]">
                OFFICIAL TEST CENTER APPROVAL
              </span>
              <h2 className="text-xl font-extrabold text-stone-900">
                공식 지정검정기관(교육장·고사장) 승인 절차
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                전국 와인 아카데미, 바리스타 학원, 대학 및 고등학교 실습실 등 표준 시설 규격을 갖춘 교육기관은 본 협의회의 공식 지정검정장으로 등록하여 자체 고사장 운영이 가능합니다.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4A2C2A] shrink-0 mt-0.5" />
                  <span>
                    <strong>시설 기준 확인:</strong> 에스프레소 2그룹 머신·그라인더 세트(커피) 또는 표준 테이스팅·디켄팅 실습석(와인) 구비
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4A2C2A] shrink-0 mt-0.5" />
                  <span>
                    <strong>온라인 기관 등록 신청:</strong> [검정기관등록] 메뉴에서 기관 정보, 대표자, 시설 현황 및 사업자번호 등록
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4A2C2A] shrink-0 mt-0.5" />
                  <span>
                    <strong>실사 승인 및 현판 교부:</strong> 협의회 심사 후 ‘공식 지정검정기관’ 인증서 및 현판 교부
                  </span>
                </li>
              </ul>

              <div className="pt-3 flex flex-wrap gap-2">
                <Link
                  href="/kwac?menu=institution"
                  className="px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-bold"
                >
                  지정검정기관 등록 신청 바로가기 →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            탭 5: 검정자료 받기 (downloads)
        ================================================================= */}
        {activeTab === "downloads" && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-extrabold text-[#722F37] uppercase tracking-wider">
                EXAM ARCHIVE & RESOURCES
              </span>
              <h2 className="text-2xl font-extrabold text-stone-900 mt-1">
                검정자료 받기 (실기 규정집 및 공식 서식 자료실)
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                수험생 및 지정검정기관을 위한 최신 실기 규정집, 채점 기준표, 기관·강사 신청 서식을 바로 내려받으실 수 있습니다.
              </p>
            </div>

            <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
              {downloadFiles.map((file) => (
                <div
                  key={file.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 px-3 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white ${
                          file.category.includes("KWAC")
                            ? "bg-[#722F37]"
                            : file.category.includes("KCAC")
                            ? "bg-[#4A2C2A]"
                            : "bg-stone-700"
                        }`}
                      >
                        {file.category}
                      </span>
                      <span className="text-xs text-stone-400">
                        등록일: {file.date} | 용량: {file.size}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-stone-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-stone-500 shrink-0" />
                      <span>{file.title}</span>
                    </h3>
                    <p className="text-xs text-stone-500">{file.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadFile(file.fileName, file.title, file.desc)}
                    className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-[#722F37] text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>자료 다운로드</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-stone-500">
          자격검정안내 페이지를 불러오는 중입니다...
        </div>
      }
    >
      <GuideContent />
    </Suspense>
  );
}

