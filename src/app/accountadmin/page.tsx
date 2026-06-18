"use client";
import React, { useState, useMemo } from "react";

// 智汇云产品数据
const zhihuiProductsData = [
    {
        id: 1,
        name: "离线数仓 Hive",
        category: "大数据/数据仓库",
        identifier: "hive",
        visibility: "指定企业可见",
        status: "online",
        onlineTime: "2026-03-25 11:03:51",
        icon: "database",
    },
    {
        id: 2,
        name: "对象存储 OSS",
        category: "存储/对象存储",
        identifier: "oss",
        visibility: "所有企业可见",
        status: "online",
        onlineTime: "2026-03-20 09:15:32",
        icon: "storage",
    },
    {
        id: 3,
        name: "云数据库 MySQL",
        category: "数据库/关系型数据库",
        identifier: "mysql",
        visibility: "所有企业可见",
        status: "online",
        onlineTime: "2026-03-18 14:22:08",
        icon: "db",
    },
    {
        id: 4,
        name: "容器服务 K8s",
        category: "容器/容器编排",
        identifier: "k8s",
        visibility: "指定企业可见",
        status: "offline",
        onlineTime: "2026-03-10 16:45:20",
        icon: "container",
    },
    {
        id: 5,
        name: "实时计算 Flink",
        category: "大数据/流计算",
        identifier: "flink",
        visibility: "所有企业可见",
        status: "offline",
        onlineTime: "2026-03-08 10:30:45",
        icon: "compute",
    },
    {
        id: 6,
        name: "消息队列 Kafka",
        category: "中间件/消息队列",
        identifier: "kafka",
        visibility: "所有企业可见",
        status: "online",
        onlineTime: "2026-03-05 08:12:33",
        icon: "queue",
    },
];

// 智企产品数据
const zhiqiProductsData = [
    {
        id: 101,
        name: "大模型",
        category: "AI/大语言模型",
        identifier: "llm",
        visibility: "所有企业可见",
        status: "online",
        onlineTime: "2026-03-22 09:30:00",
        icon: "ai",
    },
    {
        id: 102,
        name: "龙虾",
        category: "AI/智能助手",
        identifier: "lobster",
        visibility: "所有企业可见",
        status: "online",
        onlineTime: "2026-03-15 14:20:00",
        icon: "bot",
    },
    {
        id: 103,
        name: "APICloud",
        category: "开发/API服务",
        identifier: "apicloud",
        visibility: "所有企业可见",
        status: "online",
        onlineTime: "2026-03-12 10:45:00",
        icon: "api",
    },
];

// 产品计费项数据
const billingItemsData = [
    { id: 1, name: "chat_360-mirothinker-1.7_输出", tagName: "__", identifier: "api_t_s_2036746716615655424", product: "API市场 APIMKT (apimarket)", unit: "1百万tokens", rule: "用量求和", createTime: "2026-03-25 18:07:13", remark: "" },
    { id: 2, name: "chat_360-mirothinker-1.7_输入", tagName: "__", identifier: "api_t_s_2036746716615340032", product: "API市场 APIMKT (apimarket)", unit: "1百万tokens", rule: "用量求和", createTime: "2026-03-25 18:07:13", remark: "" },
    { id: 3, name: "chat_360-mirothinker-v1.7_输出", tagName: "__", identifier: "api_t_s_2036740809824219136", product: "API市场 APIMKT (apimarket)", unit: "1百万tokens", rule: "用量求和", createTime: "2026-03-25 17:43:45", remark: "" },
    { id: 4, name: "chat_360-mirothinker-v1.7_输入", tagName: "__", identifier: "api_t_s_2036740809826058240", product: "API市场 APIMKT (apimarket)", unit: "1百万tokens", rule: "用量求和", createTime: "2026-03-25 17:43:45", remark: "" },
    { id: 5, name: "Tavily Search_tavily_search_advanced", tagName: "__", identifier: "api_n_s_2036641175188381696", product: "API市场 APIMKT (apimarket)", unit: "1次", rule: "用量求和", createTime: "2026-03-25 11:07:50", remark: "" },
    { id: 6, name: "Tavily Extract _tavily_extract_basic", tagName: "__", identifier: "api_n_s_2036639435502751744", product: "API市场 APIMKT (apimarket)", unit: "1个", rule: "用量求和", createTime: "2026-03-25 11:00:55", remark: "" },
    { id: 7, name: "Tavily Extract _tavily_extract_advanced", tagName: "__", identifier: "api_n_s_2036639189061566464", product: "API市场 APIMKT (apimarket)", unit: "1个", rule: "用量求和", createTime: "2026-03-25 10:59:56", remark: "" },
    { id: 8, name: "Tavily Crawl_tavily_claw_basic", tagName: "__", identifier: "api_n_s_2036638157819600896", product: "API市场 APIMKT (apimarket)", unit: "1个", rule: "用量求和", createTime: "2026-03-25 10:55:51", remark: "" },
    { id: 9, name: "Tavily Crawl_tavily_claw_advanced", tagName: "__", identifier: "api_n_s_2036637984355844096", product: "API市场 APIMKT (apimarket)", unit: "1个", rule: "用量求和", createTime: "2026-03-25 10:55:09", remark: "" },
    { id: 10, name: "Tavily Map_tavily_map_without_instruction", tagName: "__", identifier: "api_n_s_2036637741223469056", product: "API市场 APIMKT (apimarket)", unit: "1个", rule: "用量求和", createTime: "2026-03-25 10:54:11", remark: "" },
];

// 产品套餐数据
const resourcePackagesData = [
    { id: 1, name: "旗舰版", identifier: "test0320", product: "测试产品22 (ces_sign)", type: "总价包", createTime: "2026-03-19 13:08:01", updateTime: "2026-03-19 15:19:36", status: "online" },
    { id: 2, name: "A100-80G-标准版-8卡", identifier: "13_109_8", product: "AI开发平台TAI (tai)", type: "总量节省", createTime: "2026-03-13 11:27:52", updateTime: "2026-03-23 17:04:10", status: "online" },
    { id: 3, name: "总量包1", identifier: "zlb1", product: "test (test_x)", type: "总价包", createTime: "2026-03-10 17:06:25", updateTime: "2026-03-10 17:07:22", status: "offline" },
    { id: 4, name: "自动续费套餐2", identifier: "zdxfzyb2", product: "test (test_x)", type: "总价节省", createTime: "2026-03-10 11:57:00", updateTime: "2026-03-10 15:40:35", status: "online" },
    { id: 5, name: "自动续费套餐1", identifier: "zdxfzyb1", product: "test (test_x)", type: "总量节省", createTime: "2026-03-10 11:56:12", updateTime: "2026-03-10 15:40:35", status: "online" },
    { id: 6, name: "L20-48G-基础版-8卡", identifier: "test0309", product: "测试产品22 (ces_sign)", type: "总量节省", createTime: "2026-03-09 17:21:16", updateTime: "2026-03-11 17:25:17", status: "online" },
    { id: 7, name: "L20-48G-基础版-8卡", identifier: "2_9_8", product: "AI开发平台TAI (tai)", type: "总量节省", createTime: "2026-03-02 18:45:12", updateTime: "2026-03-23 10:58:56", status: "online" },
    { id: 8, name: "L20-48G-标准版-8卡", identifier: "3_17_8", product: "AI开发平台TAI (tai)", type: "总量节省", createTime: "2026-03-02 18:44:33", updateTime: "2026-03-13 10:49:00", status: "online" },
    { id: 9, name: "4090-24G-基础版-8卡", identifier: "7_57_8", product: "AI开发平台TAI (tai)", type: "总量节省", createTime: "2026-03-02 18:43:44", updateTime: "2026-03-16 19:01:37", status: "online" },
    { id: 10, name: "4090D-48G-基础版-8卡", identifier: "6_49_8", product: "AI开发平台TAI (tai)", type: "总量节省", createTime: "2026-03-02 18:42:50", updateTime: "2026-03-13 17:58:20", status: "online" },
];

// 智企产品计费项数据
const zhiqiBillingItemsData = [
    { id: 101, name: "大模型_输入Token", tagName: "__", identifier: "zhiqi_llm_input", product: "大模型 (llm)", unit: "1百万tokens", rule: "用量求和", createTime: "2026-03-24 10:30:00", remark: "" },
    { id: 102, name: "大模型_输出Token", tagName: "__", identifier: "zhiqi_llm_output", product: "大模型 (llm)", unit: "1百万tokens", rule: "用量求和", createTime: "2026-03-24 10:30:00", remark: "" },
    { id: 103, name: "龙虾_对话次数", tagName: "__", identifier: "zhiqi_lobster_chat", product: "龙虾 (lobster)", unit: "1次", rule: "用量求和", createTime: "2026-03-22 14:20:00", remark: "" },
    { id: 104, name: "龙虾_会话时长", tagName: "__", identifier: "zhiqi_lobster_duration", product: "龙虾 (lobster)", unit: "1分钟", rule: "用量求和", createTime: "2026-03-22 14:20:00", remark: "" },
    { id: 105, name: "APICloud_API调用次数", tagName: "__", identifier: "zhiqi_api_calls", product: "APICloud (apicloud)", unit: "1次", rule: "用量求和", createTime: "2026-03-20 09:15:00", remark: "" },
    { id: 106, name: "APICloud_存储容量", tagName: "__", identifier: "zhiqi_api_storage", product: "APICloud (apicloud)", unit: "1GB", rule: "用量求和", createTime: "2026-03-20 09:15:00", remark: "" },
];

// 智企产品套餐数据
const zhiqiResourcePackagesData = [
    { id: 101, name: "大模型基础版", identifier: "llm_basic_01", product: "大模型 (llm)", type: "总价包", createTime: "2026-03-22 15:30:00", updateTime: "2026-03-24 10:20:00", status: "online" },
    { id: 102, name: "大模型专业版", identifier: "llm_pro_01", product: "大模型 (llm)", type: "总量节省", createTime: "2026-03-21 09:15:00", updateTime: "2026-03-23 14:30:00", status: "online" },
    { id: 103, name: "龙虾标准版", identifier: "lobster_std_01", product: "龙虾 (lobster)", type: "总价包", createTime: "2026-03-18 11:20:00", updateTime: "2026-03-20 09:45:00", status: "online" },
    { id: 104, name: "龙虾专业版", identifier: "lobster_pro_01", product: "龙虾 (lobster)", type: "总量节省", createTime: "2026-03-17 14:30:00", updateTime: "2026-03-19 16:20:00", status: "online" },
    { id: 105, name: "APICloud基础包", identifier: "api_basic_01", product: "APICloud (apicloud)", type: "总价包", createTime: "2026-03-15 10:00:00", updateTime: "2026-03-18 11:30:00", status: "online" },
    { id: 106, name: "APICloud高级包", identifier: "api_adv_01", product: "APICloud (apicloud)", type: "总量节省", createTime: "2026-03-12 09:30:00", updateTime: "2026-03-14 15:20:00", status: "online" },
];

// 兼容旧代码的别名
const productsData = zhihuiProductsData;

// 产品分类选项
const productCategories = [
    { value: "all", label: "全部产品分类" },
    { value: "大数据", label: "大数据" },
    { value: "存储", label: "存储" },
    { value: "数据库", label: "数据库" },
    { value: "容器", label: "容器" },
    { value: "中间件", label: "中间件" },
];

// 产品状态选项
const productStatuses = [
    { value: "all", label: "全部上线状态" },
    { value: "online", label: "已上线" },
    { value: "offline", label: "已下线" },
];

// 所有可用模型列表
const ALL_MODELS = [
    { id: 'doubao-pro', name: '豆包Pro', description: '高性能通用大模型' },
    { id: 'doubao-lite', name: '豆包Lite', description: '轻量级快速响应模型' },
    { id: 'deepseek-chat', name: 'DeepSeek', description: '深度求索对话模型' },
    { id: 'kimi', name: 'Kimi', description: '月之暗面长文本模型' },
];

// Tab配置
const adminTabs = [
    { id: "packages", name: "套餐管理", icon: "package" },
    { id: "models", name: "AI计划管理", icon: "cpu" },
];

// 获取菜单图标
const getTabIcon = (icon: string, className: string = "w-5 h-5") => {
    switch (icon) {
        case "chart":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            );
        case "users":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            );
        case "package":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            );
        case "cpu":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
            );
        case "bot":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            );
        default:
            return null;
    }
};

// 租户数据
const tenantsData = [
    {
        id: 1,
        name: "腾讯科技",
        totalPaid: 2567890,
        monthlyPackageName: "企业版月包",
        payStatus: "paid",
        memberUsed: 118,
        memberTotal: 128,
        amountUsed: 1890456,
        amountTotal: 2000000,
        lobsterCount: { normal: 23, total: 25 },
        createTime: "2024-01-15 10:23:45",
        lastAccessTime: "2025-01-10 14:32:18",
        members: [
            { id: 1, name: "张三", accountId: "zhangsan", role: "管理员", quota: 100000, usedQuota: 45678, status: "active" },
            { id: 2, name: "李四", accountId: "lisi", role: "成员", quota: 50000, usedQuota: 12345, status: "active" },
            { id: 3, name: "王五", accountId: "wangwu", role: "成员", quota: 50000, usedQuota: 8765, status: "active" },
            { id: 4, name: "赵六", accountId: "zhaoliu", role: "成员", quota: 30000, usedQuota: 5678, status: "inactive" },
        ]
    },
    {
        id: 2,
        name: "阿里巴巴",
        totalPaid: 1987654,
        monthlyPackageName: "专业版月包",
        payStatus: "paid",
        memberUsed: 76,
        memberTotal: 86,
        amountUsed: 1456234,
        amountTotal: 1500000,
        lobsterCount: { normal: 18, total: 18 },
        createTime: "2024-02-20 14:08:32",
        lastAccessTime: "2025-01-10 09:15:42",
        members: [
            { id: 1, name: "马云飞", accountId: "mayunfei", role: "管理员", quota: 80000, usedQuota: 34567, status: "active" },
            { id: 2, name: "刘强", accountId: "liuqiang", role: "成员", quota: 40000, usedQuota: 9876, status: "active" },
            { id: 3, name: "陈明", accountId: "chenming", role: "成员", quota: 40000, usedQuota: 7654, status: "active" },
        ]
    },
    {
        id: 3,
        name: "字节跳动",
        totalPaid: 1654321,
        monthlyPackageName: "专业版月包",
        payStatus: "paid",
        memberUsed: 58,
        memberTotal: 65,
        amountUsed: 1198765,
        amountTotal: 1200000,
        lobsterCount: { normal: 14, total: 15 },
        createTime: "2024-03-10 09:56:18",
        lastAccessTime: "2025-01-09 18:45:30",
        members: [
            { id: 1, name: "张一鸣", accountId: "zhangyiming", role: "管理员", quota: 90000, usedQuota: 56789, status: "active" },
            { id: 2, name: "梁汝波", accountId: "liangrubo", role: "成员", quota: 45000, usedQuota: 12345, status: "active" },
        ]
    },
    {
        id: 4,
        name: "百度在线",
        totalPaid: 1234567,
        monthlyPackageName: "基础版月包",
        payStatus: "expired",
        memberUsed: 42,
        memberTotal: 50,
        amountUsed: 987654,
        amountTotal: 1000000,
        lobsterCount: { normal: 10, total: 12 },
        createTime: "2024-04-05 16:42:07",
        lastAccessTime: "2024-12-28 11:20:15",
        members: [
            { id: 1, name: "李彦宏", accountId: "liyanhong", role: "管理员", quota: 60000, usedQuota: 23456, status: "active" },
            { id: 2, name: "沈抖", accountId: "shendou", role: "成员", quota: 30000, usedQuota: 8765, status: "active" },
        ]
    },
    {
        id: 5,
        name: "京东集团",
        totalPaid: 987654,
        monthlyPackageName: "基础版月包",
        payStatus: "paid",
        memberUsed: 28,
        memberTotal: 40,
        amountUsed: 678456,
        amountTotal: 800000,
        lobsterCount: { normal: 10, total: 10 },
        createTime: "2024-05-12 11:18:53",
        lastAccessTime: "2025-01-10 16:08:55",
        members: [
            { id: 1, name: "刘强东", accountId: "liuqiangdong", role: "管理员", quota: 50000, usedQuota: 19876, status: "active" },
        ]
    },
    {
        id: 6,
        name: "美团点评",
        totalPaid: 876543,
        monthlyPackageName: "基础版月包",
        payStatus: "expired",
        memberUsed: 28,
        memberTotal: 30,
        amountUsed: 567890,
        amountTotal: 600000,
        lobsterCount: { normal: 6, total: 8 },
        createTime: "2024-06-20 08:35:29",
        lastAccessTime: "2024-11-15 09:30:00",
        members: [
            { id: 1, name: "王兴", accountId: "wangxing", role: "管理员", quota: 40000, usedQuota: 15678, status: "active" },
        ]
    },
    {
        id: 7,
        name: "小米科技",
        totalPaid: 765432,
        monthlyPackageName: "基础版月包",
        payStatus: "paid",
        memberUsed: 18,
        memberTotal: 25,
        amountUsed: 456789,
        amountTotal: 500000,
        lobsterCount: { normal: 6, total: 6 },
        createTime: "2024-07-08 15:27:44",
        lastAccessTime: "2025-01-08 10:45:22",
        members: [
            { id: 1, name: "雷军", accountId: "leijun", role: "管理员", quota: 45000, usedQuota: 12345, status: "active" },
        ]
    },
    {
        id: 8,
        name: "华为技术",
        totalPaid: 2345678,
        monthlyPackageName: "企业版月包",
        payStatus: "paid",
        memberUsed: 142,
        memberTotal: 200,
        amountUsed: 1789456,
        amountTotal: 2500000,
        lobsterCount: { normal: 28, total: 30 },
        createTime: "2024-01-05 09:12:36",
        lastAccessTime: "2025-01-10 17:22:38",
        members: [
            { id: 1, name: "任正非", accountId: "renzhengfei", role: "管理员", quota: 120000, usedQuota: 67890, status: "active" },
            { id: 2, name: "余承东", accountId: "yuchengdong", role: "成员", quota: 60000, usedQuota: 23456, status: "active" },
        ]
    },
];

