"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { navigateTo } from "@/lib/navigation";
import {
    getSettlementRequests,
    approveSettlementRequest,
    rejectSettlementRequest,
    type SettlementRequest,
    type SettlementRequestStatus,
} from "@/lib/settlement-request-store";

import {
    ChevronDown,
    Wallet,
    Link as LinkIcon,
    Receipt,
    LayoutGrid,
    ShoppingBag,
    Settings,
    ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";

const costMenu = [
    {
        title: "资金管理",
        icon: Wallet,
        children: [
            { name: "资金概览", key: "fund-overview" },
            { name: "收支明细", key: "fund-details" },
        ],
    },
    {
        title: "关联三方结算",
        icon: LinkIcon,
        children: [
            { name: "关联三方结算管理", key: "third-party-settlement" },
            { name: "已关联三方订单管理", key: "third-party-orders" },
        ],
    },
    {
        title: "账单管理",
        icon: Receipt,
        children: [
            { name: "账单概览", key: "bill-overview" },
            { name: "账单详情", key: "bill-details" },
            { name: "计费明细", key: "billing-details" },
        ],
    },
];

const globalMenu = [
    { title: "工作台总览", icon: LayoutGrid, key: "console" },
    { title: "产品管理", icon: ShoppingBag, key: "product" },
    { title: "账单管理", icon: Receipt, key: "bill" },
    { title: "平台配置", icon: Settings, key: "platform" },
    { title: "管理后台", icon: ShieldCheck, key: "admin" },
];

const tableData = [
    {
        id: "1",
        unitName: "研发中心结算单元",
        resourceGroup: "研发-默认资源组",
        subjectType: "用户",
        subjectName: "张三",
        subjectId: "U100001",
        remark: "研发人员云资源采购结算",
        operator: "admin@360.cn",
        operateTime: "2026-06-30 14:32:45",
    },
    {
        id: "2",
        unitName: "市场部结算单元",
        resourceGroup: "市场-推广资源组",
        subjectType: "组织机构",
        subjectName: "市场部",
        subjectId: "- -",
        remark: "市场部整体三方结算",
        operator: "lujingbao@360.cn",
        operateTime: "2026-06-29 10:15:03",
    },
    {
        id: "3",
        unitName: "财务共享结算单元",
        resourceGroup: "财务-核算资源组",
        subjectType: "用户",
        subjectName: "李四",
        subjectId: "U100023",
        remark: "财务专用",
        operator: "admin@360.cn",
        operateTime: "2026-06-28 09:41:22",
    },
    {
        id: "4",
        unitName: "华东大区结算单元",
        resourceGroup: "华东-业务资源组",
        subjectType: "组织机构",
        subjectName: "华东大区",
        subjectId: "- -",
        remark: "区域业务结算归集",
        operator: "wangwu@360.cn",
        operateTime: "2026-06-27 16:08:57",
    },
    {
        id: "5",
        unitName: "AI实验室结算单元",
        resourceGroup: "AI-训练资源组",
        subjectType: "用户",
        subjectName: "赵六",
        subjectId: "U100088",
        remark: "GPU算力结算",
        operator: "admin@360.cn",
        operateTime: "2026-06-26 20:33:11",
    },
    {
        id: "6",
        unitName: "安全事业部结算单元",
        resourceGroup: "安全-防护资源组",
        subjectType: "组织机构",
        subjectName: "安全事业部",
        subjectId: "- -",
        remark: "安全产品线统一结算",
        operator: "lujingbao@360.cn",
        operateTime: "2026-06-25 11:27:49",
    },
    {
        id: "7",
        unitName: "运维保障结算单元",
        resourceGroup: "运维-监控资源组",
        subjectType: "用户",
        subjectName: "孙七",
        subjectId: "U100156",
        remark: "运维值班账号",
        operator: "admin@360.cn",
        operateTime: "2026-06-24 08:12:36",
    },
    {
        id: "8",
        unitName: "数据平台结算单元",
        resourceGroup: "数据-仓库资源组",
        subjectType: "组织机构",
        subjectName: "大数据中心",
        subjectId: "- -",
        remark: "数据仓库与计算结算",
        operator: "wangwu@360.cn",
        operateTime: "2026-06-23 15:54:08",
    },
    {
        id: "9",
        unitName: "产品设计结算单元",
        resourceGroup: "设计-协作资源组",
        subjectType: "用户",
        subjectName: "周八",
        subjectId: "U100201",
        remark: "设计工具与素材结算",
        operator: "admin@360.cn",
        operateTime: "2026-06-22 13:39:44",
    },
    {
        id: "10",
        unitName: "海外业务结算单元",
        resourceGroup: "海外-加速资源组",
        subjectType: "组织机构",
        subjectName: "海外事业部",
        subjectId: "- -",
        remark: "海外节点与CDN结算",
        operator: "lujingbao@360.cn",
        operateTime: "2026-06-21 19:02:17",
    },
];

// 已关联三方订单 mock 数据
type OrderStatus = "pending" | "approved" | "rejected";

interface OrderRecord {
    id: string;
    applicantName: string;
    applicantId: string;
    productName: string;
    service: string;
    settlementUnit: string;
    resourceGroup: string;
    amount: string;
    applyTime: string;
    remark: string;
    status: OrderStatus;
    operator?: string;
    operateTime?: string;
}

const orderData: OrderRecord[] = [
    {
        id: "O1",
        applicantName: "张三",
        applicantId: "zhangsan@360.cn",
        productName: "智企 - 大模型服务",
        service: "AI算力资源包-标准版",
        settlementUnit: "研发中心结算单元",
        resourceGroup: "研发-默认资源组",
        amount: "¥12,800.00",
        applyTime: "2026-06-30 14:32:32",
        remark: "研发团队Q3模型训练采购",
        status: "pending",
    },
    {
        id: "O2",
        applicantName: "李四",
        applicantId: "lisi@360.cn",
        productName: "智企 - 对象存储OBS",
        service: "存储资源包-1TB",
        settlementUnit: "财务共享结算单元",
        resourceGroup: "财务-核算资源组",
        amount: "¥3,200.00",
        applyTime: "2026-06-30 11:08:15",
        remark: "财务数据归档存储",
        status: "pending",
    },
    {
        id: "O3",
        applicantName: "赵六",
        applicantId: "zhaoliu@360.cn",
        productName: "智企 - GPU算力",
        service: "GPU算力包-A100×8",
        settlementUnit: "AI实验室结算单元",
        resourceGroup: "AI-训练资源组",
        amount: "¥45,600.00",
        applyTime: "2026-06-29 16:45:09",
        remark: "大模型预训练任务",
        status: "pending",
    },
    {
        id: "O4",
        applicantName: "王五",
        applicantId: "wangwu@360.cn",
        productName: "智企 - CDN加速",
        service: "CDN流量包-10TB",
        settlementUnit: "市场部结算单元",
        resourceGroup: "市场-推广资源组",
        amount: "¥6,500.00",
        applyTime: "2026-06-28 09:22:41",
        remark: "市场活动页面加速",
        status: "approved",
        operator: "lujingbao@360.cn",
        operateTime: "2026-06-28 10:05:18",
    },
    {
        id: "O5",
        applicantName: "孙七",
        applicantId: "sunqi@360.cn",
        productName: "智企 - 云主机CVM",
        service: "通用型云主机-4C8G",
        settlementUnit: "运维保障结算单元",
        resourceGroup: "运维-监控资源组",
        amount: "¥2,100.00",
        applyTime: "2026-06-27 13:37:55",
        remark: "监控系统扩容",
        status: "approved",
        operator: "admin@360.cn",
        operateTime: "2026-06-27 14:12:30",
    },
    {
        id: "O6",
        applicantName: "周八",
        applicantId: "zhouba@360.cn",
        productName: "智企 - 互动直播RTC",
        service: "直播时长包-500小时",
        settlementUnit: "海外业务结算单元",
        resourceGroup: "海外-加速资源组",
        amount: "¥8,900.00",
        applyTime: "2026-06-26 18:14:22",
        remark: "海外发布会直播",
        status: "rejected",
        operator: "lujingbao@360.cn",
        operateTime: "2026-06-26 19:00:47",
    },
    {
        id: "O7",
        applicantName: "吴九",
        applicantId: "wujiu@360.cn",
        productName: "智企 - 大数据DI",
        service: "数据集成任务包",
        settlementUnit: "数据平台结算单元",
        resourceGroup: "数据-仓库资源组",
        amount: "¥15,300.00",
        applyTime: "2026-06-25 10:29:08",
        remark: "预算超限，暂不通过",
        status: "rejected",
        operator: "admin@360.cn",
        operateTime: "2026-06-25 11:33:52",
    },
];

export default function ZyunPage() {
    const [username, setUsername] = useState("lujingbao");
    const [activeMenu, setActiveMenu] = useState("third-party-settlement");
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedUnit, setSelectedUnit] = useState("");

    // 关联三方结算管理：状态 Tab（待审批 / 已通过 / 已拒绝）
    const [settleTab, setSettleTab] = useState<SettlementRequestStatus>("pending");
    // console 端提交的申请（含待审批/已通过/已拒绝），从 localStorage 读取
    const [settleRequests, setSettleRequests] = useState<SettlementRequest[]>([]);
    // 审批弹窗（关联三方结算管理）
    const [settleApproveDialog, setSettleApproveDialog] = useState<SettlementRequest | null>(null);
    const [settleRejectDialog, setSettleRejectDialog] = useState<SettlementRequest | null>(null);
    const [settleRejectReason, setSettleRejectReason] = useState("");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [unbindDialogOpen, setUnbindDialogOpen] = useState(false);
    const [, setCurrentRecord] = useState<Record<string, string> | null>(null);

    // 已关联三方订单管理相关状态
    const [orderTab, setOrderTab] = useState<OrderStatus>("pending");
    const [orderKeyword, setOrderKeyword] = useState("");
    const [orderUnit, setOrderUnit] = useState("");
    const [orderProduct, setOrderProduct] = useState("");
    const [orders, setOrders] = useState<OrderRecord[]>(orderData);
    const [approveDialog, setApproveDialog] = useState<OrderRecord | null>(null);
    const [rejectDialog, setRejectDialog] = useState<OrderRecord | null>(null);

    const [subjectType, setSubjectType] = useState<"user" | "org">("user");

    // 抽屉表单受控字段
    const [formUnit, setFormUnit] = useState("");
    const [formResourceGroup, setFormResourceGroup] = useState("");
    const [formUser, setFormUser] = useState("");
    const [formOrg, setFormOrg] = useState("");
    const [formRemark, setFormRemark] = useState("");

    useEffect(() => {
        const userInfoStr = localStorage.getItem("zhiqi_user_info");
        if (userInfoStr) {
            try {
                const userInfo = JSON.parse(userInfoStr);
                setUsername(userInfo.account || userInfo.name || userInfo.phone || "lujingbao");
            } catch {
                setUsername("lujingbao");
            }
        }
    }, []);

    // 读取 console 端提交的开通组织支付申请
    useEffect(() => {
        setSettleRequests(getSettlementRequests());
        // 页面重新可见时刷新（从 console 切回来能看到新申请）
        const onFocus = () => setSettleRequests(getSettlementRequests());
        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onFocus);
        return () => {
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onFocus);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("zhiqi_logged_in");
        localStorage.removeItem("zhiqi_user_info");
        navigateTo("/");
    };

    // 关联三方结算管理：审批通过
    const confirmSettleApprove = () => {
        if (!settleApproveDialog) return;
        approveSettlementRequest(settleApproveDialog.id, `${username}@360.cn`);
        setSettleRequests(getSettlementRequests());
        setSettleApproveDialog(null);
    };

    // 关联三方结算管理：审批拒绝
    const confirmSettleReject = () => {
        if (!settleRejectDialog) return;
        rejectSettlementRequest(settleRejectDialog.id, `${username}@360.cn`, settleRejectReason.trim() || undefined);
        setSettleRequests(getSettlementRequests());
        setSettleRejectDialog(null);
        setSettleRejectReason("");
    };

    const handleCreate = () => {
        setCurrentRecord(null);
        setSubjectType("user");
        setFormUnit("");
        setFormResourceGroup("");
        setFormUser("");
        setFormOrg("");
        setFormRemark("");
        setDrawerOpen(true);
    };

    const handleEdit = (record: Record<string, string>) => {
        setCurrentRecord(record);
        const isUser = record.subjectType === "用户";
        setSubjectType(isUser ? "user" : "org");
        setFormUnit(record.unitName || "");
        setFormResourceGroup(record.resourceGroup || "");
        setFormUser(isUser ? record.subjectName || "" : "");
        setFormOrg(isUser ? "" : record.subjectName || "");
        setFormRemark(record.remark || "");
        setDrawerOpen(true);
    };

    const handleUnbind = (record: Record<string, string>) => {
        setCurrentRecord(record);
        setUnbindDialogOpen(true);
    };

    // 关联三方结算管理：合并「基础已通过绑定列表(tableData)」与「console 提交的申请(store)」
    // - 待审批：仅来自 store 的 pending 申请
    // - 已通过：tableData 原有绑定 + store 中已通过的申请
    // - 已拒绝：store 中已拒绝的申请
    const baseApproved: SettlementRequest[] = tableData.map((r) => ({
        id: r.id,
        unitName: r.unitName,
        resourceGroup: r.resourceGroup,
        subjectType: r.subjectType,
        subjectName: r.subjectName,
        subjectId: r.subjectId,
        remark: r.remark,
        operator: r.operator,
        operateTime: r.operateTime,
        status: "approved" as SettlementRequestStatus,
    }));

    const settleByTab: Record<SettlementRequestStatus, SettlementRequest[]> = {
        pending: settleRequests.filter((r) => r.status === "pending"),
        approved: [...settleRequests.filter((r) => r.status === "approved"), ...baseApproved],
        rejected: settleRequests.filter((r) => r.status === "rejected"),
    };

    // 各 Tab 数量（N/M/Q）
    const settleCount = {
        pending: settleByTab.pending.length,
        approved: settleByTab.approved.length,
        rejected: settleByTab.rejected.length,
    };

    // 成员名称搜索 + 结算单元筛选，作用于当前 Tab 列表
    const filteredData = settleByTab[settleTab].filter((row) => {
        const kw = searchKeyword.trim();
        const matchKw = kw === "" || row.subjectName.includes(kw);
        const matchUnit = selectedUnit === "" || row.unitName === selectedUnit;
        return matchKw && matchUnit;
    });

    // 各状态订单数量
    const orderCount = {
        pending: orders.filter((o) => o.status === "pending").length,
        approved: orders.filter((o) => o.status === "approved").length,
        rejected: orders.filter((o) => o.status === "rejected").length,
    };

    // 订单列表过滤（当前 Tab + 搜索 + 结算单元 + 产品）
    const filteredOrders = orders.filter((o) => {
        if (o.status !== orderTab) return false;
        const kw = orderKeyword.trim();
        const matchKw = kw === "" || o.applicantName.includes(kw) || o.applicantId.includes(kw);
        const matchUnit = orderUnit === "" || o.settlementUnit === orderUnit;
        const matchProduct = orderProduct === "" || o.productName === orderProduct;
        return matchKw && matchUnit && matchProduct;
    });

    // 审批通过
    const confirmApprove = () => {
        if (!approveDialog) return;
        const now = new Date().toISOString().slice(0, 19).replace("T", " ");
        setOrders((prev) =>
            prev.map((o) =>
                o.id === approveDialog.id
                    ? { ...o, status: "approved" as OrderStatus, operator: `${username}@360.cn`, operateTime: now }
                    : o
            )
        );
        setApproveDialog(null);
    };

    // 审批拒绝
    const confirmReject = () => {
        if (!rejectDialog) return;
        const now = new Date().toISOString().slice(0, 19).replace("T", " ");
        setOrders((prev) =>
            prev.map((o) =>
                o.id === rejectDialog.id
                    ? { ...o, status: "rejected" as OrderStatus, operator: `${username}@360.cn`, operateTime: now }
                    : o
            )
        );
        setRejectDialog(null);
    };

    // 查看账单：跳转账单详情，带产品、时间、结算单元、资源组
    const handleViewBill = (o: OrderRecord) => {
        const params = new URLSearchParams({
            product: o.productName,
            time: o.applyTime,
            unit: o.settlementUnit,
            group: o.resourceGroup,
            granularity: "hour",
        });
        navigateTo(`/console/cost?${params.toString()}`);
    };

    return (
        <div
            className="h-screen w-screen overflow-hidden grid"
            style={{
                gridTemplateColumns: "50px 200px minmax(0, 1fr)",
                gridTemplateRows: "50px minmax(0, 1fr)",
            }}
        >
            {/* Logo 区（顶部导航栏左端，位于图标栏列上方） */}
            <div className="flex items-center justify-center bg-white z-[100]" style={{ boxShadow: "0 2px 6px rgba(49,49,71,0.26)" }}>
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                    <path d="M14 2C7.37 2 2 7.37 2 14C2 20.63 7.37 26 14 26C16.95 26 19.7 24.95 21.8 23.1L20.3 21.6C18.6 23.1 16.4 24 14 24C8.48 24 4 19.52 4 14C4 8.48 8.48 4 14 4C16.5 4 18.7 4.9 20.4 6.4L21.9 4.9C19.75 2.95 17 2 14 2Z" fill="#0066FF" />
                    <path d="M14 6C10.13 6 7 9.13 7 13C7 16.87 10.13 20 14 20C16.1 20 18 19.1 19.2 17.7L17.8 16.3C17 17.3 15.6 18 14 18C11.24 18 9 15.76 9 13C9 10.24 11.24 8 14 8C15.4 8 16.7 8.5 17.6 9.4L19 8C17.6 6.7 15.9 6 14 6Z" fill="#00d4aa" />
                </svg>
            </div>

            {/* 顶部导航栏（跨中间菜单栏 + 主内容列） */}
            <header
                className="col-span-2 flex items-center justify-between bg-white z-[100]"
                style={{
                    padding: "0 20px",
                    boxShadow: "0 2px 6px rgba(49,49,71,0.26)",
                }}
            >
                <div className="flex items-center gap-4">
                    <span className="text-[16px] font-semibold text-[#202020]">
                        360<span className="text-[#0066FF]">智汇云</span>
                    </span>
                    <div className="flex items-center h-8 px-3 rounded cursor-pointer" style={{ background: "#EEF6FF" }}>
                        <span className="w-4 h-4 rounded text-white text-[10px] flex items-center justify-center mr-1.5" style={{ background: "#0066FF" }}>企</span>
                        <span className="text-[14px] text-[#0066FF] font-medium">360集团</span>
                    </div>
                </div>
                <div className="flex items-center">
                    <Link href="/console/cost" className="h-8 px-3 flex items-center rounded text-[14px] text-[#202020] hover:bg-[#F8F9FA]">费用</Link>
                    <Link href="#" className="h-8 px-3 flex items-center rounded text-[14px] text-[#202020] hover:bg-[#F8F9FA]">工单</Link>
                    <button className="relative h-8 px-3 flex items-center rounded text-[14px] text-[#202020] hover:bg-[#F8F9FA]">
                        消息
                        <span className="absolute -top-0.5 right-1 min-w-[18px] h-[15px] px-1 rounded-full text-white text-[9px] leading-[15px] text-center" style={{ background: "#FF4D4F" }}>99+</span>
                    </button>
                    <Link href="#" className="h-8 px-3 flex items-center rounded text-[14px] text-[#202020] hover:bg-[#F8F9FA]">帮助</Link>
                    <div className="w-px h-5 bg-[#E6E6E6] mx-3"></div>
                    <div className="relative">
                        <div
                            className="flex items-center cursor-pointer hover:bg-[#F8F9FA] rounded px-2 py-1"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 text-white text-[14px]" style={{ background: "#0066FF" }}>
                                {username?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-[14px] text-[#202020]">{username}</span>
                                <span className="text-[12px] text-[#8C9AAE]">子账号</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-[#8C9AAE] ml-1" />
                        </div>
                        {userMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded shadow-lg border border-[#E6E6E6] py-1 z-[1000]">
                                <button
                                    className="w-full px-4 py-2 text-left text-[14px] text-[#202020] hover:bg-[#F8F9FA]"
                                    onClick={handleLogout}
                                >
                                    退出登录
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* 左侧全局图标栏（50px 蓝底，主色遵循 zyun-admin-style-design #0f73f6） */}
            <aside
                className="flex flex-col items-center py-1 overflow-y-auto"
                style={{ background: "#2e8cff" }}
            >
                {globalMenu.map((item) => {
                    const active = item.key === "bill";
                    return (
                        <button
                            key={item.key}
                            title={item.title}
                            className="w-full flex flex-col items-center justify-center gap-0.5 transition-colors"
                            style={{
                                height: "50px",
                                background: active ? "#0f73f6" : "transparent",
                                color: active ? "#FFFFFF" : "#E5EAF3",
                            }}
                            onMouseEnter={(e) => {
                                if (!active) {
                                    e.currentTarget.style.background = "#0f73f6";
                                    e.currentTarget.style.color = "#FFFFFF";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!active) {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "#E5EAF3";
                                }
                            }}
                        >
                            <item.icon className="w-[18px] h-[18px]" />
                            <span className="text-[9px] leading-tight text-center px-0.5">{item.title.slice(0, 4)}</span>
                        </button>
                    );
                })}
            </aside>

            {/* 二级侧边栏（180px 白底，遵循 zyun-admin-style-design 规范） */}
            <aside
                className="flex flex-col bg-white overflow-hidden"
                style={{ borderRight: "1px solid #e4e8ec" }}
            >
                <div className="flex items-center px-4 text-[16px] font-medium text-[#2c3442] flex-shrink-0" style={{ height: "50px" }}>
                    费用
                </div>
                <div className="flex-1 overflow-y-auto px-2 py-1">
                    {costMenu.map((group, idx) => (
                        <div key={idx} className={idx > 0 ? "mt-1 pt-1 border-t border-[#eef1f4]" : ""}>
                            <div className="flex items-center text-[13px] text-[#2c3442] cursor-pointer rounded-[6px] hover:bg-[#f2f2f2] transition-colors" style={{ height: "38px", padding: "0 10px" }}>
                                <group.icon className="w-4 h-4 mr-2 text-[#5d6570]" />
                                <span className="flex-1 font-medium">{group.title}</span>
                                <ChevronDown className="w-4 h-4 text-[#8b929a]" />
                            </div>
                            <div>
                                {group.children.map((child) => {
                                    const active = activeMenu === child.key;
                                    // 本期改动菜单项：非选中态用淡红色底高亮
                                    const isHighlight = child.key === "third-party-settlement";
                                    const restBg = isHighlight ? "#fff1f0" : "transparent";
                                    return (
                                        <div
                                            key={child.key}
                                            onClick={() => setActiveMenu(child.key)}
                                            className="relative flex items-center text-[13px] cursor-pointer transition-colors rounded-[6px]"
                                            style={{
                                                height: "38px",
                                                paddingLeft: "32px",
                                                paddingRight: "10px",
                                                background: active ? "#0f73f6" : restBg,
                                                color: active ? "#ffffff" : (isHighlight ? "#f5222d" : "#2c3442"),
                                                fontWeight: active ? 500 : (isHighlight ? 500 : 400),
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!active) e.currentTarget.style.background = isHighlight ? "#ffece8" : "#f2f2f2";
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!active) e.currentTarget.style.background = restBg;
                                            }}
                                        >
                                            <span className="whitespace-nowrap">{child.name}</span>
                                            {child.key === "third-party-settlement" && (
                                                <span className="absolute -top-1 right-1 z-10 px-1.5 py-0.5 rounded-full text-[10px] leading-none font-medium bg-[#f5222d] text-white whitespace-nowrap shadow-sm">
                                                    本期改动
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* 主内容区 */}
            <main className="overflow-auto" style={{ background: "#F0F5F7" }}>
                {activeMenu === "third-party-settlement" && (
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-lg font-medium text-[#2c3442]">绑定三方结算管理</h1>
                        <Link href="#" className="text-sm text-[#0066FF] hover:text-[#0052cc]">帮助文档</Link>
                    </div>

                    <div className="rounded px-4 py-3 mb-6 text-sm text-[#5d6570]" style={{ background: "#EEF6FF", border: "1px solid #d6e4ff" }}>
                        结算单元关联三方结算后，租户下成员在对应三方产品(如智企)上可以通过绑定的结算单元购买服务，费用由绑定的结算单元承担。
                    </div>

                    {/* 状态 Tab：待审批 / 已通过 / 已拒绝 */}
                    <div className="flex items-center justify-between border-b border-gray-200 mb-4">
                        <div className="flex items-center">
                            {([
                                { key: "pending", label: "待审批", count: settleCount.pending },
                                { key: "approved", label: "已通过", count: settleCount.approved },
                                { key: "rejected", label: "已拒绝", count: settleCount.rejected },
                            ] as { key: SettlementRequestStatus; label: string; count: number }[]).map((tab) => {
                                const active = settleTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setSettleTab(tab.key)}
                                        className="relative px-5 h-10 text-sm font-medium transition-colors"
                                        style={{ color: active ? "#0066FF" : "#5d6570" }}
                                    >
                                        {tab.label} ({tab.count})
                                        {active && (
                                            <span className="absolute left-0 right-0 -bottom-px h-0.5" style={{ background: "#0066FF" }}></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <Button
                            size="sm"
                            className="bg-[#0066FF] hover:bg-[#0052cc] h-8 px-4 mb-2"
                            onClick={handleCreate}
                        >
                            新建关联
                        </Button>
                    </div>


                    {/* 搜索筛选栏 */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="搜索关联主体名称"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 w-52"
                            />
                            <select
                                className="h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 w-52 text-gray-500 bg-white"
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                            >
                                <option value="">结算单元筛选，默认全部</option>
                                {[...new Set(settleByTab[settleTab].map((r) => r.unitName))].map((u) => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                                <tr>
                                    <th className="px-4 py-3 font-medium border-r border-gray-200">结算单元名称</th>
                                    <th className="px-4 py-3 font-medium border-r border-gray-200">资源组</th>
                                    <th className="px-4 py-3 font-medium border-r border-gray-200">关联主体类型</th>
                                    <th className="px-4 py-3 font-medium border-r border-gray-200">关联主体名称</th>
                                    <th className="px-4 py-3 font-medium border-r border-gray-200">关联主体ID</th>
                                    <th className="px-4 py-3 font-medium border-r border-gray-200">{settleTab === "pending" ? "申请说明" : "备注"}</th>
                                    {settleTab === "pending" && <th className="px-4 py-3 font-medium border-r border-gray-200">申请时间</th>}
                                    <th className="px-4 py-3 font-medium border-r border-gray-200">{settleTab === "pending" ? "申请人" : "操作人"}</th>
                                    <th className="px-4 py-3 font-medium border-r border-gray-200">操作时间</th>
                                    {settleTab === "rejected" && <th className="px-4 py-3 font-medium border-r border-gray-200">拒绝原因</th>}
                                    {settleTab !== "rejected" && <th className="px-4 py-3 font-medium">操作</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={settleTab === "pending" ? 10 : settleTab === "rejected" ? 10 : 9} className="px-4 py-10 text-center text-gray-400">暂无数据</td>
                                    </tr>
                                ) : (
                                    filteredData.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 border-r border-gray-100 text-[#2c3442]">{row.unitName}</td>
                                            <td className="px-4 py-3 border-r border-gray-100">{row.resourceGroup}</td>
                                            <td className="px-4 py-3 border-r border-gray-100">{row.subjectType}</td>
                                            <td className="px-4 py-3 border-r border-gray-100">{row.subjectName}</td>
                                            <td className="px-4 py-3 border-r border-gray-100">{row.subjectId}</td>
                                            <td className="px-4 py-3 border-r border-gray-100">{row.remark}</td>
                                            {settleTab === "pending" && (
                                                <td className="px-4 py-3 border-r border-gray-100">{row.applyTime || row.operateTime}</td>
                                            )}
                                            <td className="px-4 py-3 border-r border-gray-100">
                                                {settleTab === "pending" ? (row.applicant || row.operator) : row.operator}
                                            </td>
                                            <td className="px-4 py-3 border-r border-gray-100">{row.operateTime}</td>
                                            {settleTab === "rejected" && (
                                                <td className="px-4 py-3 border-r border-gray-100">{row.rejectReason || "- -"}</td>
                                            )}
                                            {settleTab === "pending" && (
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <button
                                                        className="text-green-600 hover:text-green-700 mr-3 font-medium"
                                                        onClick={() => setSettleApproveDialog(row)}
                                                    >通过</button>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 font-medium"
                                                        onClick={() => { setSettleRejectReason(""); setSettleRejectDialog(row); }}
                                                    >拒绝</button>
                                                </td>
                                            )}
                                            {settleTab === "approved" && (
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-800 mr-3 font-medium"
                                                        onClick={() => handleEdit({ ...row } as unknown as Record<string, string>)}
                                                    >编辑</button>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 font-medium"
                                                        onClick={() => handleUnbind({ ...row } as unknown as Record<string, string>)}
                                                    >解除关联</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                )}

                {activeMenu === "third-party-orders" && (
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-lg font-medium text-[#2c3442]">
                            <span className="text-[#8C9AAE] font-normal">绑定三方结算 / </span>已关联三方订单管理
                        </h1>
                        <Link href="#" className="text-sm text-[#0066FF] hover:text-[#0052cc]">帮助文档</Link>
                    </div>

                    {/* 状态 Tab */}
                    <div className="flex items-center border-b border-gray-200 mb-4">
                        {([
                            { key: "pending", label: "待审批", count: orderCount.pending },
                            { key: "approved", label: "已通过", count: orderCount.approved },
                            { key: "rejected", label: "已拒绝", count: orderCount.rejected },
                        ] as { key: OrderStatus; label: string; count: number }[]).map((tab) => {
                            const active = orderTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setOrderTab(tab.key)}
                                    className="relative px-5 h-10 text-sm font-medium transition-colors"
                                    style={{ color: active ? "#0066FF" : "#5d6570" }}
                                >
                                    {tab.label} ({tab.count})
                                    {active && (
                                        <span className="absolute left-0 right-0 -bottom-px h-0.5" style={{ background: "#0066FF" }}></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="rounded px-4 py-3 mb-4 text-sm text-[#5d6570]" style={{ background: "#EEF6FF", border: "1px solid #d6e4ff" }}>
                        结算单元关联三方结算后，租户下成员在对应三方产品(如智企)上可以通过绑定的结算单元购买服务，费用由绑定的结算单元承担。
                    </div>

                    {/* 筛选栏 */}
                    <div className="flex items-center gap-3 mb-4">
                        <input
                            type="text"
                            placeholder="成员名称搜索"
                            value={orderKeyword}
                            onChange={(e) => setOrderKeyword(e.target.value)}
                            className="h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 w-52"
                        />
                        <select
                            className="h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 w-52 text-gray-500 bg-white"
                            value={orderUnit}
                            onChange={(e) => setOrderUnit(e.target.value)}
                        >
                            <option value="">结算单元筛选，默认全部</option>
                            {[...new Set(orders.map((o) => o.settlementUnit))].map((u) => (
                                <option key={u} value={u}>{u}</option>
                            ))}
                        </select>
                        <select
                            className="h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 w-52 text-gray-500 bg-white"
                            value={orderProduct}
                            onChange={(e) => setOrderProduct(e.target.value)}
                        >
                            <option value="">{orderTab === "pending" ? "产品筛选，默认全部" : "关联产品筛选，默认全部"}</option>
                            {[...new Set(orders.map((o) => o.productName))].map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    {/* 订单表格 */}
                    <div className="bg-white border border-gray-200 rounded w-full">
                        <table className="w-full table-fixed text-[13px] leading-snug text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                                <tr>
                                    <th className="px-2 py-3 font-medium border-r border-gray-200 w-[6%]">提单人姓名</th>
                                    <th className="px-2 py-3 font-medium border-r border-gray-200 w-[13%]">提单人账号ID</th>
                                    <th className="px-2 py-3 font-medium border-r border-gray-200 w-[9%]">产品名称</th>
                                    <th className="px-2 py-3 font-medium border-r border-gray-200 w-[9%]">购买服务</th>
                                    <th className="px-2 py-3 font-medium border-r border-gray-200 w-[9%]">归属结算单元</th>
                                    <th className="px-2 py-3 font-medium border-r border-gray-200 w-[9%]">归属资源组</th>
                                    <th className="px-2 py-3 font-medium border-r border-gray-200 w-[8%]">订单金额</th>
                                    <th className="px-2 py-3 font-medium border-r border-gray-200 w-[9%]">申请时间</th>
                                    <th className={`px-2 py-3 font-medium border-r border-gray-200 ${orderTab === "pending" ? "w-[8%]" : "w-[7%]"}`}>备注</th>
                                    {orderTab !== "pending" && (
                                        <>
                                            <th className="px-2 py-3 font-medium border-r border-gray-200 w-[6%]">操作人</th>
                                            <th className="px-2 py-3 font-medium border-r border-gray-200 w-[9%]">操作时间</th>
                                        </>
                                    )}
                                    {orderTab === "pending" && (
                                        <th className="px-2 py-3 font-medium w-[10%]">操作</th>
                                    )}
                                    {orderTab === "approved" && (
                                        <th className="px-2 py-3 font-medium w-[6%]">操作</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={orderTab === "pending" ? 10 : 12} className="px-2 py-10 text-center text-gray-400">暂无数据</td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((o) => (
                                        <tr key={o.id} className="hover:bg-gray-50 align-top">
                                            <td className="px-2 py-3 border-r border-gray-100 break-words">{o.applicantName}</td>
                                            <td className="px-2 py-3 border-r border-gray-100 break-all">{o.applicantId}</td>
                                            <td className="px-2 py-3 border-r border-gray-100 break-words">{o.productName}</td>
                                            <td className="px-2 py-3 border-r border-gray-100 break-words">{o.service}</td>
                                            <td className="px-2 py-3 border-r border-gray-100 break-words text-[#2c3442]">{o.settlementUnit}</td>
                                            <td className="px-2 py-3 border-r border-gray-100 break-words">{o.resourceGroup}</td>
                                            <td className="px-2 py-3 border-r border-gray-100 break-words">{o.amount}</td>
                                            <td className="px-2 py-3 border-r border-gray-100 break-words">{o.applyTime}</td>
                                            <td className="px-2 py-3 border-r border-gray-100 break-words">{o.remark}</td>
                                            {orderTab !== "pending" && (
                                                <>
                                                    <td className="px-2 py-3 border-r border-gray-100 break-words">{o.operator || "- -"}</td>
                                                    <td className="px-2 py-3 border-r border-gray-100 break-words">{o.operateTime || "- -"}</td>
                                                </>
                                            )}
                                            {orderTab === "pending" && (
                                                <td className="px-2 py-3 whitespace-nowrap">
                                                    <button className="text-green-600 hover:text-green-700 mr-2 font-medium" onClick={() => setApproveDialog(o)}>通过</button>
                                                    <button className="text-red-500 hover:text-red-700 font-medium" onClick={() => setRejectDialog(o)}>拒绝</button>
                                                </td>
                                            )}
                                            {orderTab === "approved" && (
                                                <td className="px-2 py-3">
                                                    <button className="text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap" onClick={() => handleViewBill(o)}>查看账单</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                )}
            </main>

            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetContent side="right" className="w-[640px] sm:max-w-[640px] p-0 flex flex-col">
                    <SheetHeader className="px-6 py-4 border-b border-gray-100">
                        <SheetTitle className="text-base font-medium">新建/编辑关联</SheetTitle>
                        <SheetDescription className="sr-only">新建或编辑结算单元与三方结算的关联关系</SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-5">
                            <div className="flex items-start gap-3">
                                <label className="w-32 pt-2 text-sm text-gray-700 flex-shrink-0 text-right"><span className="text-red-500 mr-1">*</span>选择结算单元：</label>
                                <div className="flex-1">
                                    <select
                                        value={formUnit}
                                        onChange={(e) => setFormUnit(e.target.value)}
                                        className={`w-full h-9 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white ${formUnit ? "text-gray-700" : "text-gray-400"}`}
                                    >
                                        <option value="">结算单元筛选</option>
                                        {[...new Set(tableData.map((r) => r.unitName))].map((u) => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <label className="w-32 pt-2 text-sm text-gray-700 flex-shrink-0 text-right"><span className="text-red-500 mr-1">*</span>选择资源组：</label>
                                <div className="flex-1 flex items-center gap-3">
                                    <select
                                        value={formResourceGroup}
                                        onChange={(e) => setFormResourceGroup(e.target.value)}
                                        className={`flex-1 h-9 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white ${formResourceGroup ? "text-gray-700" : "text-gray-400"}`}
                                    >
                                        <option value="">选择这个结算单元下已有的资源组</option>
                                        {[...new Set(tableData.map((r) => r.resourceGroup))].filter(Boolean).map((g) => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                    <Link href="#" className="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap font-medium">新建资源组</Link>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="w-32 text-sm text-gray-700 flex-shrink-0 text-right"><span className="text-red-500 mr-1">*</span>选择主体类型：</label>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name="subjectType" value="user" checked={subjectType === "user"} onChange={() => setSubjectType("user")} className="w-4 h-4 text-blue-600 border-gray-300" />
                                        <span className="ml-2 text-sm text-gray-700">用户</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" name="subjectType" value="org" checked={subjectType === "org"} onChange={() => setSubjectType("org")} className="w-4 h-4 text-blue-600 border-gray-300" />
                                        <span className="ml-2 text-sm text-gray-700">组织机构</span>
                                    </label>
                                </div>
                            </div>

                            {subjectType === "user" ? (
                                <div className="flex items-start gap-3">
                                    <label className="w-32 pt-2 text-sm text-gray-700 flex-shrink-0 text-right"><span className="text-red-500 mr-1">*</span>选择用户：</label>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={formUser}
                                            onChange={(e) => setFormUser(e.target.value)}
                                            placeholder="搜索成员，可多选"
                                            className="w-full h-9 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white text-gray-700"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3">
                                    <label className="w-32 pt-2 text-sm text-gray-700 flex-shrink-0 text-right"><span className="text-red-500 mr-1">*</span>选择组织机构：</label>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={formOrg}
                                            onChange={(e) => setFormOrg(e.target.value)}
                                            placeholder="组织机构搜索筛选"
                                            className="w-full h-9 px-3 border border-red-400 rounded text-sm focus:outline-none focus:border-red-500 bg-white text-gray-700"
                                        />
                                        <div className="mt-2 p-2 bg-pink-100 text-pink-700 text-xs rounded leading-relaxed">
                                            1、选择，组织机构后，如果选中的父节点，那么，其下子节点部门的成员也要生效
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <label className="w-32 pt-2 text-sm text-gray-700 flex-shrink-0 text-right"><span className="text-red-500 mr-1">*</span>备注说明：</label>
                                <div className="flex-1">
                                    <textarea
                                        value={formRemark}
                                        onChange={(e) => setFormRemark(e.target.value)}
                                        className="w-full h-24 p-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 resize-none"
                                        placeholder="角色说明，100个字符以内"
                                        maxLength={100}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-gray-100 flex justify-center gap-4">
                        <Button variant="outline" className="w-24" onClick={() => setDrawerOpen(false)}>取消</Button>
                        <Button className="w-24 bg-[#0066FF] hover:bg-[#0052cc] text-white" onClick={() => setDrawerOpen(false)}>保存</Button>
                    </div>
                </SheetContent>
            </Sheet>

            <Dialog open={unbindDialogOpen} onOpenChange={setUnbindDialogOpen}>
                <DialogContent className="max-w-[380px]">
                    <DialogHeader>
                        <DialogTitle className="text-base font-medium">解除绑定</DialogTitle>
                        <DialogDescription className="sr-only">解除该成员与当前结算单元的三方结算绑定关系</DialogDescription>
                    </DialogHeader>
                    <div className="py-2 text-sm text-gray-600 space-y-2">
                        <p>解除后，该成员将不能使用当前结算单元在三方平台提交订单</p>
                        <p>确定操作？</p>
                    </div>
                    <DialogFooter className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setUnbindDialogOpen(false)}>取消</Button>
                        <Button className="bg-[#0066FF] hover:bg-[#0052cc] text-white" onClick={() => setUnbindDialogOpen(false)}>确定</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 订单审批通过确认 */}
            <Dialog open={!!approveDialog} onOpenChange={(open) => !open && setApproveDialog(null)}>
                <DialogContent className="max-w-[380px]">
                    <DialogHeader>
                        <DialogTitle className="text-base font-medium">通过</DialogTitle>
                        <DialogDescription className="sr-only">审批通过该三方订单</DialogDescription>
                    </DialogHeader>
                    <div className="py-2 text-sm text-gray-600 space-y-2">
                        <p>通过后，该条订单支付成功，对应的账单会归属到当前结算单元下</p>
                        <p>确认通过？</p>
                    </div>
                    <DialogFooter className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setApproveDialog(null)}>取消</Button>
                        <Button className="bg-[#0066FF] hover:bg-[#0052cc] text-white" onClick={confirmApprove}>确定</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 订单审批拒绝确认 */}
            <Dialog open={!!rejectDialog} onOpenChange={(open) => !open && setRejectDialog(null)}>
                <DialogContent className="max-w-[380px]">
                    <DialogHeader>
                        <DialogTitle className="text-base font-medium">拒绝</DialogTitle>
                        <DialogDescription className="sr-only">审批拒绝该三方订单</DialogDescription>
                    </DialogHeader>
                    <div className="py-2 text-sm text-gray-600 space-y-2">
                        <p>拒绝后，该条订单将支付失败，不会在当前结算单元下产生费用</p>
                        <p>确认拒绝？</p>
                    </div>
                    <DialogFooter className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setRejectDialog(null)}>取消</Button>
                        <Button className="bg-[#0066FF] hover:bg-[#0052cc] text-white" onClick={confirmReject}>确定</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 关联三方结算：开通申请审批通过确认 */}
            <Dialog open={!!settleApproveDialog} onOpenChange={(open) => !open && setSettleApproveDialog(null)}>
                <DialogContent className="max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-base font-medium">通过申请</DialogTitle>
                        <DialogDescription className="sr-only">审批通过该开通组织支付申请</DialogDescription>
                    </DialogHeader>
                    <div className="py-2 text-sm text-gray-600 space-y-2">
                        {settleApproveDialog && (
                            <p>确认通过「{settleApproveDialog.subjectName}」与「{settleApproveDialog.unitName}」的三方结算关联申请？</p>
                        )}
                        <p>通过后，该关联将进入「已通过」列表，成员可在三方产品使用该结算单元付费。</p>
                    </div>
                    <DialogFooter className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setSettleApproveDialog(null)}>取消</Button>
                        <Button className="bg-[#0066FF] hover:bg-[#0052cc] text-white" onClick={confirmSettleApprove}>确定</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 关联三方结算：开通申请审批拒绝确认 */}
            <Dialog open={!!settleRejectDialog} onOpenChange={(open) => !open && setSettleRejectDialog(null)}>
                <DialogContent className="max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-base font-medium">拒绝申请</DialogTitle>
                        <DialogDescription className="sr-only">审批拒绝该开通组织支付申请</DialogDescription>
                    </DialogHeader>
                    <div className="py-2 text-sm text-gray-600 space-y-3">
                        {settleRejectDialog && (
                            <p>确认拒绝「{settleRejectDialog.subjectName}」与「{settleRejectDialog.unitName}」的三方结算关联申请？</p>
                        )}
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">拒绝原因（选填）</label>
                            <textarea
                                value={settleRejectReason}
                                onChange={(e) => setSettleRejectReason(e.target.value)}
                                placeholder="请输入拒绝原因"
                                className="w-full h-20 px-3 py-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setSettleRejectDialog(null)}>取消</Button>
                        <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={confirmSettleReject}>确定拒绝</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
