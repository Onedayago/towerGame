import { Graphics, Color } from 'cc';
import { CyberpunkColors } from '../../../constants/Index';

/**
 * 火箭塔子弹渲染器
 * 负责火箭塔子弹的绘制逻辑（美化版：多层发光效果 + 尾迹）
 * 参考原游戏：椭圆形火箭主体，带渐变和尾迹效果
 */
export class WeaponRocketBulletRenderer {
    /**
     * 绘制火箭子弹外观（美化版：多层发光效果 + 尾迹）
     * @param graphics Graphics 组件
     * @param size 子弹大小
     */
    static render(graphics: Graphics, size: number): void {
        if (!graphics) return;

        const rocketLength = size * 1.2;
        const rocketWidth = size * 0.6;
        const halfLength = rocketLength / 2;
        const halfWidth = rocketWidth / 2;
        
        // === 1. 尾部推进光晕 - 赛博朋克风格：霓虹橙色 ===
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.BULLET_ROCKET, 0.4);
        graphics.circle(-halfLength, 0, halfWidth * 1.5);
        graphics.fill();
        
        // === 2. 火箭主体（椭圆形，橙色渐变模拟）- 赛博朋克风格：霓虹橙色 ===
        // 使用赛博朋克霓虹橙色渐变
        const rocketColor = CyberpunkColors.BULLET_ROCKET;
        graphics.fillColor = new Color(
            Math.floor(rocketColor.r * 0.8),
            Math.floor(rocketColor.g * 0.6),
            Math.floor(rocketColor.b * 0.4),
            255
        ); // 深橙色（渐变起始）
        graphics.ellipse(0, 0, halfLength * 0.7, halfWidth * 0.5);
        graphics.fill();
        
        graphics.fillColor = CyberpunkColors.BULLET_ROCKET; // 霓虹橙色（渐变中间）
        graphics.ellipse(0, 0, halfLength * 0.85, halfWidth * 0.6);
        graphics.fill();
        
        graphics.fillColor = new Color(
            Math.min(255, Math.floor(rocketColor.r * 1.2)),
            Math.min(255, Math.floor(rocketColor.g * 1.1)),
            Math.min(255, Math.floor(rocketColor.b * 1.0)),
            255
        ); // 浅橙色（渐变结束）
        graphics.ellipse(0, 0, halfLength * 0.7, halfWidth * 0.5);
        graphics.fill();
        
        // === 3. 火箭头部高光（白色）===
        graphics.fillColor = new Color(255, 255, 255, 204); // rgba(255, 255, 255, 0.8)
        graphics.ellipse(halfLength * 0.3, 0, halfLength * 0.2, halfWidth * 0.15);
        graphics.fill();
        
        // === 4. 尾翼（左右各一个）- 赛博朋克风格：霓虹橙色 ===
        graphics.fillColor = new Color(
            Math.floor(rocketColor.r * 0.8),
            Math.floor(rocketColor.g * 0.6),
            Math.floor(rocketColor.b * 0.4),
            255
        ); // 深橙色
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
        
        // === 5. 火箭主体边框（增强立体感）- 赛博朋克风格：霓虹橙色 ===
        graphics.strokeColor = new Color(
            Math.floor(rocketColor.r * 0.8),
            Math.floor(rocketColor.g * 0.6),
            Math.floor(rocketColor.b * 0.4),
            255
        ); // 深橙色
        graphics.lineWidth = 1.5;
        graphics.ellipse(0, 0, halfLength, halfWidth);
        graphics.stroke();
    }
    
    /**
     * 绘制尾迹（动态绘制，不缓存）
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
            // 绘制尾迹线条（从上一帧位置到当前位置）
            // 使用渐变：从霓虹橙色到透明 - 赛博朋克风格
            graphics.strokeColor = CyberpunkColors.createNeonGlow(CyberpunkColors.BULLET_ROCKET, 0.4); // 起始
            graphics.lineWidth = size * 0.8;
            graphics.lineCap = Graphics.LineCap.ROUND;
            graphics.moveTo(lastX, lastY);
            graphics.lineTo(currentX, currentY);
            graphics.stroke();
            
            // 绘制更细的内层尾迹（更亮）- 赛博朋克风格：霓虹橙色
            graphics.strokeColor = CyberpunkColors.createNeonGlow(CyberpunkColors.BULLET_ROCKET, 0.7); // 内层
            graphics.lineWidth = size * 0.4;
            graphics.moveTo(lastX, lastY);
            graphics.lineTo(currentX, currentY);
            graphics.stroke();
        }
    }
}