import { initialPackagesData, type Package, getPackages, addPackage, updatePackage, updatePackageStatus } from '@/lib/packages-data';

// 导出类型供其他页面使用
export type { Package };

// 使用共享数据作为初始值
const packagesDataFromShared = initialPackagesData;

// 根据日期范围生成不同的测试数据
const generateDataByDateRange = (dateRange: string | number, isCumulative: boolean, isCustomDays: boolean = false) => {
    // 基础乘数：根据日期范围调整
    let baseMultiplier: number;
    
    if (isCustomDays && typeof dateRange === 'number') {
        // 自定义日期范围，直接使用天数
        baseMultiplier = isCumulative ? 365 : dateRange;
    } else {
        // 预设日期范围
        const multipliers: Record<string, number> = {
            today: 1,
            "7days": 7,
            "30days": 30,
            month: 30,
        };
        baseMultiplier = isCumulative ? 365 : (multipliers[dateRange as string] || 1);
    }
    
    // 添加随机波动
    const randomFactor = () => 0.8 + Math.random() * 0.4; // 0.8-1.2之间
    
    return {
        // 核心统计数据
        activeUsers: Math.floor(1234 * baseMultiplier * randomFactor() * 0.3 + 500),
        paidTenants: Math.floor(56 + baseMultiplier * 2 * randomFactor()),
        modelCalls: Math.floor(9876543 * baseMultiplier * randomFactor() * 0.1),
        tokenConsumption: Math.floor(123456789 * baseMultiplier * randomFactor() * 0.1), // Token消耗
        expiringTenants: Math.floor(5 + Math.random() * 10), // 3日内到期租户数
        exhaustedQuotaTenants: Math.floor(3 + Math.random() * 8), // 套餐配额已用尽租户数
        lobsterCount: { 
            normal: Math.floor(89 * (1 + baseMultiplier * 0.05) * randomFactor()), 
            total: Math.floor(102 * (1 + baseMultiplier * 0.05) * randomFactor()) 
        },
        income: Math.floor(1234567 * baseMultiplier * randomFactor() * 0.15),
        cost: Math.floor(876543 * baseMultiplier * randomFactor() * 0.15),
        profit: Math.floor(358024 * baseMultiplier * randomFactor() * 0.15),
        packages: [
            { name: "基础版", income: Math.floor(456789 * baseMultiplier * randomFactor() * 0.2), sold: Math.floor(234 + baseMultiplier * 3 * randomFactor()) },
            { name: "专业版", income: Math.floor(567890 * baseMultiplier * randomFactor() * 0.2), sold: Math.floor(156 + baseMultiplier * 2 * randomFactor()) },
            { name: "企业版", income: Math.floor(209888 * baseMultiplier * randomFactor() * 0.2), sold: Math.floor(45 + baseMultiplier * randomFactor()) },
        ],
        
        // TOP数据
        paidCustomersTop: [
            { name: "腾讯科技", amount: Math.floor(123456 * baseMultiplier * randomFactor()) },
            { name: "阿里巴巴", amount: Math.floor(98765 * baseMultiplier * randomFactor()) },
            { name: "字节跳动", amount: Math.floor(87654 * baseMultiplier * randomFactor()) },
            { name: "百度在线", amount: Math.floor(76543 * baseMultiplier * randomFactor()) },
            { name: "京东集团", amount: Math.floor(65432 * baseMultiplier * randomFactor()) },
        ],
        packagesTop: [
            { name: "专业版", sold: Math.floor(156 + baseMultiplier * 2 * randomFactor()), amount: Math.floor(567890 * baseMultiplier * randomFactor() * 0.2) },
            { name: "基础版", sold: Math.floor(234 + baseMultiplier * 3 * randomFactor()), amount: Math.floor(456789 * baseMultiplier * randomFactor() * 0.2) },
            { name: "企业版", sold: Math.floor(45 + baseMultiplier * randomFactor()), amount: Math.floor(209888 * baseMultiplier * randomFactor() * 0.2) },
        ],
        modelCallsTop: [
            { name: "GPT-4", calls: Math.floor(3456789 * baseMultiplier * randomFactor() * 0.1) },
            { name: "Claude-3", calls: Math.floor(2345678 * baseMultiplier * randomFactor() * 0.1) },
            { name: "文心一言", calls: Math.floor(1234567 * baseMultiplier * randomFactor() * 0.1) },
            { name: "通义千问", calls: Math.floor(987654 * baseMultiplier * randomFactor() * 0.1) },
            { name: "智谱AI", calls: Math.floor(876543 * baseMultiplier * randomFactor() * 0.1) },
        ],
        lobsterCountTop: [
            { name: "腾讯科技", count: Math.floor(25 + baseMultiplier * 0.5 * randomFactor()) },
            { name: "阿里巴巴", count: Math.floor(18 + baseMultiplier * 0.3 * randomFactor()) },
            { name: "字节跳动", count: Math.floor(15 + baseMultiplier * 0.2 * randomFactor()) },
            { name: "百度在线", count: Math.floor(12 + baseMultiplier * 0.2 * randomFactor()) },
            { name: "京东集团", count: Math.floor(10 + baseMultiplier * 0.1 * randomFactor()) },
        ],
        lobsterActiveTop: [
            { name: "龙虾-生产环境", calls: Math.floor(1234567 * baseMultiplier * randomFactor() * 0.1) },
            { name: "龙虾-测试环境", calls: Math.floor(987654 * baseMultiplier * randomFactor() * 0.1) },
            { name: "龙虾-开发环境", calls: Math.floor(765432 * baseMultiplier * randomFactor() * 0.1) },
            { name: "龙虾-预发布", calls: Math.floor(543210 * baseMultiplier * randomFactor() * 0.1) },
            { name: "龙虾-灰度", calls: Math.floor(321098 * baseMultiplier * randomFactor() * 0.1) },
        ],
    };
};

// 格式化金额
const formatMoney = (amount: number) => {
    if (amount >= 100000000) {
        return `¥${(amount / 100000000).toFixed(2)}亿`;
    } else if (amount >= 10000) {
        return `¥${(amount / 10000).toFixed(2)}万`;
    }
    return `¥${amount.toLocaleString()}`;
};

// 格式化Token数量
const formatTokens = (tokens: number) => {
    if (tokens >= 100000000) {
        return `${(tokens / 100000000).toFixed(2)}亿`;
    } else if (tokens >= 10000) {
        return `${(tokens / 10000).toFixed(2)}万`;
    }
    return tokens.toLocaleString();
};

