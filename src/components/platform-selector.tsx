"use client";

/**
 * 平台入口选择页（唯一实现源）。
 *
 * 背景：历史上首页 src/app/page.tsx 与 src/app/platform/page.tsx 是两份几乎相同的
 * 复制代码，改动只落到其中一份导致"智汇云卡片丢失"。为从根源杜绝这类分叉，
 * 这里把 platforms 数据与整页 UI 收敛为唯一组件，两个路由均引用本组件。
 *
 * 新增/修改平台入口时，只需改动本文件的 PLATFORMS 数组即可，两个路由自动同步。
 */

import React from "react";
import Link from "next/link";

interface PlatformItem {
    /** 卡片标题 */
    name: string;
    /** 卡片描述 */
    description: string;
    /** 卡片图标（SVG 节点） */
    icon: React.ReactNode;
    /** 跳转目标（站内路径，basePath 由 next.config.ts 自动补齐） */
    href: string;
    /** 顶部渐变条配色 */
    color: string;
    /** 图标底色 */
    bgColor: string;
    /** 是否为外部链接（外链用原生 <a>，站内用 next/link 的 <Link>） */
    external?: boolean;
}

/** 平台入口数据 —— 唯一维护点。 */
export const PLATFORMS: PlatformItem[] = [
    {
        name: "智企控制台和企业管理员管理后台",
        description: "企业级AI工作平台，大模型调用与管理",
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        href: "/login",
        bgColor: "bg-green-50",
        color: "from-green-500 to-green-600",
        external: false,
    },
    {
        name: "智汇云",
        description: "费用与三方结算管理，绑定结算单元与订单管理",
        icon: (
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
        ),
        href: "/zyun",
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        external: false,
    },
];

/** 单张平台卡片内容（标题/描述/图标/CTA），供内外链两种容器复用。 */
function PlatformCardBody({ platform }: { platform: PlatformItem }) {
    return (
        <>
            <div className={`h-2 bg-gradient-to-r ${platform.color}`}></div>
            <div className="p-6 relative">
                <div className={`w-20 h-20 ${platform.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-gray-700">
                        {platform.icon}
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2 min-h-[3.5rem] flex items-center justify-center">
                    {platform.name}
                </h3>
                <p className="text-sm text-gray-500 text-center min-h-[2.5rem]">
                    {platform.description}
                </p>
                <div className="mt-4 flex justify-center">
                    <span className="inline-flex items-center gap-1 text-sm text-blue-600 group-hover:gap-2 transition-all">
                        进入平台
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </>
    );
}

const CARD_CLASS =
    "block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300";

export default function PlatformSelector() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* 顶部导航 */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Logo */}
                        <div className="w-10 h-10 relative">
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full"></div>
                            <div className="absolute inset-1 border-2 border-green-400 rounded-full"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-xl font-bold text-gray-900">360智企</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        平台入口
                    </div>
                </div>
            </header>

            {/* 主内容区 */}
            <main className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">选择平台</h1>
                    <p className="text-gray-600 text-lg">请选择您要访问的平台入口</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {PLATFORMS.map((platform) => (
                        <div key={platform.name} className="group">
                            {platform.external ? (
                                <a href={platform.href} className={CARD_CLASS}>
                                    <PlatformCardBody platform={platform} />
                                </a>
                            ) : (
                                <Link href={platform.href} className={CARD_CLASS}>
                                    <PlatformCardBody platform={platform} />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            {/* 底部 */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                    © 2024 360智汇云 - 中立、安全、可信的云计算服务平台
                </div>
            </footer>
        </div>
    );
}
