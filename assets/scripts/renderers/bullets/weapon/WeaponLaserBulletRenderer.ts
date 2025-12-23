import { Graphics, Color } from 'cc';
import { CyberpunkColors } from '../../../constants/Index';

/**
 * 激光武器子弹渲染器
 * 参考原游戏：使用能量球沿路径排列，形成连续的激光束效果
 */
export class WeaponLaserBulletRenderer {
    // 能量球半径
    private static readonly ENERGY_BALL_RADIUS = 2;
    
    // 能量球之间的间距（稍微重叠，形成连续效果）
    private static readonly ENERGY_BALL_SPACING = 3; // radius * 1.5
    
    /**
     * 绘制激光束（使用能量球沿路径排列）
     * @param graphics Graphics 组件
     * @param x1 起始位置 X（相对于节点）
     * @param y1 起始位置 Y（相对于节点）
     * @param x2 结束位置 X（相对于节点）
     * @param y2 结束位置 Y（相对于节点）
     */
    static renderBeam(graphics: Graphics, x1: number, y1: number, x2: number, y2: number): void {
        if (!graphics) return;
        
        graphics.clear();
        
        // 计算长度和方向
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length <= 0) return;
        
        const radius = this.ENERGY_BALL_RADIUS;
        const spacing = this.ENERGY_BALL_SPACING;
        const numBalls = Math.ceil(length / spacing);
        
        // 计算每个能量球在路径上的位置
        for (let i = 0; i <= numBalls; i++) {
            const t = i / numBalls; // 0 到 1 的进度
            const ballX = x1 + dx * t;
            const ballY = y1 + dy * t;
            
            // 绘制能量球
            this.drawEnergyBall(graphics, ballX, ballY, radius);
        }
    }
    
    /**
     * 绘制单个能量球
     * 参考原游戏：多层渐变圆形，形成发光效果
     * @param graphics Graphics 组件
     * @param x 中心 X 坐标
     * @param y 中心 Y 坐标
     * @param radius 半径
     */
    private static drawEnergyBall(graphics: Graphics, x: number, y: number, radius: number): void {
        // === 1. 外层光晕（能量扩散）- 赛博朋克风格：霓虹粉色 ===
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.BULLET_LASER, 0.4);
        graphics.circle(x, y, radius * 2.5);
        graphics.fill();
        
        // === 2. 中层光晕 - 赛博朋克风格：霓虹粉色 ===
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.BULLET_LASER, 0.5);
        graphics.circle(x, y, radius * 1.8);
        graphics.fill();
        
        // === 3. 内层光晕 - 赛博朋克风格：霓虹粉色 ===
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.BULLET_LASER, 0.7);
        graphics.circle(x, y, radius * 1.3);
        graphics.fill();
        
        // === 4. 能量球主体 - 赛博朋克风格：霓虹粉色 ===
        graphics.fillColor = CyberpunkColors.BULLET_LASER;
        graphics.circle(x, y, radius);
        graphics.fill();
        
        // === 5. 中心亮点（白色高光）===
        graphics.fillColor = new Color(255, 255, 255, 204); // rgba(255, 255, 255, 0.8)
        graphics.circle(x - radius * 0.3, y - radius * 0.3, radius * 0.5);
        graphics.fill();
    }
    
    /**
     * 绘制激光子弹外观：细长的激光束（旧版，保留用于兼容）
     * @param graphics Graphics 组件
     * @param size 子弹大小
     */
    static render(graphics: Graphics, size: number): void {
        // 旧版渲染方法，保留用于兼容
        // 新版本应该使用 renderBeam 方法
        if (!graphics) return;

        graphics.clear();
        const length = size * 1.5; // 激光束长度
        const width = size * 0.3;   // 激光束宽度
        
        // === 1. 外层光晕（能量扩散）- 赛博朋克风格：霓虹粉色 ===
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.BULLET_LASER, 0.4);
        graphics.rect(-length / 2 - 2, -width / 2 - 2, length + 4, width + 4);
        graphics.fill();
        
        // === 2. 激光束主体（细长矩形）- 赛博朋克风格：霓虹粉色 ===
        graphics.fillColor = CyberpunkColors.BULLET_LASER;
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
        
        // === 5. 尾部能量拖尾 - 赛博朋克风格：霓虹粉色 ===
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.BULLET_LASER, 0.5);
        graphics.circle(-length / 2, 0, width / 2);
        graphics.fill();
    }
}
