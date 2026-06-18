"use client";
import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    Search,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Home,
    Users,
    Cpu,
    Bot,
    Plus,
    AlertCircle,
    X,
    Check,
    Settings,
    ExternalLink,
    User,
    LogOut,
    Building2,
    Info,
    Building,
    Folder,
    BarChart,
    ShieldCheck,
    Shield,
    ToggleLeft,
    Edit3,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// 用户角色类型
type UserRole = 'owner' | 'admin' | 'member';

// 角色配置
const roleConfig: Record<UserRole, { label: string; bgColor: string }> = {
    owner: { label: '主账号', bgColor: 'bg-blue-500' },
    admin: { label: '管理员', bgColor: 'bg-orange-500' },
    member: { label: '成员', bgColor: 'bg-green-500' },
};

// 管理后台左侧菜单项
const adminMenuItems = [
    { id: "overview", name: "概览", icon: BarChart },
    { id: "members", name: "配额管理", icon: Users },
    { id: "access", name: "访问管理", icon: Shield },
    { id: "roles", name: "角色管理", icon: ShieldCheck },
];

// 用户-企业-角色映射数据
// key: 用户账号, value: 该用户在各企业中的角色列表
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

// 角色管理数据类型
type RoleItem = {
    id: string;
    name: string;
    remark: string;
    creatorName: string;
    creatorId: string;
    createdAt: string;
    memberCount: number;
};

// 角色管理模拟数据
const defaultRoles: RoleItem[] = [
    { id: "role_001", name: "超级管理员", remark: "拥有所有权限的管理员角色", creatorName: "张三", creatorId: "zhangsan", createdAt: "2026.08.09 00:00:00", memberCount: 5 },
    { id: "role_002", name: "运维工程师", remark: "负责系统运维和监控", creatorName: "李四", creatorId: "lisi", createdAt: "2026.08.09 00:00:00", memberCount: 0 },
    { id: "role_003", name: "开发工程师", remark: "负责产品开发和代码管理", creatorName: "张三", creatorId: "zhangsan", createdAt: "2026.08.09 00:00:00", memberCount: 8 },
    { id: "role_004", name: "只读用户", remark: "仅查看权限，不可修改", creatorName: "王五", creatorId: "wangwu", createdAt: "2026.08.09 00:00:00", memberCount: 90 },
    { id: "role_005", name: "产品经理", remark: "负责需求管理和产品规划", creatorName: "张三", creatorId: "zhangsan", createdAt: "2026.08.09 00:00:00", memberCount: 3 },
    { id: "role_006", name: "测试工程师", remark: "负责质量保障和自动化测试", creatorName: "李四", creatorId: "lisi", createdAt: "2026.08.09 00:00:00", memberCount: 6 },
    { id: "role_007", name: "项目经理", remark: "负责项目进度和资源协调", creatorName: "王五", creatorId: "wangwu", createdAt: "2026.08.09 00:00:00", memberCount: 2 },
    { id: "role_008", name: "数据分析师", remark: "负责数据报表和业务分析", creatorName: "张三", creatorId: "zhangsan", createdAt: "2026.08.09 00:00:00", memberCount: 4 },
    { id: "role_009", name: "安全管理员", remark: "负责安全策略和审计", creatorName: "李四", creatorId: "lisi", createdAt: "2026.08.09 00:00:00", memberCount: 1 },
    { id: "role_010", name: "运营专员", remark: "负责日常运营和推广", creatorName: "王五", creatorId: "wangwu", createdAt: "2026.08.09 00:00:00", memberCount: 12 },
    { id: "role_011", name: "客服专员", remark: "负责用户服务和问题处理", creatorName: "张三", creatorId: "zhangsan", createdAt: "2026.08.09 00:00:00", memberCount: 15 },
    { id: "role_012", name: "财务审核", remark: "负责费用审批和财务核对", creatorName: "李四", creatorId: "lisi", createdAt: "2026.08.09 00:00:00", memberCount: 2 },
    { id: "role_013", name: "技术支持", remark: "负责技术问题排查和支持", creatorName: "王五", creatorId: "wangwu", createdAt: "2026.08.09 00:00:00", memberCount: 7 },
    { id: "role_014", name: "内容审核员", remark: "负责内容合规审核", creatorName: "张三", creatorId: "zhangsan", createdAt: "2026.08.09 00:00:00", memberCount: 0 },
    { id: "role_015", name: "外部协作者", remark: "外部人员有限访问权限", creatorName: "李四", creatorId: "lisi", createdAt: "2026.08.09 00:00:00", memberCount: 20 },
    { id: "role_016", name: "培训管理员", remark: "负责员工培训和知识库", creatorName: "王五", creatorId: "wangwu", createdAt: "2026.08.09 00:00:00", memberCount: 3 },
    { id: "role_017", name: "系统监控员", remark: "负责系统状态监控和告警", creatorName: "张三", creatorId: "zhangsan", createdAt: "2026.08.09 00:00:00", memberCount: 0 },
    { id: "role_018", name: "资源管理员", remark: "负责计算资源和配额管理", creatorName: "李四", creatorId: "lisi", createdAt: "2026.08.09 00:00:00", memberCount: 1 },
    { id: "role_019", name: "合规审计员", remark: "负责合规性审计和报告", creatorName: "王五", creatorId: "wangwu", createdAt: "2026.08.09 00:00:00", memberCount: 0 },
    { id: "role_020", name: "访客", remark: "最低权限角色，仅可浏览公开信息", creatorName: "张三", creatorId: "zhangsan", createdAt: "2026.08.09 00:00:00", memberCount: 45 },
    { id: "role_021", name: "接口管理员", remark: "负责API接口管理和文档维护", creatorName: "李四", creatorId: "lisi", createdAt: "2026.08.09 00:00:00", memberCount: 2 },
    { id: "role_022", name: "发布管理员", remark: "负责版本发布和上线审批", creatorName: "王五", creatorId: "wangwu", createdAt: "2026.08.09 00:00:00", memberCount: 3 },
    { id: "role_023", name: "DBA", remark: "数据库管理和性能优化", creatorName: "张三", creatorId: "zhangsan", createdAt: "2026.08.09 00:00:00", memberCount: 1 },
    { id: "role_024", name: "架构师", remark: "技术架构设计和评审", creatorName: "李四", creatorId: "lisi", createdAt: "2026.08.09 00:00:00", memberCount: 2 },
    { id: "role_025", name: "文档管理员", remark: "负责技术文档和知识管理", creatorName: "王五", creatorId: "wangwu", createdAt: "2026.08.09 00:00:00", memberCount: 0 },
    { id: "role_026", name: "实习生", remark: "实习生基础权限", creatorName: "张三", creatorId: "zhangsan", createdAt: "2026.08.09 00:00:00", memberCount: 10 },
    { id: "role_027", name: "外包开发", remark: "外包人员受限开发权限", creatorName: "李四", creatorId: "lisi", createdAt: "2026.08.09 00:00:00", memberCount: 8 },
    { id: "role_028", name: "运维管理员", remark: "运维团队管理权限", creatorName: "王五", creatorId: "wangwu", createdAt: "2026.08.09 00:00:00", memberCount: 4 },
    { id: "role_029", name: "产品运营", remark: "产品运营和用户增长", creatorName: "张三", creatorId: "zhangsan", createdAt: "2026.08.09 00:00:00", memberCount: 5 },
    { id: "role_030", name: "安全审计", remark: "信息安全审计和合规", creatorName: "李四", creatorId: "lisi", createdAt: "2026.08.09 00:00:00", memberCount: 1 },
    { id: "role_031", name: "网络管理员", remark: "网络设备管理和维护", creatorName: "王五", creatorId: "wangwu", createdAt: "2026.08.09 00:00:00", memberCount: 2 },
];

// 根据用户账号生成企业列表
const getEnterpriseListForUser = (userAccount: string) => {
    const roles = userEnterpriseRolesMap[userAccount] || [];
    return roles.map((item, index) => ({
        id: item.enterpriseId,
        name: item.enterpriseName,
        icon: "企",
        role: item.role,
        active: index === 0,
    }));
};

// 默认企业列表（未登录时使用）
const defaultEnterpriseList = [
    { 
        id: 1, 
        name: "张三企业", 
        icon: "企", 
        role: 'owner' as UserRole,
        active: true,
    },
];

// 模拟数据 - 成员列表
const mockMembers = [
    { id: 'zhangsan', name: '张三', email: 'zhangsan@360.cn', role: 'owner', callsUsed: 52340, callsTotal: 100000, tokensUsed: 1200000, tokensTotal: 2000000, amountUsed: 120.00, amountTotal: 200.00 },
    { id: 'lisi', name: '李四', email: 'lisi@360.cn', role: 'admin', callsUsed: 38920, callsTotal: 50000, tokensUsed: 856000, tokensTotal: 1000000, amountUsed: 85.60, amountTotal: 100.00 },
    { id: 'wangwu', name: '王五', email: 'wangwu@360.cn', role: 'member', callsUsed: 28450, callsTotal: 30000, tokensUsed: 420000, tokensTotal: 500000, amountUsed: 42.00, amountTotal: 50.00 },
    { id: 'zhaoliu', name: '赵六', email: 'zhaoliu@360.cn', role: 'member', callsUsed: 12680, callsTotal: 30000, tokensUsed: 180000, tokensTotal: 500000, amountUsed: 18.00, amountTotal: 50.00 },
    { id: 'sunqi', name: '孙七', email: 'sunqi@360.cn', role: 'member', callsUsed: 5200, callsTotal: 20000, tokensUsed: 85000, tokensTotal: 200000, amountUsed: 8.50, amountTotal: 20.00 },
    { id: 'zhouba', name: '周八', email: 'zhouba@360.cn', role: 'member', callsUsed: 0, callsTotal: 50000, tokensUsed: 0, tokensTotal: 500000, amountUsed: 0, amountTotal: 0 },
    { id: 'zhengshi', name: '郑十', email: 'zhengshi@360.cn', role: 'member', callsUsed: 15680, callsTotal: 30000, tokensUsed: 230000, tokensTotal: 500000, amountUsed: 23.00, amountTotal: 0 },
];

// 模拟数据 - 成员配额使用情况（概览1）
type MemberQuotaData = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    aiQuota: {
        used: number;
        total: number | typeof Infinity;
    };
    lobsterQuota: {
        used: number;
        total: number | typeof Infinity;
    };
};

const memberQuotaData: MemberQuotaData[] = [
    { 
        id: 'qid_10001', 
        name: '张三', 
        email: 'zhangsan@360.cn', 
        role: 'owner',
        aiQuota: { used: 52340, total: Infinity },
        lobsterQuota: { used: 10000, total: Infinity }
    },
    { 
        id: 'qid_10002', 
        name: '李四', 
        email: 'lisi@360.cn', 
        role: 'admin',
        aiQuota: { used: 38920, total: Infinity },
        lobsterQuota: { used: 8500, total: Infinity }
    },
    { 
        id: 'qid_10003', 
        name: '王五', 
        email: 'wangwu@360.cn', 
        role: 'member',
        aiQuota: { used: 28450, total: 50000 },
        lobsterQuota: { used: 12000, total: 20000 }
    },
    { 
        id: 'qid_10004', 
        name: '赵六', 
        email: 'zhaoliu@360.cn', 
        role: 'member',
        aiQuota: { used: 12680, total: 30000 },
        lobsterQuota: { used: 8500, total: 15000 }
    },
    { 
        id: 'qid_10005', 
        name: '孙七', 
        email: 'sunqi@360.cn', 
        role: 'member',
        aiQuota: { used: 5200, total: 20000 },
        lobsterQuota: { used: 3000, total: 10000 }
    },
    { 
        id: 'qid_10006', 
        name: '周八', 
        email: 'zhouba@360.cn', 
        role: 'member',
        aiQuota: { used: 0, total: 10000 },
        lobsterQuota: { used: 0, total: 5000 }
    },
    { 
        id: 'qid_10007', 
        name: '郑十', 
        email: 'zhengshi@360.cn', 
        role: 'member',
        aiQuota: { used: 15680, total: 30000 },
        lobsterQuota: { used: 9800, total: 10000 }
    },
];

// 模拟数据 - 可添加成员列表
const mockAvailableMembers = [
    { id: 'zhouba', name: '周八', email: 'zhouba@360.cn' },
    { id: 'wujiu', name: '吴九', email: 'wujiu@360.cn' },
    { id: 'zhengshi', name: '郑十', email: 'zhengshi@360.cn' },
];

// 配额规则数据类型
type QuotaRuleStatus = 'pending' | 'active' | 'inactive';

// 产品配额类型（支持具体金额或"不限制"）
type ProductQuota = {
    value: number | 'unlimited';  // 具体金额或'unlimited'表示不限制
};

