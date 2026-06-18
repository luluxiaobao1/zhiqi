"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from "recharts";

import {
    Home,
    Bell,
    HelpCircle,
    User,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Grid,
    Layers,
    BarChart3,
    Key,
    Menu,
    FileText,
    Building2,
    Sparkles,
    MessageSquare,
    BookOpen,
    Zap,
    Bot,
    Code2,
    Cpu,
    Plus,
    Copy,
    Trash2,
    Eye,
    EyeOff,
    Calendar,
    Search,
    Check,
    Settings,
    Image,
    X,
    AlertCircle,
    AlertTriangle,
    LogOut,
    FlaskConical,
    ExternalLink,
    Package,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { createPackageOrder, getOrders, type Order } from "@/lib/order-store";

// 用户角色类型：主账号、管理员、成员
type UserRole = 'owner' | 'admin' | 'member';

// 角色配置：文案和颜色
const roleConfig: Record<UserRole, { label: string; bgColor: string }> = {
    owner: { label: '主账号', bgColor: 'bg-blue-500' },
    admin: { label: '管理员', bgColor: 'bg-orange-500' },
    member: { label: '成员', bgColor: 'bg-green-500' },
};

// 场景类型定义（管理员角色）
type ScenarioType = 'no-package' | 'package-valid' | 'package-invalid';

// 场景配置（管理员角色）
const scenarioConfig: Record<ScenarioType, { label: string; desc: string; color: string }> = {
    'no-package': { label: '未购买套餐', desc: '请购买套餐开始使用', color: 'bg-orange-500' },
    'package-valid': { label: '已购买套餐，套餐有效', desc: '套餐有效期内，配额正常使用', color: 'bg-green-500' },
    'package-invalid': { label: '已购买套餐，套餐失效或已用尽', desc: '请续费以继续使用', color: 'bg-red-500' },
};

// 成员场景类型定义
type MemberScenarioType = 'no-quota' | 'quota-assigned-no-package' | 'quota-insufficient' | 'package-valid' | 'package-invalid' | 'access-none' | 'access-pending' | 'access-denied';

// 成员场景配置
const memberScenarioConfig: Record<MemberScenarioType, { label: string; desc: string; color: string }> = {
    'no-quota': { label: '未被分配配额', desc: '管理员尚未为您分配配额', color: 'bg-gray-500' },
    'quota-assigned-no-package': { label: '未购买套餐', desc: '已分配配额，请购买套餐以开始使用', color: 'bg-orange-500' },
    'quota-insufficient': { label: '配额不足', desc: '当前配额已用尽，请联系管理员增加配额', color: 'bg-red-500' },
    'package-valid': { label: '套餐有效', desc: '套餐有效期内，配额正常使用', color: 'bg-green-500' },
    'package-invalid': { label: '套餐失效', desc: '套餐已失效或已用尽，请续费', color: 'bg-red-500' },
    'access-none': { label: '未申请访问权限', desc: '成员尚未申请访问权限', color: 'bg-blue-500' },
    'access-pending': { label: '访问权限审核中', desc: '访问权限已提交，审核中', color: 'bg-yellow-500' },
    'access-denied': { label: '拒绝访问', desc: '账号已被禁止访问智企', color: 'bg-red-500' },
};

// 已购套餐数据类型
type PackageStatus = 'active' | 'expired';

interface PurchasedPackage {
    id: string;
    packageName: string;
    product: string;
    purchaser: string;
    purchaserAccount: string;
    amount: number;
    purchaseTime: string;
    expireTime: string;
    status: PackageStatus;
}

// 已购套餐模拟数据
const allPurchasedPackages: PurchasedPackage[] = [
    { id: "PKG20260414001", packageName: "AI计划-标准版", product: "AI计划", purchaser: "张三", purchaserAccount: "zhangsan", amount: 2980.00, purchaseTime: "2026-04-14 12:00:00", expireTime: "2027-04-14 12:00:00", status: "active" },
    { id: "PKG20260410002", packageName: "龙虾-专业版", product: "龙虾", purchaser: "张三", purchaserAccount: "zhangsan", amount: 5980.00, purchaseTime: "2026-04-10 09:30:00", expireTime: "2026-04-10 09:30:00", status: "expired" },
    { id: "PKG20260201003", packageName: "AI计划-企业版", product: "AI计划", purchaser: "李四", purchaserAccount: "lisi", amount: 12800.00, purchaseTime: "2026-02-01 00:00:00", expireTime: "2026-02-01 00:00:00", status: "expired" },
    { id: "PKG20260320004", packageName: "APICloud-标准版", product: "APICloud", purchaser: "王五", purchaserAccount: "wangwu", amount: 1680.00, purchaseTime: "2026-03-20 16:00:00", expireTime: "2027-03-20 16:00:00", status: "active" },
    { id: "PKG20260501005", packageName: "龙虾-专业版", product: "龙虾", purchaser: "李四", purchaserAccount: "lisi", amount: 6980.00, purchaseTime: "2026-05-01 10:00:00", expireTime: "2027-05-01 10:00:00", status: "active" },
];

// 根据角色过滤套餐数据：管理员和主账号可看全部，成员只能看自己购买的
const getFilteredPackages = (role: UserRole, account: string): PurchasedPackage[] => {
    if (role === 'owner' || role === 'admin') {
        return allPurchasedPackages;
    }
    return allPurchasedPackages.filter(pkg => pkg.purchaserAccount === account);
};

// 菜单项定义（带角色权限）
const allMenuItems = [
    { name: "我的首页", icon: Home, href: "#", roles: ['owner', 'admin', 'member'] as UserRole[] },
    { name: "龙虾", icon: Bot, href: "#", roles: ['owner', 'admin', 'member'] as UserRole[] },
    { name: "AI计划", icon: Grid, href: "#", roles: ['owner', 'admin', 'member'] as UserRole[] },
    { name: "管理后台", icon: Settings, href: "#", roles: ['owner', 'admin'] as UserRole[] },
];

// 用户-企业-角色映射数据
const userEnterpriseRolesMap: Record<string, Array<{ enterpriseId: number; enterpriseName: string; role: UserRole }>> = {
    'zhangsan': [
        { enterpriseId: 1, enterpriseName: '张三企业', role: 'owner' },
        { enterpriseId: 2, enterpriseName: '李四企业', role: 'admin' },
        { enterpriseId: 3, enterpriseName: '王五企业', role: 'member' },
    ],
    'lisi': [
        { enterpriseId: 2, enterpriseName: '李四企业', role: 'owner' },
        { enterpriseId: 3, enterpriseName: '王五企业', role: 'admin' },
        { enterpriseId: 1, enterpriseName: '张三企业', role: 'member' },
    ],
    'wangwu': [
        { enterpriseId: 3, enterpriseName: '王五企业', role: 'owner' },
    ],
};

// 根据用户账号生成企业列表
const getEnterpriseListForUser = (userAccount: string) => {
    const roles = userEnterpriseRolesMap[userAccount] || [];
    return roles.map((item, index) => ({
        id: item.enterpriseId,
        name: item.enterpriseName,
        icon: "企",
        role: item.role,
        active: index === 0,
        currentPackage: item.role === 'owner' ? 2 : null,
        adminAccount: null,
        quotaExhausted: false
    }));
};

// 默认企业列表（未登录时使用）
const defaultEnterpriseList: Array<{
    id: number;
    name: string;
    icon: string;
    role: UserRole;
    active: boolean;
    currentPackage: number | null;
    adminAccount: string | null;
    quotaExhausted: boolean;
}> = [
    { 
        id: 1, 
        name: "张三企业", 
        icon: "企", 
        role: 'owner' as UserRole,
        active: true,
        currentPackage: 2,
        adminAccount: null,
        quotaExhausted: false
    },
];

const dailyUsageData = [{
    date: "2025-03-01",
    calls: 1200,
    tokens: 45000,
    successRate: 99.2
}, {
    date: "2025-03-02",
    calls: 1580,
    tokens: 52000,
    successRate: 99.5
}, {
    date: "2025-03-03",
    calls: 2100,
    tokens: 68000,
    successRate: 99.8
}, {
    date: "2025-03-04",
    calls: 1850,
    tokens: 55000,
    successRate: 99.1
}, {
    date: "2025-03-05",
    calls: 2300,
    tokens: 72000,
    successRate: 99.6
}, {
    date: "2025-03-06",
    calls: 1950,
    tokens: 61000,
    successRate: 99.4
}, {
    date: "2025-03-07",
    calls: 2800,
    tokens: 89000,
    successRate: 99.7
}, {
    date: "2025-03-08",
    calls: 2600,
    tokens: 82000,
    successRate: 99.3
}, {
    date: "2025-03-09",
    calls: 3100,
    tokens: 95000,
    successRate: 99.9
}, {
    date: "2025-03-10",
    calls: 2900,
    tokens: 88000,
    successRate: 99.5
}, {
    date: "2025-03-11",
    calls: 3250,
    tokens: 102000,
    successRate: 99.6
}, {
    date: "2025-03-12",
    calls: 3500,
    tokens: 110000,
    successRate: 99.8
}, {
    date: "2025-03-13",
    calls: 3800,
    tokens: 118000,
    successRate: 99.4
}, {
    date: "2025-03-14",
    calls: 3600,
    tokens: 112000,
    successRate: 99.7
}, {
    date: "2025-03-15",
    calls: 4200,
    tokens: 130000,
    successRate: 99.5
}, {
    date: "2025-03-16",
    calls: 4000,
    tokens: 125000,
    successRate: 99.8
}, {
    date: "2025-03-17",
    calls: 4500,
    tokens: 140000,
    successRate: 99.6
}, {
    date: "2025-03-18",
    calls: 4300,
    tokens: 135000,
    successRate: 99.3
}, {
    date: "2025-03-19",
    calls: 4800,
    tokens: 150000,
    successRate: 99.7
}, {
    date: "2025-03-20",
    calls: 4600,
    tokens: 145000,
    successRate: 99.9
}, {
    date: "2025-03-21",
    calls: 5100,
    tokens: 160000,
    successRate: 99.5
}, {
    date: "2025-03-22",
    calls: 4900,
    tokens: 155000,
    successRate: 99.4
}, {
    date: "2025-03-23",
    calls: 5400,
    tokens: 170000,
    successRate: 99.8
}, {
    date: "2025-03-24",
    calls: 5200,
    tokens: 165000,
    successRate: 99.6
}, {
    date: "2025-03-25",
    calls: 5700,
    tokens: 180000,
    successRate: 99.7
}, {
    date: "2025-03-26",
    calls: 5500,
    tokens: 175000,
    successRate: 99.5
}, {
    date: "2025-03-27",
    calls: 6000,
    tokens: 190000,
    successRate: 99.9
}, {
    date: "2025-03-28",
    calls: 5800,
    tokens: 185000,
    successRate: 99.4
}, {
    date: "2025-03-29",
    calls: 6300,
    tokens: 200000,
    successRate: 99.8
}, {
    date: "2025-03-30",
    calls: 6100,
    tokens: 195000,
    successRate: 99.6
}];

const modelDailyData = [{
    date: "2025-03-30",
    model: "大语言模型",
    calls: 2800,
    tokens: 90000
}, {
    date: "2025-03-30",
    model: "图像理解大模型",
    calls: 1000,
    tokens: 32000
}, {
    date: "2025-03-30",
    model: "图像生成大模型",
    calls: 850,
    tokens: 28000
}, {
    date: "2025-03-30",
    model: "语音识别大模型",
    calls: 750,
    tokens: 25000
}, {
    date: "2025-03-30",
    model: "语音合成大模型",
    calls: 500,
    tokens: 15000
}, {
    date: "2025-03-30",
    model: "向量模型",
    calls: 200,
    tokens: 5000
}];

const modelUsageBaseData = [{
    name: "大语言模型",
    color: "#3b82f6"
}, {
    name: "图像理解大模型",
    color: "#8b5cf6"
}, {
    name: "图像生成大模型",
    color: "#ec4899"
}, {
    name: "语音识别大模型",
    color: "#10b981"
}, {
    name: "语音合成大模型",
    color: "#f59e0b"
}, {
    name: "向量模型",
    color: "#6b7280"
}];

const apiKeyList = [{
    id: 1,
    name: "生产环境Key",
    key: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx1234",
    createdAt: "2025-03-01 10:30:00",
    status: "normal",
    totalQuota: 100000,
    used: 45230,
    remaining: 54770,
    isUnlimited: false
}, {
    id: 2,
    name: "测试环境Key",
    key: "sk-yyyyyyyyyyyyyyyyyyyyyyyyyyyyy5678",
    createdAt: "2025-03-05 14:00:00",
    status: "normal",
    totalQuota: -1,
    used: 8956,
    remaining: -1,
    isUnlimited: true
}, {
    id: 3,
    name: "开发调试Key",
    key: "sk-zzzzzzzzzzzzzzzzzzzzzzzzzzzz9012",
    createdAt: "2025-03-08 16:45:00",
    status: "exceeded",
    totalQuota: 5000,
    used: 5000,
    remaining: 0,
    isUnlimited: false
}, {
    id: 4,
    name: "临时测试Key",
    key: "sk-aaaaaaaaaaaaaaaaaaaaaaaaaaaa1111",
    createdAt: "2025-03-10 09:20:00",
    status: "normal",
    totalQuota: 20000,
    used: 15800,
    remaining: 4200,
    isUnlimited: false
}, {
    id: 5,
    name: "VIP客户Key",
    key: "sk-bbbbbbbbbbbbbbbbbbbbbbbbbbbb2222",
    createdAt: "2025-03-12 11:45:00",
    status: "normal",
    totalQuota: -1,
    used: 156890,
    remaining: -1,
    isUnlimited: true
}];

const openClawList = [{
    id: 1,
    name: "智能客服助手",
    desc: "基于大语言模型的智能客服系统，支持多轮对话和知识库问答",
    models: ["大语言模型", "向量模型"],
    apiKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx1234",
    createdAt: "2025-03-01 10:30:00",
    status: "active",
    calls: 12580
}, {
    id: 2,
    name: "图像分析服务",
    desc: "提供图像理解和分类功能，支持物体检测和场景识别",
    models: ["图像理解大模型"],
    apiKey: "sk-yyyyyyyyyyyyyyyyyyyyyyyyyyyyy5678",
    createdAt: "2025-03-05 14:00:00",
    status: "active",
    calls: 8920
}, {
    id: 3,
    name: "内容创作工具",
    desc: "AI辅助内容创作，支持文案生成、图片生成等多模态能力",
    models: ["大语言模型", "图像生成大模型"],
    apiKey: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx1234",
    createdAt: "2025-03-10 09:20:00",
    status: "inactive",
    calls: 3450
}];

const modelHierarchy = [{
    id: "text",
    name: "大语言模型",

    children: [{
        id: "360-nanbeige4.1-3b",
        name: "360-nanbeige4.1-3b"
    }, {
        id: "360-step-3.5-flash",
        name: "360-step-3.5-flash"
    }, {
        id: "360-nanbeige-72b",
        name: "360-nanbeige-72b"
    }, {
        id: "gpt-4",
        name: "GPT-4"
    }, {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5-turbo"
    }]
}, {
    id: "image-understand",
    name: "图像理解大模型",

    children: [{
        id: "360-vision-plus",
        name: "360-vision-plus"
    }, {
        id: "360-vision-pro",
        name: "360-vision-pro"
    }, {
        id: "claude-3-vision",
        name: "Claude-3-Vision"
    }]
}, {
    id: "image-generate",
    name: "图像生成大模型",

    children: [{
        id: "360-stable-diffusion",
        name: "360-stable-diffusion"
    }, {
        id: "dall-e-3",
        name: "DALL-E-3"
    }, {
        id: "midjourney-api",
        name: "Midjourney-API"
    }]
}, {
    id: "audio-asr",
    name: "语音识别大模型",

    children: [{
        id: "360-asr-pro",
        name: "360-asr-pro"
    }, {
        id: "whisper-large",
        name: "Whisper-Large"
    }]
}, {
    id: "audio-tts",
    name: "语音合成大模型",

    children: [{
        id: "360-tts-pro",
        name: "360-tts-pro"
    }, {
        id: "azure-tts",
        name: "Azure-TTS"
    }]
}, {
    id: "embedding",
    name: "向量模型",

    children: [{
        id: "360-embedding-large",
        name: "360-embedding-large"
    }, {
        id: "text-embedding-3",
        name: "text-embedding-3"
    }]
}];

const quickActions = [{
    name: "AI对话",
    icon: MessageSquare,
    desc: "智能问答与代码生成",
    color: "bg-blue-500"
}, {
    name: "文档助手",
    icon: BookOpen,
    desc: "快速查阅产品文档",
    color: "bg-green-500"
}, {
    name: "快捷操作",
    icon: Zap,
    desc: "常用功能一键直达",
    color: "bg-orange-500"
}];

const categoryTabs = [{
    id: "all",
    name: "全部"
}, {
    id: "text",
    name: "文本"
}, {
    id: "image",
    name: "图像"
}, {
    id: "audio",
    name: "音频"
}, {
    id: "video",
    name: "视频"
}, {
    id: "info",
    name: "信息获取"
}, {
    id: "tool",
    name: "工具"
}];

const modelServices = [{
    id: 1,
    name: "大语言模型",
    desc: "大语言模型服务是一种统一提供自然语言理解与生成能力的AI服务。通过该API接口，调用者可完成对话、问答、内容创作、翻译、摘要、信息抽取、代码辅助等多种语言任务。",
    image: "https://coze-coding-project.tos.coze.site/coze_storage_7618058681078448137/image/generate_image_f7d9c04b-f6ac-4894-89ad-9c545e8300e2.jpeg?sign=1805346048-f611610c9d-0-8149e05c2d026ec0ecd5e7044925c80e576918e8d2410d11d356128007819a7d",
    category: "text"
}, {
    id: 2,
    name: "图像理解大模型",
    desc: "通过同一个API，调用者可完成目标检测、分割、分类、图像描述等任务，并支持以URL或Base64等形式输入输出，使像素数据瞬间转化为可视化或结构化语义结果。",
    image: "https://coze-coding-project.tos.coze.site/coze_storage_7618058681078448137/image/generate_image_7c37de42-33dc-42b7-b712-84f7b1c3138d.jpeg?sign=1805346048-49de29de65-0-2766766e6163c33a76a9e235a16a65dc3ba546d2263123c8d5dde1057c49d0f6",
    category: "image"
}, {
    id: 3,
    name: "图像生成大模型",
    desc: "图像生成大模型服务整合了文生图、图生图的能力，用户可通过自然语言提示、已有图像，快速生成高质量、风格丰富的视觉内容。服务统一接口调用，支持自由创作、风格变换与复杂场景融合，覆盖多种创意设计与内容生产需求。",
    image: "https://coze-coding-project.tos.coze.site/coze_storage_7618058681078448137/image/generate_image_031c1ca9-3551-400f-9998-d957449caccb.jpeg?sign=1805346053-515c795b6d-0-f5625e4eadd3e6d0bd6411b82ccefd401d382602e862e3bc311b5a04d101af9f",
    category: "image"
}, {
    id: 4,
    name: "语音识别大模型",
    desc: "语音识别大模型服务提供高精度的语音转文字能力，支持多种语言和方言识别，可应用于语音助手、会议记录、智能客服等场景。服务支持实时流式识别和离线文件识别两种模式。",
    image: "https://coze-coding-project.tos.coze.site/coze_storage_7618058681078448137/image/generate_image_cd5f7375-da0f-4e83-ab9f-abf5ea3227b0.jpeg?sign=1805346046-91aa8a9336-0-3960015827c1584217dd19b28f6fefa4f26a154b79622c9ad5b7ea8c29198616",
    category: "audio"
}, {
    id: 5,
    name: "语音合成大模型",
    desc: "语音合成大模型服务将文本转换为自然流畅的语音输出，支持多种音色、语速和情感表达，广泛应用于有声阅读、智能播报、虚拟主播等场景，提供高质量的语音生成体验。",
    image: "https://coze-coding-project.tos.coze.site/coze_storage_7618058681078448137/image/generate_image_47b95a05-1442-4e4d-afab-2f508accae35.jpeg?sign=1805346045-9179d2ae48-0-2c4ad5ce12f227aa90647b2efaef6196b609b8d39615eba46007176fb12cee6b",
    category: "audio"
}, {
    id: 6,
    name: "向量模型",
    desc: "可把文本、图像、音频等原始信号转换为浮点数向量以反映相关性，通过计算向量距离评估词语和句子相似性。借助该服务，应用可轻松实现语义搜索、推荐排序、聚类分析、个性化召回与异常检测等场景。",
    image: "https://coze-coding-project.tos.coze.site/coze_storage_7618058681078448137/image/generate_image_fe334866-f685-4357-96c9-a536c17665aa.jpeg?sign=1805346046-49a2f846a4-0-064266e373459d068fa77325cae764d90f8f186887542f1d9c379503674913b0",
    category: "text"
}, {
    id: 7,
    name: "重排序模型",
    desc: "重排序模型是一种在初步召回或粗排后对候选结果进行精细排序的模型，常用于搜索引擎、推荐系统和问答系统中，显著提升搜索结果的准确性和相关性。",
    image: "https://coze-coding-project.tos.coze.site/coze_storage_7618058681078448137/image/generate_image_abd4ba5c-1ec4-4917-9649-a91a706c2fcb.jpeg?sign=1805346049-146d185b41-0-daa5e389607cae1622629a6f294fa41b934ce735a5b19315dc1d0bac8ee0bc56",
    category: "text"
}, {
    id: 8,
    name: "视频生成大模型",
    desc: "视频生成大模型是一项基于AI的智能生成服务，支持用户通过文本、图像等提示快速生成高质量视频内容。无需专业剪辑技能，即可高效创作宣传片、动画或教学视频。该模型具备画面理解、镜头衔接自然、风格多样等优势，大幅降低内容制作门槛。",
    image: "https://coze-coding-project.tos.coze.site/coze_storage_7618058681078448137/image/generate_image_b5f57fa4-bfbe-4886-8f9c-ac139b68865a.jpeg?sign=1805346047-6ce3d7e31f-0-678d07b1c154e9ee124282f5266cfd5162619f8dde3133e081bb263c7aff2716",
    category: "video"
}];

function EnterprisePageContent() {
    // URL参数处理
    const searchParams = useSearchParams();
    
    // 用户名状态 - 从localStorage读取登录时设置的账号
    const [username, setUsername] = useState('未登录');
    const [userAccount, setUserAccount] = useState('');
    const [activeMenu, setActiveMenu] = useState("我的首页");
    const [adminTab, setAdminTab] = useState<"overview" | "members" | "models" | "lobster">("overview");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    
    // 读取URL参数，初始化菜单和tab状态
    useEffect(() => {
        const menuParam = searchParams.get('menu');
        const tabParam = searchParams.get('tab');
        
        if (menuParam === 'admin') {
            setActiveMenu("管理后台");
            if (tabParam === 'members') {
                setAdminTab("members");
            } else if (tabParam === 'models') {
                setAdminTab("models");
            } else if (tabParam === 'lobster') {
                setAdminTab("lobster");
            }
        }
    }, [searchParams]);
    
    // 场景切换状态（仅在张三企业下生效）
    const [currentScenario, setCurrentScenario] = useState<ScenarioType>('no-package');
    const [scenarioMenuOpen, setScenarioMenuOpen] = useState(false);
    
    // 成员场景切换状态（仅在王五企业下生效）
    const [memberScenario, setMemberScenario] = useState<MemberScenarioType>('no-quota');
    const [memberScenarioMenuOpen, setMemberScenarioMenuOpen] = useState(false);
    
    // 处理成员场景切换
    const handleMemberScenarioChange = (scenario: MemberScenarioType) => {
        setMemberScenario(scenario);
        setMemberScenarioMenuOpen(false);
        
        if (scenario === 'access-none') {
            setAccessControlEnabled(true);
            setHasAccessPermission(false);
            setAccessStatus('none');
        } else if (scenario === 'access-pending') {
            setAccessControlEnabled(true);
            setHasAccessPermission(false);
            setAccessStatus('pending');
        } else if (scenario === 'access-denied') {
            setAccessControlEnabled(true);
            setHasAccessPermission(false);
            setAccessStatus('denied');
        } else {
            // 非访问权限场景，恢复正常的访问权限
            setAccessControlEnabled(false);
            setHasAccessPermission(true);
            setAccessStatus('none');
        }
    };
    // 拖动按钮位置状态
    const [buttonPosition, setButtonPosition] = useState({ x: 16, y: 60 }); // 默认右上角
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    
    // 拖动处理
    const handleDragStart = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        const rect = (e.target as HTMLElement).closest('button')?.getBoundingClientRect();
        if (rect) {
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };
    
    const handleDragMove = React.useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        const newX = Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragOffset.x));
        const newY = Math.max(50, Math.min(window.innerHeight - 50, e.clientY - dragOffset.y));
        setButtonPosition({ x: newX, y: newY });
    }, [isDragging, dragOffset]);
    
    const handleDragEnd = React.useCallback(() => {
        setIsDragging(false);
    }, []);
    
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const [enterpriseDialogOpen, setEnterpriseDialogOpen] = useState(false);
    const [enterpriseList, setEnterpriseList] = useState(defaultEnterpriseList);
    const [selectedEnterprise, setSelectedEnterprise] = useState(defaultEnterpriseList[0]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [userMenuOpen, setUserMenuOpen] = useState(false); // 用户下拉菜单状态
    const [purchasedPackagesOpen, setPurchasedPackagesOpen] = useState(false); // 已购套餐面板状态
    const [pkgSearchName, setPkgSearchName] = useState(''); // 套餐名称搜索
    const [pkgFilterProduct, setPkgFilterProduct] = useState(''); // 所属产品筛选
    const [pkgFilterStatus, setPkgFilterStatus] = useState(''); // 套餐状态筛选
    
    // 访问权限控制
    const [accessControlEnabled, setAccessControlEnabled] = useState(false); // 企业是否开启访问审批
    const [hasAccessPermission, setHasAccessPermission] = useState(true); // 当前成员是否有访问权限
    
    // 访问权限状态：'none'未申请, 'pending'审核中, 'denied'已拒绝
    const [accessStatus, setAccessStatus] = useState<'none' | 'pending' | 'denied'>('none');
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    const [applyRole, setApplyRole] = useState('');
    const [accessRequestSubmitted, setAccessRequestSubmitted] = useState(false);

    // 初始化访问权限状态
    useEffect(() => {
        const controlEnabled = localStorage.getItem('zhiqi_access_control') === 'true';
        setAccessControlEnabled(controlEnabled);
        if (controlEnabled) {
            // 从localStorage获取当前用户账号
            const userInfoStr = localStorage.getItem('zhiqi_user_info');
            let account = userAccount;
            if (!account && userInfoStr) {
                try {
                    const userInfo = JSON.parse(userInfoStr);
                    account = userInfo.account || '';
                } catch (e) { /* ignore */ }
            }
            // 优先读取按用户账号存储的权限状态，其次读取全局权限状态
            const userAccess = account ? (localStorage.getItem(`zhiqi_access_permission_${account}`) || localStorage.getItem('zhiqi_access_permission')) : localStorage.getItem('zhiqi_access_permission');
            if (userAccess === 'granted') {
                setHasAccessPermission(true);
            } else if (userAccess === 'pending') {
                setHasAccessPermission(false);
                setAccessStatus('pending');
            } else if (userAccess === 'denied') {
                setHasAccessPermission(false);
                setAccessStatus('denied');
            } else {
                setHasAccessPermission(false);
                setAccessStatus('none');
            }
        }
    }, [userAccount]);
    
    // 申请访问权限 - 打开弹窗
    const handleRequestAccess = () => {
        setApplyDialogOpen(true);
    };

    // 提交访问权限申请
    const handleSubmitAccess = () => {
        if (!applyRole) return;
        const account = userAccount || localStorage.getItem('zhiqi_user_account') || '';
        localStorage.setItem(`zhiqi_access_permission_${account}`, 'pending');
        localStorage.setItem('zhiqi_access_permission', 'pending');
        localStorage.setItem('zhiqi_access_role', applyRole);
        setAccessStatus('pending');
        setAccessRequestSubmitted(true);
        setApplyDialogOpen(false);
        setApplyRole('');
    };
    
    // 数据统计时间范围状态
    const [statsDateRange, setStatsDateRange] = useState("7days");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    
    // 根据日期范围生成统计数据
    const getStatsData = (range: string) => {
        const statsData: Record<string, {
            activeMembers: { count: number; total: number };
            lobsters: { normal: number; total: number };
            calls: { count: number; trend: string };
            tokens: { count: string; daily: string };
            memberRanking: Array<{
                rank: number;
                name: string;
                role: string;
                calls: number;
                percentage: number;
                trend: string;
            }>;
        }> = {
            today: {
                activeMembers: { count: 5, total: 12 },
                lobsters: { normal: 2, total: 3 },
                calls: { count: 21234, trend: "+3.2%" },
                tokens: { count: "312K", daily: "312K" },
                memberRanking: [
                    { rank: 1, name: "张三", role: "主账号", calls: 8234, percentage: 38.8, trend: "↑ 5.1%" },
                    { rank: 2, name: "李四", role: "管理员", calls: 5892, percentage: 27.8, trend: "↑ 2.3%" },
                    { rank: 3, name: "王五", role: "成员", calls: 3890, percentage: 18.3, trend: "↓ 1.2%" },
                    { rank: 4, name: "赵六", role: "成员", calls: 2156, percentage: 10.2, trend: "↑ 0.8%" },
                    { rank: 5, name: "孙七", role: "成员", calls: 1062, percentage: 5.0, trend: "- 0.0%" },
                ]
            },
            "7days": {
                activeMembers: { count: 8, total: 12 },
                lobsters: { normal: 2, total: 3 },
                calls: { count: 156789, trend: "+12.5%" },
                tokens: { count: "2.3M", daily: "328K" },
                memberRanking: [
                    { rank: 1, name: "张三", role: "主账号", calls: 52340, percentage: 33.4, trend: "↑ 8.2%" },
                    { rank: 2, name: "李四", role: "管理员", calls: 38920, percentage: 24.8, trend: "↑ 5.6%" },
                    { rank: 3, name: "王五", role: "成员", calls: 28450, percentage: 18.2, trend: "↓ 2.1%" },
                    { rank: 4, name: "赵六", role: "成员", calls: 21680, percentage: 13.8, trend: "↑ 3.4%" },
                    { rank: 5, name: "孙七", role: "成员", calls: 15399, percentage: 9.8, trend: "- 0.0%" },
                ]
            },
            "30days": {
                activeMembers: { count: 10, total: 12 },
                lobsters: { normal: 3, total: 3 },
                calls: { count: 689452, trend: "+28.3%" },
                tokens: { count: "9.8M", daily: "326K" },
                memberRanking: [
                    { rank: 1, name: "张三", role: "主账号", calls: 245120, percentage: 35.5, trend: "↑ 12.1%" },
                    { rank: 2, name: "李四", role: "管理员", calls: 156890, percentage: 22.8, trend: "↑ 8.9%" },
                    { rank: 3, name: "王五", role: "成员", calls: 125340, percentage: 18.2, trend: "↑ 4.5%" },
                    { rank: 4, name: "赵六", role: "成员", calls: 98760, percentage: 14.3, trend: "↑ 6.2%" },
                    { rank: 5, name: "孙七", role: "成员", calls: 63342, percentage: 9.2, trend: "↑ 1.8%" },
                ]
            },
            month: {
                activeMembers: { count: 11, total: 12 },
                lobsters: { normal: 3, total: 3 },
                calls: { count: 892156, trend: "+35.6%" },
                tokens: { count: "12.6M", daily: "420K" },
                memberRanking: [
                    { rank: 1, name: "张三", role: "主账号", calls: 312450, percentage: 35.0, trend: "↑ 15.3%" },
                    { rank: 2, name: "李四", role: "管理员", calls: 201890, percentage: 22.6, trend: "↑ 10.2%" },
                    { rank: 3, name: "王五", role: "成员", calls: 167890, percentage: 18.8, trend: "↑ 7.8%" },
                    { rank: 4, name: "赵六", role: "成员", calls: 125670, percentage: 14.1, trend: "↑ 9.1%" },
                    { rank: 5, name: "孙七", role: "成员", calls: 84256, percentage: 9.4, trend: "↑ 3.5%" },
                ]
            },
            custom: {
                activeMembers: { count: 6, total: 12 },
                lobsters: { normal: 2, total: 3 },
                calls: { count: 45678, trend: "+5.2%" },
                tokens: { count: "678K", daily: "226K" },
                memberRanking: [
                    { rank: 1, name: "张三", role: "主账号", calls: 15678, percentage: 34.3, trend: "↑ 4.5%" },
                    { rank: 2, name: "李四", role: "管理员", calls: 11234, percentage: 24.6, trend: "↑ 3.2%" },
                    { rank: 3, name: "王五", role: "成员", calls: 8976, percentage: 19.7, trend: "↓ 0.8%" },
                    { rank: 4, name: "赵六", role: "成员", calls: 6123, percentage: 13.4, trend: "↑ 1.5%" },
                    { rank: 5, name: "孙七", role: "成员", calls: 3667, percentage: 8.0, trend: "- 0.0%" },
                ]
            }
        };
        return statsData[range] || statsData["7days"];
    };
    
    const currentStats = getStatsData(statsDateRange);
    
    // 配额编辑弹窗状态
    const [quotaEditOpen, setQuotaEditOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<{
        id: string;
        name: string;
        callsUsed: number;
        callsTotal: number;
        tokensUsed: number;
        tokensTotal: number;
    } | null>(null);
    const [tempCallsQuota, setTempCallsQuota] = useState("");
    const [tempTokensQuota, setTempTokensQuota] = useState("");
    
    // 添加成员抽屉状态
    const [addMemberDrawerOpen, setAddMemberDrawerOpen] = useState(false);
    const [memberSearchKeyword, setMemberSearchKeyword] = useState("");
    const [selectedAddMember, setSelectedAddMember] = useState<{
        id: string;
        name: string;
        email: string;
    } | null>(null);
    const [newMemberCallsQuota, setNewMemberCallsQuota] = useState("");
    const [newMemberTokensQuota, setNewMemberTokensQuota] = useState("");
    
    // 可添加的成员列表（模拟租户下已添加但未分配配额的成员）
    const availableMembers = [
        { id: 'sunqi', name: '孙七', email: 'sunqi@360.cn' },
        { id: 'zhouba', name: '周八', email: 'zhouba@360.cn' },
        { id: 'wujiu', name: '吴九', email: 'wujiu@360.cn' },
        { id: 'zhengshi', name: '郑十', email: 'zhengshi@360.cn' },
        { id: 'wangshiyi', name: '王十一', email: 'wangshiyi@360.cn' },
    ];
    
    // 搜索成员
    const filteredAvailableMembers = availableMembers.filter(member => 
        member.name.includes(memberSearchKeyword) || 
        member.email.includes(memberSearchKeyword) ||
        member.id.includes(memberSearchKeyword)
    );
    
    // 确认添加成员
    const handleConfirmAddMember = () => {
        if (!selectedAddMember) return;
        console.log('添加成员:', {
            ...selectedAddMember,
            callsQuota: newMemberCallsQuota || '不限制',
            tokensQuota: newMemberTokensQuota || '不限制'
        });
        // 关闭抽屉并重置状态
        setAddMemberDrawerOpen(false);
        setSelectedAddMember(null);
        setMemberSearchKeyword("");
        setNewMemberCallsQuota("");
        setNewMemberTokensQuota("");
        // TODO: 实际添加成员到列表
        alert(`成员 ${selectedAddMember.name} 添加成功！`);
    };
    
    // 当前用户角色 - 从选中的企业获取
    const currentUserRole = selectedEnterprise.role;
    
    // 根据角色过滤菜单
    const visibleMenuItems = allMenuItems.filter(item => item.roles.includes(currentUserRole));

    // 初始化时从localStorage读取用户信息（使用zhiqi登录态）
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('zhiqi_logged_in');
        if (!isLoggedIn) {
            // 未登录，跳转到登录页
            window.location.href = '/zhiqi/login';
            return;
        }
        const userInfoStr = localStorage.getItem('zhiqi_user_info');
        if (userInfoStr) {
            try {
                const userInfo = JSON.parse(userInfoStr);
                // 优先显示账号，其次名称，最后手机号
                const account = userInfo.account || '';
                const name = userInfo.name || userInfo.phone || '用户';
                setUsername(name);
                setUserAccount(account);
                
                // 根据用户账号动态生成企业列表
                if (account && userEnterpriseRolesMap[account]) {
                    const userEnterpriseList = getEnterpriseListForUser(account);
                    setEnterpriseList(userEnterpriseList);
                    // 默认选中第一个企业
                    setSelectedEnterprise(userEnterpriseList[0]);
                }
            } catch (e) {
                setUsername('用户');
            }
        }
    }, []);
    
    // 退出登录
    const handleLogout = () => {
        localStorage.removeItem('zhiqi_logged_in');
        localStorage.removeItem('zhiqi_user_info');
        // 跳转到智企官网页面
        window.location.href = '/zhiqi/';
    };

    // 切换企业时检查当前菜单是否可见
    useEffect(() => {
        const visibleItems = allMenuItems.filter(item => item.roles.includes(selectedEnterprise.role));
        if (!visibleItems.find(item => item.name === activeMenu)) {
            setActiveMenu(visibleItems[0]?.name || "我的首页");
        }
    }, [selectedEnterprise]);
    const [usageDateRange, setUsageDateRange] = useState("7days");
    const [usageModelFilter, setUsageModelFilter] = useState("all");
    const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

    const generateCustomRangeData = (startDate: Date, endDate: Date) => {
        const data = [];
        const currentDate = new Date(startDate);
        let baseCalls = 1000 + Math.floor(Math.random() * 2000);

        while (currentDate <= endDate) {
            const fluctuation = Math.floor(Math.random() * 1000) - 300;
            baseCalls = Math.max(500, baseCalls + fluctuation);
            const calls = baseCalls;
            const tokens = calls * (35 + Math.floor(Math.random() * 20));
            const successRate = 99 + Math.random() * 0.9;
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");

            data.push({
                date: `${year}-${month}-${day}`,
                calls,
                tokens,
                successRate: parseFloat(successRate.toFixed(1))
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return data;
    };

    const getFilteredData = () => {
        const today = new Date("2025-03-30");
        let startDate: Date;

        switch (usageDateRange) {
        case "today":
            startDate = today;
            break;
        case "7days":
            startDate = new Date(today);
            startDate.setDate(startDate.getDate() - 6);
            break;
        case "30days":
            startDate = new Date(today);
            startDate.setDate(startDate.getDate() - 29);
            break;
        case "custom":
            if (customStartDate && customEndDate) {
                const start = new Date(customStartDate);
                const end = new Date(customEndDate);

                const existingData = dailyUsageData.filter(item => {
                    const date = new Date(item.date);
                    return date >= start && date <= end;
                });

                if (existingData.length === 0) {
                    return generateCustomRangeData(start, end);
                }

                const expectedDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                if (existingData.length < expectedDays) {
                    return generateCustomRangeData(start, end);
                }

                return existingData;
            }

            return dailyUsageData;
        default:
            startDate = new Date(today);
            startDate.setDate(startDate.getDate() - 6);
        }

        return dailyUsageData.filter(item => {
            const date = new Date(item.date);
            return date >= startDate && date <= today;
        });
    };

    const filteredData = getFilteredData();

    const calculateStats = () => {
        if (filteredData.length === 0) {
            return {
                totalCalls: 0,
                totalTokens: 0,
                avgCalls: 0,
                avgSuccessRate: 0,
                maxCalls: 0,
                maxCallsDate: "",
                minCalls: 0,
                minCallsDate: "",
                maxTokens: 0
            };
        }

        const totalCalls = filteredData.reduce((sum, item) => sum + item.calls, 0);
        const totalTokens = filteredData.reduce((sum, item) => sum + item.tokens, 0);
        const avgCalls = Math.round(totalCalls / filteredData.length);
        const avgSuccessRate = (filteredData.reduce((sum, item) => sum + item.successRate, 0) / filteredData.length).toFixed(1);
        const maxCallsItem = filteredData.reduce((max, item) => item.calls > max.calls ? item : max, filteredData[0]);
        const minCallsItem = filteredData.reduce((min, item) => item.calls < min.calls ? item : min, filteredData[0]);
        const maxTokensItem = filteredData.reduce((max, item) => item.tokens > max.tokens ? item : max, filteredData[0]);

        return {
            totalCalls,
            totalTokens,
            avgCalls,
            avgSuccessRate,
            maxCalls: maxCallsItem.calls,
            maxCallsDate: maxCallsItem.date,
            minCalls: minCallsItem.calls,
            minCallsDate: minCallsItem.date,
            maxTokens: maxTokensItem.tokens
        };
    };

    const stats = calculateStats();

    const calculateModelUsageData = () => {
        if (filteredData.length === 0) {
            return modelUsageBaseData.map(item => ({
                ...item,
                calls: 0,
                percentage: 0
            }));
        }

        const totalCalls = stats.totalCalls;
        const modelRatios = [0.42, 0.18, 0.15, 0.12, 0.08, 0.05];

        return modelUsageBaseData.map((item, index) => {
            const ratio = modelRatios[index] || 0.05;
            const calls = Math.round(totalCalls * ratio * (0.85 + Math.random() * 0.3));
            const percentage = totalCalls > 0 ? parseFloat((calls / totalCalls * 100).toFixed(1)) : 0;

            return {
                ...item,
                calls,
                percentage
            };
        });
    };

    const modelUsageData = calculateModelUsageData();

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K";
        }

        return num.toString();
    };

    const [apiKeys, setApiKeys] = useState(apiKeyList);
    const [newKeyDialogOpen, setNewKeyDialogOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set());
    const [apiKeySearchQuery, setApiKeySearchQuery] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [openClaws, set龙虾s] = useState(openClawList);
    const [newClawDialogOpen, setNewClawDialogOpen] = useState(false);
    const [editingClawId, setEditingClawId] = useState<number | null>(null);
    const [newClawName, setNewClawName] = useState("");
    const [newClawDesc, setNewClawDesc] = useState("");
    const [newClawModels, setNewClawModels] = useState<string[]>([]);
    const [newClawApiKey, setNewClawApiKey] = useState(apiKeyList[0]?.key || "");
    const [openClawSearchQuery, set龙虾SearchQuery] = useState("");
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    
    // 订单支付状态
    const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
    const [payDrawerOpen, setPayDrawerOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<typeof resourcePackages[0] | null>(null);
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [orderSuccess, setOrderSuccess] = useState(false);
    
    // 配额不足提示弹窗
    const [quotaInsufficientDialogOpen, setQuotaInsufficientDialogOpen] = useState(false);
    
    // 余额不足提示弹窗
    const [balanceInsufficientDialogOpen, setBalanceInsufficientDialogOpen] = useState(false);
    
    // 购买成功弹窗
    const [purchaseSuccessDialogOpen, setPurchaseSuccessDialogOpen] = useState(false);
    
    // 购买来源模块：'AI计划' | '龙虾'
    const [purchaseSource, setPurchaseSource] = useState<'AI计划' | '龙虾'>('AI计划');
    
    // 当前激活的套餐名称
    const [activePackageName, setActivePackageName] = useState('基础开发包');

    // 订单列表
    const [orderList, setOrderList] = useState<{id: number; packageName: string; quantity: number; amount: number; status: string; createdAt: string}[]>([]);

    // 套餐数据
    const resourcePackages = [
        { id: 1, name: '初级套餐', price: '¥40.00', priceNum: 40, originalPrice: '¥80.00', originalPriceNum: 80, calls: '约18,000次/月', tokens: '约1,200次/5小时', validity: '1个月', features: ['支持GLM、Deepseek、Kimi、Qwen等AI模型', '适配Claude Code、Cursor、OpenClaw等编码工具', '基础技术支持', '少量调用额度'], hot: false },
        { id: 2, name: '中级套餐', price: '¥100.00', priceNum: 100, originalPrice: '¥200.00', originalPriceNum: 200, calls: '约60,000次/月', tokens: '约4,000次/5小时', validity: '1个月', features: ['支持GLM、Deepseek、Kimi、Qwen等AI模型', '适配Claude Code、Cursor、OpenClaw等编码工具', '优先技术支持', '中等调用额度'], hot: true },
        { id: 3, name: '高级套餐', price: '¥200.00', priceNum: 200, originalPrice: '¥400.00', originalPriceNum: 400, calls: '约150,000次/月', tokens: '约10,000次/5小时', validity: '1个月', features: ['支持GLM、Deepseek、Kimi、Qwen等AI模型', '适配Claude Code、Cursor、OpenClaw等编码工具', '优先技术支持', '更高调用额度'], hot: false },
    ];
    
    // 打开订单抽屉
    const openOrderDrawer = (pkg: typeof resourcePackages[0], source: 'AI计划' | '龙虾' = 'AI计划') => {
        setSelectedPackage(pkg);
        setOrderQuantity(1);
        setPurchaseSource(source);
        setOrderDrawerOpen(true);
    };
    
    // 确认订单，打开支付抽屉
    const confirmOrder = () => {
        setOrderDrawerOpen(false);
        setPayDrawerOpen(true);
        setOrderSuccess(false);
    };
    
    // 支付成功
    const handlePaySuccess = () => {
        // 成员角色配额不足场景下显示余额不足提示
        if (memberScenario === 'quota-insufficient') {
            setPayDrawerOpen(false);
            setBalanceInsufficientDialogOpen(true);
            return;
        }
        
        if (selectedPackage) {
            // 使用订单模块创建订单
            const newOrder = createPackageOrder({
                packageId: selectedPackage.id,
                packageName: selectedPackage.name,
                quantity: orderQuantity,
                amount: selectedPackage.priceNum * orderQuantity,
                validity: selectedPackage.validity,
                creator: userAccount || username,
            });
            
            // 更新本地订单列表状态（用于页面展示）
            setOrderList([{
                id: newOrder.id,
                packageName: newOrder.packageName || '',
                quantity: newOrder.quantity,
                amount: newOrder.orderAmount,
                status: '已完成',
                createdAt: newOrder.createTime
            }, ...orderList]);

            // 切换到套餐有效场景
            setCurrentScenario('package-valid');
            setActivePackageName(selectedPackage.name);
        }
        // 关闭支付抽屉，弹出购买成功弹窗
        setPayDrawerOpen(false);
        setOrderSuccess(false);
        setPurchaseSuccessDialogOpen(true);
    };
    
    // 关闭支付抽屉
    const closePayDrawer = () => {
        setPayDrawerOpen(false);
        setOrderSuccess(false);
    };

    // 龙虾状态数据
    const lobsterStatus = {
        name: '我的龙虾',
        level: '黄金会员',
        health: 95,
        exp: 7560,
        nextLevelExp: 10000,
        achievements: ['连续调用7天', '首次调用破万', '多模型集成'],
        recentActivity: [
            { time: '2分钟前', action: '调用大语言模型', count: '520次' },
            { time: '15分钟前', action: '调用图像理解', count: '180次' },
            { time: '1小时前', action: '套餐续费成功', count: '' },
        ],
    };

    // 根据场景获取不同的数据
    const getScenarioData = () => {
        const baseStats = {
            lobster: { normal: '3', total: '3' },
            todayConsumption: { value: '1,390', change: '+8.2%' },
            totalConsumption: { value: '128,456', change: '+5.6%' },
            quota: { used: 12340, total: 100000, percent: 87.66 },
            seatsUsed: 2,
            seatsTotal: 10,
            amountUsed: 1440,
            amountTotal: 10000,
            showQuotaWarning: false,
            showExpiredWarning: false,
            showNoPackageWarning: false,
            showQuotaInsufficientWarning: false,
        };

        // 管理员角色使用 currentScenario
        if (selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') {
            switch (currentScenario) {
                case 'no-package':
                    return {
                        ...baseStats,
                        lobster: { normal: '0', total: '0' },
                        todayConsumption: { value: '0', change: '-%' },
                        totalConsumption: { value: '0', change: '-%' },
                        quota: { used: 0, total: 100000, percent: 100 },
                        seatsUsed: 0,
                        seatsTotal: 10,
                        amountUsed: 0,
                        amountTotal: 10000,
                        showNoPackageWarning: true,
                    };
                case 'package-valid':
                    return {
                        ...baseStats,
                        lobster: { normal: '2', total: '3' },
                        quota: { used: 12340, total: 100000, percent: 87.66 },
                        seatsUsed: 2,
                        seatsTotal: 10,
                        amountUsed: 1440,
                        amountTotal: 10000,
                    };
                case 'package-invalid':
                    return {
                        ...baseStats,
                        lobster: { normal: '3', total: '3' },
                        quota: { used: 50000, total: 100000, percent: 50 },
                        seatsUsed: 5,
                        seatsTotal: 10,
                        amountUsed: 5000,
                        amountTotal: 10000,
                    };
                default:
                    return baseStats;
            }
        }
        
        // 成员角色使用 memberScenario
        switch (memberScenario) {
            case 'no-quota':
                return {
                    ...baseStats,
                    lobster: { normal: '0', total: '0' },
                    todayConsumption: { value: '0', change: '-%' },
                    totalConsumption: { value: '0', change: '-%' },
                    quota: { used: 0, total: 0, percent: 0 },
                    seatsUsed: 0,
                    seatsTotal: 0,
                    amountUsed: 0,
                    amountTotal: 0,
                    showNoQuotaWarning: true,
                };
            case 'quota-assigned-no-package':
                // 和企业管理员"未购买套餐"场景一致
                return {
                    ...baseStats,
                    lobster: { normal: '0', total: '0' },
                    todayConsumption: { value: '0', change: '-%' },
                    totalConsumption: { value: '0', change: '-%' },
                    quota: { used: 0, total: 10000, percent: 100 },
                    seatsUsed: 0,
                    seatsTotal: 1,
                    amountUsed: 0,
                    amountTotal: 500,
                    showNoPackageWarning: true,
                };
            case 'quota-insufficient':
                // 配额不足场景 - 展示和未购买套餐一样，但购买时需要提示配额不足
                return {
                    ...baseStats,
                    lobster: { normal: '0', total: '0' },
                    todayConsumption: { value: '0', change: '-%' },
                    totalConsumption: { value: '0', change: '-%' },
                    quota: { used: 10000, total: 10000, percent: 100 }, // 配额已用尽
                    seatsUsed: 1,
                    seatsTotal: 1,
                    amountUsed: 500,
                    amountTotal: 500,
                    showQuotaInsufficientWarning: true, // 特殊标记：配额不足
                };
            case 'package-valid':
                // 和企业管理员"已购买套餐有效"场景一致
                return {
                    ...baseStats,
                    lobster: { normal: '2', total: '3' },
                    quota: { used: 5000, total: 10000, percent: 50 },
                    seatsUsed: 1,
                    seatsTotal: 1,
                    amountUsed: 100,
                    amountTotal: 500,
                };
            case 'package-invalid':
                // 成员套餐失效场景：配额模块背景色与有效场景一致，不设置 showExpiredWarning
                return {
                    ...baseStats,
                    lobster: { normal: '3', total: '3' },
                    quota: { used: 5000, total: 10000, percent: 50 },
                    seatsUsed: 1,
                    seatsTotal: 1,
                    amountUsed: 300,
                    amountTotal: 500,
                };
            default:
                return baseStats;
        }
    };

    const scenarioData = getScenarioData();

    // 判断是否显示空状态（管理员：未购买套餐；成员：未被分配配额、未购买套餐、配额不足）
    const shouldShowEmptyState = (selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') 
        ? currentScenario === 'no-package' 
        : memberScenario === 'no-quota' || memberScenario === 'quota-assigned-no-package' || memberScenario === 'quota-insufficient';

    // 调用量数据 - 根据场景动态生成（只保留我的配额）
    const quotaInfo = { 
        name: '我的配额', 
        value: (selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') 
            ? `￥${scenarioData.quota.used.toLocaleString()} / 不限` 
            : `￥${scenarioData.quota.used.toLocaleString()} / ￥${scenarioData.quota.total.toLocaleString()}`, 
        change: '', 
        trend: 'up', 
        type: 'quota', 
        quotaPercent: (selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') 
            ? 0 
            : (scenarioData.quota.total > 0 ? Math.round((scenarioData.quota.used / scenarioData.quota.total) * 100) : 0),
        isUnlimited: (selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin')
    };
    
    // 计算规则说明
    const calculationRules = {
        up: '较昨日同期数据增长',
        down: '较昨日同期数据下降',
        same: '与昨日同期数据持平',
    };
    
    // 欢迎横幅展开状态
    const [bannerExpanded, setBannerExpanded] = useState(false);
    
    // 套餐失效提示显示状态
    const [showPackageInvalidTip, setShowPackageInvalidTip] = useState(true);
    
    const adminAccount = selectedEnterprise.adminAccount || 'zhaoliu';

    // 渲染"我的首页"内容
    const renderHomePage = () => (
        <div className="space-y-6">
            {/* 管理员提示条 */}
            {(selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') && (
                <div className="flex items-center justify-between px-4 py-2.5 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-800">可在管理后台授权企业成员使用，支持给每个成员设置消费限额</span>
                    </div>
                    <button 
                        onClick={() => window.open('/admin?tab=members', '_blank')}
                        className="px-3 py-1 bg-amber-500 text-white text-sm rounded hover:bg-amber-600 transition-colors"
                    >
                        去设置
                    </button>
                </div>
            )}
            
            {/* 欢迎横幅 - 左右分栏样式，点击展开/收起 */}
            <div className="relative">
            <div 
                className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden relative mb-5 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setBannerExpanded(!bannerExpanded)}
            >
                <div className={`transition-all duration-300 ${bannerExpanded ? 'p-4' : 'h-[40px] flex items-center px-4'}`}>
                    <div className={`flex items-center ${bannerExpanded ? 'gap-4' : 'w-full'}`}>
                        {/* 左侧：主题图片 - 收起时隐藏，展开时显示 */}
                        <div className={`hidden md:block transition-all duration-300 ${bannerExpanded ? 'opacity-100 w-[140px]' : 'opacity-0 w-0 overflow-hidden'}`}>
                            <div className="relative">
                                <img 
                                    src="/welcome-banner.png" 
                                    alt="360智企" 
                                    className="w-full h-[80px] object-cover rounded-lg"
                                />
                            </div>
                        </div>
                        
                        {/* 右侧：文字内容 */}
                        <div className={`flex-1 ${bannerExpanded ? '' : 'flex items-center w-full'}`}>
                            <h1 className={`font-bold text-gray-900 text-left ${bannerExpanded ? 'text-lg mb-2' : 'text-sm flex items-center'}`}>
                                欢迎使用 <span className="text-blue-600">360智企</span>
                                <span className={`ml-2 inline-flex items-center text-xs font-normal text-gray-400`}>
                                    {bannerExpanded ? (
                                        <>
                                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                            点击收起
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                            点击展开
                                        </>
                                    )}
                                </span>
                            </h1>
                            
                            {bannerExpanded && (
                                <>
                                    <p className="text-gray-600 mb-3 leading-relaxed text-left text-sm">
                                        360智企是专为企业打造的智慧办公平台，以大模型和智能体为核心技术底座，提供一站式大模型+智能体数字化服务，全方位赋能员工，助力企业办公效率提升。
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* AI计划和龙虾套餐 + 我的配额 - 左右分栏布局（套餐3/4，配额1/4） */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 左侧：AI计划和龙虾套餐 - 占3/4宽度 */}
                <div className="lg:col-span-3 space-y-5">
                    {/* AI计划套餐 - 管理员所有场景展示，成员特定场景展示 */}
                    {((selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') || 
                      selectedEnterprise.role === 'member' && memberScenario !== 'no-quota') && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                                <h2 className="text-base font-semibold text-gray-900">AI计划</h2>
                            </div>
                            <button
                                onClick={() => setActiveMenu("AI计划")}
                                className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                            >
                                去使用
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* 套餐卡片1 - 初级套餐 */}
                            <div className="bg-white rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow flex flex-col">
                                <div className="text-center mb-3">
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">AI计划 初级套餐</h3>
                                    <div className="flex items-baseline justify-center gap-0.5">
                                        <span className="text-2xl font-bold text-orange-500">¥40</span>
                                        <span className="text-xs text-gray-400">/月</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">满足普通用户使用量</p>
                                </div>
                                {/* 限额 */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                    <div className="text-xs text-gray-400 mb-2">限额</div>
                                    <div className="space-y-1.5 text-xs text-gray-600">
                                        <div className="flex justify-between"><span>每5小时</span><span>约1,200次请求</span></div>
                                        <div className="flex justify-between"><span>每周</span><span>约9,000次请求</span></div>
                                        <div className="flex justify-between"><span>每订阅月</span><span>约18,000次请求</span></div>
                                    </div>
                                </div>
                                {/* 权益 */}
                                <div className="space-y-2 mb-4 flex-1">
                                    {['支持GLM、Deepseek、Kimi、Qwen等AI模型', '适配Claude Code、Cursor、OpenClaw等编码工具', '基础技术支持', '少量调用额度'].map(f => (
                                        <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                                            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </span>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => openOrderDrawer(resourcePackages[0], 'AI计划')}
                                    className="w-full py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    立即购买
                                </button>
                            </div>
                            {/* 套餐卡片2 - 中级套餐 */}
                            <div className="bg-white rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow flex flex-col relative">
                                <span className="absolute -top-2 right-4 text-xs text-white bg-orange-500 px-2.5 py-0.5 rounded-full">热门</span>
                                <div className="text-center mb-3">
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">AI计划 中级套餐</h3>
                                    <div className="flex items-baseline justify-center gap-0.5">
                                        <span className="text-2xl font-bold text-orange-500">¥100</span>
                                        <span className="text-xs text-gray-400">/月</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">满足进阶用户使用量</p>
                                </div>
                                {/* 限额 */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                    <div className="text-xs text-gray-400 mb-2">限额</div>
                                    <div className="space-y-1.5 text-xs text-gray-600">
                                        <div className="flex justify-between"><span>每5小时</span><span>约4,000次请求</span></div>
                                        <div className="flex justify-between"><span>每周</span><span>约30,000次请求</span></div>
                                        <div className="flex justify-between"><span>每订阅月</span><span>约60,000次请求</span></div>
                                    </div>
                                </div>
                                {/* 权益 */}
                                <div className="space-y-2 mb-4 flex-1">
                                    {['支持GLM、Deepseek、Kimi、Qwen等AI模型', '适配Claude Code、Cursor、OpenClaw等编码工具', '优先技术支持', '中等调用额度'].map(f => (
                                        <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                                            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </span>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                {((selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') && currentScenario === 'package-valid') || (selectedEnterprise.role === 'member' && memberScenario === 'package-valid') ? (
                                    <button 
                                        disabled
                                        className="w-full py-2 bg-gray-100 text-gray-500 text-sm rounded-lg cursor-not-allowed"
                                    >
                                        已购，使用中
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => openOrderDrawer(resourcePackages[1], 'AI计划')}
                                        className="w-full py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        立即购买
                                    </button>
                                )}
                            </div>
                            {/* 套餐卡片3 - 高级套餐 */}
                            <div className="bg-white rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow flex flex-col">
                                <div className="text-center mb-3">
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">AI计划 高级套餐</h3>
                                    <div className="flex items-baseline justify-center gap-0.5">
                                        <span className="text-2xl font-bold text-orange-500">¥200</span>
                                        <span className="text-xs text-gray-400">/月</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">满足专业用户使用量</p>
                                </div>
                                {/* 限额 */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                    <div className="text-xs text-gray-400 mb-2">限额</div>
                                    <div className="space-y-1.5 text-xs text-gray-600">
                                        <div className="flex justify-between"><span>每5小时</span><span>约10,000次请求</span></div>
                                        <div className="flex justify-between"><span>每周</span><span>约75,000次请求</span></div>
                                        <div className="flex justify-between"><span>每订阅月</span><span>约150,000次请求</span></div>
                                    </div>
                                </div>
                                {/* 权益 */}
                                <div className="space-y-2 mb-4 flex-1">
                                    {['支持GLM、Deepseek、Kimi、Qwen等AI模型', '适配Claude Code、Cursor、OpenClaw等编码工具', '优先技术支持', '更高调用额度'].map(f => (
                                        <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                                            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </span>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                {((selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') && currentScenario === 'package-valid') || (selectedEnterprise.role === 'member' && memberScenario === 'package-valid') ? (
                                    <button 
                                        disabled
                                        className="w-full py-2 bg-gray-100 text-gray-500 text-sm rounded-lg cursor-not-allowed"
                                    >
                                        已购，使用中
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => openOrderDrawer(resourcePackages[2], 'AI计划')}
                                        className="w-full py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        立即购买
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* 龙虾套餐 */}
                {((selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') || 
                  selectedEnterprise.role === 'member' && memberScenario !== 'no-quota') && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-green-600" />
                                <h2 className="text-base font-semibold text-gray-900">龙虾</h2>
                            </div>
                            <button
                                onClick={() => setActiveMenu("龙虾")}
                                className="text-sm text-green-600 hover:text-green-700 transition-colors flex items-center gap-1"
                            >
                                去使用
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* 龙虾套餐卡片1 - 新手体验包（免费，仍可领取） */}
                            <div className="bg-white rounded-xl p-5 border border-green-100 hover:shadow-md transition-shadow flex flex-col">
                                <div className="text-center mb-3">
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">龙虾 新手体验包</h3>
                                    <div className="flex items-baseline justify-center gap-0.5">
                                        <span className="text-2xl font-bold text-orange-500">¥0</span>
                                        <span className="text-xs text-gray-400">/月</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">满足新用户体验使用量</p>
                                </div>
                                {/* 限额 */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                    <div className="text-xs text-gray-400 mb-2">限额</div>
                                    <div className="space-y-1.5 text-xs text-gray-600">
                                        <div className="flex justify-between"><span>每5小时</span><span>约1,200次请求</span></div>
                                        <div className="flex justify-between"><span>每周</span><span>约5,000次请求</span></div>
                                        <div className="flex justify-between"><span>每订阅月</span><span>10万次调用</span></div>
                                    </div>
                                </div>
                                {/* 权益 */}
                                <div className="space-y-2 mb-4 flex-1">
                                    {['大语言模型', '图像理解', '语音识别'].map(f => (
                                        <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                                            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </span>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => openOrderDrawer(resourcePackages[0], '龙虾')}
                                    className="w-full py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    立即领取
                                </button>
                            </div>
                            {/* 龙虾套餐卡片2 - 基础开发包（已购） */}
                            <div className="bg-white rounded-xl p-5 border border-green-100 hover:shadow-md transition-shadow flex flex-col relative">
                                <span className="absolute -top-2 right-4 text-xs text-white bg-orange-500 px-2.5 py-0.5 rounded-full">热门</span>
                                <div className="text-center mb-3">
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">龙虾 基础套餐</h3>
                                    <div className="flex items-baseline justify-center gap-0.5">
                                        <span className="text-2xl font-bold text-orange-500">¥40</span>
                                        <span className="text-xs text-gray-400">/月</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">满足普通用户使用量</p>
                                </div>
                                {/* 限额 */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                    <div className="text-xs text-gray-400 mb-2">限额</div>
                                    <div className="space-y-1.5 text-xs text-gray-600">
                                        <div className="flex justify-between"><span>每5小时</span><span>约3,000次请求</span></div>
                                        <div className="flex justify-between"><span>每周</span><span>约20,000次请求</span></div>
                                        <div className="flex justify-between"><span>每订阅月</span><span>100万次调用</span></div>
                                    </div>
                                </div>
                                {/* 权益 */}
                                <div className="space-y-2 mb-4 flex-1">
                                    {['全部模型', 'API无限调用', '技术支持'].map(f => (
                                        <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                                            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </span>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                {((selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') && currentScenario === 'package-valid') || (selectedEnterprise.role === 'member' && memberScenario === 'package-valid') ? (
                                    <button 
                                        disabled
                                        className="w-full py-2 bg-gray-100 text-gray-500 text-sm rounded-lg cursor-not-allowed"
                                    >
                                        已购，使用中
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => openOrderDrawer(resourcePackages[1], '龙虾')}
                                        className="w-full py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        立即购买
                                    </button>
                                )}
                            </div>
                            {/* 龙虾套餐卡片3 - 企业级套餐（已购） */}
                            <div className="bg-white rounded-xl p-5 border border-green-100 hover:shadow-md transition-shadow flex flex-col">
                                <div className="text-center mb-3">
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">龙虾 企业套餐</h3>
                                    <div className="flex items-baseline justify-center gap-0.5">
                                        <span className="text-2xl font-bold text-orange-500">¥250</span>
                                        <span className="text-xs text-gray-400">/月</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">满足企业级使用量</p>
                                </div>
                                {/* 限额 */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                    <div className="text-xs text-gray-400 mb-2">限额</div>
                                    <div className="space-y-1.5 text-xs text-gray-600">
                                        <div className="flex justify-between"><span>每5小时</span><span>约10,000次请求</span></div>
                                        <div className="flex justify-between"><span>每周</span><span>约100,000次请求</span></div>
                                        <div className="flex justify-between"><span>每订阅月</span><span>无限次调用</span></div>
                                    </div>
                                </div>
                                {/* 权益 */}
                                <div className="space-y-2 mb-4 flex-1">
                                    {['专属服务', 'SLA保障', '定制开发'].map(f => (
                                        <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                                            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </span>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                {((selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') && currentScenario === 'package-valid') || (selectedEnterprise.role === 'member' && memberScenario === 'package-valid') ? (
                                    <button 
                                        disabled
                                        className="w-full py-2 bg-gray-100 text-gray-500 text-sm rounded-lg cursor-not-allowed"
                                    >
                                        已购，使用中
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => openOrderDrawer(resourcePackages[2], '龙虾')}
                                        className="w-full py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        立即购买
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* 右侧：我的配额 - 仅在已分配配额场景下展示 */}
            {((selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') || 
              selectedEnterprise.role === 'member' && memberScenario !== 'no-quota') && (
            <div className="space-y-6">
                {/* 我的配额模块 */}
                    <div className={`rounded-xl border shadow-sm ${
                        scenarioData.showQuotaInsufficientWarning
                            ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100'
                            : scenarioData.showExpiredWarning 
                                ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100' 
                                : scenarioData.showQuotaWarning 
                                    ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100'
                                    : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100'
                    }`}>
                        <div className={`px-5 py-4 border-b flex items-center justify-between ${
                            scenarioData.showQuotaInsufficientWarning
                                ? 'border-pink-100' 
                                : scenarioData.showExpiredWarning 
                                    ? 'border-red-100' 
                                    : scenarioData.showQuotaWarning 
                                        ? 'border-orange-100'
                                        : 'border-orange-100'
                        }`}>
                            <h2 className="text-base font-semibold text-gray-900">我的配额</h2>
                            {scenarioData.showQuotaInsufficientWarning && (
                                <span className="text-xs text-pink-600 bg-pink-100 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    配额不足，请联系管理员({adminAccount})提配
                                </span>
                            )}
                        </div>
                        <div className="p-5">
                            {/* 已购套餐 */}
                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                                <span className="text-sm text-gray-600">已购套餐</span>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="font-bold text-gray-900">
                                        {/* 管理员角色判断 */}
                                        {(selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') && currentScenario === 'no-package' ? '0 个' : ''}
                                        {/* 成员角色判断 */}
                                        {selectedEnterprise.role === 'member' && (memberScenario === 'no-quota' || memberScenario === 'quota-assigned-no-package') ? '0 个' : ''}
                                        {/* 有套餐的场景 */}
                                        {(selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') && currentScenario !== 'no-package' ? '2 个' : ''}
                                        {selectedEnterprise.role === 'member' && (memberScenario === 'package-valid' || memberScenario === 'package-invalid') ? '2 个' : ''}
                                    </span>
                                    <span className="text-green-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                        {/* 管理员只看 currentScenario，成员只看 memberScenario */}
                                        {(selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') && currentScenario === 'package-valid' ? '2 生效中' : ''}
                                        {selectedEnterprise.role === 'member' && memberScenario === 'package-valid' ? '2 生效中' : ''}
                                        {((selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') && currentScenario !== 'package-valid') || (selectedEnterprise.role === 'member' && memberScenario !== 'package-valid') ? '0 生效中' : ''}
                                    </span>
                                    <span className="text-red-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                        {/* 管理员只看 currentScenario，成员只看 memberScenario */}
                                        {(selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') && currentScenario === 'package-invalid' ? '2 已失效' : ''}
                                        {selectedEnterprise.role === 'member' && memberScenario === 'package-invalid' ? '2 已失效' : ''}
                                        {((selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') && currentScenario !== 'package-invalid') || (selectedEnterprise.role === 'member' && memberScenario !== 'package-invalid') ? '0 已失效' : ''}
                                    </span>
                                </div>
                            </div>
                            
                            {/* 配额详情 - AI计划和龙虾 */}
                            <div className="space-y-4">
                                {/* AI计划配额 - 蓝色系 */}
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-sm text-gray-600 flex items-center gap-2 whitespace-nowrap">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                                            AI计划配额
                                        </span>
                                        <span className={`text-sm font-bold whitespace-nowrap ${
                                            quotaInfo.isUnlimited 
                                                ? 'text-blue-600'
                                                : scenarioData.showQuotaInsufficientWarning
                                                    ? 'text-pink-600'
                                                    : scenarioData.showExpiredWarning 
                                                        ? 'text-red-600' 
                                                        : scenarioData.showQuotaWarning 
                                                            ? 'text-orange-600'
                                                            : 'text-blue-600'
                                        }`}>
                                            {(selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') 
                                                ? quotaInfo.value 
                                                : `¥0 / ¥5000`}
                                        </span>
                                    </div>
                                    {/* 进度条 */}
                                    {quotaInfo.isUnlimited ? (
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 animate-pulse"
                                                style={{ width: '60%' }}
                                            ></div>
                                        </div>
                                    ) : (
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all ${
                                                    scenarioData.showQuotaInsufficientWarning
                                                        ? 'bg-pink-500'
                                                        : scenarioData.showExpiredWarning 
                                                            ? 'bg-red-500' 
                                                            : scenarioData.showQuotaWarning 
                                                                ? 'bg-orange-500'
                                                                : 'bg-blue-500'
                                                }`}
                                                style={{ width: `${Math.max(quotaInfo.quotaPercent || 0, 2)}%` }}
                                            ></div>
                                        </div>
                                    )}
                                    <div className="mt-1 text-xs text-gray-400 text-right">
                                        {quotaInfo.isUnlimited ? '配额充足' : `已用 ${quotaInfo.quotaPercent || 0}%`}
                                    </div>
                                </div>
                                
                                {/* 龙虾配额 - 绿色系 */}
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-sm text-gray-600 flex items-center gap-2 whitespace-nowrap">
                                            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                                            龙虾配额
                                        </span>
                                        <span className={`text-sm font-bold whitespace-nowrap ${
                                            quotaInfo.isUnlimited 
                                                ? 'text-green-600'
                                                : scenarioData.showQuotaInsufficientWarning
                                                    ? 'text-pink-600'
                                                    : scenarioData.showExpiredWarning 
                                                        ? 'text-red-600' 
                                                        : scenarioData.showQuotaWarning 
                                                            ? 'text-orange-600'
                                                            : 'text-green-600'
                                        }`}>
                                            {(selectedEnterprise.role === 'owner' || selectedEnterprise.role === 'admin') 
                                                ? quotaInfo.value 
                                                : `¥0 / ¥5000`}
                                        </span>
                                    </div>
                                    {/* 进度条 */}
                                    {quotaInfo.isUnlimited ? (
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full bg-gradient-to-r from-green-400 via-green-500 to-green-400 animate-pulse"
                                                style={{ width: '60%' }}
                                            ></div>
                                        </div>
                                    ) : (
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all ${
                                                    scenarioData.showQuotaInsufficientWarning
                                                        ? 'bg-pink-500'
                                                        : scenarioData.showExpiredWarning 
                                                            ? 'bg-red-500' 
                                                            : scenarioData.showQuotaWarning 
                                                                ? 'bg-orange-500'
                                                                : 'bg-green-500'
                                                }`}
                                                style={{ width: `${Math.max(quotaInfo.quotaPercent || 0, 2)}%` }}
                                            ></div>
                                        </div>
                                    )}
                                    <div className="mt-1 text-xs text-gray-400 text-right">
                                        {quotaInfo.isUnlimited ? '配额充足' : `已用 ${quotaInfo.quotaPercent || 0}%`}
                                    </div>
                                </div>
                            </div>
                            
                            {/* 配额已用尽告警提示 */}
                            {scenarioData.showQuotaWarning && (
                                <div className="mt-4 flex items-start gap-2 p-3 bg-orange-100 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 text-sm text-orange-700">
                                        {selectedEnterprise.role === 'member' ? (
                                            <>
                                                您的配额已用尽，为了避免影响使用，请尽快联系管理员提升配额。管理员：
                                                <span className="font-medium">{adminAccount}</span>
                                            </>
                                        ) : (
                                            <>
                                                您的配额已用尽，为了避免影响使用，请尽快
                                                <button 
                                                    onClick={() => {
                                                        window.open('/admin?tab=members', '_blank');
                                                    }}
                                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    提升配额
                                                </button>
                                                。
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            </div>
            
            {/* 判断是否显示空状态提示 - 仅成员"未被分配配额"场景显示专属提示 */}
            {shouldShowEmptyState && selectedEnterprise.role === 'member' && memberScenario === 'no-quota' ? (
                /* 未被分配配额场景：显示提示信息 */
                <div className="bg-white rounded-xl p-8 border border-gray-200 text-center max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 relative">
                        {/* 金色挂锁图标 */}
                        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                            {/* 锁身 */}
                            <rect x="12" y="28" width="40" height="28" rx="4" fill="#F59E0B"/>
                            <rect x="12" y="28" width="40" height="28" rx="4" fill="url(#lockGradient)"/>
                            {/* 锁孔 */}
                            <circle cx="32" cy="42" r="5" fill="#1F2937"/>
                            <rect x="30" y="42" width="4" height="8" fill="#1F2937"/>
                            {/* 锁梁 */}
                            <path d="M20 28V20C20 12.268 26.268 6 34 6V6C41.732 6 48 12.268 48 20V28" stroke="#9CA3AF" strokeWidth="5" strokeLinecap="round" fill="none"/>
                            <path d="M20 28V20C20 12.268 26.268 6 34 6V6C41.732 6 48 12.268 48 20V28" stroke="url(#shackleGradient)" strokeWidth="5" strokeLinecap="round" fill="none"/>
                            {/* 高光 */}
                            <rect x="16" y="32" width="8" height="4" rx="1" fill="white" fillOpacity="0.3"/>
                            <defs>
                                <linearGradient id="lockGradient" x1="12" y1="28" x2="52" y2="56" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#FBBF24"/>
                                    <stop offset="1" stopColor="#D97706"/>
                                </linearGradient>
                                <linearGradient id="shackleGradient" x1="20" y1="6" x2="48" y2="28" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#E5E7EB"/>
                                    <stop offset="1" stopColor="#9CA3AF"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        当前企业尚未给您分配使用配额
                    </h2>
                    <p className="text-gray-500 mb-6">
                        请联系企业管理员申请
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                        <span className="text-sm text-gray-600">管理员账号：</span>
                        <span className="text-sm font-medium text-gray-900">{adminAccount}</span>
                    </div>
                </div>
            ) : (
                /* 正常场景：此分支已不再需要，配额信息已在上面左右分栏中展示 */
                null
            )}
            </div>
            {/* 置灰容器结束 */}
        </div>
    );

    // 访问权限控制：未获得访问权限时显示对应状态页面
    if (accessControlEnabled && !hasAccessPermission) {
        return (
            <div className="min-h-screen bg-[#f5f7fa] overflow-x-hidden">
                {/* 顶部导航栏 */}
                <header className="fixed top-0 left-0 right-0 h-[50px] bg-white z-[1000] flex items-center justify-between px-4 border-b border-gray-100">
                    <div className="flex items-center">
                        <Link href="/console" className="flex items-center mr-4">
                            <div className="flex items-center">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mr-1.5">
                                    <path d="M14 2C7.37 2 2 7.37 2 14C2 20.63 7.37 26 14 26C16.95 26 19.7 24.95 21.8 23.1L20.3 21.6C18.6 23.1 16.4 24 14 24C8.48 24 4 19.52 4 14C4 8.48 8.48 4 14 4C16.5 4 18.7 4.9 20.4 6.4L21.9 4.9C19.75 2.95 17 2 14 2Z" fill="#1a5cff" />
                                    <path d="M22 6L24 10L20 10L22 6Z" fill="#1a5cff" />
                                    <path d="M14 6C10.13 6 7 9.13 7 13C7 16.87 10.13 20 14 20C16.1 20 18 19.1 19.2 17.7L17.8 16.3C17 17.3 15.6 18 14 18C11.24 18 9 15.76 9 13C9 10.24 11.24 8 14 8C15.4 8 16.7 8.5 17.6 9.4L19 8C17.6 6.7 15.9 6 14 6Z" fill="#00d4aa" />
                                    <path d="M19 3L21 7L17 7L19 3Z" fill="#00d4aa" />
                                </svg>
                                <span className="text-[17px] font-bold text-[#2c3e50] tracking-tight">360</span>
                                <span className="text-[17px] font-bold text-[#2c3e50] ml-0.5 tracking-tight">智企</span>
                            </div>
                        </Link>
                        <div className="relative">
                            <div className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded cursor-default text-sm">
                                <span className="w-4 h-4 bg-[#006bff] rounded text-white text-xs flex items-center justify-center mr-2">{selectedEnterprise.icon}</span>
                                <span className="text-gray-700">{selectedEnterprise.name}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => setPurchasedPackagesOpen(true)}
                            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
                        >
                            购买记录
                        </button>
                        <div className="w-px h-4 bg-gray-200 mx-2" />
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#006bff] rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {username?.charAt(0) || 'U'}
                            </div>
                            <span className="text-sm text-gray-700">{username || '用户'}</span>
                        </div>
                    </div>
                </header>

                {/* 左侧导航栏 */}
                <aside className="fixed left-0 top-[50px] h-[calc(100vh-50px)] bg-white z-[999] w-[200px] border-r border-gray-200">
                    <nav className="p-2 pt-3">
                        {visibleMenuItems.map(item => (
                            <div
                                key={item.name}
                                className="flex items-center px-3 py-2.5 rounded-md mb-1 text-gray-300 cursor-not-allowed"
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                <span className="text-sm">{item.name}</span>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* 主内容区 */}
                <div className="pt-[50px] ml-[200px] min-h-[calc(100vh-50px)] flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-sm p-10 max-w-md w-full text-center">
                        {accessStatus === 'none' && (
                            <>
                                {/* 场景一：未申请访问权限 */}
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                    在所选企业下尚未开通访问权限
                                </h2>
                                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                    当前企业已开启访问权限控制，您需要申请访问权限，经企业管理员审批通过后才能访问智企。
                                </p>
                                <button
                                    onClick={handleRequestAccess}
                                    className="w-full bg-[#0066FF] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#0052CC] transition-colors"
                                >
                                    申请访问权限
                                </button>
                            </>
                        )}

                        {accessStatus === 'pending' && (
                            <>
                                {/* 场景二：审核中 */}
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                    访问权限已提交，审核中~
                                </h2>
                                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                    您已提交访问申请，请等待企业管理员审批通过后即可访问智企。
                                </p>
                                {accessRequestSubmitted && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-700">
                                        申请已提交成功，请耐心等待审批
                                    </div>
                                )}
                                <div className="text-sm text-gray-500">
                                    审核进度可咨询：企业管理员
                                </div>
                            </>
                        )}

                        {accessStatus === 'denied' && (
                            <>
                                {/* 场景三：拒绝访问 */}
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="15" y1="9" x2="9" y2="15"/>
                                        <line x1="9" y1="9" x2="15" y2="15"/>
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                    当前账号已被禁止访问智企
                                </h2>
                                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                    您的访问权限已被企业管理员禁止，如需恢复访问请联系企业管理员。
                                </p>
                                <div className="text-sm text-gray-500">
                                    如果疑惑可咨询：企业管理员
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 申请访问权限弹窗 */}
                {applyDialogOpen && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50" onClick={() => { setApplyDialogOpen(false); setApplyRole(''); }} />
                        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">申请智企访问权限</h3>
                                <button onClick={() => { setApplyDialogOpen(false); setApplyRole(''); }} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 mb-2">当前登录的账号</label>
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                                    {username || '当前用户'}（{userAccount || 'account'}）
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm text-gray-600 mb-2">
                                    您的角色 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={applyRole}
                                    onChange={(e) => setApplyRole(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#0066FF] bg-white"
                                >
                                    <option value="">请选择角色，单选</option>
                                    <option value="产品经理">产品经理</option>
                                    <option value="开发工程师">开发工程师</option>
                                    <option value="测试工程师">测试工程师</option>
                                    <option value="运维工程师">运维工程师</option>
                                    <option value="其他">其他</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => { setApplyDialogOpen(false); setApplyRole(''); }}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleSubmitAccess}
                                    disabled={!applyRole}
                                    className="px-4 py-2 text-sm bg-[#0066FF] text-white rounded-md hover:bg-[#0052CC] disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    提交
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 悬浮成员场景切换按钮 - 访问权限限制页面也显示 */}
                {currentUserRole === 'member' && (
                    <div 
                        className="fixed z-[9999]"
                        style={{ 
                            left: `${buttonPosition.x}px`, 
                            top: `${buttonPosition.y}px`,
                            cursor: isDragging ? 'grabbing' : 'grab'
                        }}
                    >
                        <div className="relative">
                            <button
                                onMouseDown={handleDragStart}
                                onClick={() => !isDragging && setMemberScenarioMenuOpen(!memberScenarioMenuOpen)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 select-none ${
                                    memberScenarioMenuOpen 
                                        ? 'bg-purple-700 text-white' 
                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                }`}
                            >
                                <FlaskConical className="w-4 h-4" />
                                <span className="text-sm font-medium">成员场景切换</span>
                                <span className={`w-2 h-2 rounded-full bg-white`}></span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${memberScenarioMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {memberScenarioMenuOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-[10000]" 
                                        onClick={() => setMemberScenarioMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-[10001] overflow-hidden">
                                        <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 flex items-center gap-2">
                                            <FlaskConical className="w-3.5 h-3.5" />
                                            切换成员测试场景
                                        </div>
                                        <div className="py-1">
                                            <div className="px-4 py-1.5 text-xs text-gray-400">访问权限场景</div>
                                            {(Object.keys(memberScenarioConfig) as MemberScenarioType[]).filter(s => s.startsWith('access-')).map((scenario) => (
                                                <button
                                                    key={scenario}
                                                    onClick={() => {
                                                        handleMemberScenarioChange(scenario);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${memberScenario === scenario ? 'bg-purple-50' : ''}`}
                                                >
                                                    <span className={`w-2.5 h-2.5 rounded-full ${memberScenarioConfig[scenario].color}`}></span>
                                                    <div className="flex-1 text-left">
                                                        <div className="text-sm text-gray-700">{memberScenarioConfig[scenario].label}</div>
                                                        <div className="text-xs text-gray-400">{memberScenarioConfig[scenario].desc}</div>
                                                    </div>
                                                    {memberScenario === scenario && (
                                                        <Check className="w-4 h-4 text-purple-600" />
                                                    )}
                                                </button>
                                            ))}
                                            <div className="my-1 border-t border-gray-200" />
                                            <div className="px-4 py-1.5 text-xs text-gray-400">配额与套餐场景</div>
                                            {(Object.keys(memberScenarioConfig) as MemberScenarioType[]).filter(s => !s.startsWith('access-')).map((scenario) => (
                                                <button
                                                    key={scenario}
                                                    onClick={() => {
                                                        handleMemberScenarioChange(scenario);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${memberScenario === scenario ? 'bg-purple-50' : ''}`}
                                                >
                                                    <span className={`w-2.5 h-2.5 rounded-full ${memberScenarioConfig[scenario].color}`}></span>
                                                    <div className="flex-1 text-left">
                                                        <div className="text-sm text-gray-700">{memberScenarioConfig[scenario].label}</div>
                                                        <div className="text-xs text-gray-400">{memberScenarioConfig[scenario].desc}</div>
                                                    </div>
                                                    {memberScenario === scenario && (
                                                        <Check className="w-4 h-4 text-purple-600" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f7fa] overflow-x-hidden">
            {/* 顶部导航栏 */}
            <header
                className="fixed top-0 left-0 right-0 h-[50px] bg-white z-[1000] flex items-center justify-between px-4 border-b border-gray-100">
                <div className="flex items-center">
                    {/* Logo */}
                    <Link href="/console" className="flex items-center mr-4">
                        <div className="flex items-center">
                            {/* 双环图形Logo */}
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mr-1.5">
                                {/* 深蓝色环形 - 外圈 */}
                                <path
                                    d="M14 2C7.37 2 2 7.37 2 14C2 20.63 7.37 26 14 26C16.95 26 19.7 24.95 21.8 23.1L20.3 21.6C18.6 23.1 16.4 24 14 24C8.48 24 4 19.52 4 14C4 8.48 8.48 4 14 4C16.5 4 18.7 4.9 20.4 6.4L21.9 4.9C19.75 2.95 17 2 14 2Z"
                                    fill="#1a5cff" />
                                {/* 深蓝色箭头 */}
                                <path d="M22 6L24 10L20 10L22 6Z" fill="#1a5cff" />
                                {/* 淡绿色环形 - 内圈 */}
                                <path
                                    d="M14 6C10.13 6 7 9.13 7 13C7 16.87 10.13 20 14 20C16.1 20 18 19.1 19.2 17.7L17.8 16.3C17 17.3 15.6 18 14 18C11.24 18 9 15.76 9 13C9 10.24 11.24 8 14 8C15.4 8 16.7 8.5 17.6 9.4L19 8C17.6 6.7 15.9 6 14 6Z"
                                    fill="#00d4aa" />
                                {/* 淡绿色箭头 */}
                                <path d="M19 3L21 7L17 7L19 3Z" fill="#00d4aa" />
                            </svg>
                            {/* 文字 */}
                            <span className="text-[17px] font-bold text-[#2c3e50] tracking-tight">360</span>
                            <span className="text-[17px] font-bold text-[#2c3e50] ml-0.5 tracking-tight">智企</span>
                        </div>
                    </Link>
                    {/* 企业切换器 */}
                    <div className="relative" onClick={() => setEnterpriseDialogOpen(true)}>
                        <div
                            className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-sm">
                            <span
                                className="w-4 h-4 bg-[#006bff] rounded text-white text-xs flex items-center justify-center mr-2">{selectedEnterprise.icon}</span>
                            <span className="text-gray-700">{selectedEnterprise.name}</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    {/* 功能入口 */}
                    {/* 费用按钮 - 所有角色可见 */}
                    <a
                        href="/zhiqi/console/cost"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">费用
                    </a>
                    <button
                        onClick={() => setPurchasedPackagesOpen(true)}
                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
                    >
                        已购套餐
                    </button>
                    {/* 分隔线 */}
                    <div className="w-px h-5 bg-gray-300 mx-3"></div>
                    {/* 用户入口 */}
                    <div className="relative">
                        <div
                            className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <div
                                className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <span className="text-sm text-gray-500">{username}</span>
                            <span className={`ml-2 px-2 py-0.5 text-white text-xs rounded ${roleConfig[currentUserRole].bgColor}`}>
                                {roleConfig[currentUserRole].label}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 ml-1 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                        </div>
                        {/* 用户下拉菜单 */}
                        {userMenuOpen && (
                            <>
                                {/* 点击外部关闭菜单 */}
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setUserMenuOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    <button
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            window.open('https://console.zyun.360.cn/personalcenter/userinfo', '_blank');
                                        }}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                    >
                                        <User className="w-4 h-4" />
                                        个人信息
                                    </button>
                                    {(currentUserRole === 'owner' || currentUserRole === 'admin') && (
                                        <button
                                            onClick={() => {
                                                setUserMenuOpen(false);
                                                window.open('/console/organization', '_blank');
                                            }}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                        >
                                            <Building2 className="w-4 h-4" />
                                            组织管理
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        退出登录
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>
            {/* 左侧导航栏 */}
            <aside
                className={`fixed left-0 top-[50px] h-[calc(100vh-50px)] bg-white z-[999] transition-all duration-300 border-r border-gray-200 ${sidebarCollapsed ? "w-[60px]" : "w-[200px]"}`}>
                {/* 菜单列表 */}
                <nav className="p-2 pt-3 flex-1">
                    {visibleMenuItems.map(item => {
                        // 管理后台菜单点击新开标签页
                        if (item.name === "管理后台") {
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        window.open(window.location.origin + '/admin', '_blank');
                                    }}
                                    className={`flex items-center px-3 py-2.5 rounded-md mb-1 transition-colors w-full ${activeMenu === item.name ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                                    <item.icon className={`w-5 h-5 ${sidebarCollapsed ? "mx-auto" : "mr-3"}`} />
                                    {!sidebarCollapsed && (
                                        <>
                                            <span className="text-sm">{item.name}</span>
                                            <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-gray-400" />
                                        </>
                                    )}
                                </button>
                            );
                        }
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setActiveMenu(item.name)}
                                className={`flex items-center px-3 py-2.5 rounded-md mb-1 transition-colors ${activeMenu === item.name ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                                <item.icon className={`w-5 h-5 ${sidebarCollapsed ? "mx-auto" : "mr-3"}`} />
                                {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
                {/* 底部智能助手按钮 */}
                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={() => setDialogOpen(true)}
                        className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto hover:bg-[#333] transition-colors shadow-lg cursor-pointer">N
                    </button>
                </div>
            </aside>

            {/* 悬浮场景切换按钮 - 主账号和管理员角色显示，可拖动 */}
            {(currentUserRole === 'owner' || currentUserRole === 'admin') && (
                <div 
                    className="fixed z-[1000]"
                    style={{ 
                        left: `${buttonPosition.x}px`, 
                        top: `${buttonPosition.y}px`,
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    <div className="relative">
                        {/* 悬浮按钮 */}
                        <button
                            onMouseDown={handleDragStart}
                            onClick={() => !isDragging && setScenarioMenuOpen(!scenarioMenuOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 select-none ${
                                scenarioMenuOpen 
                                    ? 'bg-red-700 text-white' 
                                    : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                        >
                            <FlaskConical className="w-4 h-4" />
                            <span className="text-sm font-medium">管理员场景切换</span>
                            <span className={`w-2 h-2 rounded-full bg-white`}></span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${scenarioMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* 场景下拉菜单 */}
                        {scenarioMenuOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setScenarioMenuOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 overflow-hidden">
                                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 flex items-center gap-2">
                                        <FlaskConical className="w-3.5 h-3.5" />
                                        切换管理员测试场景
                                    </div>
                                    <div className="py-1">
                                        {(Object.keys(scenarioConfig) as ScenarioType[]).map((scenario) => (
                                            <button
                                                key={scenario}
                                                onClick={() => {
                                                    setCurrentScenario(scenario);
                                                    setScenarioMenuOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${currentScenario === scenario ? 'bg-blue-50' : ''}`}
                                            >
                                                <span className={`w-2.5 h-2.5 rounded-full ${scenarioConfig[scenario].color}`}></span>
                                                <div className="flex-1 text-left">
                                                    <div className="text-sm text-gray-700">{scenarioConfig[scenario].label}</div>
                                                    <div className="text-xs text-gray-400">{scenarioConfig[scenario].desc}</div>
                                                </div>
                                                {currentScenario === scenario && (
                                                    <Check className="w-4 h-4 text-blue-600" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* 悬浮成员场景切换按钮 - 成员角色显示，可拖动 */}
            {currentUserRole === 'member' && (
                <div 
                    className="fixed z-[9999]"
                    style={{ 
                        left: `${buttonPosition.x}px`, 
                        top: `${buttonPosition.y}px`,
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                >
                    <div className="relative">
                        {/* 悬浮按钮 */}
                        <button
                            onMouseDown={handleDragStart}
                            onClick={() => !isDragging && setMemberScenarioMenuOpen(!memberScenarioMenuOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 select-none ${
                                memberScenarioMenuOpen 
                                    ? 'bg-purple-700 text-white' 
                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                        >
                            <FlaskConical className="w-4 h-4" />
                            <span className="text-sm font-medium">成员场景切换</span>
                            <span className={`w-2 h-2 rounded-full bg-white`}></span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${memberScenarioMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* 场景下拉菜单 */}
                        {memberScenarioMenuOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-[10000]" 
                                    onClick={() => setMemberScenarioMenuOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-[10001] overflow-hidden">
                                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 flex items-center gap-2">
                                        <FlaskConical className="w-3.5 h-3.5" />
                                        切换成员测试场景
                                    </div>
                                    <div className="py-1">
                                        {/* 访问权限场景 - 放在前面 */}
                                        <div className="px-4 py-1.5 text-xs text-gray-400">访问权限场景</div>
                                        {(Object.keys(memberScenarioConfig) as MemberScenarioType[]).filter(s => s.startsWith('access-')).map((scenario) => (
                                            <button
                                                key={scenario}
                                                onClick={() => {
                                                    handleMemberScenarioChange(scenario);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${memberScenario === scenario ? 'bg-purple-50' : ''}`}
                                            >
                                                <span className={`w-2.5 h-2.5 rounded-full ${memberScenarioConfig[scenario].color}`}></span>
                                                <div className="flex-1 text-left">
                                                    <div className="text-sm text-gray-700">{memberScenarioConfig[scenario].label}</div>
                                                    <div className="text-xs text-gray-400">{memberScenarioConfig[scenario].desc}</div>
                                                </div>
                                                {memberScenario === scenario && (
                                                    <Check className="w-4 h-4 text-purple-600" />
                                                )}
                                            </button>
                                        ))}
                                        <div className="my-1 border-t border-gray-200" />
                                        <div className="px-4 py-1.5 text-xs text-gray-400">配额与套餐场景</div>
                                        {/* 配额与套餐场景 - 放在后面 */}
                                        {(Object.keys(memberScenarioConfig) as MemberScenarioType[]).filter(s => !s.startsWith('access-')).map((scenario) => (
                                            <button
                                                key={scenario}
                                                onClick={() => {
                                                    handleMemberScenarioChange(scenario);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${memberScenario === scenario ? 'bg-purple-50' : ''}`}
                                            >
                                                <span className={`w-2.5 h-2.5 rounded-full ${memberScenarioConfig[scenario].color}`}></span>
                                                <div className="flex-1 text-left">
                                                    <div className="text-sm text-gray-700">{memberScenarioConfig[scenario].label}</div>
                                                    <div className="text-xs text-gray-400">{memberScenarioConfig[scenario].desc}</div>
                                                </div>
                                                {memberScenario === scenario && (
                                                    <Check className="w-4 h-4 text-purple-600" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            {}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-500" />智能助手
                                        </DialogTitle>
                        <DialogDescription>选择您需要的功能，快速获取帮助
                                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 py-4">
                        {quickActions.map(action => <button
                            key={action.name}
                            onClick={() => setDialogOpen(false)}
                            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
                            <div
                                className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                                <action.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{action.name}</div>
                                <div className="text-sm text-gray-500">{action.desc}</div>
                            </div>
                        </button>)}
                    </div>
                </DialogContent>
            </Dialog>
            {}
            {enterpriseDialogOpen && <div
                className="fixed inset-0 z-[2000] flex items-center justify-center"
                onClick={() => setEnterpriseDialogOpen(false)}>
                {}
                <div className="absolute inset-0 bg-black/50" />
                {}
                <div
                    className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                    onClick={e => e.stopPropagation()}>
                    {}
                    <div
                        className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-500" />
                                <span className="text-lg font-semibold text-gray-900">选择企业</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">请选择要切换的企业账号</p>
                        </div>
                        <button
                            onClick={() => setEnterpriseDialogOpen(false)}
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {}
                    <div className="p-4 space-y-2">
                        {enterpriseList.map(enterprise => <button
                            key={enterprise.id}
                            onClick={() => {
                                setSelectedEnterprise(enterprise);
                                setEnterpriseDialogOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${selectedEnterprise.id === enterprise.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                            <span
                                className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm ${selectedEnterprise.id === enterprise.id ? "bg-blue-600" : "bg-gray-400"}`}>{enterprise.icon}</span>
                            <div className="flex-1">
                                <div className={`font-medium ${selectedEnterprise.id === enterprise.id ? "text-blue-600" : "text-gray-700"}`}>{enterprise.name}</div>
                            </div>
                            {selectedEnterprise.id === enterprise.id && <span
                                className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>}
                        </button>)}
                    </div>
                </div>
            </div>}
            {}
            <main
                className={`pt-[50px] transition-all duration-300 overflow-x-hidden ${sidebarCollapsed ? "ml-[60px]" : "ml-[200px]"}`}>
                <div className="p-4">
                    {/* 页面标题 */}
                    <div className="mb-6">
                        <h1 className="text-xl font-semibold text-gray-800">{activeMenu}</h1>
                    </div>
                    {/* 我的首页 - 概览页面 */}
                    {activeMenu === "我的首页" && renderHomePage()}
                    {}
                    {activeMenu === "AI计划" && <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-[#006bff] flex-shrink-0" />
                            <span className="text-sm text-gray-700">AI计划逻辑请见：</span>
                            <a
                                href="https://hdgzgm4kjt.coze.site/claw/api"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#006bff] hover:underline inline-flex items-center gap-1"
                            >
                                https://hdgzgm4kjt.coze.site/claw/api
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <span className="text-sm text-gray-700">，产品：周长江。开发同学只需关注页面里的内容，左侧菜单、顶部导航等样式风格和智企框架保持一致。</span>
                        </div>
                    </div>}
                    {}
                    {/* 管理后台页面 - 主账号和管理员可见 */}
                    {activeMenu === "管理后台" && (currentUserRole === 'owner' || currentUserRole === 'admin') && (
                    <div className="bg-white rounded-lg border border-gray-200">
                        {/* Tab导航 */}
                        <div className="flex items-center gap-1 px-4 border-b border-gray-100">
                            {[
                                { id: "overview", name: "概览" },
                                { id: "members", name: "成员管理" },
                                { id: "models", name: "AI计划管理" },
                                { id: "lobster", name: "龙虾管理" }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setAdminTab(tab.id as typeof adminTab)}
                                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                                        adminTab === tab.id 
                                            ? "text-[#006bff]" 
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    {tab.name}
                                    {adminTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* 概览 Tab 内容 */}
                        {adminTab === "overview" && <>
                        {/* 套餐信息模块 */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-6 flex-wrap">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">当前套餐</div>
                                        <div className="text-lg font-semibold text-gray-900">企业专业版</div>
                                    </div>
                                    <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">调用次数</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            <span className="text-[#006bff]">156,789</span>
                                            <span className="text-gray-400 font-normal text-sm ml-1">/ 500,000</span>
                                        </div>
                                    </div>
                                    <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Token总量</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            <span className="text-[#006bff]">2.3M</span>
                                            <span className="text-gray-400 font-normal text-sm ml-1">/ 5M</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                                    升级套餐
                                </button>
                            </div>
                            {/* 进度条 */}
                            <div className="mt-4 space-y-3">
                                <div>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                        <span>调用次数使用进度</span>
                                        <span>31.4%</span>
                                    </div>
                                    <div className="h-2 bg-white rounded-full overflow-hidden">
                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '31.4%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                        <span>Token使用进度</span>
                                        <span>46%</span>
                                    </div>
                                    <div className="h-2 bg-white rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '46%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 数据统计模块 */}
                        <div className="border-b border-gray-100">
                            <div className="flex items-center justify-between px-6 py-4">
                                <h3 className="font-semibold text-gray-900">数据统计</h3>
                                <div className="flex items-center gap-3">
                                    <select 
                                        value={statsDateRange}
                                        onChange={(e) => setStatsDateRange(e.target.value)}
                                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="today">今日</option>
                                        <option value="7days">最近7天</option>
                                        <option value="30days">最近30天</option>
                                        <option value="month">本月</option>
                                        <option value="custom">自定义</option>
                                    </select>
                                    {statsDateRange === "custom" && (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="date"
                                                value={customStartDate}
                                                onChange={(e) => setCustomStartDate(e.target.value)}
                                                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:border-blue-500"
                                            />
                                            <span className="text-gray-400">至</span>
                                            <input
                                                type="date"
                                                value={customEndDate}
                                                onChange={(e) => setCustomEndDate(e.target.value)}
                                                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* 统计概览卡片 */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                                {/* 活跃成员 - 第一个 */}
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="text-sm text-green-600 mb-1">活跃成员</div>
                                    <div className="text-2xl font-bold text-gray-900">{currentStats.activeMembers.count}</div>
                                    <div className="text-xs text-gray-500 mt-1">共 {currentStats.activeMembers.total} 名成员</div>
                                </div>
                                {/* 龙虾数量 - 第二个 */}
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <div className="text-sm text-orange-600 mb-1">龙虾数量(正常/总数)</div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        <span className="text-green-600">{currentStats.lobsters.normal}</span>
                                        <span className="text-gray-400 font-normal"> / {currentStats.lobsters.total}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">正常率 {((currentStats.lobsters.normal / currentStats.lobsters.total) * 100).toFixed(1)}%</div>
                                </div>
                                {/* 总调用量 - 第三个 */}
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="text-sm text-blue-600 mb-1">总调用量</div>
                                    <div className="text-2xl font-bold text-gray-900">{currentStats.calls.count.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500 mt-1">较前期 {currentStats.calls.trend}</div>
                                </div>
                                {/* Token消耗 - 第四个 */}
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="text-sm text-purple-600 mb-1">Token消耗</div>
                                    <div className="text-2xl font-bold text-gray-900">{currentStats.tokens.count}</div>
                                    <div className="text-xs text-gray-500 mt-1">日均 {currentStats.tokens.daily}</div>
                                </div>
                            </div>

                            {/* 成员调用量排行 */}
                            <div className="px-6 pb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-medium text-gray-700">模型调用量TOP</h4>
                                    <button 
                                        onClick={() => setAdminTab("members")}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >查看全部</button>
                                </div>
                                <div>
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 w-16">排名</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">成员</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 w-24">调用量</th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 w-36">
                                                    <div className="flex items-center gap-1">
                                                        占比
                                                        <div className="relative group">
                                                            <svg className="w-3.5 h-3.5 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <div className="absolute left-0 top-full mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                                                                计算规则：成员调用量 ÷ 团队总调用量
                                                                <div className="absolute left-3 bottom-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 w-24">
                                                    <div className="flex items-center gap-1">
                                                        趋势
                                                        <div className="relative group">
                                                            <svg className="w-3.5 h-3.5 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <div className="absolute left-0 top-full mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                                                                计算规则：(本期调用量 - 上期调用量) ÷ 上期调用量
                                                                <div className="absolute left-3 bottom-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentStats.memberRanking.map((member, index) => {
                                                const colors = [
                                                    { bg: "bg-blue-100", text: "text-blue-600", bar: "bg-blue-500" },
                                                    { bg: "bg-green-100", text: "text-green-600", bar: "bg-green-500" },
                                                    { bg: "bg-purple-100", text: "text-purple-600", bar: "bg-purple-500" },
                                                    { bg: "bg-cyan-100", text: "text-cyan-600", bar: "bg-cyan-500" },
                                                    { bg: "bg-pink-100", text: "text-pink-600", bar: "bg-pink-500" },
                                                ];
                                                const rankColors = [
                                                    "bg-yellow-100 text-yellow-600",
                                                    "bg-gray-100 text-gray-600",
                                                    "bg-orange-100 text-orange-600",
                                                    "bg-gray-50 text-gray-500",
                                                    "bg-gray-50 text-gray-500",
                                                ];
                                                const color = colors[index];
                                                const firstChar = member.name.charAt(0);
                                                const trendColor = member.trend.includes("↑") ? "text-green-500" : member.trend.includes("↓") ? "text-red-500" : "text-gray-400";
                                                
                                                return (
                                                    <tr key={member.rank} className="border-b border-gray-50">
                                                        <td className="py-3 px-4">
                                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${rankColors[index]}`}>{member.rank}</span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-8 h-8 rounded-full ${color.bg} flex items-center justify-center ${color.text} text-sm font-medium`}>{firstChar}</div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                                                    <div className="text-xs text-gray-400">{member.role}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-sm text-gray-900">{member.calls.toLocaleString()}</td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div className={`h-full ${color.bar} rounded-full`} style={{ width: `${member.percentage}%` }}></div>
                                                                </div>
                                                                <span className="text-sm text-gray-600">{member.percentage}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className={`text-sm ${trendColor}`}>{member.trend}</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 龙虾使用TOP */}
                            <div className="px-6 pb-6 border-t border-gray-100 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-medium text-gray-700">龙虾使用TOP</h4>
                                    <button 
                                        onClick={() => setAdminTab("lobster")}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >查看全部</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* 生产环境龙虾 */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="text-3xl">🦞</div>
                                            <div>
                                                <div className="font-medium text-gray-900">生产环境龙虾</div>
                                                <div className="text-xs text-gray-400">创建者：张三，创建时间：2026.01.01 23:56</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">状态</span>
                                                <span className="text-green-600 font-medium">● 正常</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">今日调用</span>
                                                <span className="text-gray-900 font-medium">12,340</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">配额剩余</span>
                                                <span className="text-blue-600 font-medium">87,660 / 100,000</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '87.66%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* 测试环境龙虾 */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="text-3xl">🦞</div>
                                            <div>
                                                <div className="font-medium text-gray-900">测试环境龙虾</div>
                                                <div className="text-xs text-gray-400">创建者：李四，创建时间：2026.01.15 10:23</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">状态</span>
                                                <span className="text-green-600 font-medium">● 正常</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">今日调用</span>
                                                <span className="text-gray-900 font-medium">5,890</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">配额剩余</span>
                                                <span className="text-blue-600 font-medium">44,110 / 50,000</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 rounded-full" style={{ width: '88.2%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* 开发调试龙虾 */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="text-3xl">🦞</div>
                                            <div>
                                                <div className="font-medium text-gray-900">开发调试龙虾</div>
                                                <div className="text-xs text-gray-400">创建者：王五，创建时间：2026.02.08 16:45</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">状态</span>
                                                <span className="text-orange-600 font-medium">● 配额不足</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">今日调用</span>
                                                <span className="text-gray-900 font-medium">3,210</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">配额剩余</span>
                                                <span className="text-orange-600 font-medium">1,890 / 10,000</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange-500 rounded-full" style={{ width: '18.9%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </>}

                        {/* 成员管理 Tab */}
                        {adminTab === "members" && <>
                            {/* 顶部操作栏 */}
                            <div className="p-4 flex items-center justify-between border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="搜索成员名称"
                                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                        <option value="all">全部角色</option>
                                        <option value="owner">主账号</option>
                                        <option value="admin">管理员</option>
                                        <option value="member">成员</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => {
                                            // TODO: 实现批量设置配额逻辑
                                            alert('批量设置配额功能开发中');
                                        }}
                                        className="px-4 py-2 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        批量设置配额
                                    </button>
                                    <button 
                                        onClick={() => setAddMemberDrawerOpen(true)}
                                        className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        添加成员
                                    </button>
                                </div>
                            </div>

                            {/* 成员列表 */}
                            <div className="overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">成员信息</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">角色</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">调用配额</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Token配额</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* 张三 - 主账号 */}
                                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">张</div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">张三</div>
                                                        <div className="text-xs text-gray-400">zhangsan@360.cn</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded">主账号</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="w-36">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-gray-500">已用 52,340</span>
                                                        <span className="text-gray-900 font-medium">100,000</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '52.3%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="w-36">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-gray-500">已用 1.2M</span>
                                                        <span className="text-gray-900 font-medium">2M</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button 
                                                    onClick={() => {
                                                        setEditingMember({
                                                            id: 'zhangsan',
                                                            name: '张三',
                                                            callsUsed: 52340,
                                                            callsTotal: 100000,
                                                            tokensUsed: 1200000,
                                                            tokensTotal: 2000000
                                                        });
                                                        setTempCallsQuota('100000');
                                                        setTempTokensQuota('2000000');
                                                        setQuotaEditOpen(true);
                                                    }}
                                                    className="text-sm text-[#006bff] hover:text-blue-600"
                                                >
                                                    设置配额
                                                </button>
                                            </td>
                                        </tr>
                                        {/* 李四 - 管理员 */}
                                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">李</div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">李四</div>
                                                        <div className="text-xs text-gray-400">lisi@360.cn</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">管理员</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="w-36">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-gray-500">已用 38,920</span>
                                                        <span className="text-gray-900 font-medium">50,000</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '77.8%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="w-36">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-gray-500">已用 856K</span>
                                                        <span className="text-gray-900 font-medium">1M</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '83.6%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button 
                                                    onClick={() => {
                                                        setEditingMember({
                                                            id: 'lisi',
                                                            name: '李四',
                                                            callsUsed: 38920,
                                                            callsTotal: 50000,
                                                            tokensUsed: 856000,
                                                            tokensTotal: 1000000
                                                        });
                                                        setTempCallsQuota('50000');
                                                        setTempTokensQuota('1000000');
                                                        setQuotaEditOpen(true);
                                                    }}
                                                    className="text-sm text-[#006bff] hover:text-blue-600"
                                                >
                                                    设置配额
                                                </button>
                                            </td>
                                        </tr>
                                        {/* 王五 - 成员 */}
                                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">王</div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">王五</div>
                                                        <div className="text-xs text-gray-400">wangwu@360.cn</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">成员</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="w-36">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-orange-500">已用 28,450</span>
                                                        <span className="text-gray-900 font-medium">30,000</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '94.8%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="w-36">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-gray-500">已用 420K</span>
                                                        <span className="text-gray-900 font-medium">500K</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '84%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button 
                                                    onClick={() => {
                                                        setEditingMember({
                                                            id: 'wangwu',
                                                            name: '王五',
                                                            callsUsed: 28450,
                                                            callsTotal: 30000,
                                                            tokensUsed: 420000,
                                                            tokensTotal: 500000
                                                        });
                                                        setTempCallsQuota('30000');
                                                        setTempTokensQuota('500000');
                                                        setQuotaEditOpen(true);
                                                    }}
                                                    className="text-sm text-[#006bff] hover:text-blue-600"
                                                >
                                                    设置配额
                                                </button>
                                            </td>
                                        </tr>
                                        {/* 赵六 - 成员 */}
                                        <tr className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-medium">赵</div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">赵六</div>
                                                        <div className="text-xs text-gray-400">zhaoliu@360.cn</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">成员</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="w-36">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-gray-500">已用 12,680</span>
                                                        <span className="text-gray-900 font-medium">30,000</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '42.3%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="w-36">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-gray-500">已用 180K</span>
                                                        <span className="text-gray-900 font-medium">500K</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '36%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button 
                                                    onClick={() => {
                                                        setEditingMember({
                                                            id: 'zhaoliu',
                                                            name: '赵六',
                                                            callsUsed: 12680,
                                                            callsTotal: 30000,
                                                            tokensUsed: 180000,
                                                            tokensTotal: 500000
                                                        });
                                                        setTempCallsQuota('30000');
                                                        setTempTokensQuota('500000');
                                                        setQuotaEditOpen(true);
                                                    }}
                                                    className="text-sm text-[#006bff] hover:text-blue-600"
                                                >
                                                    设置配额
                                                </button>
                                            </td>
                                        </tr>
                                        {/* 孙七 - 成员 */}
                                        <tr className="hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-medium">孙</div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">孙七</div>
                                                        <div className="text-xs text-gray-400">sunqi@360.cn</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">成员</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="w-36">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-gray-500">已用 5,200</span>
                                                        <span className="text-gray-900 font-medium">20,000</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '26%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="w-36">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-gray-500">已用 85K</span>
                                                        <span className="text-gray-900 font-medium">200K</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '42.5%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button 
                                                    onClick={() => {
                                                        setEditingMember({
                                                            id: 'sunqi',
                                                            name: '孙七',
                                                            callsUsed: 5200,
                                                            callsTotal: 20000,
                                                            tokensUsed: 85000,
                                                            tokensTotal: 200000
                                                        });
                                                        setTempCallsQuota('20000');
                                                        setTempTokensQuota('200000');
                                                        setQuotaEditOpen(true);
                                                    }}
                                                    className="text-sm text-[#006bff] hover:text-blue-600"
                                                >
                                                    设置配额
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/* 分页 */}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
                                    <div className="text-sm text-gray-500">共 12 条记录</div>
                                    <div className="flex items-center gap-2">
                                        <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-white">上一页</button>
                                        <button className="px-3 py-1 bg-[#006bff] text-white rounded text-sm">1</button>
                                        <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-white">2</button>
                                        <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-white">下一页</button>
                                    </div>
                                </div>
                            </div>

                            {/* 配额设置弹窗 */}
                            {quotaEditOpen && editingMember && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg shadow-xl w-[480px]">
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-900">设置配额 - {editingMember.name}</h3>
                                            <button 
                                                onClick={() => setQuotaEditOpen(false)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="px-6 py-4 space-y-6">
                                            {/* 当前使用情况 */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="text-sm font-medium text-gray-700 mb-3">当前使用情况</div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-1">调用次数</div>
                                                        <div className="text-lg font-semibold text-gray-900">
                                                            {editingMember.callsUsed.toLocaleString()} / {editingMember.callsTotal.toLocaleString()}
                                                        </div>
                                                        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-[#006bff] rounded-full" 
                                                                style={{ width: `${(editingMember.callsUsed / editingMember.callsTotal * 100).toFixed(1)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-1">Token用量</div>
                                                        <div className="text-lg font-semibold text-gray-900">
                                                            {(editingMember.tokensUsed / 1000).toFixed(0)}K / {(editingMember.tokensTotal / 1000).toFixed(0)}K
                                                        </div>
                                                        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-green-500 rounded-full" 
                                                                style={{ width: `${(editingMember.tokensUsed / editingMember.tokensTotal * 100).toFixed(1)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 设置新配额 */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        调用次数配额
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={tempCallsQuota}
                                                            onChange={(e) => setTempCallsQuota(e.target.value)}
                                                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#006bff] focus:ring-1 focus:ring-[#006bff]"
                                                            placeholder="请输入调用次数配额"
                                                        />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">次</span>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-400">当前已使用 {editingMember.callsUsed.toLocaleString()} 次</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Token配额
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={tempTokensQuota}
                                                            onChange={(e) => setTempTokensQuota(e.target.value)}
                                                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#006bff] focus:ring-1 focus:ring-[#006bff]"
                                                            placeholder="请输入Token配额"
                                                        />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">个</span>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-400">当前已使用 {(editingMember.tokensUsed / 1000).toFixed(0)}K 个</p>
                                                </div>
                                            </div>

                                            {/* 提示信息 */}
                                            <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                                <div className="text-xs text-blue-600">
                                                    配额设置后立即生效，新配额不能低于已使用量。建议根据成员实际需求合理分配资源。
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                                            <button 
                                                onClick={() => setQuotaEditOpen(false)}
                                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white transition-colors"
                                            >
                                                取消
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    // 这里可以添加保存逻辑
                                                    setQuotaEditOpen(false);
                                                }}
                                                className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                确认设置
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* 添加成员弹框 */}
                            {addMemberDrawerOpen && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                                    {/* 遮罩层 - 深色蒙层 + 背景模糊 */}
                                    <div 
                                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                        onClick={() => setAddMemberDrawerOpen(false)}
                                    />
                                    {/* 弹框主体 */}
                                    <div className="relative bg-white rounded-xl shadow-2xl w-[560px] max-w-[90vw] max-h-[85vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
                                        {/* 弹框头部 */}
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-900">添加成员</h3>
                                            <button 
                                                onClick={() => {
                                                    setAddMemberDrawerOpen(false);
                                                    setSelectedAddMember(null);
                                                    setMemberSearchKeyword("");
                                                    setNewMemberCallsQuota("");
                                                    setNewMemberTokensQuota("");
                                                }}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        
                                        {/* 弹框内容 */}
                                        <div className="flex-1 overflow-y-auto p-6">
                                            {/* 步骤1：搜索成员 */}
                                            <div className="mb-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-[#006bff] text-white text-xs flex items-center justify-center font-medium">1</div>
                                                        <span className="font-medium text-gray-900">选择成员</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => window.open('https://console.zyun.360.cn/useradmin/index', '_blank')}
                                                        className="text-xs text-[#006bff] hover:text-blue-600 flex items-center gap-1"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        组织管理
                                                    </button>
                                                </div>
                                                <div className="relative">
                                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                    <input
                                                        type="text"
                                                        value={memberSearchKeyword}
                                                        onChange={(e) => {
                                                            setMemberSearchKeyword(e.target.value);
                                                            setSelectedAddMember(null); // 搜索时清除选中
                                                        }}
                                                        placeholder="输入账号/姓名/邮箱搜索成员"
                                                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                
                                                {/* 搜索结果列表 */}
                                                {memberSearchKeyword && (
                                                    <div className="mt-3 border border-gray-100 rounded-lg max-h-[200px] overflow-y-auto">
                                                        {filteredAvailableMembers.length > 0 ? (
                                                            filteredAvailableMembers.map(member => (
                                                                <div
                                                                    key={member.id}
                                                                    onClick={() => {
                                                                        setSelectedAddMember(member);
                                                                        setMemberSearchKeyword("");
                                                                    }}
                                                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                                                                        selectedAddMember?.id === member.id ? 'bg-blue-50' : ''
                                                                    }`}
                                                                >
                                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm">
                                                                        {member.name[0]}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="font-medium text-gray-900 text-sm">{member.name}</div>
                                                                        <div className="text-xs text-gray-400">{member.email}</div>
                                                                    </div>
                                                                    {selectedAddMember?.id === member.id && (
                                                                        <Check className="w-4 h-4 text-[#006bff]" />
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                                                未找到匹配的成员
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* 已选中的成员 */}
                                                {selectedAddMember && !memberSearchKeyword && (
                                                    <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                                                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs">
                                                            {selectedAddMember.name[0]}
                                                        </div>
                                                        <span className="text-sm text-gray-900">{selectedAddMember.name}</span>
                                                        <span className="text-xs text-gray-400">{selectedAddMember.email}</span>
                                                        <button 
                                                            onClick={() => setSelectedAddMember(null)}
                                                            className="ml-auto text-gray-400 hover:text-gray-600"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* 步骤2：设置配额 */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`w-6 h-6 rounded-full ${selectedAddMember ? 'bg-[#006bff]' : 'bg-gray-200'} text-white text-xs flex items-center justify-center font-medium`}>2</div>
                                                    <span className={`font-medium ${selectedAddMember ? 'text-gray-900' : 'text-gray-400'}`}>设置配额</span>
                                                </div>
                                                
                                                <div className={`space-y-4 ${!selectedAddMember ? 'opacity-50 pointer-events-none' : ''}`}>
                                                    {/* 调用配额 */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            调用配额
                                                            <span className="text-xs text-gray-400 font-normal ml-1">（不填则不限制）</span>
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                value={newMemberCallsQuota}
                                                                onChange={(e) => setNewMemberCallsQuota(e.target.value)}
                                                                placeholder="请输入调用次数配额"
                                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            />
                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">次</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Token配额 */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Token配额
                                                            <span className="text-xs text-gray-400 font-normal ml-1">（不填则不限制）</span>
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                value={newMemberTokensQuota}
                                                                onChange={(e) => setNewMemberTokensQuota(e.target.value)}
                                                                placeholder="请输入Token配额"
                                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            />
                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">个</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-blue-50 rounded-lg p-3 text-xs text-gray-600">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                配额设置后，该成员在当前企业下的调用量将受此限制。如需调整，可在成员列表中重新设置。
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* 弹框底部 */}
                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                                            <button 
                                                onClick={() => {
                                                    setAddMemberDrawerOpen(false);
                                                    setSelectedAddMember(null);
                                                    setMemberSearchKeyword("");
                                                    setNewMemberCallsQuota("");
                                                    setNewMemberTokensQuota("");
                                                }}
                                                className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white transition-colors"
                                            >
                                                取消
                                            </button>
                                            <button 
                                                onClick={handleConfirmAddMember}
                                                disabled={!selectedAddMember}
                                                className={`px-5 py-2.5 rounded-lg text-sm transition-colors ${
                                                    selectedAddMember 
                                                        ? 'bg-[#006bff] text-white hover:bg-blue-600' 
                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                确认添加
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>}

                        {/* AI计划管理 Tab */}
                        {adminTab === "models" && <>
                            {/* 顶部操作栏 */}
                            <div className="p-4 flex items-center justify-between border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="搜索模型名称"
                                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                        <option value="all">全部类型</option>
                                        <option value="text">文本模型</option>
                                        <option value="image">图像模型</option>
                                        <option value="audio">音频模型</option>
                                        <option value="video">视频模型</option>
                                    </select>
                                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                        <option value="all">全部状态</option>
                                        <option value="enabled">已启用</option>
                                        <option value="disabled">已停用</option>
                                    </select>
                                </div>
                                <button className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    申请模型
                                </button>
                            </div>

                            {/* 模型列表 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                                {/* GPT-4 模型卡片 */}
                                <div className="rounded-lg border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">G</div>
                                            <div>
                                                <div className="font-medium text-gray-900">GPT-4</div>
                                                <div className="text-xs text-gray-400">文本模型</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded">已启用</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">本月调用量</span>
                                            <span className="text-gray-900 font-medium">125,340</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">配额剩余</span>
                                            <span className="text-[#006bff] font-medium">874,660 / 1,000,000</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '87.5%' }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">配置</button>
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">查看详情</button>
                                    </div>
                                </div>

                                {/* Claude 模型卡片 */}
                                <div className="rounded-lg border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-sm">C</div>
                                            <div>
                                                <div className="font-medium text-gray-900">Claude-3</div>
                                                <div className="text-xs text-gray-400">文本模型</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded">已启用</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">本月调用量</span>
                                            <span className="text-gray-900 font-medium">89,210</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">配额剩余</span>
                                            <span className="text-[#006bff] font-medium">410,790 / 500,000</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '82.2%' }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">配置</button>
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">查看详情</button>
                                    </div>
                                </div>

                                {/* 文心一言 模型卡片 */}
                                <div className="rounded-lg border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">文</div>
                                            <div>
                                                <div className="font-medium text-gray-900">文心一言</div>
                                                <div className="text-xs text-gray-400">文本模型</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded">已启用</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">本月调用量</span>
                                            <span className="text-gray-900 font-medium">45,680</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">配额剩余</span>
                                            <span className="text-[#006bff] font-medium">254,320 / 300,000</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '84.8%' }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">配置</button>
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">查看详情</button>
                                    </div>
                                </div>

                                {/* 通义千问 模型卡片 */}
                                <div className="rounded-lg border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">通</div>
                                            <div>
                                                <div className="font-medium text-gray-900">通义千问</div>
                                                <div className="text-xs text-gray-400">文本模型</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded">配额不足</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">本月调用量</span>
                                            <span className="text-gray-900 font-medium">98,450</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">配额剩余</span>
                                            <span className="text-orange-500 font-medium">1,550 / 100,000</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '1.55%' }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 px-3 py-1.5 bg-[#006bff] text-white rounded text-sm hover:bg-blue-600">扩容</button>
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">查看详情</button>
                                    </div>
                                </div>

                                {/* DALL-E 模型卡片 */}
                                <div className="rounded-lg border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm">D</div>
                                            <div>
                                                <div className="font-medium text-gray-900">DALL-E 3</div>
                                                <div className="text-xs text-gray-400">图像模型</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded">已启用</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">本月调用量</span>
                                            <span className="text-gray-900 font-medium">12,890</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">配额剩余</span>
                                            <span className="text-[#006bff] font-medium">37,110 / 50,000</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '74.2%' }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">配置</button>
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">查看详情</button>
                                    </div>
                                </div>

                                {/* Midjourney 模型卡片 */}
                                <div className="rounded-lg border border-gray-200 p-5 opacity-60">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">M</div>
                                            <div>
                                                <div className="font-medium text-gray-900">Midjourney</div>
                                                <div className="text-xs text-gray-400">图像模型</div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded">已停用</span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">本月调用量</span>
                                            <span className="text-gray-900 font-medium">0</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">配额剩余</span>
                                            <span className="text-gray-400 font-medium">-- / --</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div className="h-full bg-gray-300 rounded-full" style={{ width: '0%' }}></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex-1 px-3 py-1.5 bg-[#006bff] text-white rounded text-sm hover:bg-blue-600">启用</button>
                                        <button className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">查看详情</button>
                                    </div>
                                </div>
                            </div>
                        </>}

                        {/* 龙虾管理 Tab */}
                        {adminTab === "lobster" && <>
                            {/* 页面标题 */}
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900">我的龙虾</h2>
                            </div>
                            
                            {/* 配额显示模块 */}
                            <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">配额剩余</span>
                                    <span className="text-sm text-gray-900 font-medium">87,660 / 100,000</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                                        <div className="h-full bg-[#006bff] rounded-full" style={{ width: '87.66%' }}></div>
                                    </div>
                                    <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                        管理
                                    </button>
                                </div>
                            </div>

                            {/* 龙虾卡片列表 */}
                            <div className="p-6 space-y-4">
                                {/* 龙虾卡片1 */}
                                <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">🦞</div>
                                        <div className="flex-1">
                                            <button 
                                                onClick={() => alert('跳转到龙虾详情页')}
                                                className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors block mb-1"
                                            >
                                                龙虾名称
                                            </button>
                                            <div className="text-xs text-gray-400 mb-3">创建时间: 2026.01.01 23:56</div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">状态</span>
                                                    <span className="flex items-center gap-1 text-green-600 text-sm">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                        正常
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">今日调用</span>
                                                    <span className="text-sm text-gray-900 font-medium">12,340</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 龙虾卡片2 */}
                                <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl">🦞</div>
                                        <div className="flex-1">
                                            <button 
                                                onClick={() => alert('跳转到龙虾详情页')}
                                                className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors block mb-1"
                                            >
                                                龙虾名称
                                            </button>
                                            <div className="text-xs text-gray-400 mb-3">创建时间: 2026.01.01 23:56</div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">状态</span>
                                                    <span className="flex items-center gap-1 text-green-600 text-sm">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                        正常
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">今日调用</span>
                                                    <span className="text-sm text-gray-900 font-medium">12,340</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>}
                    </div>)}
                    {}
                    {/* 用量统计页面 - 已移除菜单入口 */}
                    {activeMenu === "用量统计" && <div className="space-y-6">
                        {}
                        <div className="bg-white rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">时间范围:</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {[{
                                            value: "today",
                                            label: "今日"
                                        }, {
                                            value: "7days",
                                            label: "近7天"
                                        }, {
                                            value: "30days",
                                            label: "近30天"
                                        }, {
                                            value: "custom",
                                            label: "自定义"
                                        }].map(option => <button
                                            key={option.value}
                                            onClick={() => setUsageDateRange(option.value)}
                                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${usageDateRange === option.value ? "bg-[#006bff] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                                            {option.label}
                                        </button>)}
                                    </div>
                                    {usageDateRange === "custom" && <div className="flex items-center gap-2 ml-4">
                                        <input
                                            type="date"
                                            value={customStartDate}
                                            onChange={e => setCustomStartDate(e.target.value)}
                                            className="border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
                                        <span className="text-gray-400">至</span>
                                        <input
                                            type="date"
                                            value={customEndDate}
                                            onChange={e => setCustomEndDate(e.target.value)}
                                            className="border border-gray-200 rounded-md px-3 py-1.5 text-sm" />
                                    </div>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Grid className="w-4 h-4 text-gray-500" />
                                    <select
                                        value={usageModelFilter}
                                        onChange={e => setUsageModelFilter(e.target.value)}
                                        className="border border-gray-200 rounded-md px-3 py-1.5 text-sm">
                                        <option value="all">全部模型</option>
                                        <option value="text">文本模型</option>
                                        <option value="image">图像模型</option>
                                        <option value="audio">音频模型</option>
                                        <option value="video">视频模型</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-5 hover:shadow-md transition-shadow">
                                <div className="text-sm text-gray-500 mb-2">总调用次数</div>
                                <div className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalCalls)}</div>
                                <div className="text-xs text-gray-400 mt-2">共 {filteredData.length}天数据
                                                      </div>
                            </div>
                            <div className="bg-white rounded-lg p-5 hover:shadow-md transition-shadow">
                                <div className="text-sm text-gray-500 mb-2">总Token消耗</div>
                                <div className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalTokens)}</div>
                                <div className="text-xs text-gray-400 mt-2">平均 {formatNumber(Math.round(stats.totalTokens / (filteredData.length || 1)))}/天
                                                      </div>
                            </div>
                            <div className="bg-white rounded-lg p-5 hover:shadow-md transition-shadow">
                                <div className="text-sm text-gray-500 mb-2">日均调用</div>
                                <div className="text-3xl font-bold text-gray-900">{formatNumber(stats.avgCalls)}</div>
                                <div className="text-xs text-gray-400 mt-2">峰值: {formatNumber(stats.maxCalls)}({stats.maxCallsDate.slice(5)})
                                                      </div>
                            </div>
                        </div>
                        {}
                        <div className="bg-white rounded-lg">
                            <div className="flex items-center justify-between mb-4 px-5 pt-5">
                                <h3 className="text-base font-semibold text-gray-900">调用趋势</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode("chart")}
                                        className={`px-3 py-1 text-sm rounded transition-colors ${viewMode === "chart" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}>图表
                                                            </button>
                                    <button
                                        onClick={() => setViewMode("table")}
                                        className={`px-3 py-1 text-sm rounded transition-colors ${viewMode === "table" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}>数据表
                                                            </button>
                                </div>
                            </div>
                            {viewMode === "chart" ? <div className="h-80 px-5 pb-5">
                                {(() => {
                                    if (filteredData.length === 0)
                                        return <div className="flex items-center justify-center h-full text-gray-400">暂无数据</div>;

                                    const chartHeight = 280;

                                    const padding = {
                                        top: 20,
                                        right: 20,
                                        bottom: 40,
                                        left: 20
                                    };

                                    const getVisibleLabels = () => {
                                        const total = filteredData.length;

                                        if (total <= 7) {
                                            return filteredData.map((_, i) => i);
                                        } else if (total <= 15) {
                                            return filteredData.map((_, i) => i).filter(i => i === 0 || i === total - 1 || i % 2 === 0);
                                        } else {
                                            return [0, Math.floor(total / 2), total - 1];
                                        }
                                    };

                                    const visibleLabelIndexes = getVisibleLabels();

                                    return (
                                        <div className="w-full h-full flex flex-col">
                                            {}
                                            <div className="flex items-center justify-center gap-6 mb-2 flex-shrink-0">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-0.5 bg-blue-500" />
                                                    <span className="text-sm text-gray-600">调用次数</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-0.5 bg-green-500" />
                                                    <span className="text-sm text-gray-600">Token消耗(×100)</span>
                                                </div>
                                            </div>
                                            {}
                                            <svg
                                                className="flex-1 w-full"
                                                viewBox="0 0 800 240"
                                                preserveAspectRatio="xMidYMid meet"
                                                style={{
                                                    padding: "16px"
                                                }}>
                                                {(() => {
                                                    const viewBoxWidth = 800;
                                                    const viewBoxHeight = 240;
                                                    const plotWidth = viewBoxWidth - padding.left - padding.right;
                                                    const plotHeight = viewBoxHeight - padding.top - padding.bottom;
                                                    const allValues = filteredData.flatMap(d => [d.calls, d.tokens / 100]);
                                                    const maxValue = Math.max(...allValues);
                                                    const yMax = Math.ceil(maxValue / 1000) * 1000 || 1000;
                                                    const yTicks = [0, 0.25, 0.5, 0.75, 1].map(r => r * yMax);

                                                    const callsPoints = filteredData.map((item, index) => {
                                                        const x = padding.left + (filteredData.length > 1 ? index / (filteredData.length - 1) * plotWidth : plotWidth / 2);
                                                        const y = padding.top + plotHeight - item.calls / yMax * plotHeight;

                                                        return {
                                                            x,
                                                            y,
                                                            item
                                                        };
                                                    });

                                                    const tokenPoints = filteredData.map((item, index) => {
                                                        const x = padding.left + (filteredData.length > 1 ? index / (filteredData.length - 1) * plotWidth : plotWidth / 2);
                                                        const y = padding.top + plotHeight - item.tokens / 100 / yMax * plotHeight;

                                                        return {
                                                            x,
                                                            y,
                                                            item
                                                        };
                                                    });

                                                    const callsPath = callsPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                                                    const tokenPath = tokenPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

                                                    return (
                                                        <>
                                                            {}
                                                            {yTicks.map((tick, i) => {
                                                                const y = padding.top + plotHeight - tick / yMax * plotHeight;

                                                                return (
                                                                    <line
                                                                        key={i}
                                                                        x1={padding.left}
                                                                        y1={y}
                                                                        x2={viewBoxWidth - padding.right}
                                                                        y2={y}
                                                                        stroke="#e5e7eb"
                                                                        strokeWidth="1" />
                                                                );
                                                            })}
                                                            {}
                                                            <line
                                                                x1={padding.left}
                                                                y1={padding.top}
                                                                x2={padding.left}
                                                                y2={padding.top + plotHeight}
                                                                stroke="#9ca3af"
                                                                strokeWidth="1" />
                                                            {}
                                                            <line
                                                                x1={padding.left}
                                                                y1={padding.top + plotHeight}
                                                                x2={viewBoxWidth - padding.right}
                                                                y2={padding.top + plotHeight}
                                                                stroke="#9ca3af"
                                                                strokeWidth="1" />
                                                            {}
                                                            {yTicks.map((tick, i) => {
                                                                const y = padding.top + plotHeight - tick / yMax * plotHeight;

                                                                return (
                                                                    <text
                                                                        key={i}
                                                                        x={padding.left - 10}
                                                                        y={y + 4}
                                                                        textAnchor="end"
                                                                        fontSize="12"
                                                                        fill="#6b7280">
                                                                        {formatNumber(tick)}
                                                                    </text>
                                                                );
                                                            })}
                                                            {}
                                                            {filteredData.map((item, index) => {
                                                                const x = padding.left + (filteredData.length > 1 ? index / (filteredData.length - 1) * plotWidth : plotWidth / 2);

                                                                if (!visibleLabelIndexes.includes(index))
                                                                    return null;

                                                                return (
                                                                    <text
                                                                        key={index}
                                                                        x={x}
                                                                        y={padding.top + plotHeight + 20}
                                                                        textAnchor="middle"
                                                                        fontSize="11"
                                                                        fill="#6b7280">
                                                                        {item.date.slice(5)}
                                                                    </text>
                                                                );
                                                            })}
                                                            {}
                                                            <path
                                                                d={callsPath}
                                                                fill="none"
                                                                stroke="#3b82f6"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round" />
                                                            {}
                                                            <path
                                                                d={tokenPath}
                                                                fill="none"
                                                                stroke="#10b981"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round" />
                                                            {}
                                                            {callsPoints.map((p, i) => <circle key={`c-${i}`} cx={p.x} cy={p.y} r="4" fill="#3b82f6" />)}
                                                            {}
                                                            {tokenPoints.map((p, i) => <circle key={`t-${i}`} cx={p.x} cy={p.y} r="4" fill="#10b981" />)}
                                                        </>
                                                    );
                                                })()}
                                            </svg>
                                        </div>
                                    );
                                })()}
                            </div> : <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">日期</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">调用次数</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Token消耗</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">环比</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((item, index) => {
                                            const prevItem = index > 0 ? filteredData[index - 1] : null;
                                            const changePercent = prevItem ? (item.calls - prevItem.calls) / prevItem.calls * 100 : 0;

                                            return (
                                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-gray-900">{item.date}</td>
                                                    <td className="py-3 px-4 text-right font-medium text-gray-900">{item.calls.toLocaleString()}</td>
                                                    <td className="py-3 px-4 text-right text-gray-600">{item.tokens.toLocaleString()}</td>
                                                    <td className="py-3 px-4 text-right">
                                                        {prevItem && <span className={changePercent >= 0 ? "text-green-500" : "text-red-500"}>
                                                            {changePercent >= 0 ? "↑" : "↓"} {Math.abs(changePercent).toFixed(1)}%
                                                                                              </span>}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>}
                        </div>
                        {}
                        <div className="grid grid-cols-2 gap-6">
                            {}
                            <div className="bg-white rounded-lg p-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">模型调用量分布</h3>
                                <div className="flex items-center justify-center">
                                    {}
                                    <div className="relative w-48 h-48">
                                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                            {modelUsageData.reduce((acc, item, index) => {
                                                const offset = acc.offset;
                                                const circumference = 2 * Math.PI * 40;
                                                const strokeDasharray = item.percentage / 100 * circumference;

                                                acc.elements.push(<circle
                                                    key={index}
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    fill="none"
                                                    stroke={item.color}
                                                    strokeWidth="20"
                                                    strokeDasharray={`${strokeDasharray} ${circumference}`}
                                                    strokeDashoffset={-offset}
                                                    className="transition-all" />);

                                                acc.offset += strokeDasharray;
                                                return acc;
                                            }, {
                                                elements: [] as React.ReactNode[],
                                                offset: 0
                                            }).elements}
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-gray-900">27.7K</div>
                                                <div className="text-xs text-gray-500">总调用</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {}
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    {modelUsageData.map(
                                        (item, index) => <div key={index} className="flex items-center gap-2 text-sm">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    backgroundColor: item.color
                                                }} />
                                            <span className="text-gray-600">{item.name}</span>
                                            <span className="text-gray-400 ml-auto">{item.percentage}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {}
                            <div className="bg-white rounded-lg p-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">模型调用量明细</h3>
                                <div className="space-y-3">
                                    {modelUsageData.map((item, index) => <div
                                        key={index}
                                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    backgroundColor: item.color
                                                }} />
                                            <span className="text-sm text-gray-700">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-gray-900 font-medium">{item.calls.toLocaleString()}</span>
                                            <span className="text-gray-400 w-12 text-right">{item.percentage}%</span>
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                        </div>
                    </div>}
                    {}
                    {activeMenu === "APIKey管理" && <div className="space-y-6">
                        {}
                        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search
                                        className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="搜索APIKey名称"
                                        value={apiKeySearchQuery}
                                        onChange={e => setApiKeySearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500" />
                                </div>
                            </div>
                            <Button
                                onClick={() => setNewKeyDialogOpen(true)}
                                className="bg-[#006bff] hover:bg-blue-600 text-white">
                                <Plus className="w-4 h-4 mr-2" />申请新Key
                                                </Button>
                        </div>
                        {}
                        {showToast && <div
                            className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                            <svg
                                className="w-4 h-4 text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            {toastMessage}
                        </div>}
                        {}
                        <div className="bg-white rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">API Key</th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">已用</th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">剩余</th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {apiKeys.filter(
                                        apiKey => apiKey.name.toLowerCase().includes(apiKeySearchQuery.toLowerCase())
                                    ).map(apiKey => {
                                        const usagePercent = apiKey.isUnlimited ? 0 : apiKey.totalQuota > 0 ? Math.round(apiKey.used / apiKey.totalQuota * 100) : 0;

                                        return (
                                            <tr key={apiKey.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900">{apiKey.name}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                            {visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.key.substring(0, 7) + "•••••••••••••••••••" + apiKey.key.slice(-4)}
                                                        </code>
                                                        <button
                                                            onClick={() => {
                                                                const newVisible = new Set(visibleKeys);

                                                                if (newVisible.has(apiKey.id)) {
                                                                    newVisible.delete(apiKey.id);
                                                                } else {
                                                                    newVisible.add(apiKey.id);
                                                                }

                                                                setVisibleKeys(newVisible);
                                                            }}
                                                            className="p-1 hover:bg-gray-100 rounded">
                                                            {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(apiKey.key);
                                                                setToastMessage("复制成功");
                                                                setShowToast(true);
                                                                setTimeout(() => setShowToast(false), 2000);
                                                            }}
                                                            className="p-1 hover:bg-gray-100 rounded">
                                                            <Copy className="w-4 h-4 text-gray-400" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{apiKey.createdAt}</td>
                                                {}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-900">{apiKey.used.toLocaleString()}</span>
                                                        {apiKey.isUnlimited ? <span className="text-xs text-gray-400">(按量计费)</span> : apiKey.totalQuota > 0 && <div className="relative group cursor-pointer">
                                                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all ${usagePercent >= 90 ? "bg-red-500" : usagePercent >= 70 ? "bg-orange-500" : "bg-blue-500"}`}
                                                                    style={{
                                                                        width: `${usagePercent}%`
                                                                    }} />
                                                            </div>
                                                            {}
                                                            <div
                                                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                                                <div
                                                                    className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">总配额：{apiKey.totalQuota.toLocaleString()}
                                                                </div>
                                                                <div
                                                                    className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                                                            </div>
                                                        </div>}
                                                    </div>
                                                </td>
                                                {}
                                                <td className="px-6 py-4 text-sm">
                                                    {apiKey.isUnlimited ? <span className="text-gray-400">- -</span> : <span
                                                        className={apiKey.remaining === 0 ? "text-red-500 font-medium" : "text-gray-900"}>
                                                        {apiKey.remaining.toLocaleString()}
                                                    </span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded-full ${apiKey.status === "normal" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                                        {apiKey.status === "normal" ? "正常" : "已超额度"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => {
                                                            if (confirm("确定要删除此API Key吗？")) {
                                                                setApiKeys(apiKeys.filter(k => k.id !== apiKey.id));
                                                            }
                                                        }}
                                                        className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>}
                    {}
                    {activeMenu === "龙虾" && <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-[#006bff] flex-shrink-0" />
                            <span className="text-sm text-gray-700">龙虾逻辑请见：</span>
                            <a
                                href="https://zhiqi.coze.site/chat2"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#006bff] hover:underline inline-flex items-center gap-1"
                            >
                                https://zhiqi.coze.site/chat2
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <span className="text-sm text-gray-700">，产品：李银刚。开发同学只需关注页面里的内容，左侧菜单、顶部导航等样式风格和智企框架保持一致。</span>
                        </div>
                    </div>}
                </div>
            </main>
            {}
            <Dialog open={newKeyDialogOpen} onOpenChange={setNewKeyDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>申请新的API Key</DialogTitle>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">APIKey</label>
                            <input
                                type="text"
                                value={newKeyName}
                                onChange={e => setNewKeyName(e.target.value)}
                                placeholder="请输入APIKey"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">联系管理员创建APIKey。参考
                                          <a
                                href="https://zyun.360.cn/developer/docnew?docId=172431512048721047959&sharedId=axBqk5EBAAA_"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600 underline ml-1">APIKEY创建文档
                                              </a>
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewKeyDialogOpen(false)}>取消
                                        </Button>
                        <Button
                            onClick={() => {
                                if (newKeyName.trim()) {
                                    const newKey = {
                                        id: Date.now(),
                                        name: newKeyName,
                                        key: "sk-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                                        createdAt: new Date().toLocaleString(),
                                        status: "normal",
                                        totalQuota: 10000,
                                        used: 0,
                                        remaining: 10000,
                                        isUnlimited: false
                                    };

                                    setApiKeys([...apiKeys, newKey]);
                                    setNewKeyName("");
                                    setNewKeyDialogOpen(false);
                                }
                            }}
                            className="bg-[#006bff] hover:bg-blue-600 text-white">确认创建
                                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {}
            <Sheet
                open={newClawDialogOpen}
                onOpenChange={open => {
                    setNewClawDialogOpen(open);

                    if (!open) {
                        setEditingClawId(null);
                        setNewClawName("");
                        setNewClawDesc("");
                        setNewClawModels([]);
                        setExpandedCategories(new Set());
                    }
                }}>
                <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto px-4">
                    <SheetHeader>
                        <SheetTitle>{editingClawId ? "编辑龙虾" : "创建新的龙虾"}</SheetTitle>
                        <SheetDescription>配置您的龙虾应用，选择需要的模型和API Key
                                                </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                        {}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">名称 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newClawName}
                                onChange={e => setNewClawName(e.target.value)}
                                placeholder="请输入龙虾名称"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                        </div>
                        {}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">简介</label>
                            <textarea
                                value={newClawDesc}
                                onChange={e => setNewClawDesc(e.target.value)}
                                placeholder="请输入龙虾简介描述"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none" />
                        </div>
                        {}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">可选模型</label>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                {modelHierarchy.map(category => {
                                    const isExpanded = expandedCategories.has(category.id);
                                    const categoryChildren = category.children || [];
                                    const selectedInCategory = categoryChildren.filter(c => newClawModels.includes(c.id));
                                    const allSelected = selectedInCategory.length === categoryChildren.length && categoryChildren.length > 0;
                                    const someSelected = selectedInCategory.length > 0 && !allSelected;

                                    return (
                                        <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                                            {}
                                            <div
                                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                                onClick={() => {
                                                    const newExpanded = new Set(expandedCategories);

                                                    if (newExpanded.has(category.id)) {
                                                        newExpanded.delete(category.id);
                                                    } else {
                                                        newExpanded.add(category.id);
                                                    }

                                                    setExpandedCategories(newExpanded);
                                                }}>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={e => {
                                                            e.stopPropagation();

                                                            if (allSelected) {
                                                                setNewClawModels(newClawModels.filter(m => !categoryChildren.some(c => c.id === m)));
                                                            } else {
                                                                const newModels = [...new Set([...newClawModels, ...categoryChildren.map(c => c.id)])];
                                                                setNewClawModels(newModels);
                                                            }
                                                        }}
                                                        className="w-4 h-4 flex items-center justify-center">
                                                        <div
                                                            className={`w-3.5 h-3.5 border rounded transition-colors ${allSelected ? "bg-blue-500 border-blue-500" : someSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}>
                                                            {(allSelected || someSelected) && <Check className="w-2.5 h-2.5 text-white" />}
                                                        </div>
                                                    </button>
                                                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                                                    {selectedInCategory.length > 0 && <span className="text-xs text-blue-500">已选{selectedInCategory.length}个</span>}
                                                </div>
                                                <ChevronRight
                                                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                                            </div>
                                            {}
                                            {isExpanded && <div className="bg-gray-50 px-4 py-2">
                                                {categoryChildren.map(model => {
                                                    const isSelected = newClawModels.includes(model.id);

                                                    return (
                                                        <label
                                                            key={model.id}
                                                            className="flex items-center gap-3 py-2 px-2 hover:bg-white rounded cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={e => {
                                                                    if (e.target.checked) {
                                                                        setNewClawModels([...newClawModels, model.id]);
                                                                    } else {
                                                                        setNewClawModels(newClawModels.filter(m => m !== model.id));
                                                                    }
                                                                }}
                                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                                            <span className="text-sm text-gray-600">{model.name}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>}
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">已选择 {newClawModels.length}个模型
                                                      </p>
                        </div>
                        {}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">API Key <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={newClawApiKey}
                                onChange={e => setNewClawApiKey(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                {apiKeys.map(key => <option key={key.id} value={key.key}>
                                    {key.name}({key.key.substring(0, 10)}...{key.key.slice(-4)})
                                                              </option>)}
                            </select>
                            <p className="text-xs text-gray-400 mt-1">默认使用第一个可用的API Key</p>
                        </div>
                    </div>
                    <SheetFooter className="flex-row gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setNewClawDialogOpen(false)}>取消
                                                </Button>
                        <Button
                            className="flex-1 bg-[#006bff] hover:bg-blue-600 text-white"
                            onClick={() => {
                                if (newClawName.trim()) {
                                    const selectedModelNames = newClawModels.map(modelId => {
                                        for (const category of modelHierarchy) {
                                            const model = category.children.find(c => c.id === modelId);

                                            if (model)
                                                return model.name;
                                        }

                                        return modelId;
                                    });

                                    const newClaw = {
                                        id: Date.now(),
                                        name: newClawName,
                                        desc: newClawDesc || "暂无描述",
                                        models: selectedModelNames.length > 0 ? selectedModelNames : ["大语言模型"],
                                        apiKey: newClawApiKey,
                                        createdAt: new Date().toLocaleString(),
                                        status: "active",
                                        calls: 0
                                    };

                                    if (editingClawId) {
                                        set龙虾s(openClaws.map(c => c.id === editingClawId ? {
                                            ...c,
                                            name: newClawName,
                                            desc: newClawDesc || "暂无描述",
                                            models: selectedModelNames.length > 0 ? selectedModelNames : c.models,
                                            apiKey: newClawApiKey
                                        } : c));
                                    } else {
                                        const newClaw = {
                                            id: Date.now(),
                                            name: newClawName,
                                            desc: newClawDesc || "暂无描述",
                                            models: selectedModelNames.length > 0 ? selectedModelNames : ["大语言模型"],
                                            apiKey: newClawApiKey,
                                            createdAt: new Date().toLocaleString(),
                                            status: "active",
                                            calls: 0
                                        };

                                        set龙虾s([...openClaws, newClaw]);
                                    }

                                    setEditingClawId(null);
                                    setNewClawName("");
                                    setNewClawDesc("");
                                    setNewClawModels([]);
                                    setExpandedCategories(new Set());
                                    setNewClawDialogOpen(false);
                                }
                            }}>
                            {editingClawId ? "保存修改" : "确认创建"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* 配额不足提示弹窗 */}
            {quotaInsufficientDialogOpen && (
                <div className="fixed inset-0 z-[2000]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setQuotaInsufficientDialogOpen(false)} />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">配额不足</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                您的配额已不足，无法购买套餐。请联系企业管理员为您分配更多配额。
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setQuotaInsufficientDialogOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    关闭
                                </button>
                                <button
                                    onClick={() => {
                                        setQuotaInsufficientDialogOpen(false);
                                        window.open('/admin?tab=members', '_blank');
                                    }}
                                    className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    联系管理员
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 余额不足提示弹窗 */}
            {balanceInsufficientDialogOpen && (
                <div className="fixed inset-0 z-[2000]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setBalanceInsufficientDialogOpen(false)} />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">余额不足</h3>
                            <p className="text-sm text-gray-500 mb-2">
                                您的余额不足，无法完成购买。请联系企业管理员为您充值或增加配额。
                            </p>
                            <p className="text-sm text-gray-600 mb-6">
                                企业管理员：<span className="font-medium text-gray-900">{adminAccount}</span>
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setBalanceInsufficientDialogOpen(false)}
                                    className="px-6 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    关闭
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 购买成功弹窗 */}
            {purchaseSuccessDialogOpen && (
                <div className="fixed inset-0 z-[2000]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setPurchaseSuccessDialogOpen(false)} />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">购买成功</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                您已成功购买{selectedPackage?.name || '套餐'}，快去使用吧！
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setPurchaseSuccessDialogOpen(false)}
                                    className="px-6 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    关闭
                                </button>
                                <button
                                    onClick={() => {
                                        setPurchaseSuccessDialogOpen(false);
                                        setActiveMenu(purchaseSource);
                                    }}
                                    className="px-6 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    去使用
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 订单确认抽屉 */}
            {orderDrawerOpen && selectedPackage && (
                <div className="fixed inset-0 z-[2000]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setOrderDrawerOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl">
                        {/* 头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">订单确认</h3>
                            <button 
                                onClick={() => setOrderDrawerOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* 内容区 */}
                        <div className="px-6 py-4 space-y-4">
                            {/* 购买说明 */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-700">购买说明</span>
                                </div>
                                <p className="text-xs text-gray-500">套餐用于抵扣产品对应计费项的费用，购买后立即生效，到期作废</p>
                            </div>
                            
                            {/* 套餐详情 */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">套餐名称</span>
                                    <span className="text-sm font-medium text-gray-900">{selectedPackage.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">套餐类型</span>
                                    <span className="text-sm font-medium text-gray-900">总价包</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">购买时长</span>
                                    <span className="text-sm font-medium text-gray-900">{selectedPackage.validity}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">官方标准价</span>
                                    <span className="text-sm text-gray-400">¥ {selectedPackage.originalPriceNum}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">购买价</span>
                                    <span className="text-sm font-bold text-red-500">{selectedPackage.price}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">购买数量</span>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                        >
                                            -
                                        </button>
                                        <input 
                                            type="number" 
                                            value={orderQuantity}
                                            onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-16 h-6 text-center border border-gray-300 rounded text-sm"
                                            min="1"
                                        />
                                        <button 
                                            onClick={() => setOrderQuantity(orderQuantity + 1)}
                                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* 底部 */}
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">应付金额：</span>
                                <span className="text-xl font-bold text-orange-500">¥{(selectedPackage.priceNum * orderQuantity).toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setOrderDrawerOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    取消
                                </button>
                                <button 
                                    onClick={confirmOrder}
                                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    确认订单
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 支付抽屉 */}
            {payDrawerOpen && selectedPackage && (
                <div className="fixed inset-0 z-[2001]">
                    <div className="absolute inset-0 bg-black/50" onClick={closePayDrawer} />
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl">
                        {/* 头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">订单支付</h3>
                            <button 
                                onClick={closePayDrawer}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* 内容区 */}
                        <div className="px-6 py-4 space-y-4">
                            {/* 订单信息 */}
                            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">产品名称</span>
                                    <span className="text-sm font-medium text-gray-900">360智汇云套餐</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">商品名称</span>
                                    <span className="text-sm font-medium text-gray-900">{selectedPackage.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">商品配置</span>
                                    <span className="text-sm font-medium text-gray-900">总价包</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">购买数量</span>
                                    <span className="text-sm font-medium text-gray-900">{orderQuantity}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                    <span className="text-sm text-gray-500">应付金额</span>
                                    <span className="text-lg font-bold text-orange-500">¥{(selectedPackage.priceNum * orderQuantity).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* 底部 */}
                        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-100 bg-gray-50">
                            {orderSuccess ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-medium">购买成功！订单已生成</span>
                                    </div>
                                    <button 
                                        onClick={closePayDrawer}
                                        className="px-6 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        完成
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={handlePaySuccess}
                                    className="w-full py-3 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    立即购买
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 已购套餐侧滑面板 */}
            {purchasedPackagesOpen && (
                <>
                    {/* 遮罩 */}
                    <div
                        className="fixed inset-0 bg-black/30 z-[2000]"
                        onClick={() => {
                            setPurchasedPackagesOpen(false);
                            setPkgSearchName('');
                            setPkgFilterProduct('');
                            setPkgFilterStatus('');
                        }}
                    />
                    {/* 面板 */}
                    <div className="fixed top-0 right-0 bottom-0 w-[1100px] max-w-[95vw] bg-white z-[2001] shadow-2xl flex flex-col">
                        {/* 头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-[#006bff]" />
                                <span className="text-lg font-semibold text-gray-900">已购套餐</span>
                                {(currentUserRole === 'owner' || currentUserRole === 'admin') && (
                                    <span className="px-2 py-0.5 text-xs text-[#006bff] bg-blue-50 rounded-full">全部成员</span>
                                )}
                                {currentUserRole === 'member' && (
                                    <span className="px-2 py-0.5 text-xs text-green-600 bg-green-50 rounded-full">仅自己</span>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setPurchasedPackagesOpen(false);
                                    setPkgSearchName('');
                                    setPkgFilterProduct('');
                                    setPkgFilterStatus('');
                                }}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        {/* 筛选栏 */}
                        <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-50 bg-gray-50/50">
                            {/* 套餐名称搜索 */}
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="搜索套餐名称"
                                    value={pkgSearchName}
                                    onChange={e => setPkgSearchName(e.target.value)}
                                    className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#006bff] focus:border-[#006bff] w-[200px]"
                                />
                            </div>
                            {/* 所属产品筛选 */}
                            <select
                                value={pkgFilterProduct}
                                onChange={e => setPkgFilterProduct(e.target.value)}
                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#006bff] focus:border-[#006bff] text-gray-700"
                            >
                                <option value="">全部产品</option>
                                <option value="AI计划">AI计划</option>
                                <option value="龙虾">龙虾</option>
                                <option value="APICloud">APICloud</option>
                            </select>
                            {/* 套餐状态筛选 */}
                            <select
                                value={pkgFilterStatus}
                                onChange={e => setPkgFilterStatus(e.target.value)}
                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#006bff] focus:border-[#006bff] text-gray-700"
                            >
                                <option value="">全部状态</option>
                                <option value="active">生效中</option>
                                <option value="expired">已过期</option>
                            </select>
                        </div>
                        {/* 表格 */}
                        <div className="flex-1 overflow-auto px-6 py-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-3 px-3 text-xs font-medium text-gray-500 text-left whitespace-nowrap">购买ID</th>
                                        <th className="py-3 px-3 text-xs font-medium text-gray-500 text-left whitespace-nowrap">套餐名称</th>
                                        <th className="py-3 px-3 text-xs font-medium text-gray-500 text-left whitespace-nowrap">所属产品</th>
                                        <th className="py-3 px-3 text-xs font-medium text-gray-500 text-left whitespace-nowrap">购买人</th>
                                        <th className="py-3 px-3 text-xs font-medium text-gray-500 text-right whitespace-nowrap">消费金额(￥)</th>
                                        <th className="py-3 px-3 text-xs font-medium text-gray-500 text-left whitespace-nowrap">购买时间</th>
                                        <th className="py-3 px-3 text-xs font-medium text-gray-500 text-left whitespace-nowrap">到期时间</th>
                                        <th className="py-3 px-3 text-xs font-medium text-gray-500 text-left whitespace-nowrap">当前状态</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getFilteredPackages(currentUserRole, userAccount)
                                        .filter(pkg => !pkgSearchName || pkg.packageName.includes(pkgSearchName))
                                        .filter(pkg => !pkgFilterProduct || pkg.product === pkgFilterProduct)
                                        .filter(pkg => !pkgFilterStatus || pkg.status === pkgFilterStatus)
                                        .map((pkg) => (
                                        <tr key={pkg.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-3 text-sm text-gray-700 font-mono whitespace-nowrap">{pkg.id}</td>
                                            <td className="py-3 px-3 text-sm text-gray-700 whitespace-nowrap">{pkg.packageName}</td>
                                            <td className="py-3 px-3 text-sm text-gray-600 whitespace-nowrap">{pkg.product}</td>
                                            <td className="py-3 px-3 text-sm text-gray-700 whitespace-nowrap">{pkg.purchaser}</td>
                                            <td className="py-3 px-3 text-sm text-gray-700 text-right whitespace-nowrap">￥{pkg.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
                                            <td className="py-3 px-3 text-sm text-gray-600 whitespace-nowrap">{pkg.purchaseTime}</td>
                                            <td className="py-3 px-3 text-sm text-gray-600 whitespace-nowrap">{pkg.expireTime}</td>
                                            <td className="py-3 px-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    pkg.status === 'active'
                                                        ? 'bg-green-50 text-green-600'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {pkg.status === 'active' ? '生效中' : '已过期'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {getFilteredPackages(currentUserRole, userAccount)
                                        .filter(pkg => !pkgSearchName || pkg.packageName.includes(pkgSearchName))
                                        .filter(pkg => !pkgFilterProduct || pkg.product === pkgFilterProduct)
                                        .filter(pkg => !pkgFilterStatus || pkg.status === pkgFilterStatus)
                                        .length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">暂无匹配的已购套餐</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
            <div className="text-gray-500">加载中...</div>
        </div>
    );
}

// Default export with Suspense boundary
export default function EnterprisePage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <EnterprisePageContent />
        </Suspense>
    );
}
