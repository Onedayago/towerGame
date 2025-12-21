import { _decorator, Graphics } from 'cc';
import { EnemyBase } from './EnemyBase';
import { EnemyType, getEnemyColor } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * 普通坦克敌人
 */
@ccclass('EnemyTank')
export class EnemyTank extends EnemyBase {
    
    start() {
        this.init(EnemyType.TANK);
    }
    
    /**
     * 绘制基础坦克外观
     */
    protected drawAppearance(graphics: Graphics, width: number, height: number) {
        const color = getEnemyColor(EnemyType.TANK);
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        
        graphics.clear();
        
        // 绘制坦克主体（矩形）
        graphics.strokeColor = color;
        graphics.lineWidth = 2;
        graphics.rect(-halfWidth * 0.8, -halfHeight * 0.6, width * 0.8, height * 0.6);
        graphics.stroke();
        
        // 绘制炮管（指向右侧）
        graphics.moveTo(halfWidth * 0.8, 0);
        graphics.lineTo(halfWidth, 0);
        graphics.stroke();
        
        // 绘制炮管前端（圆形）
        graphics.fillColor = color;
        graphics.circle(halfWidth, 0, 2);
        graphics.fill();
        
        // 添加履带
        graphics.fillColor = color;
        graphics.rect(-halfWidth * 0.8, -halfHeight * 0.6, width * 0.8, 2);
        graphics.fill();
        graphics.rect(-halfWidth * 0.8, halfHeight * 0.6 - 2, width * 0.8, 2);
        graphics.fill();
    }
}
