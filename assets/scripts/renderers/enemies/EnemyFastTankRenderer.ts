import { Graphics, Color } from 'cc';
import { EnemyType, getEnemyColor, CyberpunkColors } from '../../constants/Index';

/**
 * 快速坦克敌人渲染器
 * 负责快速坦克的绘制逻辑（美化版：流线型主体、推进器引擎、速度线条）
 */
export class EnemyFastTankRenderer {
    /**
     * 绘制快速坦克外观（美化版）
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    static render(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;

        graphics.clear();
        
        // === 1. 流线型主体（渐变设计）===
        this.drawStreamlinedBody(graphics, width);
        
        // === 3. 侧边推进器引擎 ===
        this.drawSideEngines(graphics, width);
        
        // === 4. 空气动力学导流板 ===
        this.drawAeroFins(graphics, width);
        
        // === 5. 速度线条装饰 ===
        this.drawSpeedLines(graphics, width);
        
        // === 6. 能量核心指示器 ===
        this.drawEnergyCore(graphics, width);
        
        // === 7. 前置传感器阵列 ===
        this.drawSensorArray(graphics, width);
        
        // === 8. 尾部推进光晕 ===
        this.drawThrusterGlow(graphics, width);
    }
    
    /**
     * 绘制流线型主体
     */
    private static drawStreamlinedBody(graphics: Graphics, size: number): void {
        // 主体（霓虹绿色渐变模拟）- 赛博朋克风格
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_GREEN, 0.95);
        graphics.rect(-size / 2, -size / 2, size, size);
        graphics.fill();
        
        // 边框（霓虹绿色发光）
        graphics.strokeColor = CyberpunkColors.NEON_GREEN;
        graphics.lineWidth = 2.5;
        graphics.rect(-size / 2, -size / 2, size, size);
        graphics.stroke();
        
        graphics.strokeColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.6);
        graphics.lineWidth = 1;
        graphics.rect(-size / 2, -size / 2, size, size);
        graphics.stroke();
    }
    
    /**
     * 绘制侧边推进器引擎
     */
    private static drawSideEngines(graphics: Graphics, size: number): void {
        // 上引擎（霓虹青色）- 赛博朋克风格
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.9);
        graphics.rect(-size / 2 + 3, -size / 2 + size * 0.25, size - 6, size * 0.12);
        graphics.fill();
        
        graphics.strokeColor = CyberpunkColors.NEON_CYAN;
        graphics.lineWidth = 1.5;
        graphics.rect(-size / 2 + 3, -size / 2 + size * 0.25, size - 6, size * 0.12);
        graphics.stroke();
        
        // 下引擎（对称）
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.9);
        graphics.rect(-size / 2 + 3, size / 2 - size * 0.37, size - 6, size * 0.12);
        graphics.fill();
        
        graphics.strokeColor = CyberpunkColors.NEON_CYAN;
        graphics.lineWidth = 1.5;
        graphics.rect(-size / 2 + 3, size / 2 - size * 0.37, size - 6, size * 0.12);
        graphics.stroke();
        
        // 引擎喷口细节（霓虹青色发光）
        for (let i = 0; i < 3; i++) {
            const ex = size / 2 - size * 0.15 - i * size * 0.12;
            graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.6);
            graphics.rect(ex, -size / 2 + size * 0.27, size * 0.02, size * 0.08);
            graphics.fill();
            graphics.rect(ex, size / 2 - size * 0.35, size * 0.02, size * 0.08);
            graphics.fill();
        }
    }
    
    /**
     * 绘制空气动力学导流板
     */
    private static drawAeroFins(graphics: Graphics, size: number): void {
        // 顶部导流高光
        graphics.fillColor = new Color(255, 255, 255, 128); // rgba(255, 255, 255, 0.5)
        graphics.rect(-size / 2 + 4, -size / 2 + 4, size - 8, size * 0.28);
        graphics.fill();
        
        // 前部尖锐导流板（霓虹青色）- 赛博朋克风格
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.7);
        graphics.moveTo(-size / 2 + 5, -size * 0.18);
        graphics.lineTo(-size / 2 + size * 0.25, -size * 0.08);
        graphics.lineTo(-size / 2 + size * 0.25, size * 0.08);
        graphics.lineTo(-size / 2 + 5, size * 0.18);
        graphics.close();
        graphics.fill();
        
        graphics.strokeColor = CyberpunkColors.NEON_CYAN;
        graphics.lineWidth = 1;
        graphics.moveTo(-size / 2 + 5, -size * 0.18);
        graphics.lineTo(-size / 2 + size * 0.25, -size * 0.08);
        graphics.lineTo(-size / 2 + size * 0.25, size * 0.08);
        graphics.lineTo(-size / 2 + 5, size * 0.18);
        graphics.close();
        graphics.stroke();
    }
    
    /**
     * 绘制速度线条装饰
     */
    private static drawSpeedLines(graphics: Graphics, size: number): void {
        // 侧边动态速度线（5条，霓虹青色）- 赛博朋克风格
        for (let i = 0; i < 5; i++) {
            const lineY = -size * 0.3 + i * size * 0.15;
            const lineLength = size * (0.3 + i * 0.08);
            
            graphics.strokeColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.5);
            graphics.lineWidth = 1.5;
            graphics.moveTo(size / 2 - lineLength, lineY);
            graphics.lineTo(size / 2, lineY);
            graphics.stroke();
        }
    }
    
    /**
     * 绘制能量核心指示器
     */
    private static drawEnergyCore(graphics: Graphics, size: number): void {
        const coreRadius = size * 0.14;
        
        // 外层脉冲光晕（霓虹青色）- 赛博朋克风格
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.3);
        graphics.circle(0, 0, coreRadius * 1.3);
        graphics.fill();
        
        // 核心主体（白色）
        graphics.fillColor = new Color(255, 255, 255, 255);
        graphics.circle(0, 0, coreRadius);
        graphics.fill();
        
        // 核心边框（霓虹青色发光）
        graphics.strokeColor = CyberpunkColors.NEON_CYAN;
        graphics.lineWidth = 2;
        graphics.circle(0, 0, coreRadius);
        graphics.stroke();
        
        // 内部速度符号（右箭头）
        graphics.fillColor = new Color(29, 61, 122, 204); // rgba(29, 61, 122, 0.8)
        graphics.moveTo(-coreRadius * 0.4, -coreRadius * 0.3);
        graphics.lineTo(coreRadius * 0.3, 0);
        graphics.lineTo(-coreRadius * 0.4, coreRadius * 0.3);
        graphics.close();
        graphics.fill();
    }
    
    /**
     * 绘制前置传感器阵列
     */
    private static drawSensorArray(graphics: Graphics, size: number): void {
        // 三个小传感器点
        for (let i = 0; i < 3; i++) {
            const sy = -size * 0.25 + i * size * 0.25;
            const sx = -size * 0.38;
            
            // 传感器外圈（霓虹青色）- 赛博朋克风格
            graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.5);
            graphics.circle(sx, sy, size * 0.045);
            graphics.fill();
            
            // 传感器核心（霓虹青色发光）
            graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.9);
            graphics.circle(sx, sy, size * 0.025);
            graphics.fill();
        }
    }
    
    /**
     * 绘制尾部推进光晕
     */
    private static drawThrusterGlow(graphics: Graphics, size: number): void {
        // 尾部光晕效果（推进器喷射，霓虹青色）- 赛博朋克风格
        graphics.fillColor = CyberpunkColors.createNeonGlow(CyberpunkColors.NEON_CYAN, 0.4);
        graphics.circle(size / 2, 0, size * 0.25);
        graphics.fill();
    }
}

