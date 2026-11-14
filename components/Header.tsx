"use client";

// ============================================================================
// 파일명: components/Header.tsx
// 역할: 사이트 최상단에 고정되는 통합 헤더(GNB) 컴포넌트입니다.
//       - 상단 유틸리티 바 (대표전화, 로그인, 회원가입, 마이페이지, 관리자)
//       - 메인 로고 (KWAC 한국와인아카데미협의회 / KCAC 한국커피아카데미협의회)
//       - 5대 대메뉴 및 마우스 오버 시 펼쳐지는 드롭다운 서브메뉴(KWAC 14종, KCAC 14종 포함)
//       - 모바일 반응형 전체 메뉴 드로어 기능 제공
// ============================================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Wine,
  Coffee,
  Phone,
  User,
  UserPlus,
  FileCheck,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Award,
} from "lucide-react";
import { MAIN_MENUS, ORG_INFO } from "@/lib/menu-data";

export default function Header() {
  // 현재 마우스가 올라가 있는 대메뉴 ID 상태 (드롭다운 표시용)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  // 전체 메뉴(사이트맵형 메가메뉴) 열림/닫힘 상태
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState<boolean>(false);
  // 모바일 화면에서 햄버거 메뉴 열림/닫힘 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  // 모바일 아코디언에서 펼쳐진 메뉴 ID
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>("kwac");

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-stone-200"
      onMouseLeave={() => setActiveMenuId(null)}
    >
      {/* 1. 최상단 유틸리티 바 (기관 안내 및 회원 메뉴) */}
      <div className="bg-stone-900 text-stone-200 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
          {/* 좌측: 공식 기관명 및 대표 연락처 */}
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-1.5 text-stone-300 font-medium">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              정식 등록 민간자격 주관기관 (KWAC · KCAC)
            </span>
            <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
              <Phone className="w-3 h-3" />
              고객센터: {ORG_INFO.phones[0]} / {ORG_INFO.phones[1]}
            </span>
          </div>

          {/* 우측: 로그인 / 회원가입 / 마이페이지 / 관리자 링크 */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/auth?mode=login"
              className="inline-flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>로그인</span>
            </Link>
            <span className="text-stone-700">|</span>
            <Link
              href="/auth?mode=register"
              className="inline-flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>회원가입</span>
            </Link>
            <span className="text-stone-700">|</span>
            <Link
              href="/mypage"
              className="inline-flex items-center gap-1 hover:text-amber-300 transition-colors font-medium text-white"
            >
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>접수/합격/마이페이지</span>
            </Link>
            <span className="hidden sm:inline text-stone-700">|</span>
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1 text-stone-400 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>관리자</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 메인 헤더 영역 (로고 + 5대 대메뉴 + 전체메뉴 버튼) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* 좌측: KWAC · KCAC 통합 브랜드 로고 */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center -space-x-1.5">
            <div className="w-10 h-10 rounded-full bg-[#722F37] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Wine className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 rounded-full bg-[#4A2C2A] text-amber-100 flex items-center justify-center shadow-sm border-2 border-white group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#722F37]">
                KWAC
              </span>
              <span className="text-stone-400 font-light">·</span>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#4A2C2A]">
                KCAC
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-stone-600 leading-tight">
              한국와인아카데미협의회 · 한국커피아카데미협의회
            </span>
          </div>
        </Link>

        {/* 중앙: 데스크톱 5대 메인 네비게이션 메뉴 */}
        <nav className="hidden lg:flex items-center h-full space-x-1 xl:space-x-2">
          {MAIN_MENUS.map((menu) => {
            const isHovered = activeMenuId === menu.id;
            const isWine = menu.badgeColor === "wine";
            const isCoffee = menu.badgeColor === "coffee";

            return (
              <div
                key={menu.id}
                className="relative h-full flex items-center"
                onMouseEnter={() => {
                  setActiveMenuId(menu.id);
                  setIsMegaMenuOpen(false);
                }}
              >
                <Link
                  href={menu.href}
                  className={`px-4 py-2.5 rounded-lg text-[15px] font-bold transition-all flex items-center gap-1.5 ${
                    isHovered
                      ? isWine
                        ? "bg-[#722F37] text-white shadow-sm"
                        : isCoffee
                        ? "bg-[#4A2C2A] text-white shadow-sm"
                        : "bg-stone-900 text-white"
                      : isWine
                      ? "text-[#722F37] hover:bg-rose-50"
                      : isCoffee
                      ? "text-[#4A2C2A] hover:bg-amber-50"
                      : "text-stone-800 hover:bg-stone-100"
                  }`}
                >
                  {isWine && <Wine className="w-4 h-4" />}
                  {isCoffee && <Coffee className="w-4 h-4" />}
                  <span>{menu.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isHovered ? "rotate-180" : ""
                    }`}
                  />
                </Link>
              </div>
            );
          })}
        </nav>

        {/* 우측: 빠른 원서접수 버튼 & 전체 메뉴 토글 버튼 */}
        <div className="flex items-center gap-2">
          <Link
            href="/kwac?menu=apply"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#722F37] text-white hover:bg-[#5a232a] transition-colors shadow-xs"
          >
            <Wine className="w-3.5 h-3.5" />
            와인 시험접수
          </Link>
          <Link
            href="/kcac?menu=apply"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#4A2C2A] text-amber-100 hover:bg-[#38201e] transition-colors shadow-xs"
          >
            <Coffee className="w-3.5 h-3.5" />
            커피 시험접수
          </Link>

          {/* 데스크톱 전체 메뉴(사이트맵) 버튼 */}
          <button
            type="button"
            onClick={() => {
              setIsMegaMenuOpen(!isMegaMenuOpen);
              setActiveMenuId(null);
            }}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-colors"
            title="전체 메뉴 한눈에 보기"
          >
            {isMegaMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>전체메뉴</span>
          </button>

          {/* 모바일 햄버거 버튼 */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100"
            aria-label="모바일 메뉴 열기"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. 개별 대메뉴 마우스 오버 시 열리는 맞춤형 서브메뉴 드롭다운 */}
      {activeMenuId && (
        <div className="hidden lg:block absolute left-0 w-full bg-white border-t border-b border-stone-200 shadow-xl z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {MAIN_MENUS.filter((m) => m.id === activeMenuId).map((menu) => {
              const isWine = menu.badgeColor === "wine";
              const isCoffee = menu.badgeColor === "coffee";

              return (
                <div key={menu.id} className="grid grid-cols-12 gap-8 items-start">
                  {/* 좌측 메뉴 소개 배너 */}
                  <div
                    className={`col-span-3 rounded-xl p-5 text-white ${
                      isWine
                        ? "bg-gradient-to-br from-[#722F37] to-[#4a1c22]"
                        : isCoffee
                        ? "bg-gradient-to-br from-[#4A2C2A] to-[#2c1918]"
                        : "bg-gradient-to-br from-stone-800 to-stone-950"
                    }`}
                  >
                    <p className="text-xs font-semibold tracking-wider uppercase opacity-80">
                      {menu.subtitle}
                    </p>
                    <h3 className="text-xl font-bold mt-1">{menu.title}</h3>
                    <p className="text-xs leading-relaxed mt-2 opacity-90">
                      {isWine
                        ? "한국와인아카데미협의회(KWAC)의 자격검정 원서접수, 합격조회, 강사·심사위원·기관 등록 및 각종 연수·증명서 통합 창구입니다."
                        : isCoffee
                        ? "한국커피아카데미협의회(KCAC)의 바리스타·핸드드립·로스팅·라떼아트 검정접수, 자격증 및 증명서 통합 창구입니다."
                        : "협의회 공식 안내, 자격검정 합격 기준표, 응시료 및 고객 지원 서비스를 확인하실 수 있습니다."}
                    </p>
                  </div>

                  {/* 우측 서브메뉴 그리드 목록 */}
                  <div className="col-span-9 grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {menu.subMenus.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setActiveMenuId(null)}
                        className={`group p-3 rounded-lg border transition-all ${
                          isWine
                            ? "border-stone-200 hover:border-[#722F37] hover:bg-rose-50/50"
                            : isCoffee
                            ? "border-stone-200 hover:border-[#4A2C2A] hover:bg-amber-50/50"
                            : "border-stone-200 hover:border-stone-800 hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-stone-900 group-hover:text-[#722F37]">
                            {sub.title}
                          </span>
                          {sub.category && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                              {sub.category}
                            </span>
                          )}
                        </div>
                        {sub.description && (
                          <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                            {sub.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. '전체메뉴' 버튼 클릭 시 펼쳐지는 사이트맵형 메가 메뉴 */}
      {isMegaMenuOpen && (
        <div className="hidden lg:block absolute left-0 w-full bg-white border-t border-b border-stone-300 shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-extrabold text-stone-900">
                  KWAC · KCAC 전체 메뉴 안내 (Sitemap)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  원하시는 자격검정, 등록, 증명서 및 학술/대회 메뉴로 바로 이동하실 수 있습니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMegaMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" /> 닫기
              </button>
            </div>

            <div className="grid grid-cols-5 gap-6">
              {MAIN_MENUS.map((menu) => {
                const isWine = menu.badgeColor === "wine";
                const isCoffee = menu.badgeColor === "coffee";

                return (
                  <div key={menu.id} className="flex flex-col">
                    <Link
                      href={menu.href}
                      onClick={() => setIsMegaMenuOpen(false)}
                      className={`pb-2.5 mb-3 border-b-2 font-extrabold text-base flex items-center gap-1.5 ${
                        isWine
                          ? "border-[#722F37] text-[#722F37]"
                          : isCoffee
                          ? "border-[#4A2C2A] text-[#4A2C2A]"
                          : "border-stone-800 text-stone-900"
                      }`}
                    >
                      {isWine && <Wine className="w-4 h-4" />}
                      {isCoffee && <Coffee className="w-4 h-4" />}
                      <span>{menu.title}</span>
                    </Link>
                    <ul className="space-y-1.5">
                      {menu.subMenus.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="block py-1 px-2 rounded text-xs font-medium text-stone-700 hover:bg-stone-100 hover:text-[#722F37] hover:font-bold transition-colors"
                          >
                            • {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. 모바일 반응형 아코디언 메뉴 */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 max-h-[82vh] overflow-y-auto px-4 py-4 space-y-3 shadow-xl">
          {/* 모바일 빠른 접수 버튼 */}
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-200">
            <Link
              href="/kwac?menu=apply"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#722F37] text-white text-xs font-bold"
            >
              <Wine className="w-4 h-4" /> KWAC 와인 시험접수
            </Link>
            <Link
              href="/kcac?menu=apply"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#4A2C2A] text-amber-100 text-xs font-bold"
            >
              <Coffee className="w-4 h-4" /> KCAC 커피 시험접수
            </Link>
          </div>

          {/* 모바일 대메뉴 아코디언 리스트 */}
          {MAIN_MENUS.map((menu) => {
            const isExpanded = mobileExpandedId === menu.id;
            return (
              <div key={menu.id} className="border border-stone-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileExpandedId(isExpanded ? null : menu.id)}
                  className="w-full px-4 py-3 bg-stone-50 flex items-center justify-between text-left font-bold text-sm text-stone-900"
                >
                  <span>{menu.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isExpanded && (
                  <div className="p-3 bg-white grid grid-cols-2 gap-2">
                    {menu.subMenus.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-2.5 py-2 rounded bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-800"
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
}

