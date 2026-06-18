"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    User,
    ChevronDown,
    ChevronRight,
    Plus,
    Search,
    MessageSquare,
    Crown,
    Shield,
    UserCheck,
    FolderOpen,
    Folder,
    LogOut,
    Building2,
    HelpCircle,
    Info,
    Users,
    Network,
    CreditCard,
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

// 用户角色类型
type UserRole = 'owner' | 'admin' | 'member';

// 角色配置
const roleConfig: Record<UserRole, { label: string; bgColor: string; icon: typeof Crown }> = {
    owner: { label: '主账号', bgColor: 'bg-blue-500', icon: Crown },
    admin: { label: '管理员', bgColor: 'bg-orange-500', icon: Shield },
    member: { label: '成员', bgColor: 'bg-green-500', icon: UserCheck },
};

// 访问控制子菜单 - 带图标
const accessControlMenu = [
    { name: '企业信息', key: 'info', icon: Info },
    { name: '成员管理', key: 'members', icon: Users },
    { name: '组织机构', key: 'organization', icon: Network },
    { name: '结算单元', key: 'settlement', icon: CreditCard },
];

// 模拟企业信息数据
const enterpriseInfo = {
    name: "张三科技有限责任公司",
    shortName: "张三科技",
    creditCode: "91110108MA01XXXXX",
    legalPerson: "张三",
    industry: "互联网/软件",
    scale: "50-100人",
    address: "北京市海淀区中关村软件园二期",
    contactPhone: "010-12345678",
    contactEmail: "contact@zhangsan.tech",
    createdAt: "2024-01-15",
    status: "active" as const,
};

// 模拟成员数据
const membersData = [
    { id: '1', name: '张三', account: 'zhangsan', email: 'zhangsan@360.cn', phone: '138****1234', role: 'owner' as UserRole, department: '技术部', joinTime: '2024-01-15', status: 'active' },
    { id: '2', name: '李四', account: 'lisi', email: 'lisi@360.cn', phone: '139****5678', role: 'admin' as UserRole, department: '产品部', joinTime: '2024-02-20', status: 'active' },
    { id: '3', name: '王五', account: 'wangwu', email: 'wangwu@360.cn', phone: '137****9012', role: 'member' as UserRole, department: '研发部', joinTime: '2024-03-10', status: 'active' },
    { id: '4', name: '赵六', account: 'zhaoliu', email: 'zhaoliu@360.cn', phone: '136****3456', role: 'member' as UserRole, department: '运营部', joinTime: '2024-03-15', status: 'active' },
    { id: '5', name: '孙七', account: 'sunqi', email: 'sunqi@360.cn', phone: '135****7890', role: 'member' as UserRole, department: '市场部', joinTime: '2024-04-01', status: 'inactive' },
    { id: '6', name: '周八', account: 'zhouba', email: 'zhouba@360.cn', phone: '134****2345', role: 'member' as UserRole, department: '研发部', joinTime: '2024-04-15', status: 'active' },
    { id: '7', name: '吴九', account: 'wujiu', email: 'wujiu@360.cn', phone: '133****6789', role: 'member' as UserRole, department: '测试部', joinTime: '2024-05-01', status: 'active' },
    { id: '8', name: '郑十', account: 'zhengshi', email: 'zhengshi@360.cn', phone: '132****0123', role: 'member' as UserRole, department: '运维部', joinTime: '2024-05-15', status: 'active' },
];

// 模拟组织机构数据
interface OrgNode {
    id: string;
    name: string;
    manager?: string;
    memberCount: number;
    children?: OrgNode[];
}