// 配额规则数据类型定义
type QuotaRule = {
    id: string;
    name: string;
    quotaType: 'role' | 'member';  // 角色配额 or 成员配额
    // 成员配额字段
    memberCount: number;
    quotaPerMember: number;  // 保留兼容性
    // 角色配额字段
    roleName?: string;  // 角色配额关联的角色名称
    scope?: string;  // 适用范围：指定角色 / 全部角色
    scopeTarget?: string;  // 适用对象
    // 产品维度配额
    lobsterQuota: ProductQuota;
    llmQuota: ProductQuota;
    createTime: string;
    updateTime: string;
    status: QuotaRuleStatus;
    isDefault?: boolean;  // 是否为默认配额规则
};

// 初始配额规则数据
const initialQuotaRulesData: QuotaRule[] = [
    // 成员配额
    { 
        id: '0', 
        name: '主账号和管理员配额不限制',
        quotaType: 'member',
        memberCount: 2,  // 主账号+管理员
        quotaPerMember: 0,
        lobsterQuota: { value: 'unlimited' },
        llmQuota: { value: 'unlimited' },
        createTime: '2024-01-01 00:00', 
        updateTime: '2024-01-01 00:00', 
        status: 'active',
        isDefault: true  // 标记为默认配额规则
    },
    { 
        id: '1', 
        name: '配额黑名单',
        quotaType: 'member',
        memberCount: 5, 
        quotaPerMember: 1000,
        lobsterQuota: { value: 1000 },
        llmQuota: { value: 1000 },
        createTime: '2024-01-15 10:30', 
        updateTime: '2024-03-20 14:25', 
        status: 'active' 
    },
    { 
        id: '2', 
        name: '技术部结算单元配额',
        quotaType: 'member',
        memberCount: 100, 
        quotaPerMember: 500,
        lobsterQuota: { value: 500 },
        llmQuota: { value: 500 },
        createTime: '2024-02-20 09:15', 
        updateTime: '2024-04-10 16:40', 
        status: 'inactive' 
    },
    { 
        id: '3', 
        name: '产品中心配额规则',
        quotaType: 'member',
        memberCount: 20, 
        quotaPerMember: 2000,
        lobsterQuota: { value: 2000 },
        llmQuota: { value: 2000 },
        createTime: '2024-03-01 11:00', 
        updateTime: '2024-03-01 11:00', 
        status: 'pending' 
    },
    // 角色配额
    {
        id: '10',
        name: '测试配额',
        quotaType: 'role',
        memberCount: 0,
        quotaPerMember: 0,
        roleName: '产品',
        scope: '指定角色',
        scopeTarget: '产品',
        lobsterQuota: { value: 100 },
        llmQuota: { value: 1500 },
        createTime: '2026/05/21 19:41',
        updateTime: '2026/05/22 15:59',
        status: 'active'
    },
    {
        id: '11',
        name: '全员默认配额',
        quotaType: 'member',
        memberCount: 0,
        quotaPerMember: 0,
        lobsterQuota: { value: 500 },
        llmQuota: { value: 500 },
        createTime: '2026/05/21 19:41',
        updateTime: '2026/05/22 15:59',
        status: 'active'
    },
];

// 成员列表数据
const membersList = [
    { id: '1', name: '张三', account: 'zhangsan@360.cn', department: '技术部' },
    { id: '2', name: '李四', account: 'lisi@360.cn', department: '产品部' },
    { id: '3', name: '王五', account: 'wangwu@360.cn', department: '技术部' },
    { id: '4', name: '赵六', account: 'zhaoliu@360.cn', department: '运营部' },
    { id: '5', name: '孙七', account: 'sunqi@360.cn', department: '市场部' },
    { id: '6', name: '周八', account: 'zhouba@360.cn', department: '技术部' },
    { id: '7', name: '吴九', account: 'wujiu@360.cn', department: '产品部' },
    { id: '8', name: '郑十', account: 'zhengshi@360.cn', department: '财务部' },
];

// 组织架构类型定义
type OrgNode = {
    id: string;
    name: string;
    type: 'company' | 'department' | 'team';
    memberCount?: number;
    children?: OrgNode[];
};

// 组织架构数据
const organizationTree: OrgNode[] = [
    {
        id: 'dept-1',
        name: '360智汇云',
        type: 'company',
        children: [
            {
                id: 'dept-2',
                name: '技术部',
                type: 'department',
                memberCount: 25,
                children: [
                    { id: 'dept-2-1', name: '前端组', type: 'team', memberCount: 8 },
                    { id: 'dept-2-2', name: '后端组', type: 'team', memberCount: 10 },
                    { id: 'dept-2-3', name: '算法组', type: 'team', memberCount: 7 },
                ]
            },
            {
                id: 'dept-3',
                name: '产品部',
                type: 'department',
                memberCount: 12,
            },
            {
                id: 'dept-4',
                name: '运营部',
                type: 'department',
                memberCount: 8,
            },
            {
                id: 'dept-5',
                name: '市场部',
                type: 'department',
                memberCount: 6,
            },
            {
                id: 'dept-6',
                name: '财务部',
                type: 'department',
                memberCount: 4,
            },
        ]
    }
];

// 统计数据类型
type StatsData = {
    activeMembers: { count: number; total: number; overQuota: number };
    lobsters: { normal: number; total: number };
    resourcePacks: { total: number; active: number; expired: number };
    calls: { count: number; trend: string };
    tokens: { count: number; daily: number };
    consumption: { amount: number; daily: number; trend: string };
    memberRanking: Array<{
        rank: number;
        name: string;
        role: string;
        tokensUsed: number;
        tokensQuota: number;
        percentage: number;
        trend: string;
        amount?: number;
    }>;
    productRanking: Array<{
        rank: number;
        name: string;
        amount: number;
        percentage: number;
        trend: string;
    }>;
    resourcePackRanking: Array<{
        rank: number;
        name: string;
        amount: number;
        percentage: number;
        trend: string;
    }>;
};

