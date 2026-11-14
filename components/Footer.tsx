// ============================================================================
// 파일명: components/Footer.tsx
// 역할: 사이트 최하단에 위치하는 공식 푸터(Footer) 컴포넌트입니다.
//       kwac-kcac.org의 실제 기관 정보(김대철 회장, 수원 영통구 매탄동 주소,
//       02-2088-0154/0155 고객센터, 신한은행 입금계좌)를 정확히 표시합니다.
// ============================================================================

import React from "react";
import Link from "next/link";
import { Wine, Coffee, Phone, Mail, MapPin, CreditCard } from "lucide-react";
import { ORG_INFO } from "@/lib/menu-data";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-16">
      {/* 상단 빠른 약관 및 주요 메뉴 링크 바 */}
      <div className="border-b border-stone-800 bg-stone-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/about?tab=intro" className="hover:text-white transition-colors">
              협의회 소개
            </Link>
            <Link href="/guide?tab=criteria" className="hover:text-white transition-colors">
              자격검정 기준안내
            </Link>
            <Link
              href="/about?tab=registration"
              className="text-amber-300 font-semibold hover:underline"
            >
              민간자격등록증 확인
            </Link>
            <Link href="/support?tab=location" className="hover:text-white transition-colors">
              오시는 길 (매탄권선역)
            </Link>
            <Link href="/support?tab=faq" className="hover:text-white transition-colors">
              자주 묻는 질문
            </Link>
          </div>
          <div className="text-stone-400">
            <span>지하철 수인분당선 매탄권선역 4번 출구</span>
          </div>
        </div>
      </div>

      {/* 메인 푸터 정보 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 1. 기관명 및 주소/연락처 정보 (7칸) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-1">
              <span className="w-8 h-8 rounded-full bg-[#722F37] text-white flex items-center justify-center">
                <Wine className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-full bg-[#4A2C2A] text-amber-100 flex items-center justify-center border border-stone-700">
                <Coffee className="w-4 h-4" />
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {ORG_INFO.kwacName} · {ORG_INFO.kcacName}
              </h2>
              <p className="text-[11px] text-stone-400">
                {ORG_INFO.kwacEng} / {ORG_INFO.kcacEng}
              </p>
            </div>
          </div>

          <div className="text-xs text-stone-400 space-y-1.5 leading-relaxed">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                <strong className="text-stone-200">기관명:</strong> {ORG_INFO.kwacName} /{" "}
                {ORG_INFO.kcacName}
              </span>
              <span>|</span>
              <span>
                <strong className="text-stone-200">회장(대표):</strong> {ORG_INFO.president}
              </span>
            </p>
            <p className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-200">본부 주소:</strong> {ORG_INFO.addressMain} /{" "}
                {ORG_INFO.addressSub}
              </span>
            </p>
            <p className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <strong className="text-stone-200">대표전화:</strong> {ORG_INFO.phones.join(" / ")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <strong className="text-stone-200">이메일:</strong> {ORG_INFO.email}
              </span>
            </p>
          </div>

          <p className="text-[11px] text-stone-500 pt-2">
            Copyright © {new Date().getFullYear()} KWAC & KCAC ({ORG_INFO.kwacName} ·{" "}
            {ORG_INFO.kcacName}). All rights reserved.
          </p>
        </div>

        {/* 2. 공식 지정 입금계좌 및 고객센터 안내 박스 (5칸) */}
        <div className="lg:col-span-5 bg-stone-800/70 rounded-xl p-5 border border-stone-700/80 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-700 pb-2.5">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              응시료 및 자격증 발급비 공식 입금계좌
            </span>
            <span className="text-[11px] text-stone-400">예금주 확인 필수</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ORG_INFO.bankAccounts.map((acc) => (
              <div
                key={acc.accountNumber}
                className="p-3 rounded-lg bg-stone-900/90 border border-stone-700/60"
              >
                <p className="text-[11px] font-semibold text-stone-300">{acc.org}</p>
                <p className="text-sm font-extrabold text-white mt-1">
                  {acc.bank} {acc.accountNumber}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">예금주: {acc.holder}</p>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-stone-400 pt-1">
            • 상담시간: {ORG_INFO.operatingHours}
          </p>
        </div>
      </div>
    </footer>
  );
}

