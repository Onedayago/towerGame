import { Graphics, Color } from 'cc';
import { WeaponType, getWeaponColor } from '../../constants/Index';

/**
 * 火箭塔渲染器
 * 负责火箭塔的绘制逻辑（美化版：多层阴影、火箭底座、塔身、发射轨道、雷达系统）
 */
export class WeaponRocketRenderer {
    /**
     * 绘制火箭塔外观（美化版）
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    static render(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;

        graphics.clear();
        
        const baseWidth = width * 0.7;
        const baseHeight = width * 0.3;
        const towerWidth = width * 0.34;
        const towerHeight = width * 0.9;
        
        // === 1. 多层阴影 ===
        this.drawShadowLayers(graphics, baseWidth, baseHeight, towerWidth, towerHeight, width);
        
        // === 2. 火箭底座（装甲板）===
        this.drawRocketBase(graphics, baseWidth, baseHeight, width);
        
        // === 3. 稳定器（左右三角形支架）===
        this.drawStabilizers(graphics, baseWidth, baseHeight, width);
        
        // === 4. 火箭塔身（多层渐变）===
        this.drawRocketTower(graphics, towerWidth, towerHeight, width);
        
        // === 5. 发射轨道（导轨槽）===
        this.drawLaunchRails(graphics, width, towerWidth, towerHeight);
        
        // === 6. 导弹发射舱（紫色渐变）===
        this.drawMissilePods(graphics, width, towerWidth, towerHeight);
        
        // === 7. 雷达系统（黄色雷达圆盘）===
        this.drawRadarSystem(graphics, width, towerWidth, towerHeight);
    }
    
    /**
     * 绘制多层阴影
     */
    private static drawShadowLayers(graphics: Graphics, baseWidth: number, baseHeight: number, towerWidth: number, towerHeight: number, size: number): void {
        // 第一层阴影（主阴影）
        graphics.fillColor = new Color(0, 0, 0, 102); // rgba(0, 0, 0, 0.4)
        graphics.rect(-baseWidth / 2, -size / 2 + 7, baseWidth, size - 8);
        graphics.fill();
        
        // 第二层阴影（次阴影）
        graphics.fillColor = new Color(0, 0, 0, 64); // rgba(0, 0, 0, 0.25)
        graphics.rect(-baseWidth / 2 + 3, -size / 2 + 9, baseWidth - 6, size - 12);
        graphics.fill();
        
        // 第三层阴影（软阴影）
        graphics.fillColor = new Color(0, 0, 0, 26); // rgba(0, 0, 0, 0.1)
        graphics.rect(-baseWidth / 2 + 6, -size / 2 + 11, baseWidth - 12, size - 16);
        graphics.fill();
    }
    
    /**
     * 绘制火箭底座
     */
    private static drawRocketBase(graphics: Graphics, baseWidth: number, baseHeight: number, size: number): void {
        // 底座主体（装甲板）
        graphics.fillColor = new Color(55, 65, 81, 255); // #374151
        graphics.rect(-baseWidth / 2, size / 2 - baseHeight, baseWidth, baseHeight);
        graphics.fill();
        
        // 装甲边框
        graphics.strokeColor = new Color(15, 23, 42, 255); // #0f172a
        graphics.lineWidth = 3;
        graphics.rect(-baseWidth / 2, size / 2 - baseHeight, baseWidth, baseHeight);
        graphics.stroke();
        
        // 内层装甲板
        const innerWidth = baseWidth * 0.85;
        const innerHeight = baseHeight * 0.6;
        graphics.fillColor = new Color(71, 85, 105, 242); // rgba(71, 85, 105, 0.95)
        graphics.rect(-innerWidth / 2, size / 2 - innerHeight * 0.9, innerWidth, innerHeight);
        graphics.fill();
        
        graphics.strokeColor = new Color(217, 70, 239, 153); // rgba(217, 70, 239, 0.6) - 紫色细节
        graphics.lineWidth = 2;
        graphics.rect(-innerWidth / 2, size / 2 - innerHeight * 0.9, innerWidth, innerHeight);
        graphics.stroke();
        
        // 装甲分段线（6段）
        for (let i = 1; i < 6; i++) {
            const segmentX = -baseWidth / 2 + (baseWidth / 6) * i;
            graphics.strokeColor = new Color(30, 41, 59, 179); // rgba(30, 41, 59, 0.7)
            graphics.lineWidth = 2;
            graphics.moveTo(segmentX, size / 2 - baseHeight);
            graphics.lineTo(segmentX, size / 2);
            graphics.stroke();
        }
    }
    
