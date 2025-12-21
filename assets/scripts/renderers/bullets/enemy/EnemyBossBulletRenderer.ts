import { Graphics, Color } from 'cc';

/**
 * Boss子弹渲染器
 * 负责Boss子弹的绘制逻辑（美化版：多层发光效果 + 星形特殊效果）
 */
export class EnemyBossBulletRenderer {
    /**
     * 绘制Boss子弹外观（美化版：多层发光效果 + 星形特殊效果）
     * @param graphics Graphics 组件
     * @param size 子弹大小
     */
    static render(graphics: Graphics, size: number): void {
        if (!graphics) return;

        graphics.clear();
        const radius = size / 2;
        
        // === 1. 尾迹（多层发光效果）===
        // 最外层尾迹（紫色光晕）
        graphics.fillColor = new Color(128, 0, 128, 102); // rgba(128, 0, 128, 0.4)
        graphics.circle(0, 0, radius * 2.5);
        graphics.fill();
        
        // 外层发光
        graphics.fillColor = new Color(128, 0, 128, 153); // rgba(128, 0, 128, 0.6)
        graphics.circle(0, 0, radius * 1.8);
        graphics.fill();
        
        // 中层发光
        graphics.fillColor = new Color(200, 0, 200, 179); // rgba(200, 0, 200, 0.7)
        graphics.circle(0, 0, radius * 1.3);
        graphics.fill();
        
        // === 2. 外圈（紫色基础）===
        graphics.fillColor = new Color(128, 0, 128, 255);
        graphics.circle(0, 0, radius);
        graphics.fill();
        
        // === 3. 星形（5角星，亮紫色）===
        graphics.fillColor = new Color(200, 0, 200, 255);
        const points = 5;
        const angleStep = (Math.PI * 2) / points;
        const outerRadius = radius * 0.9;
        const innerRadius = radius * 0.5;
        
        graphics.moveTo(outerRadius, 0);
        for (let i = 0; i < points; i++) {
            const outerAngle = i * angleStep;
            const innerAngle = (i + 0.5) * angleStep;
            const outerX = Math.cos(outerAngle) * outerRadius;
            const outerY = Math.sin(outerAngle) * outerRadius;
            const innerX = Math.cos(innerAngle) * innerRadius;
            const innerY = Math.sin(innerAngle) * innerRadius;
            graphics.lineTo(outerX, outerY);
            graphics.lineTo(innerX, innerY);
        }
        graphics.close();
        graphics.fill();
        
        // === 4. 星形边框（发光效果）===
        graphics.strokeColor = new Color(255, 0, 255, 255); // 亮紫色
        graphics.lineWidth = 1.5;
        graphics.moveTo(outerRadius, 0);
        for (let i = 0; i < points; i++) {
            const outerAngle = i * angleStep;
            const innerAngle = (i + 0.5) * angleStep;
            const outerX = Math.cos(outerAngle) * outerRadius;
            const outerY = Math.sin(outerAngle) * outerRadius;
            const innerX = Math.cos(innerAngle) * innerRadius;
            const innerY = Math.sin(innerAngle) * innerRadius;
            graphics.lineTo(outerX, outerY);
            graphics.lineTo(innerX, innerY);
        }
        graphics.close();
        graphics.stroke();
        
        // === 5. 中心点（白色高光）===
        graphics.fillColor = Color.WHITE;
        graphics.circle(0, 0, radius * 0.2);
        graphics.fill();
        
        // === 6. 中心点光晕（增强发光效果）===
        graphics.fillColor = new Color(255, 255, 255, 128); // rgba(255, 255, 255, 0.5)
        graphics.circle(0, 0, radius * 0.35);
        graphics.fill();
    }
}

