import { Graphics, Color } from 'cc';

/**
 * 重型坦克子弹渲染器
 * 负责重型坦克子弹的绘制逻辑（美化版：多层发光效果 + 装甲质感）
 */
export class EnemyHeavyTankBulletRenderer {
    /**
     * 绘制重型坦克子弹外观（美化版：多层发光效果 + 装甲质感）
     * @param graphics Graphics 组件
     * @param size 子弹大小
     */
    static render(graphics: Graphics, size: number): void {
        if (!graphics) return;

        graphics.clear();
        const radius = size / 2 * 1.1; // 稍大一些
        
        // === 1. 尾迹（多层发光效果）===
        // 最外层尾迹
        graphics.fillColor = new Color(139, 0, 0, 102); // rgba(139, 0, 0, 0.4)
        graphics.circle(0, 0, radius * 2.2);
        graphics.fill();
        
        // 外层发光
        graphics.fillColor = new Color(139, 0, 0, 153); // rgba(139, 0, 0, 0.6)
        graphics.circle(0, 0, radius * 1.6);
        graphics.fill();
        
        // === 2. 子弹主体（三层装甲质感）===
        // 外圈（深红色，装甲外层）
        graphics.fillColor = new Color(139, 0, 0, 255);
        graphics.circle(0, 0, radius);
        graphics.fill();
        
        // 中间层（稍亮的红色，装甲中层）
        graphics.fillColor = new Color(180, 0, 0, 255);
        graphics.circle(0, 0, radius * 0.7);
        graphics.fill();
        
        // 内圈（更亮的红色，装甲核心）
        graphics.fillColor = new Color(220, 50, 50, 255);
        graphics.circle(0, 0, radius * 0.4);
        graphics.fill();
        
        // === 3. 装甲边框（增强厚重感）===
        graphics.strokeColor = new Color(85, 0, 0, 255); // 深红色边框
        graphics.lineWidth = 2;
        graphics.circle(0, 0, radius);
        graphics.stroke();
        
        graphics.strokeColor = new Color(180, 0, 0, 255); // 中红色边框
        graphics.lineWidth = 1.5;
        graphics.circle(0, 0, radius * 0.7);
        graphics.stroke();
        
        // === 4. 高光（增强立体感）===
        graphics.fillColor = new Color(255, 100, 100, 179); // rgba(255, 100, 100, 0.7)
        graphics.circle(-radius * 0.3, -radius * 0.3, radius * 0.3);
        graphics.fill();
    }
}

