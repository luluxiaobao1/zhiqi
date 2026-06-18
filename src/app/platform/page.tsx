"use client";
import React from "react";
import Link from "next/link";

export default function PlatformPage() {
    const platforms = [
        {
            name: "智企控制台和企业管理员管理后台",
            description: "企业级AI工作平台，大模型调用与管理",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            href: "/zhiqi/login",
            bgColor: "bg-green-50",
            color: "from-green-500 to-green-600",
            external: false,
        },
        {
            name: "account后台",
            description: "智企后台管理系统，运维监控与数据总览",
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            href: "/admin",
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            external: false,
        },
    ];

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
            <main className="max-w-5xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">选择平台</h1>
                    <p className="text-gray-600 text-lg">请选择您要访问的平台入口</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {platforms.map((platform) => (
                        <div
                            key={platform.name}
                            className="group"
                        >
                            {platform.external ? (
                                <a
                                    href={platform.href}
                                    className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                                >
                                    <div className={`h-2 bg-gradient-to-r ${platform.color}`}></div>
                                    <div className="p-6">
                                        <div className={`w-20 h-20 ${platform.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <div className="text-gray-700">
                                                {platform.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                            {platform.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 text-center">
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
                                </a>
                            ) : (
                                <Link
                                    href={platform.href}
                                    className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                                >
                                    <div className={`h-2 bg-gradient-to-r ${platform.color}`}></div>
                                    <div className="p-6">
                                        <div className={`w-20 h-20 ${platform.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <div className="text-gray-700">
                                                {platform.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                            {platform.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 text-center">
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