// 不同时间范围的统计数据
const statsByDateRange: Record<string, StatsData> = {
    today: {
        activeMembers: { count: 8, total: 10, overQuota: 2 },
        lobsters: { normal: 8, total: 10 },
        resourcePacks: { total: 15, active: 12, expired: 3 },
        calls: { count: 12847, trend: "+12.5%" },
        tokens: { count: 1200000, daily: 1200000 },
        consumption: { amount: 128.47, daily: 128.47, trend: "+12.5%" },
        memberRanking: [
            { rank: 1, name: "张三", role: "主账号", tokensUsed: 523400, tokensQuota: 1000000, percentage: 26.5, trend: "↑ 15.2%", amount: 52.34 },
            { rank: 2, name: "李四", role: "管理员", tokensUsed: 389200, tokensQuota: 800000, percentage: 19.7, trend: "↑ 8.7%", amount: 38.92 },
            { rank: 3, name: "王五", role: "成员", tokensUsed: 184500, tokensQuota: 500000, percentage: 9.3, trend: "↓ 3.2%", amount: 18.45 },
            { rank: 4, name: "赵六", role: "成员", tokensUsed: 126800, tokensQuota: 500000, percentage: 6.4, trend: "↑ 5.1%", amount: 12.68 },
            { rank: 5, name: "孙七", role: "成员", tokensUsed: 60800, tokensQuota: 300000, percentage: 3.1, trend: "↑ 2.3%", amount: 6.08 },
            { rank: 6, name: "周八", role: "成员", tokensUsed: 55200, tokensQuota: 300000, percentage: 2.8, trend: "↑ 1.9%", amount: 5.52 },
            { rank: 7, name: "吴九", role: "成员", tokensUsed: 48600, tokensQuota: 250000, percentage: 2.5, trend: "↓ 0.8%", amount: 4.86 },
            { rank: 8, name: "郑十", role: "成员", tokensUsed: 42300, tokensQuota: 200000, percentage: 2.1, trend: "↑ 3.2%", amount: 4.23 },
            { rank: 9, name: "陈一", role: "成员", tokensUsed: 38900, tokensQuota: 200000, percentage: 2.0, trend: "↑ 1.5%", amount: 3.89 },
            { rank: 10, name: "林二", role: "成员", tokensUsed: 35600, tokensQuota: 150000, percentage: 1.8, trend: "↓ 0.5%", amount: 3.56 },
            { rank: 11, name: "黄三", role: "成员", tokensUsed: 31200, tokensQuota: 150000, percentage: 1.6, trend: "↑ 2.1%", amount: 3.12 },
            { rank: 12, name: "刘四", role: "成员", tokensUsed: 27800, tokensQuota: 120000, percentage: 1.4, trend: "↑ 0.9%", amount: 2.78 },
            { rank: 13, name: "杨五", role: "成员", tokensUsed: 24500, tokensQuota: 100000, percentage: 1.2, trend: "↓ 1.2%", amount: 2.45 },
            { rank: 14, name: "赵六", role: "成员", tokensUsed: 21200, tokensQuota: 100000, percentage: 1.1, trend: "↑ 0.6%", amount: 2.12 },
            { rank: 15, name: "钱七", role: "成员", tokensUsed: 18900, tokensQuota: 80000, percentage: 1.0, trend: "↑ 0.4%", amount: 1.89 },
        ],
        productRanking: [
            { rank: 1, name: "AI计划", amount: 85.50, percentage: 43.2, trend: "↑ 15.2%" },
            { rank: 2, name: "龙虾", amount: 32.80, percentage: 16.6, trend: "↑ 8.5%" },
            { rank: 3, name: "APICloud", amount: 10.17, percentage: 5.1, trend: "↓ 1.2%" },
        ],
        resourcePackRanking: [
            { rank: 1, name: "新手体验包", amount: 45.20, percentage: 22.9, trend: "↑ 10.5%" },
            { rank: 2, name: "基础开发包", amount: 32.80, percentage: 16.6, trend: "↑ 6.2%" },
            { rank: 3, name: "企业级套餐", amount: 28.50, percentage: 14.4, trend: "↓ 3.1%" },
            { rank: 4, name: "AI计划套餐", amount: 15.30, percentage: 7.7, trend: "↑ 4.8%" },
            { rank: 5, name: "图像理解包", amount: 6.67, percentage: 3.4, trend: "↑ 2.1%" },
        ],
    },
    "7days": {
        activeMembers: { count: 9, total: 10, overQuota: 3 },
        lobsters: { normal: 25, total: 32 },
        resourcePacks: { total: 48, active: 38, expired: 10 },
        calls: { count: 89234, trend: "+8.3%" },
        tokens: { count: 8500000, daily: 1200000 },
        consumption: { amount: 892.34, daily: 127.48, trend: "+8.3%" },
        memberRanking: [
            { rank: 1, name: "张三", role: "主账号", tokensUsed: 3680000, tokensQuota: 5000000, percentage: 27.1, trend: "↑ 12.1%", amount: 368.00 },
            { rank: 2, name: "李四", role: "管理员", tokensUsed: 2730000, tokensQuota: 4000000, percentage: 20.1, trend: "↑ 6.8%", amount: 273.00 },
            { rank: 3, name: "王五", role: "成员", tokensUsed: 1290000, tokensQuota: 2500000, percentage: 9.5, trend: "↓ 1.9%", amount: 129.50 },
            { rank: 4, name: "赵六", role: "成员", tokensUsed: 887600, tokensQuota: 2000000, percentage: 6.5, trend: "↑ 4.2%", amount: 88.76 },
            { rank: 5, name: "孙七", role: "成员", tokensUsed: 339900, tokensQuota: 1500000, percentage: 2.5, trend: "↑ 1.5%", amount: 33.99 },
            { rank: 6, name: "周八", role: "成员", tokensUsed: 298500, tokensQuota: 1200000, percentage: 2.2, trend: "↑ 2.1%", amount: 29.85 },
            { rank: 7, name: "吴九", role: "成员", tokensUsed: 256800, tokensQuota: 1000000, percentage: 1.9, trend: "↓ 0.6%", amount: 25.68 },
            { rank: 8, name: "郑十", role: "成员", tokensUsed: 215600, tokensQuota: 900000, percentage: 1.6, trend: "↑ 1.8%", amount: 21.56 },
            { rank: 9, name: "陈一", role: "成员", tokensUsed: 189300, tokensQuota: 800000, percentage: 1.4, trend: "↑ 0.9%", amount: 18.93 },
            { rank: 10, name: "林二", role: "成员", tokensUsed: 165800, tokensQuota: 700000, percentage: 1.2, trend: "↓ 0.3%", amount: 16.58 },
            { rank: 11, name: "黄三", role: "成员", tokensUsed: 142500, tokensQuota: 600000, percentage: 1.0, trend: "↑ 1.2%", amount: 14.25 },
            { rank: 12, name: "刘四", role: "成员", tokensUsed: 118900, tokensQuota: 500000, percentage: 0.9, trend: "↑ 0.5%", amount: 11.89 },
            { rank: 13, name: "杨五", role: "成员", tokensUsed: 95600, tokensQuota: 400000, percentage: 0.7, trend: "↓ 0.2%", amount: 9.56 },
            { rank: 14, name: "赵六", role: "成员", tokensUsed: 72800, tokensQuota: 300000, percentage: 0.5, trend: "↑ 0.3%", amount: 7.28 },
            { rank: 15, name: "钱七", role: "成员", tokensUsed: 51300, tokensQuota: 200000, percentage: 0.4, trend: "↑ 0.1%", amount: 5.13 },
        ],
        productRanking: [
            { rank: 1, name: "大模型", amount: 612.50, percentage: 45.2, trend: "↑ 18.5%" },
            { rank: 2, name: "龙虾", amount: 228.30, percentage: 16.8, trend: "↑ 10.2%" },
            { rank: 3, name: "APICloud", amount: 51.54, percentage: 3.8, trend: "↓ 1.5%" },
        ],
        resourcePackRanking: [
            { rank: 1, name: "新手体验包", amount: 312.50, percentage: 23.0, trend: "↑ 11.2%" },
            { rank: 2, name: "基础开发包", amount: 228.30, percentage: 16.8, trend: "↑ 7.5%" },
            { rank: 3, name: "企业级套餐", amount: 198.20, percentage: 14.6, trend: "↓ 2.8%" },
            { rank: 4, name: "大模型套餐", amount: 106.50, percentage: 7.8, trend: "↑ 5.1%" },
            { rank: 5, name: "图像理解包", amount: 46.84, percentage: 3.4, trend: "↑ 3.2%" },
        ],
    },
    "30days": {
        activeMembers: { count: 10, total: 10, overQuota: 3 },
        lobsters: { normal: 85, total: 110 },
        resourcePacks: { total: 156, active: 120, expired: 36 },
        calls: { count: 356789, trend: "+15.6%" },
        tokens: { count: 35200000, daily: 1170000 },
        consumption: { amount: 3567.89, daily: 118.93, trend: "+15.6%" },
        memberRanking: [
            { rank: 1, name: "张三", role: "主账号", tokensUsed: 15700000, tokensQuota: 20000000, percentage: 28.0, trend: "↑ 18.3%", amount: 1570.00 },
            { rank: 2, name: "李四", role: "管理员", tokensUsed: 10700000, tokensQuota: 15000000, percentage: 19.1, trend: "↑ 10.2%", amount: 1070.00 },
            { rank: 3, name: "王五", role: "成员", tokensUsed: 4640000, tokensQuota: 10000000, percentage: 8.3, trend: "↓ 2.1%", amount: 464.00 },
            { rank: 4, name: "赵六", role: "成员", tokensUsed: 3210000, tokensQuota: 8000000, percentage: 5.7, trend: "↑ 5.8%", amount: 321.00 },
            { rank: 5, name: "孙七", role: "成员", tokensUsed: 1450000, tokensQuota: 6000000, percentage: 2.6, trend: "↑ 2.9%", amount: 145.00 },
            { rank: 6, name: "周八", role: "成员", tokensUsed: 1285000, tokensQuota: 5000000, percentage: 2.3, trend: "↑ 3.2%", amount: 128.50 },
            { rank: 7, name: "吴九", role: "成员", tokensUsed: 1126000, tokensQuota: 4500000, percentage: 2.0, trend: "↓ 0.8%", amount: 112.60 },
            { rank: 8, name: "郑十", role: "成员", tokensUsed: 985600, tokensQuota: 4000000, percentage: 1.8, trend: "↑ 2.5%", amount: 98.56 },
            { rank: 9, name: "陈一", role: "成员", tokensUsed: 862300, tokensQuota: 3500000, percentage: 1.5, trend: "↑ 1.3%", amount: 86.23 },
            { rank: 10, name: "林二", role: "成员", tokensUsed: 756800, tokensQuota: 3000000, percentage: 1.4, trend: "↓ 0.4%", amount: 75.68 },
            { rank: 11, name: "黄三", role: "成员", tokensUsed: 652100, tokensQuota: 2800000, percentage: 1.2, trend: "↑ 1.6%", amount: 65.21 },
            { rank: 12, name: "刘四", role: "成员", tokensUsed: 548900, tokensQuota: 2500000, percentage: 1.0, trend: "↑ 0.8%", amount: 54.89 },
            { rank: 13, name: "杨五", role: "成员", tokensUsed: 446200, tokensQuota: 2000000, percentage: 0.8, trend: "↓ 0.3%", amount: 44.62 },
            { rank: 14, name: "赵六", role: "成员", tokensUsed: 344800, tokensQuota: 1500000, percentage: 0.6, trend: "↑ 0.5%", amount: 34.48 },
            { rank: 15, name: "钱七", role: "成员", tokensUsed: 243500, tokensQuota: 1000000, percentage: 0.4, trend: "↑ 0.2%", amount: 24.35 },
        ],
        productRanking: [
            { rank: 1, name: "大模型", amount: 2751.00, percentage: 48.2, trend: "↑ 22.5%" },
            { rank: 2, name: "龙虾", amount: 1070.00, percentage: 18.8, trend: "↑ 12.8%" },
            { rank: 3, name: "APICloud", amount: 285.67, percentage: 5.0, trend: "↓ 1.2%" },
        ],
        resourcePackRanking: [
            { rank: 1, name: "新手体验包", amount: 1248.50, percentage: 22.0, trend: "↑ 12.5%" },
            { rank: 2, name: "基础开发包", amount: 912.30, percentage: 16.1, trend: "↑ 8.8%" },
            { rank: 3, name: "企业级套餐", amount: 792.20, percentage: 14.0, trend: "↓ 1.5%" },
            { rank: 4, name: "大模型套餐", amount: 425.80, percentage: 7.5, trend: "↑ 5.8%" },
            { rank: 5, name: "图像理解包", amount: 189.09, percentage: 3.3, trend: "↑ 3.2%" },
        ],
    },
    month: {
        activeMembers: { count: 10, total: 10, overQuota: 4 },
        lobsters: { normal: 95, total: 125 },
        resourcePacks: { total: 180, active: 140, expired: 40 },
        calls: { count: 423567, trend: "+18.2%" },
        tokens: { count: 42100000, daily: 1400000 },
        consumption: { amount: 4235.67, daily: 141.19, trend: "+18.2%" },
        memberRanking: [
            { rank: 1, name: "张三", role: "主账号", tokensUsed: 18700000, tokensQuota: 25000000, percentage: 27.8, trend: "↑ 20.1%", amount: 1870.00 },
            { rank: 2, name: "李四", role: "管理员", tokensUsed: 12700000, tokensQuota: 18000000, percentage: 18.9, trend: "↑ 11.5%", amount: 1270.00 },
            { rank: 3, name: "王五", role: "成员", tokensUsed: 5510000, tokensQuota: 12000000, percentage: 8.2, trend: "↓ 1.8%", amount: 551.00 },
            { rank: 4, name: "赵六", role: "成员", tokensUsed: 3810000, tokensQuota: 10000000, percentage: 5.7, trend: "↑ 6.3%", amount: 381.00 },
            { rank: 5, name: "孙七", role: "成员", tokensUsed: 1650000, tokensQuota: 8000000, percentage: 2.5, trend: "↑ 3.1%", amount: 165.00 },
            { rank: 6, name: "周八", role: "成员", tokensUsed: 1526000, tokensQuota: 7000000, percentage: 2.3, trend: "↑ 3.8%", amount: 152.60 },
            { rank: 7, name: "吴九", role: "成员", tokensUsed: 1385000, tokensQuota: 6000000, percentage: 2.1, trend: "↓ 1.0%", amount: 138.50 },
            { rank: 8, name: "郑十", role: "成员", tokensUsed: 1189600, tokensQuota: 5500000, percentage: 1.8, trend: "↑ 2.8%", amount: 118.96 },
            { rank: 9, name: "陈一", role: "成员", tokensUsed: 1052300, tokensQuota: 5000000, percentage: 1.6, trend: "↑ 1.6%", amount: 105.23 },
            { rank: 10, name: "林二", role: "成员", tokensUsed: 925800, tokensQuota: 4500000, percentage: 1.4, trend: "↓ 0.5%", amount: 92.58 },
            { rank: 11, name: "黄三", role: "成员", tokensUsed: 798500, tokensQuota: 4000000, percentage: 1.2, trend: "↑ 1.9%", amount: 79.85 },
            { rank: 12, name: "刘四", role: "成员", tokensUsed: 671200, tokensQuota: 3500000, percentage: 1.0, trend: "↑ 1.0%", amount: 67.12 },
            { rank: 13, name: "杨五", role: "成员", tokensUsed: 544600, tokensQuota: 3000000, percentage: 0.8, trend: "↓ 0.4%", amount: 54.46 },
            { rank: 14, name: "赵六", role: "成员", tokensUsed: 418200, tokensQuota: 2500000, percentage: 0.6, trend: "↑ 0.6%", amount: 41.82 },
            { rank: 15, name: "钱七", role: "成员", tokensUsed: 292500, tokensQuota: 2000000, percentage: 0.4, trend: "↑ 0.3%", amount: 29.25 },
        ],
        productRanking: [
            { rank: 1, name: "大模型", amount: 3381.00, percentage: 50.2, trend: "↑ 25.5%" },
            { rank: 2, name: "龙虾", amount: 1270.00, percentage: 18.9, trend: "↑ 14.2%" },
            { rank: 3, name: "APICloud", amount: 340.67, percentage: 5.1, trend: "↓ 1.0%" },
        ],
        resourcePackRanking: [
            { rank: 1, name: "新手体验包", amount: 1482.50, percentage: 21.8, trend: "↑ 14.2%" },
            { rank: 2, name: "基础开发包", amount: 1084.30, percentage: 15.9, trend: "↑ 10.5%" },
            { rank: 3, name: "企业级套餐", amount: 940.20, percentage: 13.8, trend: "↓ 0.8%" },
            { rank: 4, name: "大模型套餐", amount: 505.17, percentage: 7.4, trend: "↑ 6.8%" },
            { rank: 5, name: "图像理解包", amount: 223.50, percentage: 3.3, trend: "↑ 4.1%" },
        ],
    },
};

