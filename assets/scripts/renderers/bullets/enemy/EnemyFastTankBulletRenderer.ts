import { Graphics, Color } from 'cc';

/**
 * 快速坦克子弹渲染器
 * 负责快速坦克子弹的绘制逻辑（美化版：多层发光效果 + 速度拖尾）
 */
export class EnemyFastTankBulletRenderer {
    /**
     * 绘制快速坦克子弹外观（美化版：多层发光效果 + 速度拖尾）
     * @param graphics Graphics 组件
     * @param size 子弹大小
     */
    static render(graphics: Graphics, size: number): void {
        if (!graphics) return;

        graphics.clear();
        const radius = size / 2 * 0.8; // 稍小一些
        
        // === 1. 速度拖尾（多层发光）===
        // 最外层拖尾
        graphics.fillColor = new Color(255, 100, 100, 102); // rgba(255, 100, 100, 0.4)
        graphics.circle(-radius * 0.5, 0, radius * 1.8);
        graphics.fill();
        
        // 中层拖尾
        graphics.fillColor = new Color(255, 100, 100, 153); // rgba(255, 100, 100, 0.6)
        graphics.circle(-radius * 0.3, 0, radius * 1.2);
        graphics.fill();
        
        // === 2. 子弹主体（浅红色）===
        graphics.fillColor = new Color(255, 100, 100, 255);
        graphics.circle(0, 0, radius);
        graphics.fill();
        
        // === 3. 速度线条（尾部，增强速度感）===
        graphics.strokeColor = new Color(255, 150, 150, 255);
        graphics.lineWidth = 1.5;
        graphics.moveTo(-radius, 0);
        graphics.lineTo(-radius * 1.8, 0);
        graphics.stroke();
        
        // === 4. 高光（增强立体感）===
        graphics.fillColor = new Color(255, 200, 200, 179); // rgba(255, 200, 200, 0.7)
        graphics.circle(-radius * 0.3, -radius * 0.3, radius * 0.4);
        graphics.fill();
    }
}

