// ============================================================================
// 파일명: app/layout.tsx
// 역할: 모든 페이지의 공통 뼈대(Root Layout)를 정의합니다.
//       상단 Header와 하단 Footer가 모든 페이지에서 일관되게 유지됩니다.
// ============================================================================

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "KWAC · KCAC | 한국와인아카데미협의회 · 한국커피아카데미협의회 공식 홈페이지",
  description:
    "한국와인아카데미협의회(KWAC) 및 한국커피아카데미협의회(KCAC) 통합 자격검정 플랫폼. 와인 소믈리에, 디켄팅, 커피바리스타, 핸드드립, 라떼아트, 로스팅 시험접수, 합격확인, 자격증 및 증명서 발급 서비스.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 antialiased">
        {/* 상단 통합 네비게이션 헤더 */}
        <Header />

        {/* 본문 컨텐츠 영역 */}
        <main className="flex-1">{children}</main>

        {/* 하단 공식 기관 정보 푸터 */}
        <Footer />
      </body>
    </html>
  );
}