// 格式化数字
const formatNumber = (num: number) => {
    if (num >= 1000000000) {
        return `${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
        return `${(num / 1000000).toFixed(2)}M`;
    }
    return num.toLocaleString();
};

export default function AdminPage() {
    const [adminMenuExpanded, setAdminMenuExpanded] = useState(true); // 管理后台菜单展开状态
    const [productMenuExpanded, setProductMenuExpanded] = useState(true); // 产品管理菜单展开状态
    const [zhiqiBillMenuExpanded, setZhiqiBillMenuExpanded] = useState(false); // 账单管理菜单展开状态
    const [currentMenu, setCurrentMenu] = useState("zhiqi-admin"); // 当前选中的菜单: product-define, product-addon, product-billing, product-package, zhiqi-bill-overview, zhiqi-bill-customer, zhiqi-bill-product, zhiqi-bill-intranet, platform-config, zhiqi-admin
    const [activeTab, setActiveTab] = useState("packages");
    
    // 账单概览页面tab状态
    const [billOverviewTab, setBillOverviewTab] = useState<"all" | "zhihui" | "zhiqi">("all");
    
    // 客户账单页面tab状态
    const [billCustomerTab, setBillCustomerTab] = useState<"all" | "zhihui" | "zhiqi">("all");
    
    // 产品账单页面tab状态
    const [billProductTab, setBillProductTab] = useState<"zhihui" | "zhiqi">("zhihui");
    
    // 内网账单页面tab状态
    const [intranetBillTab, setIntranetBillTab] = useState<"zhihui" | "zhiqi">("zhihui");
    // 内网账单二级tab状态：部门账单/产品账单
    const [intranetBillTypeTab, setIntranetBillTypeTab] = useState<"department" | "product">("department");
    
    // 产品定义相关状态
    const [productTab, setProductTab] = useState<"zhihui" | "zhiqi">("zhihui"); // 产品tab：智汇云产品/智企产品
    const [productSearchKeyword, setProductSearchKeyword] = useState("");
    const [productCategoryFilter, setProductCategoryFilter] = useState("all");
    const [productStatusFilter, setProductStatusFilter] = useState("all");
    const [createProductDialogOpen, setCreateProductDialogOpen] = useState(false);
    
    // 产品计费项相关状态
    const [billingProductTab, setBillingProductTab] = useState<"zhihui" | "zhiqi">("zhihui"); // 智汇云/智企产品tab
    const [billingItemSearch, setBillingItemSearch] = useState("");
    const [billingProductFilter, setBillingProductFilter] = useState("");
    const [billingStartDate, setBillingStartDate] = useState("");
    const [billingEndDate, setBillingEndDate] = useState("");
    const [billingCurrentPage, setBillingCurrentPage] = useState(1);
    const [billingPageSize, setBillingPageSize] = useState(10);
    const billingTotalCount = 2160; // 总数据量
    
    // 产品计费策略相关状态
    const [billingStrategyProductTab, setBillingStrategyProductTab] = useState<"zhihui" | "zhiqi">("zhihui");
    
    // 产品套餐相关状态
    const [resourcePackageProductTab, setResourcePackageProductTab] = useState<"zhihui" | "zhiqi">("zhihui"); // 智汇云/智企产品tab
    const [resourcePackageTab, setResourcePackageTab] = useState<"packages" | "tasks">("packages"); // 套餐/发放任务tab
    const [resourcePackageSearch, setResourcePackageSearch] = useState("");
    const [resourcePackageProductFilter, setResourcePackageProductFilter] = useState("");
    const [resourcePackageTypeFilter, setResourcePackageTypeFilter] = useState("");
    const [resourcePackageStatusFilter, setResourcePackageStatusFilter] = useState("");
    const [resourcePackageStartDate, setResourcePackageStartDate] = useState("");
    const [resourcePackageEndDate, setResourcePackageEndDate] = useState("");
    const [resourcePackageCurrentPage, setResourcePackageCurrentPage] = useState(1);
    const [resourcePackagePageSize, setResourcePackagePageSize] = useState(10);
    const resourcePackageTotalCount = 63; // 总数据量
    
    // 创建产品表单状态
    const [newProduct, setNewProduct] = useState({
        name: '',           // 产品名称
        shortName: '',      // 产品简称
        category: '',       // 产品分类
        productLine: '其他', // 所属产线
        identifier: 'zqi_',     // 产品标识符，预填zqi_，前缀不可删除
        description: '',    // 产品描述
        tags: [] as string[], // 产品标签
        tagInput: '',       // 标签输入
        url: '',            // URL地址
        introUrl: '',       // 介绍页地址
        networkType: 'intranet', // 内外网属性：intranet-内网, public-公网, both-既是内网又是公网
        visibility: 'all',  // 展示范围
        icon: null as File | null, // 产品图标
        auditType: '',      // 产品审核开通
        workOrderSchedule: false, // 工单排班表管理
        billingEnabled: true,     // 计费开通
        docEnabled: false,        // 产品文档
        reserveAmount: 0,         // 预留金额
    });
    
    const [dateRange, setDateRange] = useState("today");
    const [isCumulative, setIsCumulative] = useState(false);
    const [isCustomDate, setIsCustomDate] = useState(false);
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    
    // 租户管理相关状态
    const [tenantSearchKeyword, setTenantSearchKeyword] = useState("");
    const [tenantPackageFilter, setTenantPackageFilter] = useState("all");
    const [selectedTenant, setSelectedTenant] = useState<typeof tenantsData[0] | null>(null);
    const [memberDialogOpen, setMemberDialogOpen] = useState(false);
    const [memberSearchKeyword, setMemberSearchKeyword] = useState(""); // 成员账号搜索
    const [importMemberDialogOpen, setImportMemberDialogOpen] = useState(false); // 导入成员弹框
    const [importMemberQuota, setImportMemberQuota] = useState(""); // 导入成员配额
    const [selectedMember, setSelectedMember] = useState<{ tenant: typeof tenantsData[0]; member: typeof tenantsData[0]['members'][0] } | null>(null);
    const [quotaDialogOpen, setQuotaDialogOpen] = useState(false);
    const [newQuota, setNewQuota] = useState("");
    
    // 套餐管理相关状态
    const [packagesData, setPackagesData] = useState(initialPackagesData); // 使用state管理套餐数据
    const [packageStatusFilter, setPackageStatusFilter] = useState("all");
    const [packageNameSearch, setPackageNameSearch] = useState(""); // 套餐名称搜索
    const [packageTypeFilter, setPackageTypeFilter] = useState("all"); // 所属产品筛选
    const [expandedPackageIds, setExpandedPackageIds] = useState<number[]>([]); // 展开的套餐ID列表
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // 二级菜单收起状态
    const [packageSubTab, setPackageSubTab] = useState("packages"); // 套餐页面二级tab: packages | analysis
    const [modelSubTab, setModelSubTab] = useState("config"); // AI计划管理页面二级tab: config | stats
    const [createPackageDialogOpen, setCreatePackageDialogOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null); // 正在编辑的套餐
    const [togglePackageConfirm, setTogglePackageConfirm] = useState<{ id: number; name: string; action: "上架" | "下架"; newStatus: string } | null>(null);
    const [newPackage, setNewPackage] = useState<{
        name: string;
        identifier: string; // 套餐标识
        product: "ai-plan" | "lobster"; // 选择产品
        description: string;
        type: "monthly" | "addon"; // monthly: 月包, addon: 加油包
        price: number;
        costPrice: number; // 成本价
        priceHint: string; // 金额提示语
        hourLimit5: number | null; // 5小时限额
        weekLimit: number | null; // 周限额
        monthLimit: number | null; // 月限额
        capabilityDesc: string; // 套餐能力说明
        lobsterCount: number; // 龙虾数量
        memberCount: number; // 成员数
        availableModels: string[]; // 可用模型列表
        purchaseLimit: number | null;
        stock: number | null;
        officialDiscount: number;
        internalDiscount: number;
        svipDiscount: number;
        vipDiscount: number;
    }>({
        name: "",
        identifier: "",
        product: "ai-plan",
        description: "",
        type: "monthly", // 默认月包
        price: 0,
        costPrice: 0,
        priceHint: "",
        hourLimit5: null,
        weekLimit: null,
        monthLimit: null,
        capabilityDesc: "",
        lobsterCount: 1,
        memberCount: 10, // 默认成员数
        availableModels: ALL_MODELS.map(m => m.id), // 默认选中所有模型
        purchaseLimit: null as number | null,
        stock: null as number | null,
        officialDiscount: 10, // 官方折扣（折），默认10折=不打折
        internalDiscount: 10, // 内部折扣（折），默认10折=不打折
        svipDiscount: 10, // SVIP折扣（折），默认10折=不打折
        vipDiscount: 10, // VIP折扣（折），默认10折=不打折
    });
    
    // 模型选择弹框状态
    const [modelSelectDialogOpen, setModelSelectDialogOpen] = useState(false);
    const [tempSelectedModels, setTempSelectedModels] = useState<string[]>([]);

    // 使用 useMemo 根据日期范围和累计状态动态生成数据
    const mockData = useMemo(() => {
        if (isCustomDate && customStartDate && customEndDate) {
            // 自定义日期范围：计算天数差异
            const start = new Date(customStartDate);
            const end = new Date(customEndDate);
            const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            return generateDataByDateRange(daysDiff > 0 ? daysDiff : 1, isCumulative, true);
        }
        return generateDataByDateRange(dateRange, isCumulative);
    }, [dateRange, isCumulative, isCustomDate, customStartDate, customEndDate]);
    
    // 过滤租户列表
    const filteredTenants = useMemo(() => {
        return tenantsData.filter(tenant => {
            const matchKeyword = tenant.name.toLowerCase().includes(tenantSearchKeyword.toLowerCase());
            const matchPackage = tenantPackageFilter === "all" || tenant.monthlyPackageName.includes(tenantPackageFilter);
            return matchKeyword && matchPackage;
        });
    }, [tenantSearchKeyword, tenantPackageFilter]);
    
    // 过滤套餐列表
    const filteredPackages = useMemo(() => {
        return packagesData.filter(pkg => {
            const matchStatus = packageStatusFilter === "all" || pkg.status === packageStatusFilter;
            const matchName = packageNameSearch === "" || pkg.name.toLowerCase().includes(packageNameSearch.toLowerCase());
            const matchType = packageTypeFilter === "all" || pkg.product === packageTypeFilter;
            return matchStatus && matchName && matchType;
        });
    }, [packagesData, packageStatusFilter, packageNameSearch, packageTypeFilter]);

    // 打开成员管理弹窗
    const handleManageMembers = (tenant: typeof tenantsData[0]) => {
        setSelectedTenant(tenant);
        setMemberDialogOpen(true);
    };

    // 打开配额设置弹窗
    const handleSetQuota = (tenant: typeof tenantsData[0], member: typeof tenantsData[0]['members'][0]) => {
        setSelectedMember({ tenant, member });
        setNewQuota(member.quota.toString());
        setQuotaDialogOpen(true);
    };

    // 保存配额
    const handleSaveQuota = () => {
        if (selectedMember && newQuota) {
            console.log(`设置 ${selectedMember.member.name} 的配额为 ${newQuota}`);
            setQuotaDialogOpen(false);
            setSelectedMember(null);
        }
    };
    
    // 打开上/下架确认弹窗
    const handleTogglePackageStatus = (packageId: number, packageName: string, newStatus: string) => {
        const action = newStatus === "active" ? "上架" : "下架";
        setTogglePackageConfirm({ id: packageId, name: packageName, action, newStatus });
    };
    
    // 确认执行上/下架
    const handleConfirmToggleStatus = () => {
        if (togglePackageConfirm) {
            console.log(`套餐 ${togglePackageConfirm.id} ${togglePackageConfirm.action}成功`);
            // 更新本地数据状态
            setPackagesData(prev => prev.map(pkg => 
                pkg.id === togglePackageConfirm.id 
                    ? { ...pkg, status: togglePackageConfirm.newStatus as "active" | "inactive" }
                    : pkg
            ));
            setTogglePackageConfirm(null);
        }
    };
    
    // 取消上/下架操作
    const handleCancelToggleStatus = () => {
        setTogglePackageConfirm(null);
    };
    
    // 创建套餐
    const handleCreatePackage = (shouldPublish: boolean = false) => {
        if (editingPackage) {
            // 编辑模式：更新套餐
            console.log("编辑套餐:", { id: editingPackage.id, ...newPackage });
            setPackagesData(prev => prev.map(pkg => 
                pkg.id === editingPackage.id 
                    ? { 
                        ...pkg, 
                        name: newPackage.name,
                        identifier: newPackage.identifier,
                        product: newPackage.product,
                        description: newPackage.description,
                        type: newPackage.type,
                        price: newPackage.price,
                        costPrice: newPackage.costPrice,
                        priceHint: newPackage.priceHint,
                        hourLimit5: newPackage.hourLimit5,
                        weekLimit: newPackage.weekLimit,
                        monthLimit: newPackage.monthLimit,
                        capabilityDesc: newPackage.capabilityDesc,
                        lobsterCount: newPackage.lobsterCount,
                        memberCount: newPackage.memberCount,
                        availableModels: newPackage.availableModels,
                        purchaseLimit: newPackage.purchaseLimit,
                        stock: newPackage.stock,
                        officialDiscount: newPackage.officialDiscount,
                        internalDiscount: newPackage.internalDiscount,
                        svipDiscount: newPackage.svipDiscount,
                        vipDiscount: newPackage.vipDiscount,
                    }
                    : pkg
            ));
        } else {
            // 创建模式：生成新套餐并添加到列表
            const now = new Date();
            const createTime = now.toLocaleString('zh-CN', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).replace(/\//g, '-');
            
            const newPkg: Package = {
                id: Date.now(), // 使用时间戳作为唯一ID
                name: newPackage.name,
                identifier: newPackage.identifier,
                product: newPackage.product,
                description: newPackage.description,
                type: newPackage.type,
                price: newPackage.price,
                costPrice: newPackage.costPrice,
                priceHint: newPackage.priceHint,
                hourLimit5: newPackage.hourLimit5,
                weekLimit: newPackage.weekLimit,
                monthLimit: newPackage.monthLimit,
                capabilityDesc: newPackage.capabilityDesc,
                lobsterCount: newPackage.lobsterCount,
                memberCount: newPackage.memberCount,
                availableModels: newPackage.availableModels,
                purchaseLimit: newPackage.purchaseLimit,
                stock: newPackage.stock,
                officialDiscount: newPackage.officialDiscount,
                internalDiscount: newPackage.internalDiscount,
                svipDiscount: newPackage.svipDiscount,
                vipDiscount: newPackage.vipDiscount,
                soldCount: 0,
                totalIncome: 0,
                status: shouldPublish ? "active" : "inactive", // 根据参数设置状态
                createTime: createTime,
                onSaleTime: shouldPublish ? createTime : "", // 上架时才有上架时间
                features: [
                    `${newPackage.lobsterCount}个龙虾`,
                    newPackage.availableModels.length > 0 ? '全部模型支持' : '基础模型支持',
                ],
            };
            
            console.log(`创建套餐${shouldPublish ? '并上架' : ''}:`, newPkg);
            setPackagesData(prev => [newPkg, ...prev]); // 添加到列表开头
        }
        handleClosePackageDialog();
    };
    
    // 编辑套餐
    const handleEditPackage = (pkg: Package) => {
        setEditingPackage(pkg);
        setNewPackage({
            name: pkg.name,
            identifier: pkg.identifier || "",
            product: pkg.product || "ai-plan",
            description: pkg.description,
            type: pkg.type,
            price: pkg.price,
            costPrice: pkg.costPrice || 0,
            priceHint: pkg.priceHint || "",
            hourLimit5: pkg.hourLimit5 ?? null,
            weekLimit: pkg.weekLimit ?? null,
            monthLimit: pkg.monthLimit ?? null,
            capabilityDesc: pkg.capabilityDesc || "",
            lobsterCount: pkg.lobsterCount,
            memberCount: pkg.memberCount,
            availableModels: pkg.availableModels || [],
            purchaseLimit: pkg.purchaseLimit,
            stock: pkg.stock,
            officialDiscount: pkg.officialDiscount,
            internalDiscount: pkg.internalDiscount,
            svipDiscount: pkg.svipDiscount,
            vipDiscount: pkg.vipDiscount,
        });
        setCreatePackageDialogOpen(true);
    };
    
    // 关闭套餐弹窗
    const handleClosePackageDialog = () => {
        setCreatePackageDialogOpen(false);
        setEditingPackage(null);
        setNewPackage({
            name: "",
            identifier: "",
            product: "ai-plan",
            description: "",
            type: "monthly",
            price: 0,
            costPrice: 0,
            priceHint: "",
            hourLimit5: null,
            weekLimit: null,
            monthLimit: null,
            capabilityDesc: "",
            lobsterCount: 1,
            memberCount: 10,
            availableModels: ALL_MODELS.map(m => m.id), // 默认选中所有模型
            purchaseLimit: null,
            stock: null,
            officialDiscount: 10,
            internalDiscount: 10,
            svipDiscount: 10,
            vipDiscount: 10,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* 顶部导航栏 */}
            <header className="h-14 bg-[#006bff] flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
                {/* Logo */}
                <div className="flex items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                            <span className="text-[#006bff] font-bold text-sm">智</span>
                        </div>
                        <span className="text-white text-lg font-semibold">智汇云</span>
                    </div>
                </div>

                {/* 右侧操作区 */}
                <div className="flex items-center gap-6">
                    {/* 消息 */}
                    <button className="text-white text-sm hover:text-blue-200 transition-colors">
                        消息(572)
                    </button>

                    {/* 用户信息 */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">L</span>
                        </div>
                        <span className="text-white text-sm">lujingbao</span>
                        <button className="text-white text-sm hover:text-blue-200 transition-colors">
                            退出
                        </button>
                    </div>
                </div>
            </header>

            {/* 左侧导航栏 */}
            <aside className="fixed top-14 left-0 w-56 h-[calc(100vh-56px)] bg-[#1e293b] overflow-y-auto">
                {/* 标题 */}
                <div className="h-12 flex items-center px-4 border-b border-gray-700">
                    <span className="text-white font-medium">管理后台</span>
                </div>

                {/* 菜单 */}
                <nav className="py-2">
                    {/* 一级菜单：产品管理 */}
                    <div>
                        <div
                            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                                ['product-define', 'product-addon', 'product-billing', 'product-package'].includes(currentMenu) 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-white hover:bg-gray-700'
                            }`}
                            onClick={() => {
                                setProductMenuExpanded(!productMenuExpanded);
                                if (!productMenuExpanded) {
                                    setCurrentMenu('product-define');
                                }
                            }}
                        >
                            <span className="text-sm">产品管理</span>
                            <svg className={`w-4 h-4 transition-transform ${productMenuExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        {/* 二级菜单 */}
                        {productMenuExpanded && (
                            <div className="bg-gray-800">
                                <div 
                                    onClick={() => setCurrentMenu('product-define')}
                                    className={`px-6 py-2.5 cursor-pointer transition-colors text-sm ${
                                        currentMenu === 'product-define' 
                                            ? 'text-blue-400 bg-gray-700' 
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    产品定义
                                </div>
                                <div 
                                    onClick={() => setCurrentMenu('product-addon')}
                                    className={`px-6 py-2.5 cursor-pointer transition-colors text-sm ${
                                        currentMenu === 'product-addon' 
                                            ? 'text-blue-400 bg-gray-700' 
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    产品计费项
                                </div>
                                <div 
                                    onClick={() => setCurrentMenu('product-billing')}
                                    className={`px-6 py-2.5 cursor-pointer transition-colors text-sm ${
                                        currentMenu === 'product-billing' 
                                            ? 'text-blue-400 bg-gray-700' 
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    产品计费策略
                                </div>
                                <div 
                                    onClick={() => setCurrentMenu('product-package')}
                                    className={`px-6 py-2.5 cursor-pointer transition-colors text-sm ${
                                        currentMenu === 'product-package' 
                                            ? 'text-blue-400 bg-gray-700' 
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    产品套餐
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* 一级菜单：账单管理 */}
                    <div>
                        <div
                            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                                ['zhiqi-bill-overview', 'zhiqi-bill-customer', 'zhiqi-bill-product', 'zhiqi-bill-intranet'].includes(currentMenu) 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-white hover:bg-gray-700'
                            }`}
                            onClick={() => {
                                setZhiqiBillMenuExpanded(!zhiqiBillMenuExpanded);
                                if (!zhiqiBillMenuExpanded) {
                                    setCurrentMenu('zhiqi-bill-overview');
                                }
                            }}
                        >
                            <span className="text-sm">账单管理</span>
                            <svg className={`w-4 h-4 transition-transform ${zhiqiBillMenuExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        {/* 二级菜单 */}
                        {zhiqiBillMenuExpanded && (
                            <div className="bg-gray-800">
                                <div 
                                    onClick={() => setCurrentMenu('zhiqi-bill-overview')}
                                    className={`px-6 py-2.5 cursor-pointer transition-colors text-sm ${
                                        currentMenu === 'zhiqi-bill-overview' 
                                            ? 'text-blue-400 bg-gray-700' 
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    账单概览
                                </div>
                                <div 
                                    onClick={() => setCurrentMenu('zhiqi-bill-customer')}
                                    className={`px-6 py-2.5 cursor-pointer transition-colors text-sm ${
                                        currentMenu === 'zhiqi-bill-customer' 
                                            ? 'text-blue-400 bg-gray-700' 
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    客户账单
                                </div>
                                <div 
                                    onClick={() => setCurrentMenu('zhiqi-bill-product')}
                                    className={`px-6 py-2.5 cursor-pointer transition-colors text-sm ${
                                        currentMenu === 'zhiqi-bill-product' 
                                            ? 'text-blue-400 bg-gray-700' 
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    产品账单
                                </div>
                                <div 
                                    onClick={() => setCurrentMenu('zhiqi-bill-intranet')}
                                    className={`px-6 py-2.5 cursor-pointer transition-colors text-sm ${
                                        currentMenu === 'zhiqi-bill-intranet' 
                                            ? 'text-blue-400 bg-gray-700' 
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    内网账单
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* 一级菜单：平台配置 */}
                    <div
                        onClick={() => setCurrentMenu('platform-config')}
                        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                            currentMenu === 'platform-config' 
                                ? 'bg-blue-600 text-white' 
                                : 'text-white hover:bg-gray-700'
                        }`}
                    >
                        <span className="text-sm">平台配置</span>
                    </div>
                    
                    {/* 一级菜单：管理后台 */}
                    <div>
                        <div
                            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                                currentMenu === 'zhiqi-admin' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-white hover:bg-gray-700'
                            }`}
                            onClick={() => {
                                setAdminMenuExpanded(!adminMenuExpanded);
                                if (!adminMenuExpanded) {
                                    setCurrentMenu('zhiqi-admin');
                                }
                            }}
                        >
                            <span className="text-sm">管理后台</span>
                            <svg className={`w-4 h-4 transition-transform ${adminMenuExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        {/* 二级菜单：智企管理后台 */}
                        {adminMenuExpanded && (
                            <div className="bg-gray-800">
                                <div
                                    onClick={() => setCurrentMenu('zhiqi-admin')}
                                    className={`px-6 py-2.5 cursor-pointer transition-colors text-sm ${
                                        currentMenu === 'zhiqi-admin' 
                                            ? 'text-blue-400 bg-gray-700' 
                                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                    }`}
                                >
                                    智企管理后台
                                </div>
                            </div>
                        )}
                    </div>
                </nav>

                {/* 底部智能助手按钮 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <button className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-white font-bold text-sm hover:bg-[#333] transition-colors shadow-lg cursor-pointer">
                        N
                    </button>
                </div>
            </aside>

            {/* 主内容区 */}
            <main className="pt-14 pl-56">
                <div className="min-h-[calc(100vh-56px)] flex">
                    {/* 产品定义页面 */}
                    {currentMenu === 'product-define' && (
                        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
                            {/* 产品Tab切换 */}
                            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
                                <button
                                    onClick={() => setProductTab("zhihui")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        productTab === "zhihui"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    智汇云产品
                                    {productTab === "zhihui" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setProductTab("zhiqi")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        productTab === "zhiqi"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    智企产品
                                    {productTab === "zhiqi" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                            </div>
                            
                            {/* 搜索筛选区域 */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* 搜索框 */}
                                    <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="支持产品名称、产品标识搜索"
                                            value={productSearchKeyword}
                                            onChange={(e) => setProductSearchKeyword(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    {/* 产品分类筛选 */}
                                    <select
                                        value={productCategoryFilter}
                                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                                        className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    >
                                        {productCategories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                    
                                    {/* 上线状态筛选 */}
                                    <select
                                        value={productStatusFilter}
                                        onChange={(e) => setProductStatusFilter(e.target.value)}
                                        className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    >
                                        {productStatuses.map(status => (
                                            <option key={status.value} value={status.value}>{status.label}</option>
                                        ))}
                                    </select>
                                    
                                    {/* 右侧按钮 */}
                                    <div className="flex items-center gap-2 ml-auto">
                                        <button className="text-sm text-blue-600 hover:text-blue-700">
                                            导出数据
                                        </button>
                                        <button 
                                            onClick={() => setCreateProductDialogOpen(true)}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            创建产品
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* 产品卡片网格 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {(productTab === "zhihui" ? zhihuiProductsData : zhiqiProductsData)
                                    .filter(product => {
                                        const matchSearch = product.name.toLowerCase().includes(productSearchKeyword.toLowerCase()) ||
                                            product.identifier.toLowerCase().includes(productSearchKeyword.toLowerCase());
                                        const matchCategory = productCategoryFilter === 'all' || product.category.startsWith(productCategoryFilter);
                                        const matchStatus = productStatusFilter === 'all' || product.status === productStatusFilter;
                                        return matchSearch && matchCategory && matchStatus;
                                    })
                                    .map(product => (
                                    <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-3 relative hover:shadow-md transition-shadow">
                                        {/* 状态标签 */}
                                        <div className={`absolute top-3 right-3 px-1.5 py-0.5 text-xs rounded ${
                                            product.status === 'online' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {product.status === 'online' ? '已上线' : '已下线'}
                                        </div>
                                        
                                        {/* 产品图标 */}
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                            </svg>
                                        </div>
                                        
                                        {/* 产品信息 */}
                                        <h3 className="text-sm font-semibold text-gray-900 mb-1.5 truncate pr-16">{product.name}</h3>
                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div className="flex">
                                                <span className="w-14 text-gray-400 flex-shrink-0">分类</span>
                                                <span className="truncate">{product.category}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-14 text-gray-400 flex-shrink-0">标识</span>
                                                <span className="font-mono truncate">{product.identifier}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-14 text-gray-400 flex-shrink-0">可见</span>
                                                <span className="truncate">{product.visibility}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-14 text-gray-400 flex-shrink-0">时间</span>
                                                <span className="truncate">{product.onlineTime}</span>
                                            </div>
                                        </div>
                                        
                                        {/* 操作按钮 */}
                                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                            <button className={`px-3 py-1 text-xs rounded transition-colors ${
                                                product.status === 'online'
                                                    ? 'border border-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}>
                                                {product.status === 'online' ? '下线' : '上线'}
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* 产品计费项页面 */}
                    {currentMenu === 'product-addon' && (
                        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
                            {/* 产品Tab切换 */}
                            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
                                <button
                                    onClick={() => setBillingProductTab("zhihui")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        billingProductTab === "zhihui"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    智汇云产品
                                    {billingProductTab === "zhihui" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setBillingProductTab("zhiqi")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        billingProductTab === "zhiqi"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    智企产品
                                    {billingProductTab === "zhiqi" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                            </div>
                            
                            {/* 搜索筛选区域 */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                                <div className="flex flex-wrap items-center gap-4">
                                    {/* 计费项名称搜索 */}
                                    <div className="relative w-64">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="计费项名称搜索"
                                            value={billingItemSearch}
                                            onChange={(e) => setBillingItemSearch(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    {/* 所属产品筛选 */}
                                    <select
                                        value={billingProductFilter}
                                        onChange={(e) => setBillingProductFilter(e.target.value)}
                                        className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">所属产品</option>
                                        {billingProductTab === "zhihui" ? (
                                            <>
                                                <option value="apimarket">API市场 APIMKT</option>
                                                <option value="oss">对象存储 OSS</option>
                                                <option value="mysql">云数据库 MySQL</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="smart-cs">智能客服</option>
                                                <option value="enterprise-mail">企业邮箱</option>
                                                <option value="online-doc">在线文档</option>
                                                <option value="project-mgmt">项目管理</option>
                                            </>
                                        )}
                                    </select>
                                    
                                    {/* 创建日期筛选 */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="date"
                                            value={billingStartDate}
                                            onChange={(e) => setBillingStartDate(e.target.value)}
                                            className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                        <span className="text-gray-500 text-sm">至</span>
                                        <input
                                            type="date"
                                            value={billingEndDate}
                                            onChange={(e) => setBillingEndDate(e.target.value)}
                                            className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    {/* 新建按钮 */}
                                    <button className="ml-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        新建计量项
                                    </button>
                                </div>
                            </div>
                            
                            {/* 计费项表格 */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-12">序号</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">计费项名称</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">标签名称</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">计费项标识</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">所属产品</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">计费单位</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">用量计费规则</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">创建时间</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">备注</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(billingProductTab === "zhihui" ? billingItemsData : zhiqiBillingItemsData)
                                            .filter(item => {
                                                const matchSearch = billingItemSearch === "" || item.name.toLowerCase().includes(billingItemSearch.toLowerCase());
                                                const matchProduct = billingProductFilter === "" || item.product.toLowerCase().includes(billingProductFilter.toLowerCase());
                                                return matchSearch && matchProduct;
                                            })
                                            .map((item, index) => (
                                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm text-gray-500">{(billingCurrentPage - 1) * billingPageSize + index + 1}</td>
                                                <td className="py-3 px-4 text-sm text-gray-900 font-medium">{item.name}</td>
                                                <td className="py-3 px-4 text-sm text-gray-500">{item.tagName}</td>
                                                <td className="py-3 px-4 text-sm text-gray-500 font-mono text-xs">{item.identifier}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{item.product}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{item.unit}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{item.rule}</td>
                                                <td className="py-3 px-4 text-sm text-gray-500">{item.createTime}</td>
                                                <td className="py-3 px-4 text-sm text-gray-400">{item.remark || '-'}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <button className="text-blue-600 hover:text-blue-700 text-sm">编辑</button>
                                                        <button className="text-blue-600 hover:text-blue-700 text-sm">删除</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                {/* 分页 */}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                                    <div className="text-sm text-gray-500">
                                        共 {billingTotalCount} 条
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={billingPageSize}
                                            onChange={(e) => {
                                                setBillingPageSize(Number(e.target.value));
                                                setBillingCurrentPage(1);
                                            }}
                                            className="h-8 px-2 text-sm border border-gray-300 rounded"
                                        >
                                            <option value={10}>10条/页</option>
                                            <option value={20}>20条/页</option>
                                            <option value={50}>50条/页</option>
                                        </select>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => setBillingCurrentPage(Math.max(1, billingCurrentPage - 1))}
                                                disabled={billingCurrentPage === 1}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                &lt;
                                            </button>
                                            {[1, 2, 3, 4, 5, 6].map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setBillingCurrentPage(page)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                                                        billingCurrentPage === page
                                                            ? 'bg-blue-600 text-white'
                                                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <span className="text-gray-400">...</span>
                                            <button
                                                onClick={() => setBillingCurrentPage(216)}
                                                className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                                                    billingCurrentPage === 216
                                                        ? 'bg-blue-600 text-white'
                                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                216
                                            </button>
                                            <button 
                                                onClick={() => setBillingCurrentPage(Math.min(216, billingCurrentPage + 1))}
                                                disabled={billingCurrentPage === 216}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                &gt;
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <span>前往</span>
                                            <input
                                                type="number"
                                                min={1}
                                                max={216}
                                                value={billingCurrentPage}
                                                onChange={(e) => setBillingCurrentPage(Math.min(216, Math.max(1, Number(e.target.value))))}
                                                className="w-12 h-8 text-center border border-gray-300 rounded"
                                            />
                                            <span>页</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* 产品套餐页面 */}
                    {currentMenu === 'product-package' && (
                        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
                            {/* 产品Tab切换 */}
                            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
                                <button
                                    onClick={() => setResourcePackageProductTab("zhihui")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        resourcePackageProductTab === "zhihui"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    智汇云产品
                                    {resourcePackageProductTab === "zhihui" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setResourcePackageProductTab("zhiqi")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        resourcePackageProductTab === "zhiqi"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    智企产品
                                    {resourcePackageProductTab === "zhiqi" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                            </div>
                            
                            {/* 二级Tab切换 */}
                            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
                                <button
                                    onClick={() => setResourcePackageTab("packages")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        resourcePackageTab === "packages"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    产品套餐
                                    {resourcePackageTab === "packages" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setResourcePackageTab("tasks")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        resourcePackageTab === "tasks"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    套餐发放任务
                                    {resourcePackageTab === "tasks" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                            </div>
                            
                            {/* 产品套餐 Tab 内容 */}
                            {resourcePackageTab === "packages" && (
                                <>
                                    {/* 搜索筛选区域 */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                                        <div className="flex flex-wrap items-center gap-4">
                                            {/* 套餐名称搜索 */}
                                            <div className="relative w-64">
                                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                <input
                                                    type="text"
                                                    placeholder="套餐名称搜索"
                                                    value={resourcePackageSearch}
                                                    onChange={(e) => setResourcePackageSearch(e.target.value)}
                                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            
                                            {/* 所属产品筛选 */}
                                            <select
                                                value={resourcePackageProductFilter}
                                                onChange={(e) => setResourcePackageProductFilter(e.target.value)}
                                                className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">所属产品</option>
                                                <option value="tai">AI开发平台TAI</option>
                                                <option value="ces_sign">测试产品22</option>
                                                <option value="test_x">test</option>
                                            </select>
                                            
                                            {/* 类型筛选 */}
                                            <select
                                                value={resourcePackageTypeFilter}
                                                onChange={(e) => setResourcePackageTypeFilter(e.target.value)}
                                                className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">全部类型</option>
                                                <option value="总价包">总价包</option>
                                                <option value="总量节省">总量节省</option>
                                                <option value="总价节省">总价节省</option>
                                            </select>
                                            
                                            {/* 状态筛选 */}
                                            <select
                                                value={resourcePackageStatusFilter}
                                                onChange={(e) => setResourcePackageStatusFilter(e.target.value)}
                                                className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">全部状态</option>
                                                <option value="online">已上架</option>
                                                <option value="offline">已下架</option>
                                            </select>
                                            
                                            {/* 创建日期筛选 */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="date"
                                                    value={resourcePackageStartDate}
                                                    onChange={(e) => setResourcePackageStartDate(e.target.value)}
                                                    className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                                <span className="text-gray-500 text-sm">至</span>
                                                <input
                                                    type="date"
                                                    value={resourcePackageEndDate}
                                                    onChange={(e) => setResourcePackageEndDate(e.target.value)}
                                                    className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            
                                            {/* 新建按钮 */}
                                            <button className="ml-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                新建套餐
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* 套餐表格 */}
                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-12">序号</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">套餐名称</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">套餐标识</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">所属产品</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">套餐类型</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">创建时间</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">更新时间</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">状态</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(resourcePackageProductTab === "zhihui" ? resourcePackagesData : zhiqiResourcePackagesData)
                                                    .filter(item => {
                                                        const matchSearch = resourcePackageSearch === "" || item.name.toLowerCase().includes(resourcePackageSearch.toLowerCase());
                                                        const matchProduct = resourcePackageProductFilter === "" || item.product.toLowerCase().includes(resourcePackageProductFilter.toLowerCase());
                                                        const matchType = resourcePackageTypeFilter === "" || item.type === resourcePackageTypeFilter;
                                                        const matchStatus = resourcePackageStatusFilter === "" || item.status === resourcePackageStatusFilter;
                                                        return matchSearch && matchProduct && matchType && matchStatus;
                                                    })
                                                    .map((item, index) => (
                                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="py-3 px-4 text-sm text-gray-500">{(resourcePackageCurrentPage - 1) * resourcePackagePageSize + index + 1}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{item.name}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-500 font-mono">{item.identifier}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">{item.product}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">{item.type}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-500">{item.createTime}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-500">{item.updateTime}</td>
                                                        <td className="py-3 px-4">
                                                            <span className={`inline-block px-2 py-1 text-xs rounded ${
                                                                item.status === 'online' 
                                                                    ? 'bg-green-100 text-green-700' 
                                                                    : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                                {item.status === 'online' ? '已上架' : '已下架'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <button className="text-blue-600 hover:text-blue-700 text-sm">详情</button>
                                                                <button className="text-blue-600 hover:text-blue-700 text-sm">管理</button>
                                                                <button className="text-blue-600 hover:text-blue-700 text-sm">
                                                                    {item.status === 'online' ? '下架' : '上架'}
                                                                </button>
                                                                <button className="text-blue-600 hover:text-blue-700 text-sm">删除</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        
                                        {/* 分页 */}
                                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                                            <div className="text-sm text-gray-500">
                                                共 {resourcePackageTotalCount} 条
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={resourcePackagePageSize}
                                                    onChange={(e) => {
                                                        setResourcePackagePageSize(Number(e.target.value));
                                                        setResourcePackageCurrentPage(1);
                                                    }}
                                                    className="h-8 px-2 text-sm border border-gray-300 rounded"
                                                >
                                                    <option value={10}>10条/页</option>
                                                    <option value={20}>20条/页</option>
                                                    <option value={50}>50条/页</option>
                                                </select>
                                                <div className="flex items-center gap-1">
                                                    <button 
                                                        onClick={() => setResourcePackageCurrentPage(Math.max(1, resourcePackageCurrentPage - 1))}
                                                        disabled={resourcePackageCurrentPage === 1}
                                                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        &lt;
                                                    </button>
                                                    {[1, 2, 3, 4, 5, 6, 7].map(page => (
                                                        <button
                                                            key={page}
                                                            onClick={() => setResourcePackageCurrentPage(page)}
                                                            className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                                                                resourcePackageCurrentPage === page
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}
                                                    <button 
                                                        onClick={() => setResourcePackageCurrentPage(Math.min(7, resourcePackageCurrentPage + 1))}
                                                        disabled={resourcePackageCurrentPage === 7}
                                                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        &gt;
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <span>前往</span>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={7}
                                                        value={resourcePackageCurrentPage}
                                                        onChange={(e) => setResourcePackageCurrentPage(Math.min(7, Math.max(1, Number(e.target.value))))}
                                                        className="w-12 h-8 text-center border border-gray-300 rounded"
                                                    />
                                                    <span>页</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            {/* 套餐发放任务 Tab 内容 */}
                            {resourcePackageTab === "tasks" && (
                                <div className="bg-white rounded-lg border border-gray-200 p-12">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">套餐发放任务</h3>
                                        <p className="text-gray-500">功能开发中...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* 产品计费策略页面 */}
                    {currentMenu === 'product-billing' && (
                        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
                            {/* 产品Tab切换 */}
                            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
                                <button
                                    onClick={() => setBillingStrategyProductTab("zhihui")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        billingStrategyProductTab === "zhihui"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    智汇云产品
                                    {billingStrategyProductTab === "zhihui" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setBillingStrategyProductTab("zhiqi")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        billingStrategyProductTab === "zhiqi"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    智企产品
                                    {billingStrategyProductTab === "zhiqi" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                            </div>
                            
                            {/* 功能开发中提示 */}
                            <div className="bg-white rounded-lg border border-gray-200 p-12">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                                        {billingStrategyProductTab === "zhihui" ? "智汇云产品计费策略" : "智企产品计费策略"}
                                    </h3>
                                    <p className="text-gray-500">功能开发中...</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* 账单管理概览页面 */}
                    {currentMenu === 'zhiqi-bill-overview' && (
                        <div className="flex-1 bg-gray-50 overflow-auto flex flex-col">
                            {/* 页面顶部Tab */}
                            <div className="bg-white border-b border-gray-200">
                                <div className="flex items-center px-6">
                                    <button
                                        onClick={() => setBillOverviewTab("all")}
                                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                            billOverviewTab === "all"
                                                ? "text-blue-600 border-blue-600"
                                                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        全部账单
                                    </button>
                                    <button
                                        onClick={() => setBillOverviewTab("zhihui")}
                                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                            billOverviewTab === "zhihui"
                                                ? "text-blue-600 border-blue-600"
                                                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        智汇云账单
                                    </button>
                                    <button
                                        onClick={() => setBillOverviewTab("zhiqi")}
                                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                            billOverviewTab === "zhiqi"
                                                ? "text-blue-600 border-blue-600"
                                                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        智企账单
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-auto flex-1">
                            {/* 顶部操作栏 */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    {/* 账单类型选择 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="monthly">月账单</option>
                                        <option value="daily">日账单</option>
                                        <option value="hourly">小时账单</option>
                                    </select>
                                    {/* 时间范围 */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="month"
                                            defaultValue="2025-03"
                                            className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                        />
                                        <span className="text-gray-500">至</span>
                                        <input
                                            type="month"
                                            defaultValue="2026-03"
                                            className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                    导出数据
                                </button>
                            </div>

                            {/* 数据趋势图 */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                                <h3 className="text-base font-medium text-gray-900 mb-4">账单金额趋势</h3>
                                <div className="h-64 relative">
                                    {/* Y轴 */}
                                    <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500 text-right pr-2">
                                        <span>200,000,000</span>
                                        <span>150,000,000</span>
                                        <span>100,000,000</span>
                                        <span>50,000,000</span>
                                        <span>0</span>
                                    </div>
                                    {/* 图表区域 */}
                                    <div className="ml-16 h-56 border-l border-b border-gray-200 relative">
                                        {/* 网格线 */}
                                        <div className="absolute inset-0">
                                            <div className="border-b border-gray-100 absolute w-full" style={{top: '0%'}}></div>
                                            <div className="border-b border-gray-100 absolute w-full" style={{top: '25%'}}></div>
                                            <div className="border-b border-gray-100 absolute w-full" style={{top: '50%'}}></div>
                                            <div className="border-b border-gray-100 absolute w-full" style={{top: '75%'}}></div>
                                        </div>
                                        {/* 折线SVG */}
                                        <svg className="w-full h-full" viewBox="0 0 1000 224" preserveAspectRatio="none">
                                            <polyline
                                                fill="none"
                                                stroke="#22c55e"
                                                strokeWidth="2"
                                                points="0,80 77,70 154,75 231,65 308,10 385,180 462,200 539,30 616,40 693,45 770,50 847,90 924,100 1000,120"
                                            />
                                            {/* 数据点 */}
                                            <circle cx="0" cy="80" r="4" fill="#22c55e" />
                                            <circle cx="77" cy="70" r="4" fill="#22c55e" />
                                            <circle cx="154" cy="75" r="4" fill="#22c55e" />
                                            <circle cx="231" cy="65" r="4" fill="#22c55e" />
                                            <circle cx="308" cy="10" r="4" fill="#22c55e" />
                                            <circle cx="385" cy="180" r="4" fill="#22c55e" />
                                            <circle cx="462" cy="200" r="4" fill="#22c55e" />
                                            <circle cx="539" cy="30" r="4" fill="#22c55e" />
                                            <circle cx="616" cy="40" r="4" fill="#22c55e" />
                                            <circle cx="693" cy="45" r="4" fill="#22c55e" />
                                            <circle cx="770" cy="50" r="4" fill="#22c55e" />
                                            <circle cx="847" cy="90" r="4" fill="#22c55e" />
                                            <circle cx="924" cy="100" r="4" fill="#22c55e" />
                                            <circle cx="1000" cy="120" r="4" fill="#22c55e" />
                                        </svg>
                                    </div>
                                    {/* X轴标签 */}
                                    <div className="ml-16 flex justify-between text-xs text-gray-500 mt-2">
                                        <span>202503</span>
                                        <span>202504</span>
                                        <span>202505</span>
                                        <span>202506</span>
                                        <span>202507</span>
                                        <span>202508</span>
                                        <span>202509</span>
                                        <span>202510</span>
                                        <span>202511</span>
                                        <span>202512</span>
                                        <span>202601</span>
                                        <span>202602</span>
                                        <span>202603</span>
                                    </div>
                                </div>
                            </div>

                            {/* 账单数据表格 */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left">
                                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">账期年月</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">官方标准价金额（¥）</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">客户应付总金额（¥）/环比上月</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">客户欠费总金额（¥）</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">156,687,940.34</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="font-mono">84,778,920.62</span>
                                                <span className="ml-2 text-green-600">↓ 38.24%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(137,276,172.08)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">0.00</td>
                                            <td className="px-4 py-3">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户详情</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">产品详情</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202602</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">214,379,216.74</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="font-mono">137,276,172.08</span>
                                                <span className="ml-2 text-green-600">↓ 9.59%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(151,830,471.09)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">0.00</td>
                                            <td className="px-4 py-3">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户详情</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">产品详情</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202601</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">243,348,034.43</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="font-mono">151,830,471.09</span>
                                                <span className="ml-2 text-red-600">↑ 2.43%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(148,232,492.88)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">0.00</td>
                                            <td className="px-4 py-3">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户详情</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">产品详情</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202512</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">61,917,499.57</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="font-mono">148,232,492.88</span>
                                                <span className="ml-2 text-red-600">↑ 272.54%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(39,790,170.97)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">0.00</td>
                                            <td className="px-4 py-3">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户详情</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">产品详情</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202511</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">12,627,664.65</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="font-mono">39,790,170.97</span>
                                                <span className="ml-2 text-green-600">↓ 70.25%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(133,751,437.28)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">0.00</td>
                                            <td className="px-4 py-3">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户详情</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">产品详情</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202510</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">1,642,237.38</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="font-mono">133,751,437.28</span>
                                                <span className="ml-2 text-green-600">↓ 2.29%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(136,886,628.73)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">0.00</td>
                                            <td className="px-4 py-3">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户详情</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">产品详情</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3"><input type="checkbox" className="w-4 h-4 rounded border-gray-300" /></td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202509</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">2,004,984.43</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="font-mono">136,886,628.73</span>
                                                <span className="ml-2 text-green-600">↓ 32.59%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(203,071,610.82)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 font-mono">0.00</td>
                                            <td className="px-4 py-3">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户详情</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">产品详情</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                    )}
                    
                    {/* 智企客户账单页面 */}
                    {currentMenu === 'zhiqi-bill-customer' && (
                        <div className="flex-1 bg-gray-50 overflow-auto flex flex-col">
                            {/* 页面顶部Tab */}
                            <div className="bg-white border-b border-gray-200">
                                <div className="flex items-center px-6">
                                    <button
                                        onClick={() => setBillCustomerTab("all")}
                                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                            billCustomerTab === "all"
                                                ? "text-blue-600 border-blue-600"
                                                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        全部客户
                                    </button>
                                    <button
                                        onClick={() => setBillCustomerTab("zhihui")}
                                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                            billCustomerTab === "zhihui"
                                                ? "text-blue-600 border-blue-600"
                                                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        智汇云客户
                                    </button>
                                    <button
                                        onClick={() => setBillCustomerTab("zhiqi")}
                                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                            billCustomerTab === "zhiqi"
                                                ? "text-blue-600 border-blue-600"
                                                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        智企客户
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-auto flex-1">
                            {/* 顶部筛选栏 */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    {/* 账单类型选择 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="monthly">月账单</option>
                                        <option value="daily">日账单</option>
                                        <option value="hourly">小时账单</option>
                                    </select>
                                    {/* 账期选择 */}
                                    <input
                                        type="month"
                                        defaultValue="2026-03"
                                        className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    {/* 所属产品 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="">所属产品</option>
                                        <option value="llm">大模型</option>
                                        <option value="lobster">龙虾</option>
                                        <option value="apicloud">APICloud</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 text-blue-600 border border-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-colors">
                                        导出详情
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                        导出数据
                                    </button>
                                </div>
                            </div>

                            {/* 客户账单表格 */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">租户名称</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">租户标识</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">账期年月</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">官方标准价金额（¥）</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">客户应付总金额（¥）/环比上月</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">客户欠费总金额（¥）</th>
                                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">腾讯科技</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">tencent_tech</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">28,456,230.15</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">18,234,567.89</span>
                                                <span className="ml-2 text-green-600">↓ 5.32%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(19,258,432.10)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">阿里巴巴</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">alibaba_group</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">22,189,456.78</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">15,678,234.56</span>
                                                <span className="ml-2 text-red-600">↑ 8.45%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(14,455,678.90)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">字节跳动</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">bytedance</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">18,567,890.23</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">12,345,678.90</span>
                                                <span className="ml-2 text-green-600">↓ 12.56%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(14,123,456.78)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">华为技术</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">huawei_tech</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">15,890,123.45</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">9,876,543.21</span>
                                                <span className="ml-2 text-red-600">↑ 3.28%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(9,562,345.67)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">百度在线</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">baidu_online</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">12,345,678.90</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">7,654,321.09</span>
                                                <span className="ml-2 text-green-600">↓ 2.15%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(7,822,456.78)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">京东集团</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">jd_group</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">9,876,543.21</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">5,432,109.87</span>
                                                <span className="ml-2 text-red-600">↑ 15.67%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(4,695,876.54)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">美团点评</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">meituan</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">7,654,321.09</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">4,321,098.76</span>
                                                <span className="ml-2 text-green-600">↓ 8.92%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(4,743,210.98)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">小米科技</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">xiaomi_tech</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">5,432,109.87</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">3,210,987.65</span>
                                                <span className="ml-2 text-red-600">↑ 6.34%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(3,019,234.56)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">网易公司</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">netease</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">4,321,098.76</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">2,567,890.12</span>
                                                <span className="ml-2 text-green-600">↓ 4.21%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(2,680,765.43)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">滴滴出行</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">didi_chuxing</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">3,210,987.65</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">1,987,654.32</span>
                                                <span className="ml-2 text-red-600">↑ 2.89%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(1,931,876.54)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 分页 */}
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white mt-4 rounded-b-lg">
                                <div className="text-sm text-gray-500">
                                    共 <span className="font-medium">36</span> 条
                                </div>
                                <div className="flex items-center gap-2">
                                    <select className="h-8 px-2 border border-gray-300 rounded text-sm">
                                        <option value="10">10条/页</option>
                                        <option value="20">20条/页</option>
                                        <option value="50">50条/页</option>
                                    </select>
                                    <div className="flex items-center gap-1">
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">‹</button>
                                        <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded text-sm">1</button>
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">3</button>
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">4</button>
                                        <span className="px-2 text-gray-400">...</span>
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">›</button>
                                    </div>
                                    <div className="flex items-center gap-1 ml-2">
                                        <span className="text-sm text-gray-600">前往</span>
                                        <input type="number" className="w-12 h-8 px-2 border border-gray-300 rounded text-sm text-center" defaultValue="1" />
                                        <span className="text-sm text-gray-600">页</span>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    )}
                    
                    {/* 智企产品账单页面 */}
                    {currentMenu === 'zhiqi-bill-product' && (
                        <div className="flex-1 bg-gray-50 overflow-auto flex flex-col">
                            {/* 页面顶部Tab */}
                            <div className="bg-white border-b border-gray-200">
                                <div className="flex items-center px-6">
                                    <button
                                        onClick={() => setBillProductTab("zhihui")}
                                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                            billProductTab === "zhihui"
                                                ? "text-blue-600 border-blue-600"
                                                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        智汇云产品
                                    </button>
                                    <button
                                        onClick={() => setBillProductTab("zhiqi")}
                                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                            billProductTab === "zhiqi"
                                                ? "text-blue-600 border-blue-600"
                                                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        智企产品
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-auto flex-1">
                            {/* 顶部筛选栏 */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    {/* 账单类型选择 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="monthly">月账单</option>
                                        <option value="daily">日账单</option>
                                        <option value="hourly">小时账单</option>
                                    </select>
                                    {/* 账期选择 */}
                                    <input
                                        type="month"
                                        defaultValue="2026-03"
                                        className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    {/* 所属产品 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="">所属产品</option>
                                        <option value="llm">大模型</option>
                                        <option value="lobster">龙虾</option>
                                        <option value="apicloud">APICloud</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 text-blue-600 border border-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-colors">
                                        导出详情
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                        导出数据
                                    </button>
                                </div>
                            </div>

                            {/* 产品账单表格 */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">产品名称</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">产品标识</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">账期年月</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">官方标准价金额（¥）</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">客户应付总金额（¥）/环比上月</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">客户欠费总金额（¥）</th>
                                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">大模型</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">llm</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">45,678,234.56</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">28,456,123.78</span>
                                                <span className="ml-2 text-green-600">↓ 8.32%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(31,042,567.89)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">龙虾</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">lobster</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">32,189,567.89</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">19,234,567.45</span>
                                                <span className="ml-2 text-red-600">↑ 12.56%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(17,089,234.56)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">APICloud</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">apicloud</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">18,456,789.23</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">11,567,890.34</span>
                                                <span className="ml-2 text-green-600">↓ 5.67%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(12,263,456.78)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">大模型</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">llm</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202602</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">52,345,678.90</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">31,042,567.89</span>
                                                <span className="ml-2 text-red-600">↑ 6.78%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(29,075,234.56)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono">0.00</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">龙虾</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">lobster</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202602</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">28,567,890.12</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">17,089,234.56</span>
                                                <span className="ml-2 text-green-600">↓ 3.45%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(17,698,567.89)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono">0.00</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">APICloud</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">apicloud</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202602</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">21,234,567.89</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">12,263,456.78</span>
                                                <span className="ml-2 text-red-600">↑ 9.23%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(11,228,567.90)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono">0.00</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">大模型</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">llm</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202601</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">48,901,234.56</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">29,075,234.56</span>
                                                <span className="ml-2 text-green-600">↓ 2.15%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(29,714,567.89)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono">0.00</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">龙虾</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">lobster</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202601</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">26,789,012.34</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">17,698,567.89</span>
                                                <span className="ml-2 text-red-600">↑ 4.56%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(16,926,234.56)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono">0.00</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">APICloud</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">apicloud</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202601</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">19,567,890.12</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">11,228,567.90</span>
                                                <span className="ml-2 text-green-600">↓ 1.89%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(11,445,234.56)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono">0.00</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">大模型</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">llm</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202512</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">50,123,456.78</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">29,714,567.89</span>
                                                <span className="ml-2 text-red-600">↑ 15.34%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(25,761,234.56)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono">0.00</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 分页 */}
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white mt-4 rounded-b-lg">
                                <div className="text-sm text-gray-500">
                                    共 <span className="font-medium">9</span> 条
                                </div>
                                <div className="flex items-center gap-2">
                                    <select className="h-8 px-2 border border-gray-300 rounded text-sm">
                                        <option value="10">10条/页</option>
                                        <option value="20">20条/页</option>
                                        <option value="50">50条/页</option>
                                    </select>
                                    <div className="flex items-center gap-1">
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">‹</button>
                                        <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded text-sm">1</button>
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">›</button>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    )}

                    {/* 智企内网账单页面 */}
                    {currentMenu === 'zhiqi-bill-intranet' && (
                        <div className="flex-1 bg-white overflow-auto flex flex-col">
                            {/* 页面顶部Tab */}
                            <div className="bg-white border-b border-gray-200">
                                <div className="flex items-center px-6">
                                    <button
                                        onClick={() => setIntranetBillTab("zhihui")}
                                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                            intranetBillTab === "zhihui"
                                                ? "text-blue-600 border-blue-600"
                                                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        智汇云
                                    </button>
                                    <button
                                        onClick={() => setIntranetBillTab("zhiqi")}
                                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                            intranetBillTab === "zhiqi"
                                                ? "text-blue-600 border-blue-600"
                                                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        智企
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-auto flex-1">
                            {/* 二级Tab：部门账单/产品账单 */}
                            <div className="flex items-center gap-6 mb-4 border-b border-gray-200">
                                <button
                                    onClick={() => setIntranetBillTypeTab("department")}
                                    className={`px-1 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                                        intranetBillTypeTab === "department"
                                            ? "text-blue-600 border-blue-600"
                                            : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    部门账单
                                </button>
                                <button
                                    onClick={() => setIntranetBillTypeTab("product")}
                                    className={`px-1 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                                        intranetBillTypeTab === "product"
                                            ? "text-blue-600 border-blue-600"
                                            : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    产品账单
                                </button>
                            </div>

                            {/* 顶部筛选栏 */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    {/* 账单类型选择 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="monthly">月账单</option>
                                        <option value="daily">日账单</option>
                                        <option value="hourly">小时账单</option>
                                    </select>
                                    {/* 账期选择 */}
                                    <input
                                        type="month"
                                        defaultValue="2026-03"
                                        className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    {/* 部门选择 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-500">
                                        <option value="">请选择部门</option>
                                        <option value="dev">智汇云-智能工程部</option>
                                        <option value="sys">智汇云-系统部</option>
                                        <option value="biz">商业化业务线</option>
                                        <option value="cloud">智汇云-云平台部</option>
                                        <option value="search">搜索事业部</option>
                                    </select>
                                    {/* 账单状态 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="">全部账单状态</option>
                                        <option value="unsettled">未结算</option>
                                        <option value="settled">已结算</option>
                                        <option value="overdue">已逾期</option>
                                    </select>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                    导出数据
                                </button>
                            </div>

                            {/* 部门账单表格 */}
                            {intranetBillTypeTab === "department" && (
                                <>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部门名称</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">账期年月</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">官方标准价金额（¥）</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">优惠金额（¥）</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">应付金额（¥）/环比上月</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">欠费金额（¥）</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">账单状态</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">智汇云-智能工程部</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">22,861,031.55</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">10,808,145.66</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">12,052,885.89</span>
                                                    <span className="ml-2 text-green-600">↓ 0.56%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(15,408,102.19)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">智汇云-系统部</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">18,208,783.96</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">7,559,654.43</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">10,649,129.53</span>
                                                    <span className="ml-2 text-green-600">↓ 0.10%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(1,121,300.15)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">商业化业务线</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">18,628,122.82</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">8,386,334.47</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">10,241,788.35</span>
                                                    <span className="ml-2 text-green-600">↓ 0.23%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(3,069,008.13)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">智汇云-云平台部</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">15,186,107.25</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">6,427,453.66</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">8,758,653.59</span>
                                                    <span className="ml-2 text-green-600">↓ 0.09%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(887,269.31)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">搜索事业部</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">12,396,321.83</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">5,936,599.01</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">6,459,722.82</span>
                                                    <span className="ml-2 text-green-600">↓ 0.60%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(9,568,335.01)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">360借条</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">7,800,044.02</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">1,778,658.88</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">6,021,385.14</span>
                                                    <span className="ml-2 text-green-600">↓ 0.04%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(225,636.12)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">360人工智能研究院(AI大模型)</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">10,395,873.38</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">5,069,833.75</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">5,326,039.63</span>
                                                    <span className="ml-2 text-red-600">↑ 0.00%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(13,556.45)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">安全技术中台</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">7,469,854.56</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">3,598,878.47</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">3,870,976.09</span>
                                                    <span className="ml-2 text-green-600">↓ 0.35%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(2,063,958.64)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">360人工智能研究院</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">3,405,592.19</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">1,699,960.68</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">1,705,631.51</span>
                                                    <span className="ml-2 text-red-600">↑ 1.12%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(900,955.49)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">智汇云-应用平台部</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">2,749,370.08</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">1,200,456.35</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">1,548,913.73</span>
                                                    <span className="ml-2 text-red-600">↑ 0.07%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(98,340.49)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* 分页 */}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white mt-4 rounded-b-lg">
                                    <div className="text-sm text-gray-500">
                                        共 <span className="font-medium">10</span> 条
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select className="h-8 px-2 border border-gray-300 rounded text-sm">
                                            <option value="10">10条/页</option>
                                            <option value="20">20条/页</option>
                                            <option value="50">50条/页</option>
                                        </select>
                                        <div className="flex items-center gap-1">
                                            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">‹</button>
                                            <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded text-sm">1</button>
                                            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">›</button>
                                        </div>
                                    </div>
                                </div>
                                </>
                            )}

                            {/* 产品账单表格 */}
                            {intranetBillTypeTab === "product" && (
                                <>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品名称</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">账期年月</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">官方标准价金额（¥）</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">优惠金额（¥）</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">应付金额（¥）/环比上月</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">欠费金额（¥）</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">账单状态</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">大模型</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">35,256,789.12</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">12,345,678.90</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">22,911,110.22</span>
                                                    <span className="ml-2 text-red-600">↑ 5.67%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(21,678,234.56)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">APICloud</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">18,456,789.23</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">6,567,890.34</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">11,888,898.89</span>
                                                    <span className="ml-2 text-green-600">↓ 3.21%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(12,283,456.78)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">龙虾</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">12,345,678.90</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">4,567,890.12</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">7,777,788.78</span>
                                                    <span className="ml-2 text-red-600">↑ 2.34%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(7,600,123.45)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">短信服务</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">5,678,901.23</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">1,234,567.89</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">4,444,333.34</span>
                                                    <span className="ml-2 text-green-600">↓ 1.56%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(4,514,789.01)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">存储服务</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">3,456,789.01</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">890,123.45</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">2,566,665.56</span>
                                                    <span className="ml-2 text-red-600">↑ 0.89%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(2,544,012.34)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* 分页 */}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white mt-4 rounded-b-lg">
                                    <div className="text-sm text-gray-500">
                                        共 <span className="font-medium">5</span> 条
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select className="h-8 px-2 border border-gray-300 rounded text-sm">
                                            <option value="10">10条/页</option>
                                            <option value="20">20条/页</option>
                                            <option value="50">50条/页</option>
                                        </select>
                                        <div className="flex items-center gap-1">
                                            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">‹</button>
                                            <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded text-sm">1</button>
                                            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">›</button>
                                        </div>
                                    </div>
                                </div>
                                </>
                            )}
                            </div>
                        </div>
                    )}
                    
                    {/* 平台配置页面 - 占位 */}
                    {currentMenu === 'platform-config' && (
                        <div className="flex-1 bg-gray-50 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">平台配置</h3>
                                <p className="text-gray-500">功能开发中...</p>
                            </div>
                        </div>
                    )}
                    
                    {/* 智企管理后台 - 原有内容 */}
                    {currentMenu === 'zhiqi-admin' && (
                        <>
                    {/* 左侧二级菜单 */}
                    <aside className={`bg-white border-r border-gray-200 flex-shrink-0 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "w-12" : "w-48"}`}>
                        {/* 标题区域 */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between min-h-[57px]">
                            {!sidebarCollapsed && (
                                <h3 className="text-base font-semibold text-gray-900">智企管理后台</h3>
                            )}
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className={`p-1 hover:bg-gray-100 rounded transition-colors ${sidebarCollapsed ? "mx-auto" : ""}`}
                                title={sidebarCollapsed ? "展开菜单" : "收起菜单"}
                            >
                                <svg className={`w-4 h-4 text-gray-500 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>
                        <nav className="py-2 flex-1">
                            {adminTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center transition-colors ${
                                        sidebarCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-2.5"
                                    } text-sm font-medium ${
                                        activeTab === tab.id
                                            ? "bg-blue-50 text-[#006bff] border-l-2 border-[#006bff]"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                    title={tab.name}
                                >
                                    <span className={`flex-shrink-0 ${activeTab === tab.id ? "text-[#006bff]" : "text-gray-400"}`}>
                                        {getTabIcon(tab.icon, "w-5 h-5")}
                                    </span>
                                    {!sidebarCollapsed && (
                                        <>
                                            <span className="flex-1 text-left">{tab.name}</span>
                                            {activeTab === tab.id && (
                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* 内容区域 */}
                    <div className="flex-1 overflow-auto">
                        {/* 套餐管理 Tab 内容 */}
                        {activeTab === "packages" && (
                        <div className={createPackageDialogOpen && packageSubTab === "packages" ? "flex flex-col h-full" : "p-6"}>
                            {/* 二级菜单 - 创建表单时隐藏 */}
                            {!(createPackageDialogOpen && packageSubTab === "packages") ? (
                            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
                                <button
                                    onClick={() => setPackageSubTab("packages")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        packageSubTab === "packages"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    套餐管理
                                    {packageSubTab === "packages" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setPackageSubTab("analysis")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        packageSubTab === "analysis"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    数据分析
                                    {packageSubTab === "analysis" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                            </div>
                            ) : null}

                            {/* 数据分析 Tab */}
                            {packageSubTab === "analysis" && (
                                <>
                                    {/* 套餐统计卡片 */}
                                    <div className="grid grid-cols-4 gap-6 mb-4">
                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <div className="text-sm text-gray-500 mb-2">套餐总数</div>
                                            <div className="text-3xl font-bold text-gray-900">{packagesData.length}</div>
                                        </div>
                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <div className="text-sm text-gray-500 mb-2">已上架套餐</div>
                                            <div className="text-3xl font-bold text-green-600">{packagesData.filter(p => p.status === "active").length}</div>
                                        </div>
                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <div className="text-sm text-gray-500 mb-2">已售套餐数量</div>
                                            <div className="text-3xl font-bold text-orange-600">{packagesData.reduce((sum, p) => sum + p.soldCount, 0).toLocaleString()}</div>
                                        </div>
                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <div className="text-sm text-gray-500 mb-2">总收入</div>
                                            <div className="text-3xl font-bold text-blue-600">{formatMoney(packagesData.reduce((sum, p) => sum + p.totalIncome, 0))}</div>
                                        </div>
                                    </div>

                                    {/* 月包统计卡片 */}
                                    <div className="grid grid-cols-4 gap-6 mb-4">
                                        <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                                            <div className="text-sm text-purple-600 mb-1">月包总数</div>
                                            <div className="text-2xl font-bold text-purple-700">{packagesData.filter(p => p.type === "monthly").length}</div>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                                            <div className="text-sm text-purple-600 mb-1">已上架月包</div>
                                            <div className="text-2xl font-bold text-purple-700">{packagesData.filter(p => p.type === "monthly" && p.status === "active").length}</div>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                                            <div className="text-sm text-purple-600 mb-1">月包已售数量</div>
                                            <div className="text-2xl font-bold text-purple-700">{packagesData.filter(p => p.type === "monthly").reduce((sum, p) => sum + p.soldCount, 0).toLocaleString()}</div>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                                            <div className="text-sm text-purple-600 mb-1">月包收入</div>
                                            <div className="text-2xl font-bold text-purple-700">{formatMoney(packagesData.filter(p => p.type === "monthly").reduce((sum, p) => sum + p.totalIncome, 0))}</div>
                                        </div>
                                    </div>

                                    {/* 加油包统计卡片 */}
                                    <div className="grid grid-cols-4 gap-6">
                                        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                                            <div className="text-sm text-green-600 mb-1">加油包总数</div>
                                            <div className="text-2xl font-bold text-green-700">{packagesData.filter(p => p.type === "addon").length}</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                                            <div className="text-sm text-green-600 mb-1">已上架加油包</div>
                                            <div className="text-2xl font-bold text-green-700">{packagesData.filter(p => p.type === "addon" && p.status === "active").length}</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                                            <div className="text-sm text-green-600 mb-1">加油包已售数量</div>
                                            <div className="text-2xl font-bold text-green-700">{packagesData.filter(p => p.type === "addon").reduce((sum, p) => sum + p.soldCount, 0).toLocaleString()}</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                                            <div className="text-sm text-green-600 mb-1">加油包收入</div>
                                            <div className="text-2xl font-bold text-green-700">{formatMoney(packagesData.filter(p => p.type === "addon").reduce((sum, p) => sum + p.totalIncome, 0))}</div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* 套餐管理 Tab */}
                            {packageSubTab === "packages" && !createPackageDialogOpen && (
                                <>
                                    {/* 操作栏 */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    <input
                                                        type="text"
                                                        placeholder="搜索套餐名称"
                                                        value={packageNameSearch}
                                                        onChange={(e) => setPackageNameSearch(e.target.value)}
                                                        className="border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500 w-48"
                                                    />
                                                </div>
                                                <select
                                                    value={packageTypeFilter}
                                                    onChange={(e) => setPackageTypeFilter(e.target.value)}
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
                                                >
                                                    <option value="all">全部产品</option>
                                                    <option value="ai-plan">AI计划</option>
                                                    <option value="lobster">龙虾</option>
                                                </select>
                                                <select
                                                    value={packageStatusFilter}
                                                    onChange={(e) => setPackageStatusFilter(e.target.value)}
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
                                                >
                                                    <option value="all">全部状态</option>
                                                    <option value="active">已上架</option>
                                                    <option value="inactive">已下架</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => {
                                                        setNewPackage({
                                                            name: "",
                                                            identifier: "",
                                                            product: "ai-plan",
                                                            description: "",
                                                            type: "monthly",
                                                            price: 0,
                                                            costPrice: 0,
                                                            priceHint: "",
                                                            hourLimit5: null,
                                                            weekLimit: null,
                                                            monthLimit: null,
                                                            capabilityDesc: "",
                                                            lobsterCount: 1, // 月包默认1
                                                            memberCount: 1, // 月包默认1
                                                            availableModels: ALL_MODELS.map(m => m.id), // 默认全部模型
                                                            purchaseLimit: null,
                                                            stock: null,
                                                            officialDiscount: 10,
                                                            internalDiscount: 10,
                                                            svipDiscount: 10,
                                                            vipDiscount: 10,
                                                        });
                                                        setCreatePackageDialogOpen(true);
                                                    }}
                                                    className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    创建套餐
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 套餐列表 */}
                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">套餐名称</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">套餐标识</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">规格</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">所属产品</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">价格</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">已售数量</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">收入金额</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">状态</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredPackages.map((pkg) => {
                                                    const isExpanded = expandedPackageIds.includes(pkg.id);
                                                    return (
                                                        <React.Fragment key={pkg.id}>
                                                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                                                            <td className="py-3 px-4">
                                                                <div className="flex items-start gap-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setExpandedPackageIds(prev => 
                                                                                prev.includes(pkg.id) 
                                                                                    ? prev.filter(id => id !== pkg.id)
                                                                                    : [...prev, pkg.id]
                                                                            );
                                                                        }}
                                                                        className="mt-1 p-0.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                                                                        title={expandedPackageIds.includes(pkg.id) ? "收起" : "展开"}
                                                                    >
                                                                        <svg className={`w-4 h-4 text-gray-500 transition-transform ${expandedPackageIds.includes(pkg.id) ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                        </svg>
                                                                    </button>
                                                                    <div className="font-medium text-gray-900">{pkg.name}</div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <span className="text-sm text-gray-600 font-mono">{pkg.identifier}</span>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <div className="text-sm text-gray-600 space-y-0.5">
                                                                    {(pkg as Record<string, unknown>).priceHint ? (
                                                                        <div>{(pkg as Record<string, unknown>).priceHint as string}</div>
                                                                    ) : null}
                                                                    {(pkg as Record<string, unknown>).hourLimit5 != null ? (
                                                                        <div>5小时限额: {(pkg as Record<string, unknown>).hourLimit5 as number}</div>
                                                                    ) : null}
                                                                    {(pkg as Record<string, unknown>).weekLimit != null ? (
                                                                        <div>周限额: {(pkg as Record<string, unknown>).weekLimit as number}</div>
                                                                    ) : null}
                                                                    {(pkg as Record<string, unknown>).monthLimit != null ? (
                                                                        <div>月限额: {(pkg as Record<string, unknown>).monthLimit as number}</div>
                                                                    ) : null}
                                                                    {!(pkg as Record<string, unknown>).priceHint && (pkg as Record<string, unknown>).hourLimit5 == null && (pkg as Record<string, unknown>).weekLimit == null && (pkg as Record<string, unknown>).monthLimit == null && (
                                                                        <span className="text-gray-400">-</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                                                    pkg.product === "ai-plan" 
                                                                        ? "bg-blue-50 text-blue-700" 
                                                                        : "bg-orange-50 text-orange-700"
                                                                }`}>
                                                                    {pkg.product === "ai-plan" ? "AI计划" : "龙虾"}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <div className="text-gray-900 font-medium">
                                                                    {pkg.price > 0 ? `¥${pkg.price.toLocaleString()}${pkg.type === 'monthly' ? '/月' : ''}` : "免费"}
                                                                </div>
                                                                {(pkg.officialDiscount || pkg.internalDiscount || pkg.svipDiscount || pkg.vipDiscount) && (
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {pkg.officialDiscount && (
                                                                            <span className="inline-block px-1.5 py-0.5 text-xs bg-orange-50 text-orange-600 rounded">官方{pkg.officialDiscount}折</span>
                                                                        )}
                                                                        {pkg.internalDiscount && (
                                                                            <span className="inline-block px-1.5 py-0.5 text-xs bg-blue-50 text-blue-600 rounded">内部{pkg.internalDiscount}折</span>
                                                                        )}
                                                                        {pkg.svipDiscount && (
                                                                            <span className="inline-block px-1.5 py-0.5 text-xs bg-purple-50 text-purple-600 rounded">SVIP{pkg.svipDiscount}折</span>
                                                                        )}
                                                                        {pkg.vipDiscount && (
                                                                            <span className="inline-block px-1.5 py-0.5 text-xs bg-green-50 text-green-600 rounded">VIP{pkg.vipDiscount}折</span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="py-3 px-4 text-gray-900 font-medium">{pkg.soldCount}</td>
                                                            <td className="py-3 px-4 text-gray-900 font-medium text-green-600">{formatMoney(pkg.totalIncome)}</td>
                                                            <td className="py-3 px-4">
                                                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                                                    pkg.status === "active" 
                                                                        ? "bg-green-50 text-green-700" 
                                                                        : "bg-gray-100 text-gray-500"
                                                                }`}>
                                                                    {pkg.status === "active" ? "已上架" : "已下架"}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <div className="flex items-center gap-2">
                                                                    {pkg.status === "active" ? (
                                                                        <button 
                                                                            onClick={() => handleTogglePackageStatus(pkg.id, pkg.name, "inactive")}
                                                                            className="text-orange-600 hover:text-orange-700 text-sm"
                                                                        >
                                                                            下架
                                                                        </button>
                                                                    ) : (
                                                                        <button 
                                                                            onClick={() => handleTogglePackageStatus(pkg.id, pkg.name, "active")}
                                                                            className="text-green-600 hover:text-green-700 text-sm"
                                                                        >
                                                                            上架
                                                                        </button>
                                                                    )}
                                                                    <button 
                                                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                                                        onClick={() => handleEditPackage(pkg)}
                                                                    >编辑</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {expandedPackageIds.includes(pkg.id) && (
                                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                                <td colSpan={11} className="py-3 px-4">
                                                                    <div className="flex items-center gap-8 text-sm">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-gray-500">创建时间：</span>
                                                                            <span className="text-gray-700">{pkg.createTime}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-gray-500">更新时间：</span>
                                                                            <span className="text-gray-700">{pkg.onSaleTime}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}

                            {/* 创建/编辑套餐 - 页面内表单 */}
                            {packageSubTab === "packages" && createPackageDialogOpen && (
                                <div className="flex-1 overflow-auto">
                                    {/* 顶部导航 */}
                                    <div className="flex items-center gap-3 px-6 pt-5 pb-4">
                                        <button
                                            onClick={handleClosePackageDialog}
                                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            返回列表
                                        </button>
                                        <span className="text-gray-300">/</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {editingPackage ? '编辑套餐' : '创建套餐'}
                                        </span>
                                    </div>

                                    {/* 表单卡片 */}
                                    <div className="bg-white rounded-lg border border-gray-200 mx-6 mb-6">
                                        <div className="px-6 py-4 border-b border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {editingPackage ? '编辑套餐' : '创建套餐'}
                                            </h3>
                                        </div>

                                        <div className="p-6">
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">套餐名称 <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={newPackage.name}
                                                        onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="请输入套餐名称"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">套餐标识 <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={newPackage.identifier}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/[^a-z0-9\-_]/g, '');
                                                            setNewPackage({ ...newPackage, identifier: val });
                                                        }}
                                                        disabled={!!editingPackage}
                                                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none ${editingPackage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'focus:border-blue-500'}`}
                                                        placeholder="仅支持小写字母、数字、-、_，如 basic-plan-01"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">选择产品 <span className="text-red-500">*</span></label>
                                                    <div className="flex items-center gap-6">
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="productType"
                                                                checked={newPackage.product === "ai-plan"}
                                                                onChange={() => setNewPackage({ ...newPackage, product: "ai-plan" })}
                                                                className="w-4 h-4 text-[#006bff] border-gray-300 focus:ring-[#006bff]"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">AI计划</span>
                                                        </label>
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="productType"
                                                                checked={newPackage.product === "lobster"}
                                                                onChange={() => setNewPackage({ ...newPackage, product: "lobster" })}
                                                                className="w-4 h-4 text-[#006bff] border-gray-300 focus:ring-[#006bff]"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">龙虾</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">官方标准价（元） <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={newPackage.price}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value);
                                                            setNewPackage({ ...newPackage, price: isNaN(value) ? 0 : Math.max(0, Math.round(value * 100) / 100) });
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="0 表示免费"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">成本价（元） <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={newPackage.costPrice}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value);
                                                            setNewPackage({ ...newPackage, costPrice: isNaN(value) ? 0 : Math.max(0, Math.round(value * 100) / 100) });
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="请输入成本价"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">折扣设置 <span className="text-red-500">*</span></label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1.5">官方折扣 <span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0.01"
                                                                    max="10"
                                                                    value={newPackage.officialDiscount}
                                                                    onChange={(e) => setNewPackage({ ...newPackage, officialDiscount: e.target.value ? Number(e.target.value) : 10 })}
                                                                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                                    placeholder="如9.75"
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">折</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1.5">内部折扣 <span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0.01"
                                                                    max="10"
                                                                    value={newPackage.internalDiscount}
                                                                    onChange={(e) => setNewPackage({ ...newPackage, internalDiscount: e.target.value ? Number(e.target.value) : 10 })}
                                                                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                                    placeholder="如9.75"
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">折</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1.5">SVIP折扣 <span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0.01"
                                                                    max="10"
                                                                    value={newPackage.svipDiscount}
                                                                    onChange={(e) => setNewPackage({ ...newPackage, svipDiscount: e.target.value ? Number(e.target.value) : 10 })}
                                                                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                                    placeholder="如9.75"
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">折</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1.5">VIP折扣 <span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0.01"
                                                                    max="10"
                                                                    value={newPackage.vipDiscount}
                                                                    onChange={(e) => setNewPackage({ ...newPackage, vipDiscount: e.target.value ? Number(e.target.value) : 10 })}
                                                                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                                    placeholder="如9.75"
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">折</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-2">输入折扣数值，如9.75表示9.75折，10表示不打折</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">金额提示语</label>
                                                    <input
                                                        type="text"
                                                        value={newPackage.priceHint}
                                                        onChange={(e) => setNewPackage({ ...newPackage, priceHint: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="如：约等于X元/天"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">5小时限额</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            value={newPackage.hourLimit5 ?? ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value ? Math.floor(Number(e.target.value)) : null;
                                                                setNewPackage({ ...newPackage, hourLimit5: value && value >= 0 ? value : null });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            placeholder="不限"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">周限额</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            value={newPackage.weekLimit ?? ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value ? Math.floor(Number(e.target.value)) : null;
                                                                setNewPackage({ ...newPackage, weekLimit: value && value >= 0 ? value : null });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            placeholder="不限"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">月限额</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            value={newPackage.monthLimit ?? ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value ? Math.floor(Number(e.target.value)) : null;
                                                                setNewPackage({ ...newPackage, monthLimit: value && value >= 0 ? value : null });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            placeholder="不限"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">套餐能力说明</label>
                                                    <textarea
                                                        value={newPackage.capabilityDesc}
                                                        onChange={(e) => setNewPackage({ ...newPackage, capabilityDesc: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="支持GLM、Deepseek、Kimi、Qwen等AI模型；适配Claude Code、Cursor、OpenClaw等编码工具；基础技术支持；小量调用额度"
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* 底部操作栏 */}
                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                            <button 
                                                onClick={handleClosePackageDialog}
                                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                取消
                                            </button>
                                            {!editingPackage && (
                                                <button 
                                                    onClick={() => handleCreatePackage(true)}
                                                    className="px-4 py-2 border border-[#006bff] text-[#006bff] rounded-lg text-sm hover:bg-blue-50 transition-colors"
                                                >
                                                    创建并上架
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleCreatePackage(false)}
                                                className="px-4 py-2 bg-[#006bff] text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                            >
                                                {editingPackage ? '保存修改' : '创建'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* AI计划管理 Tab 内容 */}
                    {activeTab === "models" && (
                        <div className="p-6">
                            {/* 二级菜单 */}
                            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
                                <button
                                    onClick={() => setModelSubTab("config")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        modelSubTab === "config"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    AI能力配置
                                    {modelSubTab === "config" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setModelSubTab("stats")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        modelSubTab === "stats"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    使用统计
                                    {modelSubTab === "stats" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                            </div>

                            {/* AI能力配置 Tab */}
                            {modelSubTab === "config" && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg">
                                        <svg className="w-5 h-5 text-[#006bff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-700">AI计划管理包含两个页面，AI能力配置和数据统计。逻辑请见：</span>
                                        <a
                                            href="https://hdgzgm4kjt.coze.site/claw/admin"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-[#006bff] hover:underline inline-flex items-center gap-1"
                                        >
                                            https://hdgzgm4kjt.coze.site/claw/admin
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                        <span className="text-sm text-gray-700">，产品：周长江。开发同学只需关注页面里的内容，左侧菜单、顶部导航等样式风格和智企框架里保持一致。</span>
                                    </div>
                                </div>
                            )}

                            {/* 使用统计 Tab */}
                            {modelSubTab === "stats" && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg">
                                        <svg className="w-5 h-5 text-[#006bff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-700">AI计划管理包含两个页面，AI能力配置和数据统计。逻辑请见：</span>
                                        <a
                                            href="https://hdgzgm4kjt.coze.site/claw/admin"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-[#006bff] hover:underline inline-flex items-center gap-1"
                                        >
                                            https://hdgzgm4kjt.coze.site/claw/admin
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                        <span className="text-sm text-gray-700">，产品：周长江。开发同学只需关注页面里的内容，左侧菜单、顶部导航等样式风格和智企框架里保持一致。</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    </div>
                        </>
                    )}
                </div>
            </main>

            {/* 成员管理抽屉 */}
            {memberDialogOpen && selectedTenant && (
                <div className="fixed inset-0 z-[100]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMemberDialogOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-[700px] bg-white shadow-xl flex flex-col">
                        {/* 抽屉头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">成员管理</h3>
                                <p className="text-sm text-gray-500 mt-1">租户：{selectedTenant.name}</p>
                            </div>
                            <button 
                                onClick={() => setMemberDialogOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 搜索和操作栏 */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="搜索成员账号"
                                        value={memberSearchKeyword}
                                        onChange={(e) => setMemberSearchKeyword(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <button 
                                    onClick={() => setImportMemberDialogOpen(true)}
                                    className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    导入成员
                                </button>
                            </div>
                        </div>

                        {/* 成员列表 */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">成员名称</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">账号ID</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">角色</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">配额</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTenant.members
                                        .filter(member => 
                                            member.accountId.toLowerCase().includes(memberSearchKeyword.toLowerCase()) ||
                                            member.name.toLowerCase().includes(memberSearchKeyword.toLowerCase())
                                        )
                                        .map((member) => {
                                            const isUnlimited = member.quota === 0;
                                            const quotaPercentage = isUnlimited ? 0 : (member.usedQuota / member.quota) * 100;
                                            const isQuotaWarning = !isUnlimited && quotaPercentage > 90;
                                            
                                            return (
                                        <tr key={member.id} className="border-b border-gray-100">
                                            <td className="py-3 px-4 font-medium text-gray-900">{member.name}</td>
                                            <td className="py-3 px-4 text-gray-600 font-mono text-sm">{member.accountId}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                                    member.role === "管理员" 
                                                        ? "bg-orange-50 text-orange-700" 
                                                        : "bg-gray-100 text-gray-700"
                                                }`}>
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="w-36">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className={isQuotaWarning ? "text-orange-500" : "text-gray-500"}>已用 {formatNumber(member.usedQuota)}</span>
                                                        <span className="text-gray-900 font-medium">
                                                            {isUnlimited ? '不限制' : formatNumber(member.quota)}
                                                        </span>
                                                    </div>
                                                    {!isUnlimited && (
                                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className={`h-full ${isQuotaWarning ? 'bg-orange-500' : 'bg-[#006bff]'} rounded-full`} style={{ width: `${quotaPercentage}%` }}></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button 
                                                    onClick={() => handleSetQuota(selectedTenant, member)}
                                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                                >
                                                    设置配额
                                                </button>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* 抽屉底部 */}
                        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button 
                                onClick={() => setMemberDialogOpen(false)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                关闭
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 导入成员抽屉 */}
            {importMemberDialogOpen && selectedTenant && (
                <div className="fixed inset-0 z-[110]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setImportMemberDialogOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-[500px] bg-white shadow-xl flex flex-col">
                        {/* 抽屉头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">导入成员</h3>
                                <p className="text-sm text-gray-500 mt-1">租户：{selectedTenant.name}</p>
                            </div>
                            <button 
                                onClick={() => setImportMemberDialogOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 抽屉内容 */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {/* 选择企业 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">选择企业</label>
                                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="">{selectedTenant.name}</option>
                                    </select>
                                </div>

                                {/* 成员账号 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">成员账号 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="请输入成员账号"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">多个账号用逗号分隔，如：user1,user2,user3</p>
                                </div>

                                {/* 配额设置 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">配额设置 <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={importMemberQuota}
                                        onChange={(e) => setImportMemberQuota(e.target.value)}
                                        placeholder="请输入配额数量"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">所有导入的成员将使用相同配额</p>
                                </div>

                            </div>
                        </div>

                        {/* 抽屉底部 */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button 
                                onClick={() => {
                                    setImportMemberDialogOpen(false);
                                    setImportMemberQuota("");
                                }}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                取消
                            </button>
                            <button 
                                onClick={() => {
                                    // TODO: 实现导入成员逻辑
                                    setImportMemberDialogOpen(false);
                                    setImportMemberQuota("");
                                }}
                                className="px-4 py-2 bg-[#006bff] text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                            >
                                确认导入
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 配额设置抽屉 */}
            {quotaDialogOpen && selectedMember && (
                <div className="fixed inset-0 z-[120]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setQuotaDialogOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-[400px] bg-white shadow-xl flex flex-col">
                        {/* 抽屉头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">设置配额</h3>
                            <button 
                                onClick={() => setQuotaDialogOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 抽屉内容 */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">成员信息</label>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>姓名：{selectedMember.member.name}</p>
                                    <p>账号ID：{selectedMember.member.accountId}</p>
                                    <p>租户：{selectedMember.tenant.name}</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">当前配额</label>
                                <div className="text-lg font-semibold text-gray-900">{formatNumber(selectedMember.member.quota)}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">新配额</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={newQuota}
                                    onChange={(e) => setNewQuota(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="请输入新配额"
                                />
                            </div>
                        </div>

                        {/* 抽屉底部 */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button 
                                onClick={() => setQuotaDialogOpen(false)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleSaveQuota}
                                className="px-4 py-2 bg-[#006bff] text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 上/下架确认弹窗 */}
            {togglePackageConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={handleCancelToggleStatus} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-[400px] max-w-[90vw] overflow-hidden">
                        {/* 弹窗头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {togglePackageConfirm.action}确认
                            </h3>
                            <button 
                                onClick={handleCancelToggleStatus}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 弹窗内容 */}
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                                    togglePackageConfirm.action === "下架" 
                                        ? "bg-orange-100" 
                                        : "bg-green-100"
                                }`}>
                                    {togglePackageConfirm.action === "下架" ? (
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900 font-medium mb-2">
                                        确定要{togglePackageConfirm.action}套餐「{togglePackageConfirm.name}」吗？
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {togglePackageConfirm.action === "下架" 
                                            ? "下架后该套餐将不再对用户可见，已购买用户不受影响。" 
                                            : "上架后该套餐将对用户可见并开放购买。"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 弹窗底部 */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button 
                                onClick={handleCancelToggleStatus}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleConfirmToggleStatus}
                                className={`px-4 py-2 rounded-lg text-sm text-white transition-colors ${
                                    togglePackageConfirm.action === "下架" 
                                        ? "bg-orange-600 hover:bg-orange-700" 
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                确认{togglePackageConfirm.action}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 模型选择弹框 */}
            {modelSelectDialogOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setModelSelectDialogOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-[500px] max-w-[90vw] overflow-hidden">
                        {/* 弹窗头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">选择可用模型</h3>
                            <button 
                                onClick={() => setModelSelectDialogOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 弹窗内容 */}
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    已选择 {tempSelectedModels.length}/{ALL_MODELS.length} 个模型
                                </span>
                                <button
                                    onClick={() => {
                                        if (tempSelectedModels.length === ALL_MODELS.length) {
                                            // 月包时，取消全选保留第一个模型
                                            if (newPackage.type === 'monthly') {
                                                setTempSelectedModels([ALL_MODELS[0].id]);
                                            } else {
                                                setTempSelectedModels([]);
                                            }
                                        } else {
                                            setTempSelectedModels(ALL_MODELS.map(m => m.id));
                                        }
                                    }}
                                    className="text-sm text-[#006bff] hover:text-blue-600"
                                >
                                    {tempSelectedModels.length === ALL_MODELS.length ? '取消全选' : '全选'}
                                </button>
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {ALL_MODELS.map(model => (
                                    <label
                                        key={model.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                            tempSelectedModels.includes(model.id)
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            checked={tempSelectedModels.includes(model.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setTempSelectedModels([...tempSelectedModels, model.id]);
                                                } else {
                                                    // 月包时，至少保留一个模型
                                                    if (newPackage.type === 'monthly' && tempSelectedModels.length === 1) {
                                                        return; // 不允许取消最后一个模型
                                                    }
                                                    setTempSelectedModels(tempSelectedModels.filter(id => id !== model.id));
                                                }
                                            }}
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{model.name}</div>
                                            <div className="text-xs text-gray-500">{model.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 弹窗底部 */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button 
                                onClick={() => setModelSelectDialogOpen(false)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                取消
                            </button>
                            <button 
                                onClick={() => {
                                    // 月包时，可用模型不能为空
                                    if (newPackage.type === 'monthly' && tempSelectedModels.length === 0) {
                                        alert('月包必须选择至少一个可用模型');
                                        return;
                                    }
                                    setNewPackage({ ...newPackage, availableModels: tempSelectedModels });
                                    setModelSelectDialogOpen(false);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                    newPackage.type === 'monthly' && tempSelectedModels.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-[#006bff] text-white hover:bg-blue-600'
                                }`}
                            >
                                确定
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 创建产品抽屉 */}
            {createProductDialogOpen && (
                <div className="fixed inset-0 z-[100]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setCreateProductDialogOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-[80%] bg-white shadow-xl flex flex-col">
                        {/* 抽屉头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setCreateProductDialogOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <h3 className="text-lg font-semibold text-gray-900">创建产品</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCreateProductDialogOpen(false)}
                                    className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-700 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={() => {
                                        // TODO: 保存产品
                                        setCreateProductDialogOpen(false);
                                    }}
                                    disabled={!newProduct.name || !newProduct.shortName || !newProduct.category || !newProduct.identifier || !newProduct.description || newProduct.tags.length === 0 || !newProduct.url}
                                    className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                                        !newProduct.name || !newProduct.shortName || !newProduct.category || !newProduct.identifier || !newProduct.description || newProduct.tags.length === 0 || !newProduct.url
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    确定
                                </button>
                            </div>
                        </div>
                        
                        {/* 表单内容 */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            {/* 产品名称 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    产品名称 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={20}
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    placeholder="可包含中文、英文字母、数字、下划线(_)、中划线"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                                <div className="text-xs text-gray-400 mt-1 text-right">{newProduct.name.length}/20</div>
                            </div>
                            
                            {/* 产品简称 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    产品简称 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.shortName}
                                    onChange={(e) => setNewProduct({ ...newProduct, shortName: e.target.value })}
                                    placeholder="可包含中文、英文字母、数字、下划线(_)、中划线"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-400 mt-1">收藏产品后，在导航收藏列表里展示产品的简称，建议和产品的英文名称保持一致</p>
                            </div>
                            
                            {/* 产品分类 & 所属产线 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        产品分类 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">请选择</option>
                                        <option value="大数据">大数据</option>
                                        <option value="存储">存储</option>
                                        <option value="数据库">数据库</option>
                                        <option value="容器">容器</option>
                                        <option value="中间件">中间件</option>
                                        <option value="计算">计算</option>
                                        <option value="网络">网络</option>
                                        <option value="安全">安全</option>
                                        <option value="AI">AI</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        所属产线
                                    </label>
                                    <select
                                        value={newProduct.productLine}
                                        onChange={(e) => setNewProduct({ ...newProduct, productLine: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="其他">其他</option>
                                        <option value="云存储">云存储</option>
                                        <option value="云计算">云计算</option>
                                        <option value="云数据库">云数据库</option>
                                        <option value="大数据平台">大数据平台</option>
                                        <option value="AI平台">AI平台</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* 产品标识符 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    产品标识符 <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center">
                                    <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600 font-mono">zqi_</span>
                                    <input
                                        type="text"
                                        value={newProduct.identifier.replace('zqi_', '')}
                                        onChange={(e) => setNewProduct({ ...newProduct, identifier: 'zqi_' + e.target.value })}
                                        placeholder="请输入标识符后缀"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg text-sm focus:outline-none focus:border-blue-500 font-mono"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">产品标识符以 zqi_ 开头，不可修改</p>
                            </div>
                            
                            {/* 产品描述 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    产品描述 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={40}
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    placeholder="请输入"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                                <div className="text-xs text-gray-400 mt-1 text-right">{newProduct.description.length}/40</div>
                            </div>
                            
                            {/* 产品标签 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    产品标签 <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {newProduct.tags.map((tag, index) => (
                                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                                            {tag}
                                            <button
                                                onClick={() => setNewProduct({ ...newProduct, tags: newProduct.tags.filter((_, i) => i !== index) })}
                                                className="hover:text-blue-800"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}
                                    {newProduct.tags.length < 3 && (
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="text"
                                                maxLength={5}
                                                value={newProduct.tagInput}
                                                onChange={(e) => setNewProduct({ ...newProduct, tagInput: e.target.value })}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && newProduct.tagInput.trim()) {
                                                        setNewProduct({ 
                                                            ...newProduct, 
                                                            tags: [...newProduct.tags, newProduct.tagInput.trim()],
                                                            tagInput: '' 
                                                        });
                                                    }
                                                }}
                                                placeholder="输入标签"
                                                className="w-20 px-2 py-1 border border-dashed border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                onClick={() => {
                                                    if (newProduct.tagInput.trim()) {
                                                        setNewProduct({ 
                                                            ...newProduct, 
                                                            tags: [...newProduct.tags, newProduct.tagInput.trim()],
                                                            tagInput: '' 
                                                        });
                                                    }
                                                }}
                                                className="text-xs text-blue-600 hover:text-blue-700"
                                            >
                                                +添加标签
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400">支持中英文、数字，单个标签5个字符以内，最多添加3个标签</p>
                            </div>
                            
                            {/* URL地址 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    URL地址 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.url}
                                    onChange={(e) => setNewProduct({ ...newProduct, url: e.target.value })}
                                    placeholder="请输入"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            
                            {/* 介绍页地址 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    介绍页地址
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.introUrl}
                                    onChange={(e) => setNewProduct({ ...newProduct, introUrl: e.target.value })}
                                    placeholder="请输入"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            
                            {/* 内外网属性 */}
                            <div>
                                <label className="block text-sm font-medium text-red-500 mb-1.5">
                                    内外网属性
                                </label>
                                <div className="flex items-center gap-4">
                                    {[
                                        { value: 'intranet', label: '内网(qih00.net)' },
                                        { value: 'public', label: '公网(360.cn)' },
                                        { value: 'both', label: '既是内网又是公网(即，内外是一个产品)' },
                                    ].map(option => (
                                        <label key={option.value} className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="networkType"
                                                value={option.value}
                                                checked={newProduct.networkType === option.value}
                                                onChange={(e) => setNewProduct({ ...newProduct, networkType: e.target.value })}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className={`text-sm ${newProduct.networkType === option.value ? 'text-blue-600' : 'text-gray-700'}`}>{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            {/* 展示范围 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    展示范围
                                </label>
                                <div className="flex items-center gap-2">
                                    {[
                                        { value: 'all', label: '所有企业可见' },
                                        { value: 'specified', label: '指定企业可见' },
                                        { value: 'excluded', label: '指定企业不可见' },
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => setNewProduct({ ...newProduct, visibility: option.value })}
                                            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                                                newProduct.visibility === option.value
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* 产品图标 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    产品图标 <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                        {newProduct.icon ? (
                                            <div className="text-xs text-gray-500">已上传</div>
                                        ) : (
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        )}
                                    </div>
                                    <button className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                        上传图标
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">SVG格式且背景色透明，图标颜色为#626F84</p>
                            </div>
                            
                            {/* 分隔线 */}
                            <div className="border-t border-gray-200 pt-5">
                                {/* 产品审核开通 */}
                                <div className="mb-5">
                                    <div className="flex items-center gap-1 mb-1.5">
                                        <label className="text-sm font-medium text-gray-700">产品审核开通</label>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {[
                                            { value: 'default', label: '默认开通' },
                                            { value: 'manual', label: '人工审核' },
                                            { value: 'auto', label: '自动审核' },
                                            { value: 'none', label: '不需要开通' },
                                        ].map(option => (
                                            <label key={option.value} className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="auditType"
                                                    value={option.value}
                                                    checked={newProduct.auditType === option.value}
                                                    onChange={(e) => setNewProduct({ ...newProduct, auditType: e.target.value })}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className={`text-sm ${newProduct.auditType === option.value ? 'text-blue-600' : 'text-gray-700'}`}>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* 开关类设置 */}
                                <div className="space-y-4">
                                    {/* 工单排班表管理 */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">工单排班表管理</span>
                                        <button
                                            onClick={() => setNewProduct({ ...newProduct, workOrderSchedule: !newProduct.workOrderSchedule })}
                                            className={`relative w-10 h-5 rounded-full transition-colors ${newProduct.workOrderSchedule ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.workOrderSchedule ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>
                                    
                                    {/* 计费开通 */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm text-gray-700">计费开通</span>
                                            <p className="text-xs text-gray-400 mt-0.5">开启后，该产品在计费相关页面的产品列表里展示</p>
                                        </div>
                                        <button
                                            onClick={() => setNewProduct({ ...newProduct, billingEnabled: !newProduct.billingEnabled })}
                                            className={`relative w-10 h-5 rounded-full transition-colors ${newProduct.billingEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.billingEnabled ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>
                                    
                                    {/* 产品文档 */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">产品文档</span>
                                        <button
                                            onClick={() => setNewProduct({ ...newProduct, docEnabled: !newProduct.docEnabled })}
                                            className={`relative w-10 h-5 rounded-full transition-colors ${newProduct.docEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.docEnabled ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>
                                    
                                    {/* 预留金额 */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm text-gray-700">预留金额</span>
                                            <p className="text-xs text-gray-400 mt-0.5">设置金额，业务产品在用户使用产品时校验对应企业下的余额</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                min={0}
                                                value={newProduct.reserveAmount}
                                                onChange={(e) => setNewProduct({ ...newProduct, reserveAmount: Number(e.target.value) })}
                                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:border-blue-500"
                                            />
                                            <span className="text-sm text-gray-500">元</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
