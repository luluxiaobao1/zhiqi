"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Bot,
    Brain,
    Zap,
    Shield,
    Users,
    MessageSquare,
    FileText,
    Code2,
    ChevronRight,
    ArrowRight,
    Check,
    Sparkles,
    Cpu,
    Menu,
    X,
    Rocket,
    Layers,
    Cloud,
    TrendingUp,
    Settings,
    Phone,
} from "lucide-react";

// 企业入口页面地址
const ENTERPRISE_URL = "/zhiqi/console";

export default function ZhiqiOfficialPage() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activePrice, setActivePrice] = useState<"year" | "month">("year");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 检查登录状态
    useEffect(() => {
        const loggedIn = localStorage.getItem("zhiqi_logged_in") === "true";
        setIsLoggedIn(loggedIn);
    }, []);

    // 跳转到工作台或登录页
    const handleStartOrLogin = () => {
        if (isLoggedIn) {
            window.location.href = ENTERPRISE_URL;
        } else {
            router.push("/login");
        }
    };

    // 退出登录
    const handleLogout = () => {
        localStorage.removeItem("zhiqi_logged_in");
        localStorage.removeItem("zhiqi_user_info");
        setIsLoggedIn(false);
        router.refresh();
    };

    const features = [
        {
            icon: <Brain className="w-6 h-6" />,
            title: "大模型能力",
            description: "接入主流大模型，文本生成、代码编写、数据分析",
        },
        {
            icon: <Bot className="w-6 h-6" />,
            title: "龙虾智能体",
            description: "云端龙虾开箱即用，快速创建专属AI助手",
        },
        {
            icon: <Cloud className="w-6 h-6" />,
            title: "云端部署",
            description: "无需本地部署，云端即开即用，降低运维成本",
        },
        {
            icon: <Layers className="w-6 h-6" />,
            title: "知识库管理",
            description: "企业知识库快速构建，智能检索与问答",
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "企业级安全",
            description: "多重安全防护，数据加密存储",
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "团队协作",
            description: "多人协作、知识共享、权限管理",
        },
    ];

    const lobsterFeatures = [
        { icon: <Zap className="w-5 h-5" />, title: "开箱即用", description: "注册即用，无需部署" },
        { icon: <Bot className="w-5 h-5" />, title: "多种模板", description: "内置丰富模板" },
        { icon: <Settings className="w-5 h-5" />, title: "灵活定制", description: "自定义能力" },
        { icon: <Cloud className="w-5 h-5" />, title: "云端运行", description: "7×24稳定服务" },
        { icon: <TrendingUp className="w-5 h-5" />, title: "效果追踪", description: "数据可视化" },
        { icon: <Shield className="w-5 h-5" />, title: "安全可靠", description: "企业级安全" },
    ];

    const scenarios = [
        { icon: <MessageSquare className="w-6 h-6" />, title: "智能客服", description: "龙虾客服7×24小时在线，自动应答常见问题" },
        { icon: <FileText className="w-6 h-6" />, title: "文档处理", description: "智能文档生成、摘要提取、翻译校对" },
        { icon: <Code2 className="w-6 h-6" />, title: "代码助手", description: "智能代码补全、代码审查、Bug诊断" },
        { icon: <Rocket className="w-6 h-6" />, title: "营销创作", description: "智能文案生成、创意策划、数据分析" },
    ];

    const pricingPlans = [
        {
            name: "个人版",
            description: "适合个人用户，快速体验AI能力",
            price: { month: 0, year: 0 },
            features: [
                "1个龙虾智能体",
                "基础大模型调用",
                "100次/月 对话次数",
                "基础知识库",
                "社区支持",
            ],
            cta: "免费开始",
            popular: false,
        },
        {
            name: "企业版",
            description: "适合中小团队，协作效率翻倍",
            price: { month: 299, year: 199 },
            features: [
                "10个龙虾智能体",
                "高级大模型调用",
                "10000次/月 对话次数",
                "高级知识库管理",
                "团队协作功能",
                "数据看板分析",
                "优先技术支持",
            ],
            cta: "立即购买",
            popular: true,
        },
        {
            name: "旗舰版",
            description: "适合大型企业，定制化服务",
            price: { month: "联系销售", year: "联系销售" },
            features: [
                "无限龙虾智能体",
                "全部大模型调用",
                "无限对话次数",
                "企业知识库定制",
                "私有化部署支持",
                "专属技术顾问",
                "SLA服务保障",
            ],
            cta: "联系我们",
            popular: false,
        },
    ];

    const stats = [
        { value: "10,000+", label: "企业用户" },
        { value: "100万+", label: "日均调用" },
        { value: "< 2秒", label: "响应速度" },
        { value: "99.9%", label: "服务可用性" },
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased">
            {/* 顶部导航 */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? "bg-white/95 backdrop-blur-sm border-b border-gray-100"
                        : "bg-transparent"
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">360智企</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-10">
                            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                产品能力
                            </a>
                            <a href="#lobster" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                云端龙虾
                            </a>
                            <a href="#scenarios" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                应用场景
                            </a>
                            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                定价
                            </a>
                        </nav>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            {isLoggedIn ? (
                                <>
                                    <a
                                        href={ENTERPRISE_URL}
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        工作台
                                    </a>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        退出
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => router.push("/login")}
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        登录
                                    </button>
                                    <button
                                        onClick={handleStartOrLogin}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                    >
                                        免费开始
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100">
                        <div className="px-6 py-4 space-y-3">
                            <a href="#features" className="block text-gray-600 hover:text-gray-900 text-sm" onClick={() => setMobileMenuOpen(false)}>产品能力</a>
                            <a href="#lobster" className="block text-gray-600 hover:text-gray-900 text-sm" onClick={() => setMobileMenuOpen(false)}>云端龙虾</a>
                            <a href="#scenarios" className="block text-gray-600 hover:text-gray-900 text-sm" onClick={() => setMobileMenuOpen(false)}>应用场景</a>
                            <a href="#pricing" className="block text-gray-600 hover:text-gray-900 text-sm" onClick={() => setMobileMenuOpen(false)}>定价</a>
                            <div className="pt-3 border-t border-gray-100 space-y-2">
                                {isLoggedIn ? (
                                    <>
                                        <a href={ENTERPRISE_URL} className="block text-center py-2 text-gray-600 text-sm">工作台</a>
                                        <button onClick={handleLogout} className="block w-full text-center py-2 text-gray-500 text-sm">退出</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => router.push("/login")} className="block w-full text-center py-2 text-gray-600 text-sm">登录</button>
                                        <button onClick={handleStartOrLogin} className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">免费开始</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative pt-24 pb-20 overflow-hidden">
                {/* 背景渐变 */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-blue-50/30 to-white pointer-events-none"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-blue-100/50 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto pt-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-blue-100 rounded-full text-sm text-blue-600 mb-8 shadow-sm">
                            <Bot className="w-4 h-4" />
                            <span>大模型 + 龙虾智能体</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-5">
                            大模型 + 龙虾
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">提升员工效率</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg text-gray-500 mb-6 max-w-2xl mx-auto leading-relaxed">
                            360智企以大模型为技术底座，龙虾智能体为核心服务，为企业提供一站式AI数字化服务，全方位赋能员工。
                        </p>

                        {/* Highlight */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 rounded-xl mb-10">
                            <Cloud className="w-4 h-4 text-cyan-500" />
                            <span className="text-cyan-700 font-medium text-sm">云端龙虾，开箱即用</span>
                            <Zap className="w-4 h-4 text-amber-500" />
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={handleStartOrLogin}
                                className="w-full sm:w-auto group px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                            >
                                免费开始使用
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {stats.map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl font-bold text-gray-900 mb-1">{item.value}</div>
                                <div className="text-sm text-gray-500">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* 产品展示 */}
                    <div className="mt-20">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden">
                            {/* 浏览器标题栏 */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="bg-white rounded-md px-4 py-1 text-xs text-gray-400 border border-gray-200">
                                        console.zyun.360.cn
                                    </div>
                                </div>
                            </div>

                            {/* 产品界面 */}
                            <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-gray-500">我的龙虾</span>
                                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                <Bot className="w-4 h-4 text-blue-500" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
                                        <div className="text-xs text-gray-400">已创建智能体</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-gray-500">大模型调用</span>
                                            <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                                                <Cpu className="w-4 h-4 text-violet-500" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 mb-1">8,234</div>
                                        <div className="text-xs text-emerald-500 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            ↑ 23% 本周
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-gray-500">员工效率</span>
                                            <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="w-4 h-4 text-cyan-500" />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 mb-1">+35%</div>
                                        <div className="text-xs text-gray-400">平均提升</div>
                                    </div>
                                </div>

                                {/* 聊天预览 */}
                                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm font-medium text-gray-900">龙虾助手</span>
                                                <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">运行中</span>
                                            </div>
                                            <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                您好！我是您的龙虾智能体助手，基于大模型能力，我可以帮您处理文档、编写代码、分析数据等任务，大幅提升工作效率。请问有什么可以帮您的？
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 云端龙虾 Section */}
            <section id="lobster" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 border border-cyan-100 rounded-full text-sm text-cyan-600 mb-5">
                                <Bot className="w-4 h-4" />
                                云端龙虾
                            </div>
                            
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 tracking-tight">
                                云端龙虾
                                <span className="text-blue-600"> 开箱即用</span>
                            </h2>
                            
                            <p className="text-gray-500 mb-8 leading-relaxed text-lg">
                                龙虾是360智企的核心智能体服务，基于大模型技术，提供开箱即用的AI能力。无需复杂部署，云端运行，企业员工即可快速使用，显著提升办公效率。
                            </p>

                            <div className="space-y-4 mb-8">
                                {[
                                    "注册即用，无需本地部署服务器",
                                    "内置多种智能体模板，一键创建",
                                    "7×24小时云端稳定运行",
                                    "灵活定制，满足个性化业务需求",
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-blue-600" />
                                        </div>
                                        <span className="text-gray-600">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleStartOrLogin}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                            >
                                立即体验龙虾
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Right Content */}
                        <div className="grid grid-cols-2 gap-4">
                            {lobsterFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all"
                                >
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{feature.title}</h3>
                                    <p className="text-sm text-gray-500">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">产品能力</h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">大模型为底座，龙虾智能体为核心，为企业提供全方位AI解决方案</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-gray-50 hover:bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all"
                            >
                                <div className="w-12 h-12 bg-white group-hover:bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-5 border border-gray-100 group-hover:border-blue-100 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scenarios Section */}
            <section id="scenarios" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">龙虾应用场景</h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">龙虾智能体覆盖企业办公全场景，让AI成为每个员工的得力助手</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {scenarios.map((scenario, index) => (
                            <div
                                key={index}
                                className="group flex items-start gap-5 bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all"
                            >
                                <div className="w-14 h-14 bg-blue-50 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-cyan-500 rounded-xl flex items-center justify-center text-blue-500 group-hover:text-white flex-shrink-0 transition-all">
                                    {scenario.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{scenario.title}</h3>
                                    <p className="text-gray-500">{scenario.description}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">选择适合您的方案</h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">灵活的定价方案，满足不同规模企业的需求</p>
                        
                        {/* 切换按钮 */}
                        <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setActivePrice("year")}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                    activePrice === "year"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                年付
                                <span className="ml-1 text-xs text-blue-500">省33%</span>
                            </button>
                            <button
                                onClick={() => setActivePrice("month")}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                    activePrice === "month"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                月付
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative bg-white rounded-2xl border transition-all ${
                                    plan.popular
                                        ? "border-blue-500 shadow-xl shadow-blue-100"
                                        : "border-gray-200 hover:border-blue-200 hover:shadow-lg"
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                                            最受欢迎
                                        </span>
                                    </div>
                                )}
                                
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                                    
                                    <div className="mb-6">
                                        {typeof plan.price[activePrice] === "number" ? (
                                            <>
                                                <span className="text-4xl font-bold text-gray-900">¥{plan.price[activePrice]}</span>
                                                <span className="text-gray-500 ml-1">/成员/月</span>
                                            </>
                                        ) : (
                                            <span className="text-2xl font-bold text-gray-900">{plan.price[activePrice]}</span>
                                        )}
                                    </div>

                                    <button
                                        onClick={plan.popular ? handleStartOrLogin : undefined}
                                        className={`block w-full py-2.5 text-center rounded-lg font-medium transition-colors ${
                                            plan.popular
                                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        {plan.cta}
                                    </button>
                                </div>

                                <div className="px-6 pb-6">
                                    <div className="border-t border-gray-100 pt-4">
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, fIndex) => (
                                                <li key={fIndex} className="flex items-center gap-2.5 text-sm text-gray-600">
                                                    <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 企业定制 */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-500 mb-4">需要更大规模或定制化方案？</p>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            <Phone className="w-4 h-4" />
                            联系销售团队
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                        开启企业AI之旅
                    </h2>
                    <p className="text-blue-100 mb-8 text-lg">
                        立即体验云端龙虾，让大模型+智能体为您的企业赋能
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleStartOrLogin}
                            className="w-full sm:w-auto px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center gap-2"
                        >
                            免费开始使用
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <a
                            href="#pricing"
                            className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors border border-blue-400 flex items-center justify-center"
                        >
                            查看定价
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-lg font-semibold text-white">360智企</span>
                            </div>
                            <p className="text-sm leading-relaxed max-w-md text-gray-500">
                                360智企以大模型和龙虾智能体为核心，为企业提供一站式AI数字化服务，云端龙虾开箱即用，全方位提升员工效率。
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-4 text-sm">产品</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#features" className="hover:text-white transition-colors">产品能力</a></li>
                                <li><a href="#lobster" className="hover:text-white transition-colors">云端龙虾</a></li>
                                <li><a href="#scenarios" className="hover:text-white transition-colors">应用场景</a></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors">定价</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-4 text-sm">支持</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">开发文档</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-500">© 2024 360智企. All rights reserved.</div>
                        <div className="flex items-center gap-6 text-sm">
                            <a href="#" className="text-gray-500 hover:text-white transition-colors">隐私政策</a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors">服务条款</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
