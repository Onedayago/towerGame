import { Graphics, Color } from 'cc';
import { CyberpunkColors } from '../../../constants/Index';

/**
 * 火箭塔子弹渲染器
 * 负责火箭塔子弹的绘制逻辑（增强版：多层发光效果 + 炫酷尾迹）
 * 参考原游戏：椭圆形火箭主体，带渐变和尾迹效果
 */
export class WeaponRocketBulletRenderer {
    /**
     * 绘制火箭子弹外观（增强版：多层发光效果 + 炫酷尾迹）
     * @param graphics Graphics 组件
     * @param size 子弹大小
     */
    static render(graphics: Graphics, size: number): void {
        if (!graphics) return;

        const rocketLength = size * 1.2;
        const rocketWidth = size * 0.6;
        const halfLength = rocketLength / 2;
        const halfWidth = rocketWidth / 2;
        
        // === 1. 外层光晕 - 大范围发光效果 ===
        graphics.fillColor = new Color(255, 140, 0, 60); // 橙色，低透明度
        graphics.circle(-halfLength, 0, halfWidth * 2.5);
        graphics.fill();
        
        // === 2. 中层推进光晕 - 增强发光 ===
        graphics.fillColor = new Color(255, 165, 0, 120); // 亮橙色
        graphics.circle(-halfLength, 0, halfWidth * 2.0);
        graphics.fill();
        
        // === 3. 内层推进光晕 - 最亮核心 ===
        graphics.fillColor = new Color(255, 255, 100, 180); // 黄橙色，高亮度
        graphics.circle(-halfLength, 0, halfWidth * 1.5);
        graphics.fill();
        
        // === 4. 尾部火花效果（多个小圆点）===
        graphics.fillColor = new Color(255, 255, 150, 200);
        // 火花1
        graphics.circle(-halfLength * 1.1, -halfWidth * 0.3, halfWidth * 0.2);
        graphics.fill();
        // 火花2
        graphics.circle(-halfLength * 1.1, halfWidth * 0.3, halfWidth * 0.2);
        graphics.fill();
        // 火花3（中心）
        graphics.circle(-halfLength * 1.15, 0, halfWidth * 0.25);
        graphics.fill();
        
        // === 5. 火箭主体外层（深橙色渐变）===
        const rocketColor = CyberpunkColors.BULLET_ROCKET;
        graphics.fillColor = new Color(
            Math.floor(rocketColor.r * 0.7),
            Math.floor(rocketColor.g * 0.5),
            Math.floor(rocketColor.b * 0.3),
            255
        );
        graphics.ellipse(0, 0, halfLength * 1.0, halfWidth * 0.7);
        graphics.fill();
        
        // === 6. 火箭主体中层（霓虹橙色）===
        graphics.fillColor = CyberpunkColors.BULLET_ROCKET;
        graphics.ellipse(0, 0, halfLength * 0.85, halfWidth * 0.6);
        graphics.fill();
        
        // === 7. 火箭主体内层（亮橙色）===
        graphics.fillColor = new Color(
            Math.min(255, Math.floor(rocketColor.r * 1.3)),
            Math.min(255, Math.floor(rocketColor.g * 1.2)),
            Math.min(255, Math.floor(rocketColor.b * 1.1)),
            255
        );
        graphics.ellipse(0, 0, halfLength * 0.65, halfWidth * 0.45);
        graphics.fill();
        
        // === 8. 火箭头部高光（白色，增强亮度）===
        graphics.fillColor = new Color(255, 255, 255, 255); // 纯白色，完全不透明
        graphics.circle(halfLength * 0.35, 0, halfWidth * 0.25);
        graphics.fill();
        // 头部外层光晕
        graphics.fillColor = new Color(255, 255, 200, 180);
        graphics.circle(halfLength * 0.35, 0, halfWidth * 0.35);
        graphics.fill();
        
        // === 9. 尾翼（左右各一个，增强发光边框）===
        const wingColor = new Color(
            Math.floor(rocketColor.r * 0.9),
            Math.floor(rocketColor.g * 0.7),
            Math.floor(rocketColor.b * 0.5),
            255
        );
        graphics.fillColor = wingColor;
        // 左尾翼
        graphics.moveTo(-halfLength * 0.8, -halfWidth * 0.3);
        graphics.lineTo(-halfLength * 0.95, -halfWidth * 1.1);
        graphics.lineTo(-halfLength * 0.6, -halfWidth * 0.3);
        graphics.close();
        graphics.fill();
        // 右尾翼
        graphics.moveTo(-halfLength * 0.8, halfWidth * 0.3);
        graphics.lineTo(-halfLength * 0.95, halfWidth * 1.1);
        graphics.lineTo(-halfLength * 0.6, halfWidth * 0.3);
        graphics.close();
        graphics.fill();
        
        // 尾翼发光边框
        graphics.strokeColor = new Color(255, 200, 100, 220);
        graphics.lineWidth = 1.5;
        // 左尾翼边框
        graphics.moveTo(-halfLength * 0.8, -halfWidth * 0.3);
        graphics.lineTo(-halfLength * 0.95, -halfWidth * 1.1);
        graphics.lineTo(-halfLength * 0.6, -halfWidth * 0.3);
        graphics.close();
        graphics.stroke();
        // 右尾翼边框
        graphics.moveTo(-halfLength * 0.8, halfWidth * 0.3);
        graphics.lineTo(-halfLength * 0.95, halfWidth * 1.1);
        graphics.lineTo(-halfLength * 0.6, halfWidth * 0.3);
        graphics.close();
        graphics.stroke();
        
        // === 10. 火箭主体发光边框（多层叠加）===
        // 外层边框（较暗）
        graphics.strokeColor = new Color(
            Math.floor(rocketColor.r * 0.9),
            Math.floor(rocketColor.g * 0.7),
            Math.floor(rocketColor.b * 0.5),
            200
        );
        graphics.lineWidth = 2.0;
        graphics.ellipse(0, 0, halfLength * 1.05, halfWidth * 0.75);
        graphics.stroke();
        
        // 内层边框（较亮）
        graphics.strokeColor = new Color(255, 200, 100, 255);
        graphics.lineWidth = 1.5;
        graphics.ellipse(0, 0, halfLength * 0.9, halfWidth * 0.65);
        graphics.stroke();
        
        // === 11. 中心能量核心（最亮点）===
        graphics.fillColor = new Color(255, 255, 255, 255);
        graphics.circle(halfLength * 0.1, 0, halfWidth * 0.15);
        graphics.fill();
    }
    
