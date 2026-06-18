"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    ChevronDown,
    Plus,
    Search,
    Bell,
    HelpCircle,
    Grid,
    Home,
    Star,
    MessageSquare,
    Video,
    Mic,
    Image as ImageIcon,
    Database,
    Container,
    Cpu,
    Edit,
    Shield,
    Settings,
    Key,
    FileText,
    Gauge,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

// 左侧产品导航
const productNavItems = [
    { name: '最近', icon: Home },
    { name: '收藏', icon: Star },
    { name: 'APIMKT', icon: Grid },
    { name: '对话AIMI', icon: MessageSquare },
    { name: '互动RTC', icon: Video },
    { name: '直播LIVE', icon: Video },
    { name: '大数据DI', icon: Database },
    { name: '对象OBS', icon: Container },
    { name: '容器CRS', icon: Container },
    { name: '容器CIS', icon: Container },
    { name: 'ECS', icon: Cpu },
    { name: '记忆AMS', icon: Database },
    { name: 'AI开发TAI', icon: Cpu },
    { name: '标注TLP', icon: Edit },
    { name: '评测TEP', icon: Shield },
    { name: '模型TLM', icon: Cpu },
    { name: '模型TLG', icon: Cpu },
    { name: '视频VS', icon: Video },
    { name: '语音TTS', icon: Mic },
    { name: '语音ASR', icon: Mic },
    { name: '图像IC', icon: ImageIcon },
];

// 访问控制菜单 - 资源组管理模块
const accessControlMenu = [
    { name: '资源组管理', key: 'resource-group' },
    { name: '资源管理', key: 'resource' },
    { name: '权限管理', key: 'permission' },
    { name: '密钥管理', key: 'key' },
    { name: '操作审计', key: 'audit' },
    { name: '配额管理', key: 'quota' },
];

// 模拟资源组数据
const resourceGroupsData = [
    { 
        id: '6046', 
        name: '互联网产品事业群_游戏产品事业部_平台技术部-计费增减项资源组', 
        resourceCount: 0, 
        department: '360集团/互联网产品事业群.游戏产品事业部.平台技术部' 
    },
    { 
        id: '5657', 
        name: '游戏新平台', 
        resourceCount: 30, 
        department: '360集团/互联网产品事业群.游戏产品事业部.平台技术部' 
    },
    { 
        id: '5133', 
        name: 'Wargaming事业部-产品技术部-apicloud资源组', 
        resourceCount: 5, 
        department: '360集团/互联网产品事业群.游戏产品事业部.平台技术部' 
    },
    { 
        id: '5011', 
        name: '游戏大厅', 
        resourceCount: 2, 
        department: '360集团/互联网产品事业群.游戏产品事业部.平台技术部' 
    },
    { 
        id: '4468', 
        name: '游戏技术部-云舟观测默认资源组', 
        resourceCount: 2, 
        department: '360集团/互联网产品事业群.游戏产品事业部.平台技术部' 
    },
    { 
        id: '3918', 
        name: '游戏技术部的奇麟资源组', 
        resourceCount: 62, 
        department: '360集团/互联网产品事业群.游戏产品事业部.平台技术部' 
    },
    { 
        id: '3815', 
        name: 'hdp-game(dfs_shbt)', 
        resourceCount: 6, 
        department: '360集团/互联网产品事业群.游戏产品事业部.平台技术部' 
    },
    { 
        id: '2094', 
        name: '游戏技术部', 
        resourceCount: 221, 
        department: '360集团/互联网产品事业群.游戏产品事业部.平台技术部' 
    },
];

// 部门列表
const departments = [
    '互联网产品事业群.游戏产品事业部.平台技术部',
    '互联网产品事业群.游戏产品事业部.运营部',
    '技术中心.研发部',
    '技术中心.测试部',
];