const organizationData: OrgNode[] = [
    {
        id: '1',
        name: '张三科技',
        manager: '张三',
        memberCount: 45,
        children: [
            {
                id: '1-1',
                name: '技术中心',
                manager: '李四',
                memberCount: 20,
                children: [
                    { id: '1-1-1', name: '研发部', memberCount: 12 },
                    { id: '1-1-2', name: '测试部', memberCount: 5 },
                    { id: '1-1-3', name: '运维部', memberCount: 3 },
                ]
            },
            {
                id: '1-2',
                name: '产品中心',
                manager: '王五',
                memberCount: 10,
                children: [
                    { id: '1-2-1', name: '产品设计部', memberCount: 6 },
                    { id: '1-2-2', name: '用户研究部', memberCount: 4 },
                ]
            },
            {
                id: '1-3',
                name: '运营中心',
                memberCount: 15,
                children: [
                    { id: '1-3-1', name: '市场部', memberCount: 8 },
                    { id: '1-3-2', name: '客服部', memberCount: 7 },
                ]
            },
        ]
    }
];

// 模拟结算单元数据
const settlementUnits = [
    { id: '6046', name: '技术中心结算单元', managers: ['1', '2'], department: '360集团/技术中心', resourceCount: 5, createTime: '2024-01-20', status: 'active' },
    { id: '5657', name: '产品中心结算单元', managers: ['3'], department: '360集团/产品中心', resourceCount: 3, createTime: '2024-02-15', status: 'active' },
    { id: '5133', name: '运营中心结算单元', managers: ['4'], department: '360集团/运营中心', resourceCount: 4, createTime: '2024-03-01', status: 'active' },
    { id: '2094', name: '综合管理结算单元', managers: ['1'], department: '360集团', resourceCount: 0, createTime: '2024-05-01', status: 'active' },
];

// 企业列表 - 与zhiqi console完全一致
const enterpriseList = [
    { 
        id: 1, 
        name: "张三", 
        icon: "企", 
        role: 'owner' as UserRole,
        active: true,
    },
    { 
        id: 2, 
        name: "李四", 
        icon: "企", 
        role: 'admin' as UserRole,
        active: false,
    },
    { 
        id: 3, 
        name: "王五", 
        icon: "企", 
        role: 'member' as UserRole,
        active: false,
    },
];