    /**
     * 绘制尾迹（动态绘制，不缓存，增强版：多层渐变尾迹）
     * 参考原游戏：从上一帧位置到当前位置的渐变线条
     * @param graphics Graphics 组件
     * @param lastX 上一帧位置 X（相对于节点）
     * @param lastY 上一帧位置 Y（相对于节点）
     * @param currentX 当前位置 X（相对于节点，通常是0）
     * @param currentY 当前位置 Y（相对于节点，通常是0）
     * @param size 子弹大小
     */
    static renderTrail(graphics: Graphics, lastX: number, lastY: number, currentX: number, currentY: number, size: number): void {
        if (!graphics) return;
        
        const dx = currentX - lastX;
        const dy = currentY - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0.1) {
            graphics.lineCap = Graphics.LineCap.ROUND;
            
            // === 1. 最外层尾迹（大范围，低透明度）===
            graphics.strokeColor = new Color(255, 140, 0, 50); // 橙色，低透明度
            graphics.lineWidth = size * 1.2;
            graphics.moveTo(lastX, lastY);
            graphics.lineTo(currentX, currentY);
            graphics.stroke();
            
            // === 2. 中层尾迹（中等范围，中等透明度）===
            graphics.strokeColor = new Color(255, 165, 0, 100); // 亮橙色
            graphics.lineWidth = size * 0.9;
            graphics.moveTo(lastX, lastY);
            graphics.lineTo(currentX, currentY);
            graphics.stroke();
            
            // === 3. 内层尾迹（霓虹橙色，较亮）===
            graphics.strokeColor = CyberpunkColors.createNeonGlow(CyberpunkColors.BULLET_ROCKET, 0.6);
            graphics.lineWidth = size * 0.6;
            graphics.moveTo(lastX, lastY);
            graphics.lineTo(currentX, currentY);
            graphics.stroke();
            
            // === 4. 核心尾迹（最亮，黄橙色）===
            graphics.strokeColor = new Color(255, 255, 150, 200); // 黄橙色，高亮度
            graphics.lineWidth = size * 0.35;
            graphics.moveTo(lastX, lastY);
            graphics.lineTo(currentX, currentY);
            graphics.stroke();
            
            // === 5. 最核心尾迹（纯白色，极高亮度）===
            graphics.strokeColor = new Color(255, 255, 255, 180); // 白色
            graphics.lineWidth = size * 0.2;
            graphics.moveTo(lastX, lastY);
            graphics.lineTo(currentX, currentY);
            graphics.stroke();
            
            // === 6. 尾迹边缘火花（多个小点）===
            graphics.fillColor = new Color(255, 255, 150, 180);
            const sparkCount = 3;
            for (let i = 0; i < sparkCount; i++) {
                const t = i / (sparkCount - 1);
                const sparkX = lastX + (currentX - lastX) * t;
                const sparkY = lastY + (currentY - lastY) * t;
                // 左右两侧火花
                const offset = (i % 2 === 0 ? 1 : -1) * size * 0.15;
                const perpX = -dy / dist * offset;
                const perpY = dx / dist * offset;
                graphics.circle(sparkX + perpX, sparkY + perpY, size * 0.08);
                graphics.fill();
            }
        }
    }
}
