import PlatformSelector from "@/components/platform-selector";

// 首页与 /platform 复用同一实现，避免重复代码导致的内容分叉。
// 平台入口的增删改统一在 src/components/platform-selector.tsx 维护。
export default function HomePage() {
    return <PlatformSelector />;
}
