import { Graphics, Color } from 'cc';

/**
 * 火箭塔子弹渲染器
 * 负责火箭塔子弹的绘制逻辑（美化版：多层发光效果 + 尾迹）
 */
export class WeaponRocketBulletRenderer {
    /**
     * 绘制火箭子弹外观（美化版：多层发光效果 + 尾迹）
     * @param graphics Graphics 组件
     * @param size 子弹大小
     */
    static render(graphics: Graphics, size: number): void {
        if (!graphics) return;

        graphics.clear();
        const rocketLength = size * 1.2;
        const rocketWidth = size * 0.6;
        const halfLength = rocketLength / 2;
        const halfWidth = rocketWidth / 2;
        
        // === 1. 尾部推进光晕 ===
        graphics.fillColor = new Color(255, 165, 0, 102); // rgba(255, 165, 0, 0.4)
        graphics.circle(-halfLength, 0, halfWidth * 1.5);
        graphics.fill();
        
        // === 2. 火箭主体（椭圆形，橙色渐变模拟）===
        graphics.fillColor = new Color(255, 165, 0, 255); // 橙色
        graphics.ellipse(0, 0, halfLength, halfWidth);
        graphics.fill();
        
        // === 3. 火箭头部（三角形，白色高光）===
        graphics.fillColor = new Color(255, 255, 255, 255); // 白色
        graphics.moveTo(halfLength, 0);
        graphics.lineTo(halfLength * 0.7, -halfWidth * 0.5);
        graphics.lineTo(halfLength * 0.7, halfWidth * 0.5);
        graphics.close();
        graphics.fill();
        
        // === 4. 尾翼（左右各一个，深橙色）===
        graphics.fillColor = new Color(200, 100, 0, 255); // 深橙色
        // 左尾翼
        graphics.moveTo(-halfLength * 0.8, -halfWidth * 0.3);
        graphics.lineTo(-halfLength, -halfWidth);
        graphics.lineTo(-halfLength * 0.6, -halfWidth * 0.3);
        graphics.close();
        graphics.fill();
        // 右尾翼
        graphics.moveTo(-halfLength * 0.8, halfWidth * 0.3);
        graphics.lineTo(-halfLength, halfWidth);
        graphics.lineTo(-halfLength * 0.6, halfWidth * 0.3);
        graphics.close();
        graphics.fill();
        
        // === 5. 火箭主体边框（增强立体感）===
        graphics.strokeColor = new Color(200, 100, 0, 255); // 深橙色
        graphics.lineWidth = 1.5;
        graphics.ellipse(0, 0, halfLength, halfWidth);
        graphics.stroke();
    }
}

