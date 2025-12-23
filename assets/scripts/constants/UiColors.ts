import { Color } from 'cc';
import { CyberpunkColors } from './CyberpunkColors';

/**
 * UI 颜色常量
 * 使用赛博朋克风格颜色配置
 */
export class UiColors {
    // ==================== UI 边框颜色 ====================
    /** UI 边框颜色（霓虹青色） */
    static readonly UI_BORDER = 0x00ffff;
    
    /** UI 边框颜色（Color 对象）- 赛博朋克风格 */
    static readonly UI_BORDER_COLOR = CyberpunkColors.UI_BORDER;
    
    // ==================== 开始界面背景颜色 ====================
    /** 开始界面背景起始颜色（赛博朋克深色） */
    static readonly START_SCREEN_BG_START = CyberpunkColors.START_SCREEN_BG_START;
    
    /** 开始界面背景结束颜色（赛博朋克深蓝紫色） */
    static readonly START_SCREEN_BG_END = CyberpunkColors.START_SCREEN_BG_END;
    
    /** 开始界面渐变步数 */
    static readonly START_SCREEN_GRADIENT_STEPS = 30;
    
    // ==================== 小地图背景颜色 ====================
    /** 小地图背景起始颜色（赛博朋克深蓝紫色） */
    static readonly MINIMAP_BG_START = CyberpunkColors.MINIMAP_BG_START;
    
    /** 小地图背景结束颜色（赛博朋克更深色） */
    static readonly MINIMAP_BG_END = CyberpunkColors.MINIMAP_BG_END;
    
    /** 小地图渐变步数 */
    static readonly MINIMAP_GRADIENT_STEPS = 25;
    
    /** 小地图边框颜色（霓虹青色，透明度 0.9）- 赛博朋克风格 */
    static readonly MINIMAP_BORDER_COLOR = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.9);
    
    /** 小地图边框线宽 */
    static readonly MINIMAP_BORDER_WIDTH = 2.5;
    
    /** 小地图内边框颜色（白色，透明度 0.2） */
    static readonly MINIMAP_INNER_BORDER_COLOR = new Color(255, 255, 255, 51);
    
    /** 小地图内边框线宽 */
    static readonly MINIMAP_INNER_BORDER_WIDTH = 1;
    
    // ==================== 武器容器背景颜色 ====================
    /** 武器容器背景起始颜色（赛博朋克深蓝灰色） */
    static readonly WEAPON_CONTAINER_BG_START = CyberpunkColors.WEAPON_CONTAINER_BG_START;
    
    /** 武器容器背景结束颜色（赛博朋克更深色） */
    static readonly WEAPON_CONTAINER_BG_END = CyberpunkColors.WEAPON_CONTAINER_BG_END;
    
    /** 武器容器渐变步数 */
    static readonly WEAPON_CONTAINER_GRADIENT_STEPS = 25;
    
    /** 武器容器边框颜色（霓虹青色，透明度 0.6）- 赛博朋克风格 */
    static readonly WEAPON_CONTAINER_BORDER_COLOR = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.6);
    
    /** 武器容器边框线宽 */
    static readonly WEAPON_CONTAINER_BORDER_WIDTH = 2;
    
    /** 武器容器内边框颜色（白色，透明度 0.1） */
    static readonly WEAPON_CONTAINER_INNER_BORDER_COLOR = new Color(255, 255, 255, 26);
    
    /** 武器容器内边框线宽 */
    static readonly WEAPON_CONTAINER_INNER_BORDER_WIDTH = 1;
    
    // ==================== 工具函数 ====================
    /**
     * 创建渐变颜色
     * @param start 起始颜色 {r, g, b, a}
     * @param end 结束颜色 {r, g, b, a}
     * @param ratio 插值比例 (0-1)
     * @returns Color 对象
     */
    static createGradientColor(
        start: { r: number; g: number; b: number; a: number },
        end: { r: number; g: number; b: number; a: number },
        ratio: number
    ): Color {
        const r = Math.floor(start.r + (end.r - start.r) * ratio);
        const g = Math.floor(start.g + (end.g - start.g) * ratio);
        const b = Math.floor(start.b + (end.b - start.b) * ratio);
        const a = start.a + (end.a - start.a) * ratio;
        return new Color(r, g, b, a * 255);
    }
}