export default function OrganizationPage() {
    const router = useRouter();
    const [username, setUsername] = useState('未登录');
    const [currentUserRole, setCurrentUserRole] = useState<UserRole>('owner');
    const [activeMenu, setActiveMenu] = useState('info');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [enterpriseDialogOpen, setEnterpriseDialogOpen] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState(enterpriseList[0]);
    const [hasPermission, setHasPermission] = useState(true);
    const [permissionChecked, setPermissionChecked] = useState(false);
    
    // 切换企业失败提示弹框
    const [switchFailDialogOpen, setSwitchFailDialogOpen] = useState(false);
    const [switchFailMessage, setSwitchFailMessage] = useState('');
    
    // 分页状态
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    // 企业信息编辑状态
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(enterpriseInfo);
    
    // 成员管理状态
    const [memberSearch, setMemberSearch] = useState('');
    const [memberList, setMemberList] = useState(membersData);
    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', account: '', email: '', phone: '', role: 'member' as UserRole, department: '' });
    
    // 组织机构状态
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '1-1']));
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    
    // 结算单元状态
    const [settlementSearch, setSettlementSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [addSettlementDialogOpen, setAddSettlementDialogOpen] = useState(false);
    const [newSettlement, setNewSettlement] = useState({ name: '', managers: [] as string[] });
    const [managerDropdownOpen, setManagerDropdownOpen] = useState(false);
    const [settlementList, setSettlementList] = useState(settlementUnits);
    
    // 编辑结算单元状态
    const [editSettlementDialogOpen, setEditSettlementDialogOpen] = useState(false);
    const [editingSettlement, setEditingSettlement] = useState<{ id: string; name: string; managers: string[] }>({ id: '', name: '', managers: [] });
    const [editManagerDropdownOpen, setEditManagerDropdownOpen] = useState(false);
    
    // 删除确认弹框状态
    const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
    const [deletingSettlement, setDeletingSettlement] = useState<{ id: string; name: string } | null>(null);

    // 初始化 - 与zhiqi console打通
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
        
        // 检查当前选中企业的角色权限
        const currentEnterprise = enterpriseList.find(e => e.id === selectedEnterprise.id) || enterpriseList[0];
        if (currentEnterprise.role === 'member') {
            setHasPermission(false);
        } else {
            setHasPermission(true);
        }
        setPermissionChecked(true);
    }, [router]);

    // 企业切换处理 - 检查角色权限
    const handleEnterpriseSwitch = (enterprise: typeof enterpriseList[0]) => {
        if (enterprise.role === 'member') {
            setSwitchFailMessage('员工角色无权访问组织管理，请切换到管理员或主账号身份的企业');
            setSwitchFailDialogOpen(true);
            return;
        }
        setSelectedEnterprise(enterprise);
        setEnterpriseDialogOpen(false);
    };

    // 退出登录
    const handleLogout = () => {
        localStorage.removeItem('zhiqi_logged_in');
        localStorage.removeItem('zhiqi_user_info');
        window.location.href = '/';
    };

    // 切换组织节点展开状态
    const toggleNode = (nodeId: string) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    // 渲染组织树节点
    const renderOrgNode = (node: OrgNode, level: number = 0) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes.has(node.id);
        const isSelected = selectedNode === node.id;

        return (
            <div key={node.id}>
                <div
                    className={`flex items-center py-2 px-3 rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    style={{ paddingLeft: `${level * 24 + 12}px` }}
                    onClick={() => setSelectedNode(node.id)}
                >
                    {hasChildren && (
                        <button
                            className="w-5 h-5 flex items-center justify-center mr-1 hover:bg-gray-100 rounded"
                            onClick={(e) => { e.stopPropagation(); toggleNode(node.id); }}
                        >
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                        </button>
                    )}
                    {!hasChildren && <span className="w-6" />}
                    {hasChildren ? (
                        <FolderOpen className="w-4 h-4 text-blue-500 mr-2" />
                    ) : (
                        <Folder className="w-4 h-4 text-gray-400 mr-2" />
                    )}
                    <span className="flex-1 text-sm text-gray-700">{node.name}</span>
                    {node.manager && (
                        <span className="text-xs text-gray-400 mr-2">{node.manager}</span>
                    )}
                    <span className="text-xs text-gray-400">{node.memberCount}人</span>
                </div>
                {hasChildren && isExpanded && (
                    <div>
                        {node.children!.map(child => renderOrgNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    // 过滤成员
    const filteredMembers = memberList.filter(m =>
        m.name.includes(memberSearch) ||
        m.account.includes(memberSearch) ||
        m.email.includes(memberSearch)
    );

    // 过滤结算单元
    const filteredSettlements = settlementList.filter(s => {
        const matchSearch = s.name.includes(settlementSearch) || s.id.includes(settlementSearch);
        const matchDept = !departmentFilter || s.department.includes(departmentFilter);
        return matchSearch && matchDept;
    });

    // 分页数据
    const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const paginatedSettlements = filteredSettlements.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // 渲染企业信息Tab
    const renderInfoContent = () => (
        <div className="bg-white rounded border border-gray-200">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">企业基本信息</h3>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? '取消' : '编辑'}
                </Button>
            </div>
            <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">企业名称</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                        ) : (
                            <p className="text-sm text-gray-900">{enterpriseInfo.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">企业简称</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editForm.shortName}
                                onChange={(e) => setEditForm({ ...editForm, shortName: e.target.value })}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                        ) : (
                            <p className="text-sm text-gray-900">{enterpriseInfo.shortName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">统一社会信用代码</label>
                        <p className="text-sm text-gray-900">{enterpriseInfo.creditCode}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">法定代表人</label>
                        <p className="text-sm text-gray-900">{enterpriseInfo.legalPerson}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">所属行业</label>
                        {isEditing ? (
                            <select
                                value={editForm.industry}
                                onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option>互联网/软件</option>
                                <option>金融</option>
                                <option>教育</option>
                                <option>医疗</option>
                                <option>制造业</option>
                            </select>
                        ) : (
                            <p className="text-sm text-gray-900">{enterpriseInfo.industry}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">企业规模</label>
                        {isEditing ? (
                            <select
                                value={editForm.scale}
                                onChange={(e) => setEditForm({ ...editForm, scale: e.target.value })}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option>1-50人</option>
                                <option>50-100人</option>
                                <option>100-500人</option>
                                <option>500人以上</option>
                            </select>
                        ) : (
                            <p className="text-sm text-gray-900">{enterpriseInfo.scale}</p>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-500 mb-1">企业地址</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editForm.address}
                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                        ) : (
                            <p className="text-sm text-gray-900">{enterpriseInfo.address}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">联系电话</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editForm.contactPhone}
                                onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                        ) : (
                            <p className="text-sm text-gray-900">{enterpriseInfo.contactPhone}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">联系邮箱</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editForm.contactEmail}
                                onChange={(e) => setEditForm({ ...editForm, contactEmail: e.target.value })}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                        ) : (
                            <p className="text-sm text-gray-900">{enterpriseInfo.contactEmail}</p>
                        )}
                    </div>
                </div>
                {isEditing && (
                    <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsEditing(false)}>
                            保存修改
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );

    // 渲染成员管理内容
    const renderMembersContent = () => (
        <div className="bg-white rounded border border-gray-200">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="请输入成员姓名或账号搜索"
                            value={memberSearch}
                            onChange={(e) => { setMemberSearch(e.target.value); setCurrentPage(1); }}
                            className="h-8 pl-9 pr-4 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 w-64"
                        />
                    </div>
                    <select 
                        className="h-8 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                        value={departmentFilter}
                        onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="">全部部门</option>
                        <option value="技术部">技术部</option>
                        <option value="产品部">产品部</option>
                        <option value="运营部">运营部</option>
                        <option value="市场部">市场部</option>
                    </select>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8" onClick={() => setAddMemberDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    添加成员
                </Button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">成员名称</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">账号</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">邮箱</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">角色</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">所属部门</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedMembers.map((member) => {
                            const RoleIcon = roleConfig[member.role].icon;
                            return (
                                <tr key={member.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                                                <span className="text-white text-xs">{member.name[0]}</span>
                                            </div>
                                            <span className="text-sm text-gray-900">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">{member.account}</td>
                                    <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                                    <td className="px-5 py-3 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-white ${roleConfig[member.role].bgColor}`}>
                                            <RoleIcon className="w-3 h-3" />
                                            {roleConfig[member.role].label}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">{member.department}</td>
                                    <td className="px-5 py-3 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${member.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {member.status === 'active' ? '正常' : '停用'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            <button className="text-blue-600 hover:text-blue-700 text-sm">管理</button>
                                            <span className="text-gray-300">|</span>
                                            <button className="text-blue-600 hover:text-blue-700 text-sm">编辑</button>
                                            <span className="text-gray-300">|</span>
                                            <button className="text-red-500 hover:text-red-600 text-sm">删除</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                    共 {filteredMembers.length} 条记录 第 {currentPage} / {Math.ceil(filteredMembers.length / pageSize) || 1} 页
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                        上一页
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">{currentPage}</button>
                    <button 
                        className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        disabled={currentPage >= Math.ceil(filteredMembers.length / pageSize)}
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredMembers.length / pageSize), p + 1))}
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
    );

    // 渲染组织机构内容
    const renderOrganizationContent = () => (
        <div className="bg-white rounded border border-gray-200">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="请输入部门名称搜索"
                            className="h-8 pl-9 pr-4 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 w-64"
                        />
                    </div>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8">
                    <Plus className="w-4 h-4 mr-1" />
                    添加部门
                </Button>
            </div>
            
            <div className="p-4 min-h-[400px]">
                {organizationData.map(node => renderOrgNode(node))}
            </div>
        </div>
    );

    // 渲染结算单元内容
    const renderSettlementContent = () => (
        <div className="bg-white rounded border border-gray-200">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="请输入结算单元ID或名称搜索"
                            value={settlementSearch}
                            onChange={(e) => { setSettlementSearch(e.target.value); setCurrentPage(1); }}
                            className="h-8 pl-9 pr-4 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 w-64"
                        />
                    </div>
                    <select 
                        className="h-8 px-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 min-w-[200px]"
                        value={departmentFilter}
                        onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="">全部部门</option>
                        <option value="技术中心">技术中心</option>
                        <option value="产品中心">产品中心</option>
                        <option value="运营中心">运营中心</option>
                    </select>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8" onClick={() => setAddSettlementDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    创建结算单元
                </Button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">结算单元名称</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">负责人</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">资源组数量</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedSettlements.map((unit) => (
                            <tr key={unit.id} className="hover:bg-gray-50">
                                <td className="px-5 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">{unit.name}</span>
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-1 flex-wrap">
                                        {unit.managers.slice(0, 3).map(managerId => {
                                            const member = membersData.find(m => m.id === managerId);
                                            return member ? (
                                                <span key={managerId} className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                                                    {member.name}
                                                </span>
                                            ) : null;
                                        })}
                                        {unit.managers.length > 3 && (
                                            <span className="text-xs text-gray-400">+{unit.managers.length - 3}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                    <a 
                                        href="https://console.zyun.360.cn/accessmanage/resource" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        {unit.resourceCount}
                                    </a>
                                </td>
                                <td className="px-5 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-1">
                                        <button 
                                            className="text-blue-600 hover:text-blue-700 text-sm"
                                            onClick={() => {
                                                setEditingSettlement({
                                                    id: unit.id,
                                                    name: unit.name,
                                                    managers: [...unit.managers]
                                                });
                                                setEditSettlementDialogOpen(true);
                                            }}
                                        >编辑</button>
                                        <span className="text-gray-300">|</span>
                                        <a 
                                            href="https://console.zyun.360.cn/accessmanage/resource" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 text-sm"
                                        >
                                            资源组管理
                                        </a>
                                        <span className="text-gray-300">|</span>
                                        <button 
                                            className={`text-sm ${unit.resourceCount > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-600'}`}
                                            disabled={unit.resourceCount > 0}
                                            onClick={() => {
                                                if (unit.resourceCount === 0) {
                                                    setDeletingSettlement({ id: unit.id, name: unit.name });
                                                    setDeleteConfirmDialogOpen(true);
                                                }
                                            }}
                                        >
                                            删除
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                    共 {filteredSettlements.length} 条记录 第 {currentPage} / {Math.ceil(filteredSettlements.length / pageSize) || 1} 页
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                        上一页
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">{currentPage}</button>
                    <button 
                        className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        disabled={currentPage >= Math.ceil(filteredSettlements.length / pageSize)}
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredSettlements.length / pageSize), p + 1))}
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
    );

    return (
        <div className="min-h-screen bg-[#f5f7fa] overflow-x-hidden">
            {/* 顶部导航栏 - 与zhiqi console完全一致 */}
            <header className="fixed top-0 left-0 right-0 h-[50px] bg-white z-[1000] flex items-center justify-between px-4 border-b border-gray-100">
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
                        <div className="flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-50 text-sm">
                            <span className="w-4 h-4 bg-[#006bff] rounded text-white text-xs flex items-center justify-center mr-2">{selectedEnterprise.icon}</span>
                            <span className="text-gray-700">{selectedEnterprise.name}</span>
                            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    {/* 功能入口 */}
                    <a
                        href="/console/cost"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">费用
                    </a>
                    <Link href="#" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">工单</Link>
                    <Link href="#" className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 mr-2">帮助</Link>
                    {/* 分隔线 */}
                    <div className="w-px h-5 bg-gray-300 mx-3"></div>
                    {/* 用户入口 */}
                    <div className="relative">
                        <div
                            className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <span className="text-sm text-gray-500">{username}</span>
                            <span className={`ml-2 px-2 py-0.5 text-white text-xs rounded ${roleConfig[selectedEnterprise.role].bgColor}`}>
                                {roleConfig[selectedEnterprise.role].label}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 ml-1 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                        </div>
                        {/* 用户下拉菜单 */}
                        {userMenuOpen && (
                            <>
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

            {/* 左侧导航栏 - 带图标的菜单 */}
            <aside className="fixed left-0 top-[50px] h-[calc(100vh-50px)] w-[200px] bg-white z-[999] border-r border-gray-200">
                {/* 组织管理模块 */}
                <div className="p-3">
                    <div className="px-3 py-2 text-sm font-medium text-gray-800 border-b border-gray-100 mb-2">组织管理</div>
                    {accessControlMenu.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.key}
                                onClick={() => setActiveMenu(item.key)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded ${
                                    activeMenu === item.key
                                        ? 'bg-[#006bff] text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {item.name}
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* 主内容区 */}
            <main className="pt-[50px] pl-[200px]">
                <div className="p-4">
                    {/* 内容区域 */}
                    <div>
                        {activeMenu === 'info' && renderInfoContent()}
                        {activeMenu === 'members' && renderMembersContent()}
                        {activeMenu === 'organization' && renderOrganizationContent()}
                        {activeMenu === 'settlement' && renderSettlementContent()}
                    </div>
                </div>
            </main>

            {/* 右下角悬浮按钮 */}
            <div className="fixed right-5 bottom-5 flex flex-col gap-3 z-40">
                <button className="w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-[#0066FF] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700">
                    <MessageSquare className="w-5 h-5" />
                </button>
            </div>

            {/* 企业切换弹窗 - 与zhiqi console完全一致 */}
            <Dialog open={enterpriseDialogOpen} onOpenChange={setEnterpriseDialogOpen}>
                <DialogContent className="max-w-md p-0">
                    {/* 标题区域 */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-500" />
                                <span className="text-lg font-semibold text-gray-900">选择企业</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">请选择要切换的企业账号</p>
                        </div>
                    </div>
                    {/* 企业列表 */}
                    <div className="p-4 space-y-2">
                        {enterpriseList.map((enterprise) => (
                            <button
                                key={enterprise.id}
                                onClick={() => handleEnterpriseSwitch(enterprise)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                                    selectedEnterprise.id === enterprise.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                                <span
                                    className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm ${
                                        selectedEnterprise.id === enterprise.id ? "bg-blue-600" : "bg-gray-400"
                                    }`}
                                >
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
                                    <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                                        ✓
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* 添加成员弹窗 */}
            <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>添加成员</DialogTitle>
                        <DialogDescription>填写成员信息，添加到企业组织</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">姓名</label>
                            <input
                                type="text"
                                value={newMember.name}
                                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                placeholder="请输入姓名"
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">账号</label>
                            <input
                                type="text"
                                value={newMember.account}
                                onChange={(e) => setNewMember({ ...newMember, account: e.target.value })}
                                placeholder="请输入账号"
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">邮箱</label>
                            <input
                                type="email"
                                value={newMember.email}
                                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                placeholder="请输入邮箱"
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">角色</label>
                            <select
                                value={newMember.role}
                                onChange={(e) => setNewMember({ ...newMember, role: e.target.value as UserRole })}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="member">成员</option>
                                <option value="admin">管理员</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">部门</label>
                            <select
                                value={newMember.department}
                                onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">请选择部门</option>
                                <option value="技术部">技术部</option>
                                <option value="产品部">产品部</option>
                                <option value="运营部">运营部</option>
                                <option value="市场部">市场部</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddMemberDialogOpen(false)}>取消</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setAddMemberDialogOpen(false)}>确认添加</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 新建结算单元弹窗 */}
            <Dialog open={addSettlementDialogOpen} onOpenChange={(open) => {
                setAddSettlementDialogOpen(open);
                if (!open) {
                    setNewSettlement({ name: '', managers: [] });
                    setManagerDropdownOpen(false);
                }
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>创建结算单元</DialogTitle>
                        <DialogDescription>创建新的结算单元，用于部门独立核算</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                <span className="text-red-500 mr-0.5">*</span>
                                结算单元名称
                                <span className="text-gray-400 text-xs ml-1">（100个字符以内）</span>
                            </label>
                            <input
                                type="text"
                                value={newSettlement.name}
                                onChange={(e) => {
                                    const value = e.target.value.slice(0, 100);
                                    setNewSettlement({ ...newSettlement, name: value });
                                }}
                                placeholder="请输入结算单元名称"
                                maxLength={100}
                                className={`w-full h-8 px-3 border rounded text-sm focus:outline-none ${!newSettlement.name && newSettlement.name.length === 0 ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                            />
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-red-500">
                                    {!newSettlement.name && '请输入结算单元名称'}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {newSettlement.name.length}/100
                                </span>
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm text-gray-700 mb-1">
                                <span className="text-red-500 mr-0.5">*</span>
                                负责人
                            </label>
                            <div
                                className={`w-full min-h-[32px] px-3 py-1 border rounded text-sm cursor-pointer flex items-center flex-wrap gap-1 ${newSettlement.managers.length === 0 ? 'border-red-300' : 'border-gray-300'} focus-within:border-blue-500`}
                                onClick={() => setManagerDropdownOpen(!managerDropdownOpen)}
                            >
                                {newSettlement.managers.length === 0 ? (
                                    <span className="text-gray-400">请选择负责人</span>
                                ) : (
                                    newSettlement.managers.map(managerId => {
                                        const member = membersData.find(m => m.id === managerId);
                                        return member ? (
                                            <span
                                                key={managerId}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                                            >
                                                {member.name}
                                                <span
                                                    className="hover:bg-blue-100 rounded"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setNewSettlement({
                                                            ...newSettlement,
                                                            managers: newSettlement.managers.filter(id => id !== managerId)
                                                        });
                                                    }}
                                                >
                                                    ×
                                                </span>
                                            </span>
                                        ) : null;
                                    })
                                )}
                                <ChevronDown className="ml-auto w-4 h-4 text-gray-400" />
                            </div>
                            {managerDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {membersData.filter(m => m.status === 'active').map(member => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newManagers = newSettlement.managers.includes(member.id)
                                                    ? newSettlement.managers.filter(id => id !== member.id)
                                                    : [...newSettlement.managers, member.id];
                                                setNewSettlement({ ...newSettlement, managers: newManagers });
                                            }}
                                        >
                                            <div className={`w-4 h-4 border rounded flex items-center justify-center ${newSettlement.managers.includes(member.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                                {newSettlement.managers.includes(member.id) && (
                                                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-sm">{member.name}</span>
                                            <span className="text-xs text-gray-400">({member.department})</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {newSettlement.managers.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">请选择负责人</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setAddSettlementDialogOpen(false);
                            setNewSettlement({ name: '', managers: [] });
                            setManagerDropdownOpen(false);
                        }}>取消</Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700" 
                            disabled={!newSettlement.name.trim() || newSettlement.managers.length === 0}
                            onClick={() => {
                                // 创建新结算单元
                                const newUnit = {
                                    id: Date.now().toString().slice(-4),
                                    name: newSettlement.name.trim(),
                                    managers: newSettlement.managers,
                                    department: '360集团',
                                    resourceCount: 0,
                                    createTime: new Date().toISOString().split('T')[0],
                                    status: 'active' as const,
                                };
                                setSettlementList(prev => [...prev, newUnit]);
                                setAddSettlementDialogOpen(false);
                                setNewSettlement({ name: '', managers: [] });
                                setManagerDropdownOpen(false);
                            }}
                        >确认创建</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 编辑结算单元弹窗 */}
            <Dialog open={editSettlementDialogOpen} onOpenChange={(open) => {
                setEditSettlementDialogOpen(open);
                if (!open) {
                    setEditingSettlement({ id: '', name: '', managers: [] });
                    setEditManagerDropdownOpen(false);
                }
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>编辑结算单元</DialogTitle>
                        <DialogDescription>修改结算单元信息</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                <span className="text-red-500 mr-0.5">*</span>
                                结算单元名称
                                <span className="text-gray-400 text-xs ml-1">（100个字符以内）</span>
                            </label>
                            <input
                                type="text"
                                value={editingSettlement.name}
                                onChange={(e) => {
                                    const value = e.target.value.slice(0, 100);
                                    setEditingSettlement({ ...editingSettlement, name: value });
                                }}
                                placeholder="请输入结算单元名称"
                                maxLength={100}
                                className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                {editingSettlement.name.length}/100
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm text-gray-700 mb-1">
                                <span className="text-red-500 mr-0.5">*</span>
                                负责人
                            </label>
                            <div
                                className={`w-full min-h-[32px] px-3 py-1 border rounded text-sm cursor-pointer flex items-center flex-wrap gap-1 ${editingSettlement.managers.length === 0 ? 'border-red-300' : 'border-gray-300'} focus-within:border-blue-500`}
                                onClick={() => setEditManagerDropdownOpen(!editManagerDropdownOpen)}
                            >
                                {editingSettlement.managers.length === 0 ? (
                                    <span className="text-gray-400">请选择负责人</span>
                                ) : (
                                    editingSettlement.managers.map(managerId => {
                                        const member = membersData.find(m => m.id === managerId);
                                        return member ? (
                                            <span
                                                key={managerId}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                                            >
                                                {member.name}
                                                <span
                                                    className="hover:bg-blue-100 rounded"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingSettlement({
                                                            ...editingSettlement,
                                                            managers: editingSettlement.managers.filter(id => id !== managerId)
                                                        });
                                                    }}
                                                >
                                                    ×
                                                </span>
                                            </span>
                                        ) : null;
                                    })
                                )}
                                <ChevronDown className="ml-auto w-4 h-4 text-gray-400" />
                            </div>
                            {editManagerDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {membersData.filter(m => m.status === 'active').map(member => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newManagers = editingSettlement.managers.includes(member.id)
                                                    ? editingSettlement.managers.filter(id => id !== member.id)
                                                    : [...editingSettlement.managers, member.id];
                                                setEditingSettlement({ ...editingSettlement, managers: newManagers });
                                            }}
                                        >
                                            <div className={`w-4 h-4 border rounded flex items-center justify-center ${editingSettlement.managers.includes(member.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                                                {editingSettlement.managers.includes(member.id) && (
                                                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-sm">{member.name}</span>
                                            <span className="text-xs text-gray-400">({member.department})</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {editingSettlement.managers.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">请选择负责人</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setEditSettlementDialogOpen(false);
                            setEditingSettlement({ id: '', name: '', managers: [] });
                            setEditManagerDropdownOpen(false);
                        }}>取消</Button>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700" 
                            disabled={!editingSettlement.name.trim() || editingSettlement.managers.length === 0}
                            onClick={() => {
                                // 更新结算单元
                                setSettlementList(prev => prev.map(item => 
                                    item.id === editingSettlement.id 
                                        ? { ...item, name: editingSettlement.name.trim(), managers: editingSettlement.managers }
                                        : item
                                ));
                                setEditSettlementDialogOpen(false);
                                setEditingSettlement({ id: '', name: '', managers: [] });
                                setEditManagerDropdownOpen(false);
                            }}
                        >保存</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 删除确认弹框 */}
            <Dialog open={deleteConfirmDialogOpen} onOpenChange={setDeleteConfirmDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>确认删除</DialogTitle>
                        <DialogDescription>
                            确定要删除结算单元「{deletingSettlement?.name}」吗？此操作不可恢复。
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setDeleteConfirmDialogOpen(false);
                            setDeletingSettlement(null);
                        }}>取消</Button>
                        <Button 
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => {
                                // 删除结算单元
                                if (deletingSettlement) {
                                    setSettlementList(prev => prev.filter(item => item.id !== deletingSettlement.id));
                                }
                                setDeleteConfirmDialogOpen(false);
                                setDeletingSettlement(null);
                            }}
                        >确认删除</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 切换企业失败提示弹框 */}
            <Dialog open={switchFailDialogOpen} onOpenChange={setSwitchFailDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>无法切换企业</DialogTitle>
                        <DialogDescription>
                            {switchFailMessage}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setSwitchFailDialogOpen(false)}>我知道了</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 无权限提示弹框 */}
            <Dialog open={!hasPermission && permissionChecked} onOpenChange={() => {}}>
                <DialogContent className="max-w-sm" onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>无访问权限</DialogTitle>
                        <DialogDescription>
                            您当前是员工角色，无权访问组织管理页面。请切换到管理员或主账号身份的企业后再访问。
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => router.push('/console')}>返回控制台</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
