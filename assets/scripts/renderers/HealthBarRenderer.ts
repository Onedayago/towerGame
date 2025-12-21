import { Graphics, Color } from 'cc';
import { UiConfig } from '../config/Index';

/**
 * 血条渲染器
 * 参考微信小游戏实现，提供美化的血条绘制
 */
export class HealthBarRenderer {
    // 血条配置常量
    private static readonly HEALTH_BAR_HEIGHT = 6; // 血条高度
    private static readonly HEALTH_BAR_WIDTH_RATIO = 0.9; // 血条宽度比例（相对于实体大小）
    private static readonly HEALTH_BAR_BG_ALPHA = 0.5; // 背景透明度
    
    // 血量阈值
    private static readonly CRITICAL_THRESHOLD = 0.3; // 危险阈值（30%）
    private static readonly WARNING_THRESHOLD = 0.6; // 警告阈值（60%）
    
    // 颜色定义（参考原游戏）
    private static readonly COLOR_HEALTHY = new Color(0, 255, 0, 242); // 绿色，透明度约0.95
    private static readonly COLOR_WARNING = new Color(251, 191, 36, 242); // 黄色 #fbbf24，透明度约0.95
    private static readonly COLOR_CRITICAL = new Color(255, 0, 0, 242); // 红色，透明度约0.95
    private static readonly COLOR_BACKGROUND = new Color(0, 0, 0, 128); // 半透明黑色背景
    private static readonly COLOR_BORDER = new Color(255, 255, 255, 100); // 边框颜色（半透明白色）
    private static readonly BORDER_WIDTH = 1; // 边框宽度
    
    /**
     * 渲染血条
     * @param graphics Graphics 组件
     * @param width 血条宽度
     * @param height 血条高度
     * @param healthPercent 血量百分比 (0-1)
     */
    static render(
        graphics: Graphics,
        width: number,
        height: number,
        healthPercent: number
    ): void {
        if (!graphics) return;
        
        graphics.clear();
        
        const clampedPercent = Math.max(0, Math.min(1, healthPercent));
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        
        // 绘制背景（半透明黑色矩形）
        graphics.fillColor = this.COLOR_BACKGROUND;
        graphics.rect(-halfWidth, -halfHeight, width, height);
        graphics.fill();
        
        // 绘制血量条（根据血量百分比选择颜色）
        if (clampedPercent > 0) {
            const healthWidth = width * clampedPercent;
            const healthColor = this.getHealthColor(clampedPercent);
            
            graphics.fillColor = healthColor;
            graphics.rect(-halfWidth, -halfHeight, healthWidth, height);
            graphics.fill();
        }
        
        // 绘制边框（半透明白色）
        graphics.strokeColor = this.COLOR_BORDER;
        graphics.lineWidth = this.BORDER_WIDTH;
        graphics.rect(-halfWidth, -halfHeight, width, height);
        graphics.stroke();
    }
    
    /**
     * 根据血量百分比获取颜色
     * @param percent 血量百分比
     * @returns 对应的颜色
     */
    private static getHealthColor(percent: number): Color {
        if (percent <= this.CRITICAL_THRESHOLD) {
            return this.COLOR_CRITICAL; // 危险：红色
        } else if (percent <= this.WARNING_THRESHOLD) {
            return this.COLOR_WARNING; // 警告：黄色
        } else {
            return this.COLOR_HEALTHY; // 健康：绿色
        }
    }
    
    /**
     * 计算血条宽度（基于实体大小）
     * @param entitySize 实体大小（格子大小）
     * @returns 血条宽度
     */
    static calculateWidth(entitySize: number): number {
        return entitySize * this.HEALTH_BAR_WIDTH_RATIO;
    }
    
    /**
     * 获取血条高度
     * @returns 血条高度
     */
    static getHeight(): number {
        return this.HEALTH_BAR_HEIGHT;
    }
}

