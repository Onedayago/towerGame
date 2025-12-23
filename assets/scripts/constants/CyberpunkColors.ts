import { Color } from 'cc';

/**
 * 赛博朋克风格颜色配置
 * 参考赛博朋克2077和银翼杀手的视觉风格
 */
export class CyberpunkColors {
    // ==================== 霓虹色调 ====================
    /** 霓虹粉色 - 主要强调色 */
    static readonly NEON_PINK = new Color(255, 20, 147, 255); // #ff1493
    
    /** 霓虹蓝色 - 科技感 */
    static readonly NEON_BLUE = new Color(0, 191, 255, 255); // #00bfff
    
    /** 霓虹紫色 - 神秘感 */
    static readonly NEON_PURPLE = new Color(138, 43, 226, 255); // #8a2be2
    
    /** 霓虹青色 - 能量感 */
    static readonly NEON_CYAN = new Color(0, 255, 255, 255); // #00ffff
    
    /** 霓虹绿色 - 数据流 */
    static readonly NEON_GREEN = new Color(0, 255, 127, 255); // #00ff7f
    
    /** 霓虹黄色 - 警告色 */
    static readonly NEON_YELLOW = new Color(255, 255, 0, 255); // #ffff00
    
    /** 霓虹橙色 - 能量色 */
    static readonly NEON_ORANGE = new Color(255, 140, 0, 255); // #ff8c00
    
    // ==================== 背景色 ====================
    /** 深色背景 - 主背景 */
    static readonly DARK_BG = new Color(10, 10, 20, 255); // #0a0a14
    
    /** 深蓝紫色背景 */
    static readonly DARK_PURPLE_BG = new Color(15, 10, 30, 255); // #0f0a1e
    
    /** 深蓝灰色背景 */
    static readonly DARK_BLUE_GRAY = new Color(20, 25, 40, 255); // #141928
    
    // ==================== UI 颜色 ====================
    /** UI 主色调 - 霓虹青色 */
    static readonly UI_PRIMARY = CyberpunkColors.NEON_CYAN;
    
    /** UI 次要色 - 霓虹蓝色 */
    static readonly UI_SECONDARY = CyberpunkColors.NEON_BLUE;
    
    /** UI 强调色 - 霓虹粉色 */
    static readonly UI_ACCENT = CyberpunkColors.NEON_PINK;
    
    /** UI 警告色 - 霓虹黄色 */
    static readonly UI_WARNING = CyberpunkColors.NEON_YELLOW;
    
    /** UI 边框颜色 - 霓虹青色，半透明 */
    static readonly UI_BORDER = new Color(0, 255, 255, 200);
    
    /** UI 背景 - 深色半透明 */
    static readonly UI_BG = new Color(10, 10, 20, 230);
    
    // ==================== 敌人颜色 ====================
    /** 敌人主色 - 霓虹红色（危险感） */
    static readonly ENEMY_PRIMARY = new Color(255, 50, 50, 255); // #ff3232
    
    /** 敌人细节色 - 霓虹橙色 */
    static readonly ENEMY_DETAIL = new Color(255, 140, 0, 255); // #ff8c00
    
    /** 敌人发光色 - 霓虹红色 */
    static readonly ENEMY_GLOW = new Color(255, 0, 0, 200); // #ff0000
    
    // ==================== 武器颜色 ====================
    /** 基础武器 - 霓虹蓝色 */
    static readonly WEAPON_BASIC = CyberpunkColors.NEON_BLUE;
    
    /** 激光武器 - 霓虹粉色 */
    static readonly WEAPON_LASER = CyberpunkColors.NEON_PINK;
    
    /** 火箭武器 - 霓虹橙色 */
    static readonly WEAPON_ROCKET = CyberpunkColors.NEON_ORANGE;
    
    /** 加农炮 - 霓虹黄色 */
    static readonly WEAPON_CANNON = CyberpunkColors.NEON_YELLOW;
    
    /** 狙击枪 - 霓虹紫色 */
    static readonly WEAPON_SNIPER = CyberpunkColors.NEON_PURPLE;
    
    // ==================== 子弹颜色 ====================
    /** 基础子弹 - 霓虹蓝色 */
    static readonly BULLET_BASIC = CyberpunkColors.NEON_BLUE;
    
    /** 激光子弹 - 霓虹粉色 */
    static readonly BULLET_LASER = CyberpunkColors.NEON_PINK;
    
    /** 火箭子弹 - 霓虹橙色 */
    static readonly BULLET_ROCKET = CyberpunkColors.NEON_ORANGE;
    
    /** 加农炮子弹 - 霓虹黄色 */
    static readonly BULLET_CANNON = CyberpunkColors.NEON_YELLOW;
    
    /** 狙击子弹 - 霓虹紫色 */
    static readonly BULLET_SNIPER = CyberpunkColors.NEON_PURPLE;
    
    // ==================== 特效颜色 ====================
    /** 生成特效 - 霓虹青色 */
    static readonly EFFECT_SPAWN = CyberpunkColors.NEON_CYAN;
    
    /** 爆炸特效 - 霓虹橙色 */
    static readonly EFFECT_EXPLOSION = CyberpunkColors.NEON_ORANGE;
    
    /** 击中特效 - 霓虹黄色 */
    static readonly EFFECT_HIT = CyberpunkColors.NEON_YELLOW;
    
    /** 能量特效 - 霓虹蓝色 */
    static readonly EFFECT_ENERGY = CyberpunkColors.NEON_BLUE;
    
    // ==================== 渐变配置 ====================
    /** 开始界面背景起始颜色（深色） */
    static readonly START_SCREEN_BG_START = { r: 5, g: 5, b: 15, a: 0.95 };
    
    /** 开始界面背景结束颜色（深蓝紫色） */
    static readonly START_SCREEN_BG_END = { r: 20, g: 10, b: 40, a: 0.9 };
    
    /** 小地图背景起始颜色（深蓝紫色） */
    static readonly MINIMAP_BG_START = { r: 15, g: 10, b: 30, a: 0.9 };
    
    /** 小地图背景结束颜色（更深） */
    static readonly MINIMAP_BG_END = { r: 5, g: 5, b: 15, a: 0.95 };
    
    /** 武器容器背景起始颜色（深蓝灰色） */
    static readonly WEAPON_CONTAINER_BG_START = { r: 15, g: 20, b: 35, a: 0.95 };
    
    /** 武器容器背景结束颜色（更深） */
    static readonly WEAPON_CONTAINER_BG_END = { r: 5, g: 10, b: 20, a: 0.9 };
    
    // ==================== 工具函数 ====================
    /**
     * 创建霓虹发光效果的颜色（带透明度）
     * @param baseColor 基础颜色
     * @param alpha 透明度 (0-1)
     * @returns Color 对象
     */
    static createNeonGlow(baseColor: Color, alpha: number = 0.8): Color {
        return new Color(baseColor.r, baseColor.g, baseColor.b, Math.floor(alpha * 255));
    }
    
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

