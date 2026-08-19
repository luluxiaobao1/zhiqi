"use client";

/**
 * 可拖动悬浮按钮（右下角浮标）。
 *
 * 特性：
 * - 默认吸附在页面右下角，可用鼠标/触摸在视口内自由拖动；
 * - 拖动结束（位移超过阈值）时不触发点击，避免误操作；
 * - hover 时在按钮上方弹出说明内容（children 作为说明框正文）；
 * - 醒目的橙色渐变 + 阴影 + 呼吸光圈样式，突出改动提示。
 *
 * console 页面使用本组件，只需传入 label / onClick / children。
 */

import React, { useCallback, useEffect, useRef, useState } from "react";

interface DraggableFloatingButtonProps {
    /** 按钮文案 */
    label: string;
    /** 点击（非拖动）时触发 */
    onClick: () => void;
    /** hover 说明框正文内容 */
    children: React.ReactNode;
    /** 说明框标题 */
    tipTitle: string;
    /** 说明框宽度（px），默认 460 */
    tipWidth?: number;
}

// 判定为“拖动”的最小位移阈值（px），小于该值视为点击
const DRAG_THRESHOLD = 4;
// 默认距离视口边缘的间距（px）
const EDGE_GAP = 24;
// 按钮预估尺寸，用于初始右下角定位与边界约束
const BTN_W = 220;
const BTN_H = 44;

export default function DraggableFloatingButton({
    label,
    onClick,
    children,
    tipTitle,
    tipWidth = 460,
}: DraggableFloatingButtonProps) {
    // 按钮左上角坐标（px，相对视口）；null 表示尚未初始化（使用默认右下角）
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
    // 是否正在拖动（用于禁用点击 & 改变光标）
    const [dragging, setDragging] = useState(false);

    const draggingRef = useRef(false);
    const movedRef = useRef(false); // 本次按下是否发生过有效位移
    const startRef = useRef({ x: 0, y: 0, px: 0, py: 0 }); // 起始鼠标与按钮坐标
    const posRef = useRef<{ x: number; y: number } | null>(null);

    posRef.current = pos;

    // 初始化到右下角（客户端首次挂载时根据视口尺寸计算）
    useEffect(() => {
        const init = () => {
            setPos((prev) => {
                if (prev) return prev;
                return {
                    x: window.innerWidth - BTN_W - EDGE_GAP,
                    y: window.innerHeight - BTN_H - EDGE_GAP,
                };
            });
        };
        init();
        window.addEventListener("resize", () => {
            // 窗口缩放时把按钮约束回可视区域
            setPos((prev) => {
                if (!prev) return prev;
                return clampToViewport(prev.x, prev.y);
            });
        });
    }, []);

    const clampToViewport = (x: number, y: number) => {
        const maxX = window.innerWidth - BTN_W - 4;
        const maxY = window.innerHeight - BTN_H - 4;
        return {
            x: Math.max(4, Math.min(x, Math.max(4, maxX))),
            y: Math.max(4, Math.min(y, Math.max(4, maxY))),
        };
    };

    const onPointerMove = useCallback((e: PointerEvent) => {
        if (!draggingRef.current) return;
        const dx = e.clientX - startRef.current.x;
        const dy = e.clientY - startRef.current.y;
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
            movedRef.current = true;
        }
        const next = clampToViewport(startRef.current.px + dx, startRef.current.py + dy);
        setPos(next);
    }, []);

    const onPointerUp = useCallback(() => {
        draggingRef.current = false;
        setDragging(false);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
    }, [onPointerMove]);

    const onPointerDown = (e: React.PointerEvent) => {
        // 仅左键 / 触摸
        if (e.button !== 0) return;
        draggingRef.current = true;
        movedRef.current = false;
        setDragging(true);
        const cur = posRef.current || {
            x: window.innerWidth - BTN_W - EDGE_GAP,
            y: window.innerHeight - BTN_H - EDGE_GAP,
        };
        startRef.current = { x: e.clientX, y: e.clientY, px: cur.x, py: cur.y };
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    };

    const handleClick = () => {
        // 若本次是拖动，则不触发点击
        if (movedRef.current) return;
        onClick();
    };

    const style: React.CSSProperties = pos
        ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" }
        : { right: EDGE_GAP, bottom: EDGE_GAP };

    return (
        <div
            className="fixed z-[1200] group select-none"
            style={style}
        >
            <button
                onPointerDown={onPointerDown}
                onClick={handleClick}
                className={`relative inline-flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 border border-orange-300 shadow-[0_8px_24px_rgba(249,115,22,0.45)] hover:shadow-[0_10px_28px_rgba(249,115,22,0.6)] hover:brightness-105 transition-all ${dragging ? "cursor-grabbing scale-[1.03]" : "cursor-grab"}`}
            >
                {/* 呼吸光圈，提升存在感 */}
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                </span>
                <span className="whitespace-nowrap">{label}</span>
                {/* 拖动手柄图标 */}
                <svg className="w-4 h-4 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="9" cy="6" r="1.6" />
                    <circle cx="15" cy="6" r="1.6" />
                    <circle cx="9" cy="12" r="1.6" />
                    <circle cx="15" cy="12" r="1.6" />
                    <circle cx="9" cy="18" r="1.6" />
                    <circle cx="15" cy="18" r="1.6" />
                </svg>
            </button>
            {/* hover 悬浮说明框（向上弹出）；拖动时隐藏 */}
            {!dragging && (
                <div
                    className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[1201] text-left"
                    style={{ width: tipWidth }}
                >
                    <div className="text-sm font-semibold text-gray-900 mb-2">{tipTitle}</div>
                    {children}
                </div>
            )}
        </div>
    );
}
