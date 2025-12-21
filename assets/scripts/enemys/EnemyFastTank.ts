import { _decorator, Graphics } from 'cc';
import { EnemyBase } from './EnemyBase';
import { EnemyType, getEnemyColor } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 快速坦克敌人
 */
@ccclass('EnemyFastTank')
export class EnemyFastTank extends EnemyBase {
    
    start() {
        this.init(EnemyType.FAST_TANK);
    }
    
    /**
     * 绘制快速坦克外观
     */
    protected drawAppearance(graphics: Graphics, width: number, height: number) {
        const color = getEnemyColor(EnemyType.FAST_TANK);
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        
        graphics.clear();
        
        // 绘制坦克主体（矩形，更小）
        graphics.strokeColor = color;
        graphics.lineWidth = 2;
        graphics.rect(-halfWidth * 0.7, -halfHeight * 0.5, width * 0.7, height * 0.5);
        graphics.stroke();
        
        // 绘制炮管（指向右侧，更细）
        graphics.moveTo(halfWidth * 0.6, 0);
        graphics.lineTo(halfWidth, 0);
        graphics.stroke();
        
        // 绘制炮管前端（圆形）
        graphics.fillColor = color;
        graphics.circle(halfWidth, 0, 2);
        graphics.fill();
        
        // 添加速度线条
        graphics.moveTo(-halfWidth * 0.4, -halfHeight * 0.3);
        graphics.lineTo(-halfWidth * 0.2, -halfHeight * 0.3);
        graphics.stroke();
        graphics.moveTo(-halfWidth * 0.4, halfHeight * 0.3);
        graphics.lineTo(-halfWidth * 0.2, halfHeight * 0.3);
        graphics.stroke();
    }
}

