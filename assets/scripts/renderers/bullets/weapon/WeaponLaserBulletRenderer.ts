import { Graphics, Color } from 'cc';

/**
 * 激光武器子弹渲染器
 * 负责激光武器子弹的绘制逻辑（美化版：多层发光效果）
 */
export class WeaponLaserBulletRenderer {
    /**
     * 绘制激光子弹外观（美化版：多层发光效果）
     * @param graphics Graphics 组件
     * @param size 子弹大小
     */
    static render(graphics: Graphics, size: number): void {
        if (!graphics) return;

        graphics.clear();
        const length = size * 1.5; // 激光束长度
        const width = size * 0.3;   // 激光束宽度
        
        // === 1. 外层光晕（能量扩散）===
        graphics.fillColor = new Color(0, 255, 255, 102); // rgba(0, 255, 255, 0.4)
        graphics.rect(-length / 2 - 2, -width / 2 - 2, length + 4, width + 4);
        graphics.fill();
        
        // === 2. 激光束主体（细长矩形，青色）===
        graphics.fillColor = Color.CYAN;
        graphics.rect(-length / 2, -width / 2, length, width);
        graphics.fill();
        
        // === 3. 激光束中心（更亮的白色线）===
        graphics.fillColor = Color.WHITE;
        graphics.rect(-length / 2, -width / 4, length, width / 2);
        graphics.fill();
        
        // === 4. 前端亮点（能量聚焦）===
        graphics.fillColor = Color.WHITE;
        graphics.circle(length / 2, 0, width / 2);
        graphics.fill();
        
        // === 5. 尾部能量拖尾 ===
        graphics.fillColor = new Color(0, 255, 255, 128); // rgba(0, 255, 255, 0.5)
        graphics.circle(-length / 2, 0, width / 2);
        graphics.fill();
    }
}