export default function ResourceGroupPage() {
    const router = useRouter();
    const [username, setUsername] = useState('未登录');
    const [activeMenu, setActiveMenu] = useState('resource-group');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    
    // 搜索和筛选状态
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('互联网产品事业群.游戏产品事业部.平台技术部');
    
    // 分页状态
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    // 弹窗状态
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newResourceGroup, setNewResourceGroup] = useState({ name: '', department: '' });

    // 初始化
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('zhiqi_logged_in');
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        const userInfoStr = localStorage.getItem('zhiqi_user_info');
        if (userInfoStr) {
            try {
                const userInfo = JSON.parse(userInfoStr);
                setUsername(userInfo.account || userInfo.name || userInfo.phone || '用户');
            } catch (e) {
                setUsername('用户');
            }
        }
    }, [router]);

    // 退出登录
    const handleLogout = () => {
        localStorage.removeItem('zhiqi_logged_in');
        localStorage.removeItem('zhiqi_user_info');
        window.location.href = '/';
    };

    // 过滤资源组
    const filteredResourceGroups = resourceGroupsData.filter(rg => {
        const matchSearch = !searchKeyword || 
            rg.name.toLowerCase().includes(searchKeyword.toLowerCase()) || 
            rg.id.includes(searchKeyword);
        const matchDept = !selectedDepartment || rg.department.includes(selectedDepartment);
        return matchSearch && matchDept;
    });

    // 分页数据
    const paginatedData = filteredResourceGroups.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filteredResourceGroups.length / pageSize) || 1;

    return (
        <div className="min-h-screen bg-[#f0f2f5]">
            {/* 顶部导航栏 */}
            <header className="fixed top-0 left-0 right-0 h-[50px] bg-white z-[1000] flex items-center justify-between px-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                <div className="flex items-center">
                    <Link href="/" className="flex items-center mr-4">
                        <div className="flex items-center">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mr-1">
                                <path d="M14 2C7.37 2 2 7.37 2 14C2 20.63 7.37 26 14 26C16.95 26 19.7 24.95 21.8 23.1L20.3 21.6C18.6 23.1 16.4 24 14 24C8.48 24 4 19.52 4 14C4 8.48 8.48 4 14 4C16.5 4 18.7 4.9 20.4 6.4L21.9 4.9C19.75 2.95 17 2 14 2Z" fill="#0066FF" />
                                <path d="M22 6L24 10L20 10L22 6Z" fill="#0066FF" />
                                <path d="M14 6C10.13 6 7 9.13 7 13C7 16.87 10.13 20 14 20C16.1 20 18 19.1 19.2 17.7L17.8 16.3C17 17.3 15.6 18 14 18C11.24 18 9 15.76 9 13C9 10.24 11.24 8 14 8C15.4 8 16.7 8.5 17.6 9.4L19 8C17.6 6.7 15.9 6 14 6Z" fill="#00d4aa" />
                                <path d="M19 3L21 7L17 7L19 3Z" fill="#00d4aa" />
                            </svg>
                            <span className="text-[16px] font-bold text-gray-800">360</span>
                            <span className="text-[16px] font-bold text-[#0066FF] ml-0.5">智汇云</span>
                        </div>
                    </Link>
                    {/* 工作台和企业按钮 */}
                    <div className="flex items-center gap-2 ml-2">
                        <Link href="/console" className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded">
                            工作台总览
                        </Link>
                        <div className="flex items-center px-3 py-1.5 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
                            <span className="w-4 h-4 bg-[#0066FF] rounded text-white text-xs flex items-center justify-center mr-2">企</span>
                            <span className="text-sm text-gray-700">360集团</span>
                            <ChevronDown className="w-3 h-3 text-gray-500 ml-1" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <Link href="/console/cost" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">费用</Link>
                    <Link href="#" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">工单</Link>
                    <button className="relative px-3 py-1.5 text-gray-600 hover:text-gray-800">
                        <Bell className="w-4 h-4" />
                        <span className="absolute -top-0.5 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">97</span>
                    </button>
                    <Link href="#" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">帮助</Link>
                    <div className="w-px h-5 bg-gray-300 mx-2"></div>
                    <div className="relative">
                        <div 
                            className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <div className="w-7 h-7 rounded-full bg-[#0066FF] flex items-center justify-center mr-2">
                                <span className="text-white text-sm">{username?.[0]?.toUpperCase() || 'U'}</span>
                            </div>
                            <span className="text-sm text-gray-600">{username}</span>
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">子账号</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                        </div>
                        {userMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                                <button
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                    onClick={handleLogout}
                                >
                                    退出登录
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* 左侧导航 */}
            <aside className="fixed left-0 top-[50px] bottom-0 flex z-[999]">
                {/* 产品导航 */}
                <div className="w-12 bg-[#f8f9fa] border-r border-gray-200 flex flex-col py-2">
                    {productNavItems.slice(0, 21).map((item, index) => {
                        const Icon = item.icon;
                        const isRecent = index < 2;
                        return (
                            <button
                                key={item.name}
                                className={`w-12 h-9 flex items-center justify-center hover:bg-gray-200 ${
                                    isRecent ? 'text-gray-500' : 'text-gray-400'
                                }`}
                                title={item.name}
                            >
                                <Icon className="w-4 h-4" />
                            </button>
                        );
                    })}
                </div>
                
                {/* 访问控制模块 */}
                <div className="w-[160px] bg-white border-r border-gray-200 flex flex-col">
                    <div className="px-4 py-3 text-sm font-medium text-gray-800 border-b border-gray-100">
                        访问控制
                    </div>
                    <div className="flex-1 py-2">
                        {accessControlMenu.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setActiveMenu(item.key)}
                                className={`w-full flex items-center px-4 py-2 text-sm ${
                                    activeMenu === item.key
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* 主内容区 */}
            <main className="pt-[50px] pl-[208px]">
                <div className="p-4">
                    {/* 搜索和筛选栏 */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="请输入资源组ID或名称搜索"
                                    value={searchKeyword}
                                    onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(1); }}
                                    className="h-8 pl-9 pr-4 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 w-64"
                                />
                            </div>
                            <select 
                                className="h-8 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 min-w-[280px] text-gray-600"
                                value={selectedDepartment}
                                onChange={(e) => { setSelectedDepartment(e.target.value); setCurrentPage(1); }}
                            >
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button size="sm" className="bg-[#0066FF] hover:bg-blue-700 h-8" onClick={() => setCreateDialogOpen(true)}>
                                <Plus className="w-4 h-4 mr-1" />
                                创建资源组
                            </Button>
                            <Link href="#" className="text-sm text-[#0066FF] hover:text-blue-700 flex items-center gap-1">
                                <HelpCircle className="w-4 h-4" />
                                帮助文档
                            </Link>
                        </div>
                    </div>

                    {/* 资源组列表 */}
                    <div className="bg-white rounded border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#f5f7fa]">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">资源组名称</th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">资源组ID</th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">资源数量</th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">所属部门</th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedData.map((rg) => (
                                        <tr key={rg.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">{rg.name}</span>
                                            </td>
                                            <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">{rg.id}</td>
                                            <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">{rg.resourceCount}</td>
                                            <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">{rg.department}</td>
                                            <td className="px-5 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <button className="text-[#0066FF] hover:text-blue-700 text-sm">管理</button>
                                                    <span className="text-gray-300">|</span>
                                                    <button className="text-[#0066FF] hover:text-blue-700 text-sm">编辑</button>
                                                    <span className="text-gray-300">|</span>
                                                    <button className="text-red-500 hover:text-red-600 text-sm">删除</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* 分页 */}
                        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                                共 {filteredResourceGroups.length} 条记录 第 {currentPage} / {totalPages} 页
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                >
                                    上一页
                                </button>
                                <button className="px-3 py-1 bg-[#0066FF] text-white rounded text-sm">{currentPage}</button>
                                <button 
                                    className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                >
                                    下一页
                                </button>
                                <select 
                                    className="h-8 px-2 border border-gray-200 rounded text-sm text-gray-600"
                                    value={pageSize}
                                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                                >
                                    <option value="10">10条/页</option>
                                    <option value="20">20条/页</option>
                                    <option value="50">50条/页</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 右下角悬浮按钮 */}
            <div className="fixed right-5 bottom-5 flex flex-col gap-3 z-50">
                <button className="w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-[#0066FF] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700">
                    <MessageSquare className="w-5 h-5" />
                </button>
            </div>

            {/* 创建资源组弹窗 */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>创建资源组</DialogTitle>
                        <DialogDescription>创建新的资源组，用于管理云资源</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">资源组名称</label>
                            <input
                                type="text"
                                placeholder="请输入资源组名称"
                                value={newResourceGroup.name}
                                onChange={(e) => setNewResourceGroup({ ...newResourceGroup, name: e.target.value })}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">所属部门</label>
                            <select
                                value={newResourceGroup.department}
                                onChange={(e) => setNewResourceGroup({ ...newResourceGroup, department: e.target.value })}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">请选择部门</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>取消</Button>
                        <Button className="bg-[#0066FF] hover:bg-blue-700" onClick={() => setCreateDialogOpen(false)}>确认创建</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
