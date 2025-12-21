import { Color } from 'cc';

/**
 * UI 颜色常量
 * 参考微信小游戏的颜色配置
 */
export class UiColors {
    // ==================== UI 边框颜色 ====================
    /** UI 边框颜色（青色） */
    static readonly UI_BORDER = 0x00ffff;
    
    /** UI 边框颜色（Color 对象） */
    static readonly UI_BORDER_COLOR = new Color(0, 255, 255, 255);
    
    // ==================== 开始界面背景颜色 ====================
    /** 开始界面背景起始颜色（黑色） */
    static readonly START_SCREEN_BG_START = { r: 0, g: 0, b: 0, a: 0.85 };
    
    /** 开始界面背景结束颜色（深蓝紫色） */
    static readonly START_SCREEN_BG_END = { r: 26, g: 26, b: 46, a: 0.9 };
    
    /** 开始界面渐变步数 */
    static readonly START_SCREEN_GRADIENT_STEPS = 30;
    
    // ==================== 小地图背景颜色 ====================
    /** 小地图背景起始颜色（深蓝紫色） */
    static readonly MINIMAP_BG_START = { r: 26, g: 26, b: 46, a: 0.85 };
    
    /** 小地图背景结束颜色（更深的蓝紫色） */
    static readonly MINIMAP_BG_END = { r: 15, g: 15, b: 30, a: 0.9 };
    
    /** 小地图渐变步数 */
    static readonly MINIMAP_GRADIENT_STEPS = 25;
    
    /** 小地图边框颜色（青色，透明度 0.9） */
    static readonly MINIMAP_BORDER_COLOR = new Color(0, 255, 255, 230);
    
    /** 小地图边框线宽 */
    static readonly MINIMAP_BORDER_WIDTH = 2.5;
    
    /** 小地图内边框颜色（白色，透明度 0.2） */
    static readonly MINIMAP_INNER_BORDER_COLOR = new Color(255, 255, 255, 51);
    
    /** 小地图内边框线宽 */
    static readonly MINIMAP_INNER_BORDER_WIDTH = 1;
    
    // ==================== 武器容器背景颜色 ====================
    /** 武器容器背景起始颜色（深蓝灰色） */
    static readonly WEAPON_CONTAINER_BG_START = { r: 20, g: 25, b: 35, a: 0.95 };
    
    /** 武器容器背景结束颜色（更深的蓝灰色） */
    static readonly WEAPON_CONTAINER_BG_END = { r: 5, g: 10, b: 20, a: 0.9 };
    
    /** 武器容器渐变步数 */
    static readonly WEAPON_CONTAINER_GRADIENT_STEPS = 25;
    
    /** 武器容器边框颜色（青色，透明度 0.6） */
    static readonly WEAPON_CONTAINER_BORDER_COLOR = new Color(0, 255, 255, 153);
    
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

