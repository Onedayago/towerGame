import { Graphics, Color } from 'cc';

/**
 * 基础武器子弹渲染器
 * 负责基础武器子弹的绘制逻辑（美化版：多层发光效果）
 */
export class WeaponBasicBulletRenderer {
    /**
     * 绘制基础武器子弹外观（美化版：多层发光效果）
     * @param graphics Graphics 组件
     * @param size 子弹大小
     */
    static render(graphics: Graphics, size: number): void {
        if (!graphics) return;

        graphics.clear();
        const radius = size / 2;
        
        // === 1. 尾迹（多层发光效果）===
        // 最外层尾迹
        graphics.fillColor = new Color(255, 255, 0, 102); // rgba(255, 255, 0, 0.4)
        graphics.circle(0, 0, radius * 2.5);
        graphics.fill();
        
        // 外层发光
        graphics.fillColor = new Color(255, 255, 0, 128); // rgba(255, 255, 0, 0.5)
        graphics.circle(0, 0, radius * 1.8);
        graphics.fill();
        
        // 中层发光
        graphics.fillColor = new Color(255, 255, 0, 179); // rgba(255, 255, 0, 0.7)
        graphics.circle(0, 0, radius * 1.3);
        graphics.fill();
        
        // === 2. 子弹主体（渐变效果）===
        // 外圈（黄色）
        graphics.fillColor = Color.YELLOW;
        graphics.circle(0, 0, radius);
        graphics.fill();
        
        // 内圈（更亮的黄色）
        graphics.fillColor = new Color(255, 255, 150, 255);
        graphics.circle(0, 0, radius * 0.6);
        graphics.fill();
        
        // === 3. 高光（增强立体感）===
        graphics.fillColor = new Color(255, 255, 255, 179); // rgba(255, 255, 255, 0.7)
        graphics.circle(-radius * 0.3, -radius * 0.3, radius * 0.5);
        graphics.fill();
    }
}