function EnterpriseAdminContent() {
    const searchParams = useSearchParams();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string>("overview");
    const [dialogOpen, setDialogOpen] = useState(false);
    
    // 企业切换相关
    const [enterpriseList, setEnterpriseList] = useState(defaultEnterpriseList);
    const [selectedEnterprise, setSelectedEnterprise] = useState(defaultEnterpriseList[0]);
    const [enterpriseDialogOpen, setEnterpriseDialogOpen] = useState(false);
    
    // 概览1搜索状态
    const [overview1Search, setOverview1Search] = useState("");
    const [overview1Page, setOverview1Page] = useState(1);
    const overview1PageSize = 5;
    
    // 配额管理搜索状态
    const [quotaSearchKeyword, setQuotaSearchKeyword] = useState("");
    
    // 角色管理状态
    const [roleSearchKeyword, setRoleSearchKeyword] = useState("");
    const [roleList, setRoleList] = useState<RoleItem[]>(defaultRoles);
    const [rolePage, setRolePage] = useState(1);
    const rolePageSize = 10;
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
    const [roleFormName, setRoleFormName] = useState("");
    const [roleFormRemark, setRoleFormRemark] = useState("");
    
    // 用户菜单
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [username, setUsername] = useState('未登录');
    const [userAccount, setUserAccount] = useState('');
    
    // 初始化时从localStorage读取用户信息（使用zhiqi登录态）
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('zhiqi_logged_in');
        if (!isLoggedIn) {
            // 未登录，跳转到登录页
            window.location.href = '/login';
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
                    // 默认选中第一个有权限的企业（非成员角色）
                    const firstAccessible = userEnterpriseList.find(e => e.role !== 'member') || userEnterpriseList[0];
                    setSelectedEnterprise(firstAccessible);
                }
            } catch (e) {
                setUsername('用户');
            }
        }
    }, []);
    
    // 统计日期范围
    const [statsDateRange, setStatsDateRange] = useState("today");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    
    // 配额编辑弹窗
    const [quotaEditOpen, setQuotaEditOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<{
        id: string;
        name: string;
        email: string;
        callsUsed: number;
        callsTotal: number;
        tokensUsed: number;
        tokensTotal: number;
        amountUsed: number;
        amountTotal: number;
    } | null>(null);
    const [tempCallsQuota, setTempCallsQuota] = useState("");
    const [tempTokensQuota, setTempTokensQuota] = useState("");
    const [tempAmountQuota, setTempAmountQuota] = useState("");
    
    // 添加成员弹窗
    const [addMemberDrawerOpen, setAddMemberDrawerOpen] = useState(false);
    const [selectedAddMember, setSelectedAddMember] = useState<{ id: string; name: string; email: string } | null>(null);
    const [memberSearchKeyword, setMemberSearchKeyword] = useState("");
    const [newMemberCallsQuota, setNewMemberCallsQuota] = useState("");
    const [newMemberTokensQuota, setNewMemberTokensQuota] = useState("");
    const [members, setMembers] = useState(mockMembers);
    
    // 成员多选状态
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
    const isAllSelected = selectedMemberIds.length === members.length && members.length > 0;
    const isPartialSelected = selectedMemberIds.length > 0 && selectedMemberIds.length < members.length;
    
    // 批量设置配额弹窗
    const [batchQuotaDialogOpen, setBatchQuotaDialogOpen] = useState(false);
    const [batchQuotaValue, setBatchQuotaValue] = useState("");

    // 消费TOP抽屉状态
    const [consumptionDrawerOpen, setConsumptionDrawerOpen] = useState(false);
    const [consumptionDrawerTab, setConsumptionDrawerTab] = useState<'member' | 'product' | 'resourcePack'>('member');
    
    // 配额规则状态
    const [quotaRules, setQuotaRules] = useState<QuotaRule[]>(initialQuotaRulesData);
    
    // 配额列表筛选-配额类型
    const [quotaTypeFilter, setQuotaTypeFilter] = useState<'all' | 'role' | 'member'>('all');
    const [quotaStatusFilter, setQuotaStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
    
    // 角色配额-选择角色
    const [selectedRoleForQuota, setSelectedRoleForQuota] = useState('');
    
    // 确认弹窗状态
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
        title: string;
        message: string;
        onConfirm: () => void;
    } | null>(null);

    // ===== 访问管理状态 =====
    const [accessEnabled, setAccessEnabled] = useState(false);
    const [accessTab, setAccessTab] = useState<'pending' | 'accessible' | 'blocked'>('pending');
    const [accessSearchKeyword, setAccessSearchKeyword] = useState('');
    const [accessRoleFilter, setAccessRoleFilter] = useState('全部');
    const [banMemberDialogOpen, setBanMemberDialogOpen] = useState(false);
    const [banTargetMember, setBanTargetMember] = useState<{name: string; account: string; role: string; applyTime: string; operator: string; operateTime: string} | null>(null);
    const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
    const [editRoleTargetMembers, setEditRoleTargetMembers] = useState<string[]>([]);
    const [editRoleNewRole, setEditRoleNewRole] = useState('');
    const [editRoleConfirmOpen, setEditRoleConfirmOpen] = useState(false);
    const [restoreMemberDialogOpen, setRestoreMemberDialogOpen] = useState(false);
    const [restoreTargetMember, setRestoreTargetMember] = useState<{name: string; account: string; role: string; accessTime: string; operator: string; operateTime: string} | null>(null);

    // 可访问成员数据
    const [accessibleMembers, setAccessibleMembers] = useState([
        { name: '张三', account: 'zhangsan', role: '产品经理', accessTime: '2026/05/20 10:30', operator: '未开启访问设置，自动通过', operateTime: '2026/05/20 10:30', status: '可访问' as const },
        { name: '李四', account: 'lisi', role: '开发工程师', accessTime: '2026/05/21 14:22', operator: '未开启访问设置，自动通过', operateTime: '2026/05/21 14:22', status: '可访问' as const },
        { name: '王五', account: 'wangwu', role: '测试工程师', accessTime: '2026/05/22 09:15', operator: '未开启访问设置，自动通过', operateTime: '2026/05/22 09:15', status: '可访问' as const },
        { name: '赵六', account: 'zhaoliu', role: '运维工程师', accessTime: '2026/05/23 16:45', operator: '未开启访问设置，自动通过', operateTime: '2026/05/23 16:45', status: '可访问' as const },
        { name: '孙七', account: 'sunqi', role: '产品经理', accessTime: '2026/06/01 08:00', operator: '未开启访问设置，自动通过', operateTime: '2026/06/01 08:00', status: '可访问' as const },
    ]);

    // 已禁止访问成员数据
    const [blockedMembers, setBlockedMembers] = useState([
        { name: '周八', account: 'zhouba', role: '开发工程师', accessTime: '2026/05/18 11:20', operator: 'zhangsan', operateTime: '2026/06/10 09:30', status: '已禁止' as const },
    ]);
    // 待审批成员数据
    const [pendingMembers, setPendingMembers] = useState([
        { name: '陈一', account: 'chenyi', role: '产品经理', applyTime: '2026/06/12 09:30', status: '待审批' as const },
        { name: '吴二', account: 'wuer', role: '开发工程师', applyTime: '2026/06/12 10:15', status: '待审批' as const },
        { name: '郑三', account: 'zhengsan', role: '测试工程师', applyTime: '2026/06/12 11:00', status: '待审批' as const },
    ]);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [approveTargetMember, setApproveTargetMember] = useState<{name: string; account: string; role: string; applyTime: string} | null>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectTargetMember, setRejectTargetMember] = useState<{name: string; account: string; role: string; applyTime: string} | null>(null);

    // 访问管理筛选后的待审批成员
    const filteredPendingMembers = useMemo(() => {
        return pendingMembers.filter(m => {
            const matchName = !accessSearchKeyword || m.name.includes(accessSearchKeyword);
            const matchRole = accessRoleFilter === '全部' || m.role === accessRoleFilter;
            return matchName && matchRole;
        });
    }, [pendingMembers, accessSearchKeyword, accessRoleFilter]);

    // 访问管理筛选后的可访问成员
    const filteredAccessibleMembers = useMemo(() => {
        return accessibleMembers.filter(m => {
            const matchName = !accessSearchKeyword || m.name.includes(accessSearchKeyword);
            const matchRole = accessRoleFilter === '全部' || m.role === accessRoleFilter;
            return matchName && matchRole;
        });
    }, [accessibleMembers, accessSearchKeyword, accessRoleFilter]);

    // 访问管理筛选后的已禁止成员
    const filteredBlockedMembers = useMemo(() => {
        return blockedMembers.filter(m => {
            const matchName = !accessSearchKeyword || m.name.includes(accessSearchKeyword);
            const matchRole = accessRoleFilter === '全部' || m.role === accessRoleFilter;
            return matchName && matchRole;
        });
    }, [blockedMembers, accessSearchKeyword, accessRoleFilter]);
    // ===== 访问管理状态结束 =====

    // 打开确认弹窗
    const openConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
        setConfirmDialogConfig({ title, message, onConfirm });
        setConfirmDialogOpen(true);
    };
    
    // 关闭确认弹窗
    const closeConfirmDialog = () => {
        setConfirmDialogOpen(false);
        setConfirmDialogConfig(null);
    };
    
    // 确认操作
    const handleConfirm = () => {
        if (confirmDialogConfig?.onConfirm) {
            confirmDialogConfig.onConfirm();
        }
        closeConfirmDialog();
    };
    
    // 设置配额状态为失效
    const setQuotaInactive = (ruleId: string) => {
        openConfirmDialog(
            '设置为失效',
            '确定要将该配额规则设置为失效吗？设置后，相关成员将无法继续使用该配额。',
            () => {
                setQuotaRules(prev => prev.map(rule => 
                    rule.id === ruleId ? { ...rule, status: 'inactive' as QuotaRuleStatus } : rule
                ));
            }
        );
    };
    
    // 设置配额状态为生效
    const setQuotaActive = (ruleId: string) => {
        openConfirmDialog(
            '设置为生效',
            '确定要将该配额规则设置为生效吗？设置后，相关成员将可以使用该配额。',
            () => {
                setQuotaRules(prev => prev.map(rule => 
                    rule.id === ruleId ? { ...rule, status: 'active' as QuotaRuleStatus } : rule
                ));
            }
        );
    };
    
    // 创建配额弹窗状态
    const [createQuotaDrawerOpen, setCreateQuotaDrawerOpen] = useState(false);
    const [editingQuotaId, setEditingQuotaId] = useState<string | null>(null); // 编辑中的配额ID
    const [quotaName, setQuotaName] = useState('');
    const [quotaNameError, setQuotaNameError] = useState('');
    const [memberSelectType, setMemberSelectType] = useState<'all' | 'member' | 'organization' | 'role'>('all');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
    const [expandedOrgNodes, setExpandedOrgNodes] = useState<string[]>(['dept-1']);
    const [quotaMemberSearchKeyword, setQuotaMemberSearchKeyword] = useState('');
    
    // 每个产品的配额
    const [lobsterQuota, setLobsterQuota] = useState('100');
    const [llmQuota, setLlmQuota] = useState('100');
    
    // 每个产品是否"不限制"
    const [lobsterUnlimited, setLobsterUnlimited] = useState(false);
    const [llmUnlimited, setLlmUnlimited] = useState(false);
    
    // 验证并格式化配额输入（只允许大于等于0的数字，小数点后两位）
    const handleQuotaInput = (value: string, setter: (val: string) => void) => {
        // 允许空值
        if (value === '') {
            setter('');
            return;
        }
        
        // 只允许数字和小数点
        const cleaned = value.replace(/[^\d.]/g, '');
        
        // 检查是否是有效的数字格式
        const regex = /^\d*\.?\d{0,2}$/;
        if (regex.test(cleaned)) {
            // 检查是否以多个0开头（但允许0和0.xx）
            if (cleaned.length > 1 && cleaned[0] === '0' && cleaned[1] !== '.') {
                return;
            }
            setter(cleaned);
        }
    };
    
    // 产品列表
    const productList = [
        { id: 'lobster', name: '龙虾' },
        { id: 'llm', name: 'AI计划' },
    ];
    
    // 过滤成员列表
    const filteredMembers = membersList.filter(member => 
        member.name.includes(quotaMemberSearchKeyword) || 
        member.account.includes(quotaMemberSearchKeyword) ||
        member.department.includes(quotaMemberSearchKeyword)
    );
    
    // 重置创建配额表单
    const resetCreateQuotaForm = () => {
        setEditingQuotaId(null);
        setQuotaName('');
        setQuotaNameError('');
        setMemberSelectType('all');
        setSelectedMembers([]);
        setSelectedOrgs([]);
        setQuotaMemberSearchKeyword('');
        setLobsterQuota('0');
        setLlmQuota('0');
        setLobsterUnlimited(false);
        setLlmUnlimited(false);
        setSelectedRoleForQuota('');
    };
    
    // 打开创建配额弹窗
    const openCreateQuotaDrawer = () => {
        resetCreateQuotaForm();
        setCreateQuotaDrawerOpen(true);
    };
    
    // 打开编辑配额弹窗
    const openEditQuotaDrawer = (rule: QuotaRule) => {
        resetCreateQuotaForm();
        setEditingQuotaId(rule.id);
        setQuotaName(rule.name);
        if (rule.quotaType === 'role') {
            setMemberSelectType('role');
            setSelectedRoleForQuota(rule.roleName || '');
        } else {
            setMemberSelectType('all');
        }
        // 填充配额数据
        if (rule.lobsterQuota.value === 'unlimited') {
            setLobsterUnlimited(true);
            setLobsterQuota('');
        } else {
            setLobsterUnlimited(false);
            setLobsterQuota(rule.lobsterQuota.value.toString());
        }
        if (rule.llmQuota.value === 'unlimited') {
            setLlmUnlimited(true);
            setLlmQuota('');
        } else {
            setLlmUnlimited(false);
            setLlmQuota(rule.llmQuota.value.toString());
        }
        setCreateQuotaDrawerOpen(true);
    };
    
    // 验证配额名称
    const validateQuotaName = (value: string) => {
        if (!value.trim()) {
            setQuotaNameError('请输入配额名称');
            return false;
        }
        if (value.length > 100) {
            setQuotaNameError('配额名称不能超过100个字符');
            return false;
        }
        setQuotaNameError('');
        return true;
    };
    
    // 切换成员选择
    const toggleMemberSelection = (memberId: string) => {
        setSelectedMembers(prev => 
            prev.includes(memberId) 
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };
    
    // 切换组织节点选择
    const toggleOrgSelection = (orgId: string) => {
        setSelectedOrgs(prev => 
            prev.includes(orgId) 
                ? prev.filter(id => id !== orgId)
                : [...prev, orgId]
        );
    };
    
    // 切换组织节点展开
    const toggleOrgNodeExpand = (nodeId: string) => {
        setExpandedOrgNodes(prev => 
            prev.includes(nodeId) 
                ? prev.filter(id => id !== nodeId)
                : [...prev, nodeId]
        );
    };
    
    // 全选/取消全选成员
    const toggleSelectAllMembers = () => {
        if (selectedMembers.length === filteredMembers.length) {
            setSelectedMembers([]);
        } else {
            setSelectedMembers(filteredMembers.map(m => m.id));
        }
    };
    
    // 提交创建配额
    const submitCreateQuota = () => {
        const isNameValid = validateQuotaName(quotaName);
        
        if (!isNameValid) return;
        
        // 选角色验证
        if (memberSelectType === 'role' && !editingQuotaId) {
            if (!selectedRoleForQuota) {
                alert('请选择角色');
                return;
            }
        }
        
        // 选成员验证
        if (memberSelectType === 'member' && !editingQuotaId) {
            if (selectedMembers.length === 0) {
                alert('请选择至少一个成员');
                return;
            }
        }
        
        // 选组织验证
        if (memberSelectType === 'organization' && !editingQuotaId) {
            if (selectedOrgs.length === 0) {
                alert('请选择至少一个组织');
                return;
            }
        }
        
        // 至少设置一个产品的配额（考虑"不限制"的情况）
        if (!lobsterQuota && !llmQuota && !lobsterUnlimited && !llmUnlimited) {
            alert('请至少设置一个产品的配额');
            return;
        }
        
        // 构建配额数据
        const quotaData = {
            name: quotaName,
            memberSelectType,
            selectedMembers: memberSelectType === 'member' ? selectedMembers : [],
            selectedOrgs: memberSelectType === 'organization' ? selectedOrgs : [],
            quotas: {
                lobster: lobsterUnlimited ? 'unlimited' as const : (lobsterQuota ? parseFloat(lobsterQuota) : 0),
                llm: llmUnlimited ? 'unlimited' as const : (llmQuota ? parseFloat(llmQuota) : 0),
            }
        };
        
        if (editingQuotaId) {
            // 编辑模式
            console.log('编辑配额:', { id: editingQuotaId, ...quotaData });
            // 更新配额列表
            setQuotaRules(prev => prev.map(rule => {
                if (rule.id === editingQuotaId) {
                    return {
                        ...rule,
                        name: quotaName,
                        lobsterQuota: { value: quotaData.quotas.lobster },
                        llmQuota: { value: quotaData.quotas.llm },
                        updateTime: new Date().toLocaleString().replace(/\//g, '-')
                    };
                }
                return rule;
            }));
            alert('配额规则编辑成功');
        } else {
            // 创建模式
            console.log('创建配额:', quotaData);
            
            if (memberSelectType === 'role') {
                // 选角色 - 创建角色配额
                const newRule: QuotaRule = {
                    id: Date.now().toString(),
                    name: quotaName,
                    quotaType: 'role',
                    memberCount: 0,
                    quotaPerMember: 0,
                    roleName: selectedRoleForQuota,
                    scope: selectedRoleForQuota === '全部角色' ? '全部角色' : '指定角色',
                    scopeTarget: selectedRoleForQuota,
                    lobsterQuota: { value: quotaData.quotas.lobster },
                    llmQuota: { value: quotaData.quotas.llm },
                    createTime: new Date().toLocaleString().replace(/\//g, '-'),
                    updateTime: new Date().toLocaleString().replace(/\//g, '-'),
                    status: 'pending'
                };
                setQuotaRules(prev => [...prev, newRule]);
                alert('角色配额创建成功，状态为未生效');
            } else {
                // 全部成员/选组织/选成员 - 创建成员配额
                let memberCount = 0;
                if (memberSelectType === 'all') {
                    memberCount = members.length;
                } else if (memberSelectType === 'member') {
                    memberCount = selectedMembers.length;
                } else {
                    memberCount = selectedOrgs.length * 10;
                }
                
                // 添加新的配额规则
                const newRule: QuotaRule = {
                    id: Date.now().toString(),
                    name: quotaName,
                    quotaType: 'member',
                    memberCount,
                    quotaPerMember: 0,
                    lobsterQuota: { value: quotaData.quotas.lobster },
                    llmQuota: { value: quotaData.quotas.llm },
                    createTime: new Date().toLocaleString().replace(/\//g, '-'),
                    updateTime: new Date().toLocaleString().replace(/\//g, '-'),
                    status: 'pending'
                };
                setQuotaRules(prev => [...prev, newRule]);
                alert('成员配额创建成功，状态为未生效');
            }
        }
        
        setCreateQuotaDrawerOpen(false);
        resetCreateQuotaForm();
    };
    
    // 渲染组织架构树
    const renderOrgTree = (nodes: OrgNode[], level: number): React.ReactNode => {
        return nodes.map(node => {
            const hasChildren = node.children && node.children.length > 0;
            const isExpanded = expandedOrgNodes.includes(node.id);
            const isSelected = selectedOrgs.includes(node.id);
            
            return (
                <div key={node.id}>
                    <div 
                        className={`flex items-center gap-2 py-2 px-2 rounded cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                        style={{ paddingLeft: `${level * 20 + 8}px` }}
                    >
                        {hasChildren && (
                            <button
                                onClick={() => toggleOrgNodeExpand(node.id)}
                                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
                            >
                                <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>
                        )}
                        {!hasChildren && <span className="w-5" />}
                        
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleOrgSelection(node.id)}
                            className="w-4 h-4 text-[#006bff] border-gray-300 rounded focus:ring-[#006bff]"
                        />
                        
                        {node.type === 'company' && <Building className="w-4 h-4 text-blue-500" />}
                        {node.type === 'department' && <Folder className="w-4 h-4 text-orange-500" />}
                        {node.type === 'team' && <Users className="w-4 h-4 text-green-500" />}
                        
                        <span className="text-sm text-gray-700">{node.name}</span>
                        {node.memberCount && (
                            <span className="text-xs text-gray-400">({node.memberCount}人)</span>
                        )}
                    </div>
                    
                    {hasChildren && isExpanded && (
                        <div>
                            {renderOrgTree(node.children!, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    // 从URL参数获取初始tab
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && ['overview', 'overview1', 'members', 'models', 'lobster'].includes(tabParam)) {
            setActiveMenu(tabParam);
        }
    }, [searchParams]);

    // 概览1分页数据
    const overview1FilteredData = useMemo(() => {
        return memberQuotaData.filter(member => 
            member.name.toLowerCase().includes(overview1Search.toLowerCase()) ||
            member.id.toLowerCase().includes(overview1Search.toLowerCase())
        );
    }, [overview1Search]);
    
    const overview1TotalPages = Math.ceil(overview1FilteredData.length / overview1PageSize);
    const overview1PaginatedData = useMemo(() => {
        const start = (overview1Page - 1) * overview1PageSize;
        return overview1FilteredData.slice(start, start + overview1PageSize);
    }, [overview1FilteredData, overview1Page, overview1PageSize]);
    
    // 切换tab时重置分页
    useEffect(() => {
        setOverview1Page(1);
    }, [overview1Search]);

    // 获取当前统计数据
    const currentStats = useMemo(() => {
        if (statsDateRange === "custom" && customStartDate && customEndDate) {
            // 自定义日期范围时返回模拟数据
            return statsByDateRange["7days"];
        }
        return statsByDateRange[statsDateRange] || statsByDateRange.today;
    }, [statsDateRange, customStartDate, customEndDate]);

    // 过滤可添加成员
    const filteredAvailableMembers = useMemo(() => {
        if (!memberSearchKeyword) return mockAvailableMembers;
        const keyword = memberSearchKeyword.toLowerCase();
        return mockAvailableMembers.filter(
            member =>
                member.name.toLowerCase().includes(keyword) ||
                member.email.toLowerCase().includes(keyword) ||
                member.id.toLowerCase().includes(keyword)
        );
    }, [memberSearchKeyword]);

    // 确认添加成员
    const handleConfirmAddMember = () => {
        if (selectedAddMember) {
            const newMember = {
                id: selectedAddMember.id,
                name: selectedAddMember.name,
                email: selectedAddMember.email,
                role: 'member' as const,
                callsUsed: 0,
                callsTotal: parseInt(newMemberCallsQuota) || 0,
                tokensUsed: 0,
                tokensTotal: parseInt(newMemberTokensQuota) || 0,
                amountUsed: 0,
                amountTotal: parseFloat(newMemberTokensQuota) || 0,
            };
            setMembers([...members, newMember]);
            setAddMemberDrawerOpen(false);
            setSelectedAddMember(null);
            setMemberSearchKeyword("");
            setNewMemberCallsQuota("");
            setNewMemberTokensQuota("");
        }
    };

    // 退出登录
    const handleLogout = () => {
        setUserMenuOpen(false);
        localStorage.removeItem('zhiqi_logged_in');
        localStorage.removeItem('zhiqi_user_info');
        window.location.href = '/';
    };

    // 切换企业
    const handleSelectEnterprise = (enterprise: typeof selectedEnterprise) => {
        if (enterprise.role === 'member') {
            // 成员角色不能访问管理后台，显示提示，不切换企业
            setEnterpriseDialogOpen(false);
            setMemberRoleAlertOpen(true);
        } else {
            setSelectedEnterprise(enterprise);
            setEnterpriseDialogOpen(false);
        }
    };

    // 成员角色提示弹框
    const [memberRoleAlertOpen, setMemberRoleAlertOpen] = useState(false);

    // 获取当前用户角色
    const currentUserRole = selectedEnterprise.role;

    // ========== 角色管理相关函数 ==========
    // 角色成员数量：从访问管理可访问成员中动态统计
    const roleMemberCountMap = useMemo(() => {
        const countMap: Record<string, number> = {};
        accessibleMembers.forEach(m => {
            countMap[m.role] = (countMap[m.role] || 0) + 1;
        });
        return countMap;
    }, [accessibleMembers]);

    const filteredRoles = useMemo(() => {
        return roleList.filter(role =>
            role.name.toLowerCase().includes(roleSearchKeyword.toLowerCase())
        );
    }, [roleList, roleSearchKeyword]);

    const roleTotalPages = Math.max(1, Math.ceil(filteredRoles.length / rolePageSize));
    const roleCurrentData = filteredRoles.slice((rolePage - 1) * rolePageSize, rolePage * rolePageSize);

    const openCreateRoleDialog = () => {
        setEditingRole(null);
        setRoleFormName("");
        setRoleFormRemark("");
        setRoleDialogOpen(true);
    };

    const openEditRoleDialog = (role: RoleItem) => {
        setEditingRole(role);
        setRoleFormName(role.name);
        setRoleFormRemark(role.remark);
        setRoleDialogOpen(true);
    };

    const saveRole = () => {
        if (!roleFormName.trim()) {
            alert('请输入角色名称');
            return;
        }
        if (roleFormName.length > 50) {
            alert('角色名称不能超过50个字符');
            return;
        }
        if (roleFormRemark.length > 100) {
            alert('备注说明不能超过100个字符');
            return;
        }
        if (editingRole) {
            setRoleList(prev => prev.map(r =>
                r.id === editingRole.id ? { ...r, name: roleFormName.trim(), remark: roleFormRemark.trim() } : r
            ));
        } else {
            const newRole: RoleItem = {
                id: `role_${Date.now()}`,
                name: roleFormName.trim(),
                remark: roleFormRemark.trim(),
                creatorName: username,
                creatorId: userAccount,
                createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '.'),
                memberCount: 0,
            };
            setRoleList(prev => [...prev, newRole]);
        }
        setRoleDialogOpen(false);
        setEditingRole(null);
        setRoleFormName("");
        setRoleFormRemark("");
    };

    const deleteRole = (roleId: string) => {
        openConfirmDialog(
            '删除角色',
            '确定要删除该角色吗？删除后不可恢复。',
            () => {
                setRoleList(prev => prev.filter(r => r.id !== roleId));
            }
        );
    };

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
                    {/* 费用按钮 - 只有主账号和企业管理员可见 */}
                    {(currentUserRole === 'owner' || currentUserRole === 'admin') && (
                        <a
                            href="/console/cost"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">费用
                        </a>
                    )}
                    <Link
                        href="#"
                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">工单
                    </Link>
                    <Link
                        href="#"
                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 mr-2">帮助
                    </Link>
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
            
            {/* 企业切换弹窗 */}
            {enterpriseDialogOpen && (
                <div 
                    className="fixed inset-0 z-[2000] flex items-center justify-center"
                    onClick={() => setEnterpriseDialogOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div 
                        className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-blue-500" />
                                    <span className="text-lg font-semibold text-gray-900">选择企业</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">请选择要切换的企业账号</p>
                            </div>
                            <button
                                onClick={() => setEnterpriseDialogOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            {enterpriseList.map((enterprise) => (
                                <button
                                    key={enterprise.id}
                                    onClick={() => handleSelectEnterprise(enterprise)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                                        selectedEnterprise.id === enterprise.id 
                                            ? "border-blue-500 bg-blue-50" 
                                            : "border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    <span className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm ${
                                        selectedEnterprise.id === enterprise.id ? "bg-blue-600" : "bg-gray-400"
                                    }`}>
                                        {enterprise.icon}
                                    </span>
                                    <div className="flex-1">
                                        <div className={`font-medium ${
                                            selectedEnterprise.id === enterprise.id ? "text-blue-600" : "text-gray-700"
                                        }`}>
                                            {enterprise.name}
                                        </div>
                                    </div>
                                    {selectedEnterprise.id === enterprise.id && (
                                        <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 成员角色提示弹框 */}
            {memberRoleAlertOpen && (
                <div 
                    className="fixed inset-0 z-[2000] flex items-center justify-center"
                    onClick={() => setMemberRoleAlertOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <div 
                        className="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-500" />
                                <span className="text-lg font-semibold text-gray-900">提示</span>
                            </div>
                            <button
                                onClick={() => setMemberRoleAlertOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 py-6">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                您在当前企业下是成员角色，不能访问管理后台。请确认所选企业是否正确。
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setMemberRoleAlertOpen(false)}
                                className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                我知道了
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 左侧导航栏 */}
            <aside
                className={`fixed left-0 top-[50px] h-[calc(100vh-50px)] bg-white z-[999] transition-all duration-300 border-r border-gray-200 ${sidebarCollapsed ? "w-[60px]" : "w-[200px]"}`}
            >
                {/* 标题 */}
                <div className="h-12 flex items-center px-4 border-b border-gray-100">
                    {!sidebarCollapsed && (
                        <span className="text-base font-semibold text-gray-900">管理后台</span>
                    )}
                </div>
                {/* 菜单列表 */}
                <nav className="p-2 pt-3 flex-1">
                    {adminMenuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveMenu(item.id)}
                            className={`flex items-center px-3 py-2.5 rounded-md mb-1 transition-colors w-full ${activeMenu === item.id ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                        >
                            <item.icon className={`w-5 h-5 ${sidebarCollapsed ? "mx-auto" : "mr-3"}`} />
                            {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
                        </button>
                    ))}
                </nav>
                
                {/* 折叠按钮 */}
                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>
            </aside>

            {/* 主内容区域 */}
            <main className={`pt-[50px] transition-all duration-300 ${sidebarCollapsed ? "ml-[60px]" : "ml-[200px]"}`}>
                <div className="p-6">
                    {/* 概览 - 成员配额使用情况 */}
                    {activeMenu === "overview" && (
                        <>
                            {/* 页面标题 */}
                            <div className="text-xl font-semibold text-gray-900 mb-6">概览</div>
                            
                            {/* 成员配额使用情况表格 */}
                            <div className="bg-white rounded-lg border border-gray-200">
                                {/* 搜索栏 */}
                                <div className="p-4 border-b border-gray-100">
                                    <div className="relative max-w-sm">
                                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder="搜索成员名称或账号ID"
                                            value={overview1Search}
                                            onChange={(e) => setOverview1Search(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                
                                {/* 表格 */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-orange-50">
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">成员名称</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">成员账号ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">AI计划配额(已用/总量)</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">龙虾配额(已用/总量)</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {overview1PaginatedData.map((member, index) => {
                                                const aiUsedPercent = member.aiQuota.total > 0 ? (member.aiQuota.used / member.aiQuota.total) * 100 : 0;
                                                const lobsterUsedPercent = member.lobsterQuota.total > 0 ? (member.lobsterQuota.used / member.lobsterQuota.total) * 100 : 0;
                                                
                                                return (
                                                    <tr key={member.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-700">{member.id}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div 
                                                                        className={`h-full rounded-full ${aiUsedPercent > 90 ? 'bg-red-500' : aiUsedPercent > 70 ? 'bg-orange-500' : 'bg-blue-500'}`}
                                                                        style={{ width: `${Math.min(aiUsedPercent, 100)}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-sm text-gray-700 whitespace-nowrap">
                                                                    {member.aiQuota.used.toLocaleString()} / {member.aiQuota.total === Infinity ? '∞' : member.aiQuota.total.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div 
                                                                        className={`h-full rounded-full ${lobsterUsedPercent > 90 ? 'bg-red-500' : lobsterUsedPercent > 70 ? 'bg-orange-500' : 'bg-green-500'}`}
                                                                        style={{ width: `${Math.min(lobsterUsedPercent, 100)}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-sm text-gray-700 whitespace-nowrap">
                                                                    {member.lobsterQuota.used.toLocaleString()} / {member.lobsterQuota.total === Infinity ? '∞' : member.lobsterQuota.total.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <button
                                                                onClick={() => setActiveMenu("members")}
                                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                            >
                                                                管理配额
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* 分页 */}
                                {overview1TotalPages > 1 && (
                                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            共 {overview1FilteredData.length} 条，第 {overview1Page} / {overview1TotalPages} 页
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setOverview1Page(1)}
                                                disabled={overview1Page === 1}
                                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                首页
                                            </button>
                                            <button
                                                onClick={() => setOverview1Page(prev => Math.max(1, prev - 1))}
                                                disabled={overview1Page === 1}
                                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                上一页
                                            </button>
                                            <button
                                                onClick={() => setOverview1Page(prev => Math.min(overview1TotalPages, prev + 1))}
                                                disabled={overview1Page === overview1TotalPages}
                                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                下一页
                                            </button>
                                            <button
                                                onClick={() => setOverview1Page(overview1TotalPages)}
                                                disabled={overview1Page === overview1TotalPages}
                                                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                末页
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* 配额管理页面 */}
                    {activeMenu === "members" && (
                        <>
                            {/* 页面标题 */}
                            <div className="text-xl font-semibold text-gray-900 mb-6">配额管理</div>
                            <div className="bg-white rounded-lg border border-gray-200">
                                {/* 顶部操作栏 */}
                                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                placeholder="搜索配额规则名称"
                                                value={quotaSearchKeyword}
                                                onChange={(e) => setQuotaSearchKeyword(e.target.value)}
                                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <button
                                            onClick={() => {}}
                                            className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <Search className="w-4 h-4" />
                                        </button>
                                        <select
                                            value={quotaTypeFilter}
                                            onChange={(e) => setQuotaTypeFilter(e.target.value as 'all' | 'role' | 'member')}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="all">全部类型</option>
                                            <option value="role">角色配额</option>
                                            <option value="member">成员配额</option>
                                        </select>
                                        <select
                                            value={quotaStatusFilter}
                                            onChange={(e) => setQuotaStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'pending')}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="all">全部状态</option>
                                            <option value="active">生效中</option>
                                            <option value="pending">未生效</option>
                                            <option value="inactive">已失效</option>
                                        </select>
                                    </div>
                                    <button 
                                        onClick={openCreateQuotaDrawer}
                                        className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        创建配额
                                    </button>
                                </div>

                                {/* 配额列表 */}
                                <div className="overflow-hidden mt-4">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50">
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">配额规则名称</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">配额类型</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">适用范围</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">适用对象</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">龙虾配额</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">AI计划配额</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">创建时间</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">最近一次修改时间</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">配额状态</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {quotaRules
                                                .filter(rule => quotaTypeFilter === 'all' || rule.quotaType === quotaTypeFilter)
                                                .filter(rule => quotaStatusFilter === 'all' || rule.status === quotaStatusFilter)
                                                .filter(rule => rule.name.toLowerCase().includes(quotaSearchKeyword.toLowerCase()))
                                                .map((rule) => (
                                                <tr key={rule.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="py-4 px-4">
                                                        <span className="text-sm text-gray-900">{rule.name}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-2 py-0.5 text-xs rounded ${
                                                            rule.quotaType === 'role' 
                                                                ? 'bg-purple-100 text-purple-600' 
                                                                : 'bg-green-100 text-green-600'
                                                        }`}>
                                                            {rule.quotaType === 'role' ? '角色配额' : '成员配额'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`text-sm ${
                                                            rule.quotaType === 'role' ? 'text-purple-600 font-medium' : 'text-gray-900'
                                                        }`}>
                                                            {rule.quotaType === 'role' ? (rule.roleName || rule.scope || '-') : (rule.scope === '全部成员' ? '全部成员' : rule.scope || '指定成员')}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`text-sm ${
                                                            rule.quotaType === 'role' ? 'text-purple-600 font-medium' : 'text-gray-900'
                                                        }`}>
                                                            {rule.quotaType === 'role' 
                                                                ? (rule.roleName || rule.scopeTarget || '-') 
                                                                : (rule.scope === '全部成员' ? '全部成员' : rule.scopeTarget || '-')}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="text-sm text-gray-900">
                                                            {rule.lobsterQuota.value === 'unlimited' 
                                                                ? <span className="text-blue-600">不限制</span> 
                                                                : <>¥{Number(rule.lobsterQuota.value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span className="text-gray-600 text-xs ml-0.5">元/月</span></>}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="text-sm text-gray-900">
                                                            {rule.llmQuota.value === 'unlimited' 
                                                                ? <span className="text-blue-600">不限制</span> 
                                                                : <>¥{Number(rule.llmQuota.value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span className="text-gray-600 text-xs ml-0.5">元/月</span></>}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="text-sm text-gray-500 whitespace-nowrap">{rule.createTime}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="text-sm text-gray-500 whitespace-nowrap">{rule.updateTime}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`text-sm font-medium ${
                                                            rule.status === 'active' ? 'text-green-600' : 
                                                            rule.status === 'pending' ? 'text-orange-500' : 'text-gray-400'
                                                        }`}>
                                                            {rule.status === 'active' ? '生效中' : 
                                                             rule.status === 'pending' ? '未生效' : '已失效'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => openEditQuotaDrawer(rule)}
                                                                className="text-sm text-[#006bff] hover:text-blue-600"
                                                            >
                                                                编辑
                                                            </button>
                                                            {rule.status === 'active' && !rule.isDefault && (
                                                                <button 
                                                                    onClick={() => setQuotaInactive(rule.id)}
                                                                    className="text-sm text-red-500 hover:text-red-600"
                                                                >
                                                                    设置为失效
                                                                </button>
                                                            )}
                                                            {(rule.status === 'pending' || rule.status === 'inactive') && !rule.isDefault && (
                                                                <button 
                                                                    onClick={() => setQuotaActive(rule.id)}
                                                                    className="text-sm text-[#006bff] hover:text-blue-600"
                                                                >
                                                                    设置为生效
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* 访问管理页面 */}
                    {activeMenu === "access" && (
                        <>
                            <div className="text-xl font-semibold text-gray-900 mb-6">访问管理</div>
                            
                            {/* 权限开关 */}
                            <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setAccessEnabled(!accessEnabled)}
                                        className={`relative w-11 h-6 rounded-full transition-colors ${accessEnabled ? 'bg-[#006bff]' : 'bg-gray-300'}`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${accessEnabled ? 'translate-x-5' : ''}`} />
                                    </button>
                                    <span className="text-sm text-gray-700">访问权限设置，开启后，成员访问智企需申请访问权限，企业管理员审批。</span>
                                </div>
                            </div>

                            {/* 搜索与筛选 */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="成员名称搜索"
                                            value={accessSearchKeyword}
                                            onChange={(e) => setAccessSearchKeyword(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={accessRoleFilter}
                                            onChange={(e) => setAccessRoleFilter(e.target.value)}
                                            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                                        >
                                            <option value="全部">全部角色</option>
                                            {roleList.map(role => (
                                                <option key={role.id} value={role.name}>{role.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Tab 切换 */}
                            <div className="flex border-b border-gray-200 mb-0">
                                {accessEnabled && (
                                    <button
                                        onClick={() => setAccessTab('pending')}
                                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${accessTab === 'pending' ? 'text-[#006bff] border-[#006bff]' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                                    >
                                        待审批({pendingMembers.length})
                                    </button>
                                )}
                                <button
                                    onClick={() => setAccessTab('accessible')}
                                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${accessTab === 'accessible' ? 'text-[#006bff] border-[#006bff]' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                                >
                                    可访问成员({accessibleMembers.length})
                                </button>
                                <button
                                    onClick={() => setAccessTab('blocked')}
                                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${accessTab === 'blocked' ? 'text-[#006bff] border-[#006bff]' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                                >
                                    已禁止访问成员({blockedMembers.length})
                                </button>
                            </div>

                            {/* 成员表格 */}
                            <div className="bg-white border border-gray-200 border-t-0 rounded-b-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">成员名称</th>
                                                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">成员账号</th>
                                                <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">成员角色</th>
                                                {accessTab === 'pending' ? (
                                                    <>
                                                        <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">申请访问时间</th>
                                                        <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作</th>
                                                    </>
                                                ) : (
                                                    <>
                                                        <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">申请访问时间</th>
                                                        <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作人账号ID</th>
                                                        <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作时间</th>
                                                        <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">当前状态</th>
                                                        <th className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">操作</th>
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {accessTab === 'pending' ? (
                                                pendingMembers.length > 0 ? pendingMembers.map((member) => (
                                                    <tr key={member.account} className="border-t border-gray-100 hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{member.name}</td>
                                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.account}</td>
                                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.role}</td>
                                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.applyTime}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex items-center gap-3">
                                                                <button
                                                                    onClick={() => {
                                                                        setApproveTargetMember({ name: member.name, account: member.account, role: member.role, applyTime: member.applyTime });
                                                                        setApproveDialogOpen(true);
                                                                    }}
                                                                    className="text-[#006bff] hover:text-blue-600 text-sm font-medium"
                                                                >
                                                                    允许
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setRejectTargetMember({ name: member.name, account: member.account, role: member.role, applyTime: member.applyTime });
                                                                        setRejectDialogOpen(true);
                                                                    }}
                                                                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                                                                >
                                                                    拒绝
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400">暂无待审批成员</td>
                                                    </tr>
                                                )
                                            ) : accessTab === 'accessible' ? (
                                                filteredAccessibleMembers.length > 0 ? filteredAccessibleMembers.map((member) => (
                                                    <tr key={member.account} className="border-t border-gray-100 hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{member.name}</td>
                                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.account}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-gray-900">{member.role}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditRoleTargetMembers([member.account]);
                                                                        setEditRoleNewRole('');
                                                                        setEditRoleDialogOpen(true);
                                                                    }}
                                                                    className="text-[#006bff] hover:text-blue-600"
                                                                >
                                                                    <Edit3 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.accessTime}</td>
                                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.operator}</td>
                                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.operateTime}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className="text-green-600 font-medium">可访问</span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <button
                                                                onClick={() => {
                                                                    setBanTargetMember({ name: member.name, account: member.account, role: member.role, applyTime: member.accessTime, operator: member.operator, operateTime: member.operateTime });
                                                                    setBanMemberDialogOpen(true);
                                                                }}
                                                                className="text-red-500 hover:text-red-600 text-sm"
                                                            >
                                                                禁止访问
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={8} className="px-4 py-8 text-center text-gray-400">暂无数据</td>
                                                    </tr>
                                                )
                                            ) : (
                                                filteredBlockedMembers.length > 0 ? filteredBlockedMembers.map((member) => (
                                                    <tr key={member.account} className="border-t border-gray-100 hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{member.name}</td>
                                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.account}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-gray-900">{member.role}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditRoleTargetMembers([member.account]);
                                                                        setEditRoleNewRole('');
                                                                        setEditRoleDialogOpen(true);
                                                                    }}
                                                                    className="text-[#006bff] hover:text-blue-600"
                                                                >
                                                                    <Edit3 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.accessTime}</td>
                                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.operator}</td>
                                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.operateTime}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className="text-red-500 font-medium">已禁止</span>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <button
                                                                onClick={() => {
                                                                    setRestoreTargetMember({ name: member.name, account: member.account, role: member.role, accessTime: member.accessTime, operator: member.operator, operateTime: member.operateTime });
                                                                    setRestoreMemberDialogOpen(true);
                                                                }}
                                                                className="text-[#006bff] hover:text-blue-600 text-sm"
                                                            >
                                                                恢复访问
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={8} className="px-4 py-8 text-center text-gray-400">暂无数据</td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* 角色管理页面 */}
                    {activeMenu === "roles" && (
                        <>
                            <div className="text-xl font-semibold text-gray-900 mb-6">角色管理</div>
                            <div className="bg-white rounded-lg border border-gray-200">
                                {/* 顶部操作栏 */}
                                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                placeholder="角色名称搜索"
                                                value={roleSearchKeyword}
                                                onChange={(e) => { setRoleSearchKeyword(e.target.value); setRolePage(1); }}
                                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <button
                                            onClick={() => { setRoleSearchKeyword(""); setRolePage(1); }}
                                            className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <Search className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={openCreateRoleDialog}
                                        className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        新建角色
                                    </button>
                                </div>

                                {/* 角色列表表格 */}
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">角色名称</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">备注</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">创建人姓名</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">创建人ID</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">创建时间</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">成员数量</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roleCurrentData.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-center py-12 text-gray-400">
                                                    暂无角色数据
                                                </td>
                                            </tr>
                                        ) : (
                                            roleCurrentData.map(role => (
                                                <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm text-gray-900">{role.name}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{role.remark || '-'}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-900">{role.creatorName}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{role.creatorId}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">{role.createdAt}</td>
                                                    <td className="py-3 px-4 text-sm text-[#006bff] font-medium">
                                                        <button
                                                            onClick={() => {
                                                                setActiveMenu("access");
                                                                setAccessTab('accessible');
                                                                setAccessRoleFilter(role.name);
                                                            }}
                                                            className="hover:underline cursor-pointer"
                                                        >
                                                            {roleMemberCountMap[role.name] || 0}
                                                        </button>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">
                                                        <div className="flex items-center gap-3">
                                                            <button onClick={() => openEditRoleDialog(role)} className="text-[#006bff] hover:text-blue-600">编辑</button>
                                                            <button onClick={() => deleteRole(role.id)} className="text-[#006bff] hover:text-blue-600">删除</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>

                                {/* 分页 */}
                                <div className="p-4 flex items-center justify-between border-t border-gray-100">
                                    <span className="text-sm text-gray-500">共{filteredRoles.length}条, 第{rolePage}/{roleTotalPages}页</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setRolePage(1)}
                                            disabled={rolePage === 1}
                                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >首页</button>
                                        <button
                                            onClick={() => setRolePage(p => Math.max(1, p - 1))}
                                            disabled={rolePage === 1}
                                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >上一页</button>
                                        <button
                                            onClick={() => setRolePage(p => Math.min(roleTotalPages, p + 1))}
                                            disabled={rolePage === roleTotalPages}
                                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >下一页</button>
                                        <button
                                            onClick={() => setRolePage(roleTotalPages)}
                                            disabled={rolePage === roleTotalPages}
                                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >末页</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* 确认弹窗 */}
            {confirmDialogOpen && confirmDialogConfig && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={closeConfirmDialog} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{confirmDialogConfig.title}</h3>
                        <p className="text-sm text-gray-600 mb-6">{confirmDialogConfig.message}</p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={closeConfirmDialog}
                                className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 text-sm text-white bg-[#006bff] rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                确认
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 创建/编辑角色弹窗 */}
            {roleDialogOpen && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setRoleDialogOpen(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">{editingRole ? '编辑角色' : '创建角色'}</h3>
                            <button onClick={() => setRoleDialogOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-5">
                            <div className="flex items-start gap-3">
                                <label className="text-sm text-gray-700 pt-2 whitespace-nowrap min-w-[80px] text-right">
                                    <span className="text-red-500">*</span>角色名称：
                                </label>
                                <input
                                    type="text"
                                    placeholder="输入角色名称，中英文、数字、()，50个字符以内"
                                    value={roleFormName}
                                    onChange={(e) => setRoleFormName(e.target.value)}
                                    maxLength={50}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-start gap-3">
                                <label className="text-sm text-gray-700 pt-2 whitespace-nowrap min-w-[80px] text-right">
                                    <span className="text-red-500">*</span>备注说明：
                                </label>
                                <textarea
                                    placeholder="角色说明，100个字符以内"
                                    value={roleFormRemark}
                                    onChange={(e) => setRoleFormRemark(e.target.value)}
                                    maxLength={100}
                                    rows={3}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
                            <button
                                onClick={() => setRoleDialogOpen(false)}
                                className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={saveRole}
                                className="px-4 py-2 text-sm text-white bg-[#006bff] rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 创建配额弹窗 */}
            {createQuotaDrawerOpen && (
                <div className="fixed inset-0 z-[2000]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setCreateQuotaDrawerOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl flex flex-col">
                        {/* 头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingQuotaId ? '编辑配额' : '创建配额'}
                            </h3>
                            <button 
                                onClick={() => setCreateQuotaDrawerOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        
                        {/* 内容区 */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* 配额名称 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    配额名称 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={quotaName}
                                    onChange={(e) => {
                                        setQuotaName(e.target.value);
                                        validateQuotaName(e.target.value);
                                    }}
                                    placeholder="请输入配额名称，100个字符以内"
                                    maxLength={100}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${
                                        quotaNameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                />
                                {quotaNameError && (
                                    <p className="mt-1 text-sm text-red-500">{quotaNameError}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-400 text-right">{quotaName.length}/100</p>
                            </div>

                            {/* 选择成员方式 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    选择成员 <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4 mb-3">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="memberSelectType"
                                            checked={memberSelectType === 'all'}
                                            onChange={() => {
                                                setMemberSelectType('all');
                                                setSelectedMembers([]);
                                                setSelectedOrgs([]);
                                                setSelectedRoleForQuota('');
                                            }}
                                            className="w-4 h-4 text-[#006bff] border-gray-300 focus:ring-[#006bff]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">全部成员</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="memberSelectType"
                                            checked={memberSelectType === 'organization'}
                                            onChange={() => {
                                                setMemberSelectType('organization');
                                                setSelectedMembers([]);
                                                setSelectedRoleForQuota('');
                                            }}
                                            className="w-4 h-4 text-[#006bff] border-gray-300 focus:ring-[#006bff]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">选组织</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="memberSelectType"
                                            checked={memberSelectType === 'member'}
                                            onChange={() => {
                                                setMemberSelectType('member');
                                                setSelectedOrgs([]);
                                                setSelectedRoleForQuota('');
                                            }}
                                            className="w-4 h-4 text-[#006bff] border-gray-300 focus:ring-[#006bff]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">选成员</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="memberSelectType"
                                            checked={memberSelectType === 'role'}
                                            onChange={() => {
                                                setMemberSelectType('role');
                                                setSelectedMembers([]);
                                                setSelectedOrgs([]);
                                            }}
                                            className="w-4 h-4 text-[#006bff] border-gray-300 focus:ring-[#006bff]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">选角色</span>
                                    </label>
                                </div>
                                
                                {/* 全部成员 */}
                                {memberSelectType === 'all' && (
                                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Info className="w-4 h-4 text-blue-500" />
                                            <span>已选择企业下所有成员（共 {members.length} 人）</span>
                                        </div>
                                    </div>
                                )}
                                
                                {/* 选成员 */}
                                {memberSelectType === 'member' && (
                                    <div className="border border-gray-200 rounded-lg">
                                        {/* 搜索栏 */}
                                        <div className="p-3 border-b border-gray-100">
                                            <div className="relative">
                                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    value={quotaMemberSearchKeyword}
                                                    onChange={(e) => setQuotaMemberSearchKeyword(e.target.value)}
                                                    placeholder="搜索成员名称、账号或部门"
                                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                        {/* 全选 */}
                                        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                                                    onChange={toggleSelectAllMembers}
                                                    className="w-4 h-4 text-[#006bff] border-gray-300 rounded focus:ring-[#006bff]"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">全选</span>
                                            </label>
                                            <span className="text-sm text-gray-500">已选 {selectedMembers.length} 人</span>
                                        </div>
                                        {/* 成员列表 */}
                                        <div className="max-h-60 overflow-y-auto">
                                            {filteredMembers.map(member => (
                                                <label
                                                    key={member.id}
                                                    className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMembers.includes(member.id)}
                                                        onChange={() => toggleMemberSelection(member.id)}
                                                        className="w-4 h-4 text-[#006bff] border-gray-300 rounded focus:ring-[#006bff]"
                                                    />
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                                        <div className="text-xs text-gray-500">{member.account} · {member.department}</div>
                                                    </div>
                                                </label>
                                            ))}
                                            {filteredMembers.length === 0 && (
                                                <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                    未找到匹配的成员
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* 选组织 */}
                                {memberSelectType === 'organization' && (
                                    <div className="border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto">
                                        {renderOrgTree(organizationTree, 0)}
                                    </div>
                                )}

                                {/* 选角色 */}
                                {memberSelectType === 'role' && (
                                    <div>
                                        <select
                                            value={selectedRoleForQuota}
                                            onChange={(e) => setSelectedRoleForQuota(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        >
                                            <option value="">请选择角色，单选</option>
                                            <option value="全部角色">全部角色</option>
                                            {roleList.map(role => (
                                                <option key={role.id} value={role.name}>{role.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            
                            {/* 配额金额设置 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    配额金额设置 <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-3">
                                    {/* 龙虾 */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-20 text-sm text-gray-600 flex-shrink-0">龙虾</span>
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                                            <input
                                                type="text"
                                                value={lobsterQuota}
                                                onChange={(e) => handleQuotaInput(e.target.value, setLobsterQuota)}
                                                placeholder="0"
                                                disabled={lobsterUnlimited}
                                                className="w-full pl-8 pr-16 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-red-500">元/月</span>
                                        </div>
                                    </div>
                                    {/* AI计划 */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-20 text-sm text-gray-600 flex-shrink-0">AI计划</span>
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                                            <input
                                                type="text"
                                                value={llmQuota}
                                                onChange={(e) => handleQuotaInput(e.target.value, setLlmQuota)}
                                                placeholder="0"
                                                disabled={llmUnlimited}
                                                className="w-full pl-8 pr-16 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600">元/月</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-gray-400">通过角色或成员给成员分配配额，即，每个月最多可消费的金额。</p>
                            </div>
                        </div>
                        
                        {/* 底部按钮 */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                            <button
                                onClick={() => setCreateQuotaDrawerOpen(false)}
                                className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={submitCreateQuota}
                                className="px-4 py-2 text-sm text-white bg-[#006bff] rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                {editingQuotaId ? '确认编辑' : '确认创建'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 消费TOP抽屉 */}
            {consumptionDrawerOpen && (
                <div className="fixed inset-0 z-[2000]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setConsumptionDrawerOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl flex flex-col">
                        {/* 头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                            <h3 className="text-lg font-semibold text-gray-900">消费TOP详情</h3>
                            <button 
                                onClick={() => setConsumptionDrawerOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        
                        {/* Tab切换 */}
                        <div className="flex items-center gap-6 px-6 border-b border-gray-100 flex-shrink-0">
                            <button
                                onClick={() => setConsumptionDrawerTab('member')}
                                className={`py-3 text-sm transition-colors border-b-2 ${
                                    consumptionDrawerTab === 'member' 
                                        ? 'text-[#006bff] border-[#006bff]' 
                                        : 'text-gray-600 border-transparent hover:text-gray-900'
                                }`}
                            >
                                成员消费分布
                            </button>
                            <button
                                onClick={() => setConsumptionDrawerTab('product')}
                                className={`py-3 text-sm transition-colors border-b-2 ${
                                    consumptionDrawerTab === 'product' 
                                        ? 'text-[#006bff] border-[#006bff]' 
                                        : 'text-gray-600 border-transparent hover:text-gray-900'
                                }`}
                            >
                                产品消费分布
                            </button>
                            <button
                                onClick={() => setConsumptionDrawerTab('resourcePack')}
                                className={`py-3 text-sm transition-colors border-b-2 ${
                                    consumptionDrawerTab === 'resourcePack' 
                                        ? 'text-[#006bff] border-[#006bff]' 
                                        : 'text-gray-600 border-transparent hover:text-gray-900'
                                }`}
                            >
                                套餐消费分布
                            </button>
                        </div>
                        
                        {/* 内容区 */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* 成员消费分布 */}
                            {consumptionDrawerTab === 'member' && (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 text-sm font-medium text-gray-500 w-16">排名</th>
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">成员</th>
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">角色</th>
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">消费金额</th>
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">占比</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentStats.memberRanking.map((member, index) => {
                                            const rankColors = [
                                                "bg-yellow-100 text-yellow-600",
                                                "bg-gray-100 text-gray-600",
                                                "bg-orange-100 text-orange-600",
                                            ];
                                            const trendColor = member.trend.includes("↑") ? "text-green-500" : member.trend.includes("↓") ? "text-red-500" : "text-gray-400";
                                            const amount = (member.amount || (member.tokensUsed * 0.0001)).toFixed(2);
                                            
                                            return (
                                                <tr key={member.rank} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3">
                                                        <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-medium ${index < 3 ? rankColors[index] : 'bg-gray-50 text-gray-500'}`}>{member.rank}</span>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="text-sm text-gray-900">{member.name}</div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className={`inline-flex px-2 py-0.5 rounded text-xs ${roleConfig[member.role as UserRole]?.bgColor || 'bg-gray-500'} text-white`}>
                                                            {roleConfig[member.role as UserRole]?.label || member.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900">¥{amount}</span>
                                                            <span className={`text-xs ${trendColor}`}>{member.trend}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="text-sm text-gray-600">{member.percentage}%</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                            
                            {/* 产品消费分布 */}
                            {consumptionDrawerTab === 'product' && (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 text-sm font-medium text-gray-500 w-16">排名</th>
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">产品</th>
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">消费金额</th>
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">占比</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentStats.productRanking.map((product, index) => {
                                            const rankColors = [
                                                "bg-yellow-100 text-yellow-600",
                                                "bg-gray-100 text-gray-600",
                                                "bg-orange-100 text-orange-600",
                                            ];
                                            const trendColor = product.trend.includes("↑") ? "text-green-500" : product.trend.includes("↓") ? "text-red-500" : "text-gray-400";
                                            
                                            return (
                                                <tr key={product.rank} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3">
                                                        <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-medium ${index < 3 ? rankColors[index] : 'bg-gray-50 text-gray-500'}`}>{product.rank}</span>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="text-sm text-gray-900">{product.name}</div>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900">¥{product.amount.toFixed(2)}</span>
                                                            <span className={`text-xs ${trendColor}`}>{product.trend}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="text-sm text-gray-600">{product.percentage}%</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                            
                            {/* 套餐消费分布 */}
                            {consumptionDrawerTab === 'resourcePack' && (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 text-sm font-medium text-gray-500 w-16">排名</th>
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">套餐</th>
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">消费金额</th>
                                            <th className="text-left py-3 text-sm font-medium text-gray-500">占比</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentStats.resourcePackRanking.map((pack, index) => {
                                            const rankColors = [
                                                "bg-yellow-100 text-yellow-600",
                                                "bg-gray-100 text-gray-600",
                                                "bg-orange-100 text-orange-600",
                                            ];
                                            const trendColor = pack.trend.includes("↑") ? "text-green-500" : pack.trend.includes("↓") ? "text-red-500" : "text-gray-400";
                                            
                                            return (
                                                <tr key={pack.rank} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3">
                                                        <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-medium ${index < 3 ? rankColors[index] : 'bg-gray-50 text-gray-500'}`}>{pack.rank}</span>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="text-sm text-gray-900">{pack.name}</div>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-900">¥{pack.amount.toFixed(2)}</span>
                                                            <span className={`text-xs ${trendColor}`}>{pack.trend}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="text-sm text-gray-600">{pack.percentage}%</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* 禁止访问确认弹窗 */}
            {banMemberDialogOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setBanMemberDialogOpen(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">禁止访问确认</h3>
                        <p className="text-sm text-gray-600 mb-6">禁止访问后，该企业成员将不能访问智企，确定禁止访问？</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setBanMemberDialogOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">取消</button>
                            <button onClick={() => {
                                if (banTargetMember) {
                                    setBlockedMembers(prev => [...prev, { name: banTargetMember.name, account: banTargetMember.account, role: accessibleMembers.find(m => m.account === banTargetMember.account)?.role || '', accessTime: accessibleMembers.find(m => m.account === banTargetMember.account)?.accessTime || '', operator: userAccount || '管理员', operateTime: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '/'), status: '已禁止' as const }]);
                                    setAccessibleMembers(prev => prev.filter(m => m.account !== banTargetMember.account));
                                    // 同步更新localStorage，标记该成员访问权限为已禁止
                                    localStorage.setItem(`zhiqi_access_permission_${banTargetMember.account}`, 'denied');
                                }
                                setBanMemberDialogOpen(false);
                                setBanTargetMember(null);
                            }} className="px-4 py-2 text-sm bg-[#0066FF] text-white rounded-md hover:bg-[#0052CC]">确定</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 修改成员角色弹窗 */}
            {editRoleDialogOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setEditRoleDialogOpen(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">修改成员角色</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {editRoleTargetMembers.map(account => accessibleMembers.find(m => m.account === account)?.name).filter(Boolean).join('、')}
                        </p>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                修改角色为 <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editRoleNewRole}
                                onChange={(e) => setEditRoleNewRole(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                            >
                                <option value="">请选择角色，单选</option>
                                {roleList.map(role => (
                                    <option key={role.id} value={role.name}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setEditRoleDialogOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">取消</button>
                            <button onClick={() => {
                                if (!editRoleNewRole) return;
                                setEditRoleConfirmOpen(true);
                            }} className="px-4 py-2 text-sm bg-[#0066FF] text-white rounded-md hover:bg-[#0052CC]">保存</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 角色修改二次确认弹窗 */}
            {editRoleConfirmOpen && (
                <div className="fixed inset-0 z-[2001] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setEditRoleConfirmOpen(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">确认</h3>
                        <p className="text-sm text-gray-600 mb-6">成员角色修改后，当期成员的配额会同步更新到新角色的配额，确定修改？</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setEditRoleConfirmOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">取消</button>
                            <button onClick={() => {
                                setAccessibleMembers(prev => prev.map(m => editRoleTargetMembers.includes(m.account) ? { ...m, role: editRoleNewRole } : m));
                                setBlockedMembers(prev => prev.map(m => editRoleTargetMembers.includes(m.account) ? { ...m, role: editRoleNewRole } : m));
                                setEditRoleConfirmOpen(false);
                                setEditRoleDialogOpen(false);
                                setEditRoleTargetMembers([]);
                                setEditRoleNewRole('');
                            }} className="px-4 py-2 text-sm bg-[#0066FF] text-white rounded-md hover:bg-[#0052CC]">确定</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 恢复访问确认弹窗 */}
            {restoreMemberDialogOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setRestoreMemberDialogOpen(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">恢复访问确认</h3>
                        <p className="text-sm text-gray-600 mb-6">恢复访问后，该企业成员将可以访问智企，确定恢复访问？</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setRestoreMemberDialogOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">取消</button>
                            <button onClick={() => {
                                if (restoreTargetMember) {
                                    const target = blockedMembers.find(m => m.account === restoreTargetMember.account);
                                    if (target) {
                                        setAccessibleMembers(prev => [...prev, { name: target.name, account: target.account, role: target.role, accessTime: target.accessTime, operator: '手动恢复', operateTime: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '/'), status: '可访问' as const }]);
                                        setBlockedMembers(prev => prev.filter(m => m.account !== restoreTargetMember.account));
                                        // 同步更新localStorage，标记该成员访问权限为已授权
                                        localStorage.setItem(`zhiqi_access_permission_${target.account}`, 'granted');
                                    }
                                }
                                setRestoreMemberDialogOpen(false);
                                setRestoreTargetMember(null);
                            }} className="px-4 py-2 text-sm bg-[#0066FF] text-white rounded-md hover:bg-[#0052CC]">确定</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 允许访问确认弹窗 */}
            {approveDialogOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setApproveDialogOpen(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">允许访问确认</h3>
                        <p className="text-sm text-gray-600 mb-6">允许访问后，该成员将可以访问智企，确定允许访问？</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setApproveDialogOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">取消</button>
                            <button onClick={() => {
                                if (approveTargetMember) {
                                    setAccessibleMembers(prev => [...prev, {
                                        name: approveTargetMember.name,
                                        account: approveTargetMember.account,
                                        role: approveTargetMember.role,
                                        accessTime: approveTargetMember.applyTime,
                                        operator: userAccount || '管理员',
                                        operateTime: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '/'),
                                        status: '可访问' as const
                                    }]);
                                    setPendingMembers(prev => prev.filter(m => m.account !== approveTargetMember.account));
                                    // 同步更新localStorage，标记该成员访问权限为已授权
                                    localStorage.setItem(`zhiqi_access_permission_${approveTargetMember.account}`, 'granted');
                                }
                                setApproveDialogOpen(false);
                                setApproveTargetMember(null);
                            }} className="px-4 py-2 text-sm bg-[#0066FF] text-white rounded-md hover:bg-[#0052CC]">确定</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 拒绝访问确认弹窗 */}
            {rejectDialogOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setRejectDialogOpen(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">拒绝访问确认</h3>
                        <p className="text-sm text-gray-600 mb-6">拒绝访问后，该成员将不能访问智企，确定拒绝访问？</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setRejectDialogOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">取消</button>
                            <button onClick={() => {
                                if (rejectTargetMember) {
                                    setBlockedMembers(prev => [...prev, {
                                        name: rejectTargetMember.name,
                                        account: rejectTargetMember.account,
                                        role: rejectTargetMember.role,
                                        accessTime: rejectTargetMember.applyTime,
                                        operator: userAccount || '管理员',
                                        operateTime: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '/'),
                                        status: '已禁止' as const
                                    }]);
                                    setPendingMembers(prev => prev.filter(m => m.account !== rejectTargetMember.account));
                                    // 同步更新localStorage，标记该成员访问权限为已拒绝
                                    localStorage.setItem(`zhiqi_access_permission_${rejectTargetMember.account}`, 'denied');
                                }
                                setRejectDialogOpen(false);
                                setRejectTargetMember(null);
                            }} className="px-4 py-2 text-sm bg-[#0066FF] text-white rounded-md hover:bg-[#0052CC]">确定</button>
                        </div>
                    </div>
                </div>
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
export default function EnterpriseAdminPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <EnterpriseAdminContent />
        </Suspense>
    );
}

 