    /**
     * 绘制稳定器
     */
    private static drawStabilizers(graphics: Graphics, baseWidth: number, baseHeight: number, size: number): void {
        const stabWidth = baseWidth * 0.2;
        const stabHeight = baseHeight * 1.2;
        
        for (let side = -1; side <= 1; side += 2) {
            const stabX = (baseWidth / 2) * side;
            
            // 稳定器主体（三角形）
            graphics.fillColor = new Color(71, 85, 105, 242); // rgba(71, 85, 105, 0.95)
            graphics.moveTo(stabX, size / 2 - baseHeight);
            graphics.lineTo(stabX + stabWidth * side, size / 2);
            graphics.lineTo(stabX, size / 2);
            graphics.close();
            graphics.fill();
            
            graphics.strokeColor = new Color(15, 23, 42, 230); // rgba(15, 23, 42, 0.9)
            graphics.lineWidth = 2;
            graphics.moveTo(stabX, size / 2 - baseHeight);
            graphics.lineTo(stabX + stabWidth * side, size / 2);
            graphics.lineTo(stabX, size / 2);
            graphics.close();
            graphics.stroke();
        }
    }
    
    /**
     * 绘制火箭塔身
     */
    private static drawRocketTower(graphics: Graphics, towerWidth: number, towerHeight: number, size: number): void {
        // 塔身主体（多层渐变模拟）
        graphics.fillColor = new Color(55, 65, 81, 255); // #374151
        graphics.rect(-towerWidth / 2, -towerHeight / 2, towerWidth, towerHeight);
        graphics.fill();
        
        // 塔身发光边框
        graphics.strokeColor = new Color(217, 70, 239, 255); // #d946ef - 紫色发光
        graphics.lineWidth = 3;
        graphics.rect(-towerWidth / 2, -towerHeight / 2, towerWidth, towerHeight);
        graphics.stroke();
        
        // 塔身装甲板（3块）
        const plateHeight = towerHeight * 0.25;
        for (let i = 0; i < 3; i++) {
            const plateY = -towerHeight / 2 + towerHeight * (0.15 + i * 0.28);
            const plateWidth = towerWidth * 0.85;
            
            graphics.fillColor = new Color(30, 41, 59, 204); // rgba(30, 41, 59, 0.8)
            graphics.rect(-plateWidth / 2, plateY, plateWidth, plateHeight);
            graphics.fill();
            
            graphics.strokeColor = new Color(15, 23, 42, 179); // rgba(15, 23, 42, 0.7)
            graphics.lineWidth = 1;
            graphics.rect(-plateWidth / 2, plateY, plateWidth, plateHeight);
            graphics.stroke();
        }
        
        // 观察窗（3个，青色发光）
        const windowWidth = towerWidth * 0.28;
        const windowHeight = towerHeight * 0.12;
        
        for (let i = 0; i < 3; i++) {
            const wy = -towerHeight * 0.3 + i * windowHeight * 1.8;
            
            // 窗口主体（青色）
            graphics.fillColor = new Color(6, 182, 212, 255); // #06b6d4
            graphics.rect(-windowWidth / 2, wy, windowWidth, windowHeight);
            graphics.fill();
            
            // 窗口边框
            graphics.strokeColor = new Color(6, 182, 212, 255); // #06b6d4
            graphics.lineWidth = 1.5;
            graphics.rect(-windowWidth / 2, wy, windowWidth, windowHeight);
            graphics.stroke();
            
            // 内部反光点
            graphics.fillColor = new Color(255, 255, 255, 179); // rgba(255, 255, 255, 0.7)
            graphics.circle(-windowWidth * 0.2, wy + windowHeight * 0.3, windowWidth * 0.12);
            graphics.fill();
        }
    }
    
