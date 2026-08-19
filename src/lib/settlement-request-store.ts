// 开通组织支付申请（关联三方结算）共享 store
// console 端提交申请 -> zyun 端「关联三方结算管理」待审批列表

// 申请状态：pending=待审批 / approved=已通过 / rejected=已拒绝
export type SettlementRequestStatus = 'pending' | 'approved' | 'rejected';

// 一条申请/绑定记录，字段与 zyun 绑定关系表保持一致
export interface SettlementRequest {
    id: string;
    unitName: string;        // 结算单元名称
    resourceGroup: string;   // 资源组
    subjectType: string;     // 关联主体类型：用户 / 组织机构
    subjectName: string;     // 关联主体名称
    subjectId: string;       // 关联主体ID
    remark: string;          // 备注 / 申请说明
    operator: string;        // 操作人（申请人 / 审批人）
    operateTime: string;     // 操作时间
    applicant?: string;      // 申请人（console 提交人）
    applyTime?: string;      // 申请时间
    status: SettlementRequestStatus;
    rejectReason?: string;   // 拒绝原因
}

// 存储 KEY
const STORAGE_KEY = 'zhiqi_settlement_requests';

// 时间格式化
const formatTime = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

// 生成唯一ID
const generateId = () => `SR${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

// 获取全部申请
export const getSettlementRequests = (): SettlementRequest[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return [];
        }
    }
    return [];
};

// 保存全部申请
export const saveSettlementRequests = (list: SettlementRequest[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

// console 端创建一条开通组织支付申请（默认待审批）
export const createSettlementRequest = (params: {
    unitName: string;
    resourceGroup?: string;
    subjectType?: string;
    subjectName: string;
    subjectId?: string;
    remark: string;
    applicant: string;
}): SettlementRequest => {
    const now = formatTime(new Date());
    const request: SettlementRequest = {
        id: generateId(),
        unitName: params.unitName,
        resourceGroup: params.resourceGroup || '- -',
        subjectType: params.subjectType || '组织机构',
        subjectName: params.subjectName,
        subjectId: params.subjectId || '- -',
        remark: params.remark,
        operator: params.applicant,
        operateTime: now,
        applicant: params.applicant,
        applyTime: now,
        status: 'pending',
    };
    const list = getSettlementRequests();
    saveSettlementRequests([request, ...list]);
    return request;
};

// 审批通过
export const approveSettlementRequest = (id: string, operator: string) => {
    const now = formatTime(new Date());
    const list = getSettlementRequests().map((r) =>
        r.id === id ? { ...r, status: 'approved' as SettlementRequestStatus, operator, operateTime: now } : r
    );
    saveSettlementRequests(list);
    return list;
};

// 审批拒绝
export const rejectSettlementRequest = (id: string, operator: string, rejectReason?: string) => {
    const now = formatTime(new Date());
    const list = getSettlementRequests().map((r) =>
        r.id === id ? { ...r, status: 'rejected' as SettlementRequestStatus, operator, operateTime: now, rejectReason } : r
    );
    saveSettlementRequests(list);
    return list;
};

// 各状态数量
export const getSettlementRequestCount = () => {
    const list = getSettlementRequests();
    return {
        pending: list.filter((r) => r.status === 'pending').length,
        approved: list.filter((r) => r.status === 'approved').length,
        rejected: list.filter((r) => r.status === 'rejected').length,
    };
};
