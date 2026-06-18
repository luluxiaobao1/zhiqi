"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Eye,
    EyeOff,
    AlertCircle,
    User,
    Lock,
    QrCode,
    Phone,
    Check,
} from "lucide-react";

// 企业入口页面地址
const ENTERPRISE_URL = "/zhiqi/console";

// 测试账号列表
const TEST_ACCOUNTS = [
    { account: 'zhangsan', name: '张三', desc: '张三企业主账号 / 李四企业管理员 / 王五企业成员' },
    { account: 'lisi', name: '李四', desc: '李四企业主账号 / 王五企业管理员 / 张三企业成员' },
    { account: 'wangwu', name: '王五', desc: '王五企业主账号' },
];

export default function LoginPage() {
    const [mounted, setMounted] = useState(false);
    const [loginType, setLoginType] = useState<"password" | "sms" | "qrcode">("password");
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [smsCode, setSmsCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [agreed, setAgreed] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 发送验证码
    const sendSmsCode = () => {
        if (!account || account.length !== 11) {
            setError("请输入正确的手机号");
            return;
        }
        setError("");
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // 登录
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!agreed) {
            setError("请先阅读并同意用户协议");
            return;
        }

        if (loginType === "password") {
            if (!account || !password) {
                setError("请输入账号和密码");
                return;
            }
        } else if (loginType === "sms") {
            if (!account || !smsCode) {
                setError("请输入手机号和验证码");
                return;
            }
        }

        setLoading(true);

        setTimeout(() => {
            localStorage.setItem("zhiqi_logged_in", "true");
            localStorage.setItem("zhiqi_user_info", JSON.stringify({
                phone: account || "138****8888",
                name: account || "用户",
                account: account,
            }));
            
            window.location.href = ENTERPRISE_URL;
        }, 1000);
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#1890ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f8fa] flex">
            {/* 左侧品牌区域 - 使用背景图片 */}
            <div 
                className="hidden lg:flex lg:w-[55%] xl:w-[60%] bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/login-bg.png)' }}
            >
            </div>

            {/* 右侧登录区域 */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-[380px]">
                    {/* 登录卡片 */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        {/* 上次登录标签 */}
                        <div className="mb-4">
                            <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-600 text-xs rounded">
                                上次登录
                            </span>
                        </div>

                        {/* 登录方式切换 */}
                        <div className="flex border-b border-gray-100 mb-6">
                            <button
                                type="button"
                                onClick={() => { setLoginType("password"); setError(""); }}
                                className={`flex-1 py-3 text-center text-sm font-medium transition-colors relative ${
                                    loginType === "password"
                                        ? "text-[#1890ff]"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                360账号登录
                                {loginType === "password" && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#1890ff]"></div>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setLoginType("sms"); setError(""); }}
                                className={`flex-1 py-3 text-center text-sm font-medium transition-colors relative ${
                                    loginType === "sms"
                                        ? "text-[#1890ff]"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                短信登录
                                {loginType === "sms" && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#1890ff]"></div>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setLoginType("qrcode"); setError(""); }}
                                className={`flex-1 py-3 text-center text-sm font-medium transition-colors relative ${
                                    loginType === "qrcode"
                                        ? "text-[#1890ff]"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                扫码登录
                                {loginType === "qrcode" && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#1890ff]"></div>
                                )}
                            </button>
                        </div>

                        {/* 账号密码登录表单 */}
                        {loginType === "password" && (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={account}
                                            onChange={(e) => setAccount(e.target.value)}
                                            placeholder="请输入手机号/账号"
                                            className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="请输入密码"
                                            className="w-full h-11 pl-10 pr-10 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-all text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* 测试账号快速选择 */}
                                <div className="bg-blue-50 rounded-lg p-3">
                                    <div className="text-xs text-blue-600 font-medium mb-2">测试账号快速选择</div>
                                    <div className="space-y-2">
                                        {TEST_ACCOUNTS.map((item) => (
                                            <button
                                                key={item.account}
                                                type="button"
                                                onClick={() => {
                                                    setAccount(item.account);
                                                    setPassword('123456');
                                                    setAgreed(true);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                                                    account === item.account 
                                                        ? 'border-blue-500 bg-white' 
                                                        : 'border-transparent hover:bg-white/50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">{item.name}</span>
                                                    <span className="text-xs text-gray-400">({item.account})</span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 协议勾选 */}
                                <div className="flex items-start gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setAgreed(!agreed)}
                                        className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center transition-colors ${
                                            agreed
                                                ? "bg-[#1890ff] border-[#1890ff]"
                                                : "border-gray-300 hover:border-gray-400"
                                        }`}
                                    >
                                        {agreed && <Check className="w-3 h-3 text-white" />}
                                    </button>
                                    <span className="text-xs text-gray-500">
                                        已仔细阅读并同意
                                        <a href="#" className="text-[#1890ff] hover:underline ml-1">《360用户服务条款》</a>
                                        <a href="#" className="text-[#1890ff] hover:underline ml-1">《360用户隐私政策》</a>
                                    </span>
                                </div>

                                {/* 错误提示 */}
                                {error && (
                                    <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 px-3 py-2 rounded">
                                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {/* 登录按钮 */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-11 bg-[#1890ff] hover:bg-[#40a9ff] text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            登录中...
                                        </>
                                    ) : (
                                        "登 录"
                                    )}
                                </button>

                                {/* 快速注册 | 找回密码 */}
                                <div className="flex justify-end gap-2 text-sm">
                                    <Link href="#" className="text-[#1890ff] hover:underline">快速注册</Link>
                                    <span className="text-gray-300">|</span>
                                    <Link href="#" className="text-[#1890ff] hover:underline">找回密码</Link>
                                </div>
                            </form>
                        )}

                        {/* 短信登录表单 */}
                        {loginType === "sms" && (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={account}
                                            onChange={(e) => setAccount(e.target.value.replace(/\D/g, "").slice(0, 11))}
                                            placeholder="请输入手机号"
                                            className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={smsCode}
                                            onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            placeholder="请输入验证码"
                                            className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff] transition-all text-sm"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={sendSmsCode}
                                        disabled={countdown > 0}
                                        className={`h-11 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                            countdown > 0
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                                : "bg-white text-[#1890ff] border border-[#1890ff] hover:bg-[#f0f7ff]"
                                        }`}
                                    >
                                        {countdown > 0 ? `${countdown}s` : "获取验证码"}
                                    </button>
                                </div>

                                {/* 协议勾选 */}
                                <div className="flex items-start gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setAgreed(!agreed)}
                                        className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center transition-colors ${
                                            agreed
                                                ? "bg-[#1890ff] border-[#1890ff]"
                                                : "border-gray-300 hover:border-gray-400"
                                        }`}
                                    >
                                        {agreed && <Check className="w-3 h-3 text-white" />}
                                    </button>
                                    <span className="text-xs text-gray-500">
                                        已仔细阅读并同意
                                        <a href="#" className="text-[#1890ff] hover:underline ml-1">《360用户服务条款》</a>
                                        <a href="#" className="text-[#1890ff] hover:underline ml-1">《360用户隐私政策》</a>
                                    </span>
                                </div>

                                {/* 错误提示 */}
                                {error && (
                                    <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 px-3 py-2 rounded">
                                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {/* 登录按钮 */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-11 bg-[#1890ff] hover:bg-[#40a9ff] text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                >
                                    {loading ? "登录中..." : "登 录"}
                                </button>
                            </form>
                        )}

                        {/* 扫码登录 */}
                        {loginType === "qrcode" && (
                            <div className="text-center py-6">
                                <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                    <QrCode className="w-32 h-32 text-gray-300" />
                                </div>
                                <p className="text-sm text-gray-500">
                                    使用360智企App扫描二维码登录
                                </p>
                            </div>
                        )}

                        {/* 第三方登录 */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="text-center text-gray-400 text-xs mb-4">其他登录方式</div>
                            <div className="flex justify-center gap-4">
                                {/* QQ */}
                                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#12B7F5">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 13.19c-.18.61-.83 1.17-1.46 1.25-.36.05-.74.1-1.13.13-.35.03-.7.05-1.05.05s-.7-.02-1.05-.05c-.39-.03-.77-.08-1.13-.13-.63-.08-1.28-.64-1.46-1.25-.13-.44-.07-.88.12-1.24.19-.36.49-.65.87-.84.38-.19.79-.29 1.21-.29h2.88c.42 0 .83.1 1.21.29.38.19.68.48.87.84.19.36.25.8.12 1.24z"/>
                                    </svg>
                                </button>
                                {/* 微信 */}
                                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#07C160">
                                        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.139.045c.133 0 .241-.11.241-.245 0-.06-.024-.119-.04-.177l-.325-1.233a.492.492 0 01.178-.554c1.526-1.123 2.499-2.786 2.499-4.628 0-3.374-3.152-6.127-7.059-6.115zm-2.853 2.971c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm5.706 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/>
                                    </svg>
                                </button>
                                {/* 微博 */}
                                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#E6162D">
                                        <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zm-2.878-3.975c.252-.769 1.188-1.19 2.08-.939.892.252 1.412 1.041 1.16 1.809-.252.77-1.188 1.19-2.079.939-.892-.25-1.412-1.039-1.161-1.809zm1.615-.892c-.46-.125-.958.089-1.113.484-.156.395.079.828.538.953.458.126.958-.088 1.113-.483.156-.395-.079-.829-.538-.954zm5.893-1.095c-.423-.116-.866.088-1.006.458-.14.371.092.777.513.893.42.116.864-.089 1.005-.458.14-.371-.091-.776-.512-.893zm-1.383.489c-.416-.12-.871.08-1.016.45-.145.37.081.774.497.894.415.119.87-.08 1.015-.45.146-.37-.08-.775-.496-.894zm6.464-5.708c-.421-1.253-1.683-1.935-2.822-1.523-1.138.411-1.715 1.727-1.293 2.98.421 1.254 1.683 1.936 2.821 1.524 1.139-.412 1.716-1.728 1.294-2.981zm-1.189.429c.216.644-.078 1.344-.658 1.566-.579.22-1.233-.104-1.449-.748-.216-.644.078-1.344.657-1.565.58-.221 1.234.103 1.45.747zm-.773-4.018c-.707-2.103-2.824-3.247-4.737-2.559-1.911.689-2.876 2.894-2.169 4.996.707 2.104 2.824 3.248 4.736 2.56 1.912-.69 2.877-2.895 2.17-4.997zm-2.015.723c.377 1.123-.125 2.341-1.121 2.726-.995.385-2.121-.212-2.498-1.334-.377-1.123.125-2.341 1.121-2.726.995-.385 2.121.212 2.498 1.334z"/>
                                    </svg>
                                </button>
                                {/* 支付宝 */}
                                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1677FF">
                                        <path d="M21.422 15.358c-1.426-.541-4.394-1.59-5.838-2.142-.11-.042-.22-.084-.331-.127a7.76 7.76 0 001.567-4.507h-3.235V7.242h4.01V6.19h-4.01V3.897h-1.77c-.12 0-.217.098-.217.217V6.19H7.416v1.052h4.182v1.34H7.913v1.05h6.334a6.025 6.025 0 01-.938 2.99c-1.143-.418-2.296-.739-3.415-.739-2.139 0-3.69 1.176-3.69 2.903 0 1.714 1.518 2.89 3.69 2.89 1.818 0 3.32-.884 4.414-2.36.217.092.432.182.644.27 1.697.706 4.226 1.742 5.453 2.238.166.067.332.134.497.203l.624-2.486zm-11.53.55c-1.39 0-2.192-.676-2.192-1.63 0-.966.802-1.63 2.192-1.63.89 0 1.865.283 2.834.733-.854 1.476-1.886 2.527-2.834 2.527z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