    /**
     * 绘制发射轨道
     */
    private static drawLaunchRails(graphics: Graphics, size: number, towerWidth: number, towerHeight: number): void {
        const railWidth = towerWidth * 1.5;
        const railHeight = towerHeight * 0.25;
        const railY = -towerHeight * 0.05;
        
        // 导轨主体
        graphics.fillColor = new Color(15, 23, 42, 255); // #0f172a
        graphics.rect(-railWidth / 2, railY, railWidth, railHeight);
        graphics.fill();
        
        // 导轨边框
        graphics.strokeColor = new Color(51, 65, 85, 204); // rgba(51, 65, 85, 0.8)
        graphics.lineWidth = 2;
        graphics.rect(-railWidth / 2, railY, railWidth, railHeight);
        graphics.stroke();
        
        // 导轨槽（3条）
        graphics.strokeColor = new Color(0, 0, 0, 153); // rgba(0, 0, 0, 0.6)
        graphics.lineWidth = 1.5;
        for (let i = 0; i < 3; i++) {
            const slotY = railY + railHeight * (0.2 + i * 0.3);
            graphics.moveTo(-railWidth / 2 + railWidth * 0.1, slotY);
            graphics.lineTo(railWidth / 2 - railWidth * 0.1, slotY);
            graphics.stroke();
        }
    }
    
    /**
     * 绘制导弹发射舱
     */
    private static drawMissilePods(graphics: Graphics, size: number, towerWidth: number, towerHeight: number): void {
        const podWidth = towerWidth * 0.6;
        const podHeight = towerHeight * 0.35;
        const podY = -towerHeight * 0.42;
        
        // 发射舱主体（紫色渐变模拟）
        graphics.fillColor = new Color(217, 70, 239, 255); // #d946ef
        graphics.rect(-podWidth / 2, podY, podWidth, podHeight);
        graphics.fill();
        
        // 发射舱边框
        graphics.strokeColor = new Color(91, 33, 182, 255); // #5b21b6
        graphics.lineWidth = 2;
        graphics.rect(-podWidth / 2, podY, podWidth, podHeight);
        graphics.stroke();
        
        // 弹药指示条纹（3条）
        graphics.strokeColor = new Color(30, 27, 75, 179); // rgba(30, 27, 75, 0.7)
        graphics.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const stripeY = podY + podHeight * (0.25 + i * 0.25);
            graphics.moveTo(-podWidth / 2 + podWidth * 0.15, stripeY);
            graphics.lineTo(podWidth / 2 - podWidth * 0.15, stripeY);
            graphics.stroke();
        }
    }
    
    /**
     * 绘制雷达系统
     */
    private static drawRadarSystem(graphics: Graphics, size: number, towerWidth: number, towerHeight: number): void {
        const radarY = -towerHeight * 0.58;
        const radarRadius = towerWidth * 0.22;
        
        // 雷达主体（径向渐变模拟）
        graphics.fillColor = new Color(251, 191, 36, 255); // #fbbf24 - 黄色
        graphics.circle(0, radarY, radarRadius);
        graphics.fill();
        
        // 雷达边框
        graphics.strokeColor = new Color(251, 191, 36, 255); // #fbbf24
        graphics.lineWidth = 2.5;
        graphics.circle(0, radarY, radarRadius);
        graphics.stroke();
        
        // 雷达扫描环
        graphics.strokeColor = new Color(253, 224, 71, 179); // rgba(253, 224, 71, 0.7)
        graphics.lineWidth = 1.5;
        graphics.circle(0, radarY, radarRadius * 0.7);
        graphics.stroke();
        
        graphics.strokeColor = new Color(253, 224, 71, 128); // rgba(253, 224, 71, 0.5)
        graphics.lineWidth = 1;
        graphics.circle(0, radarY, radarRadius * 0.45);
        graphics.stroke();
        
        // 雷达核心
        const coreRadius = radarRadius * 0.25;
        graphics.fillColor = new Color(255, 255, 255, 255); // 白色
        graphics.circle(0, radarY, coreRadius);
        graphics.fill();
        
        // 雷达扫描线（4条）
        graphics.strokeColor = new Color(251, 191, 36, 153); // rgba(251, 191, 36, 0.6)
        graphics.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI / 2) * i;
            graphics.moveTo(0, radarY);
            graphics.lineTo(Math.cos(angle) * radarRadius * 0.8, radarY + Math.sin(angle) * radarRadius * 0.8);
            graphics.stroke();
        }
    }
}

