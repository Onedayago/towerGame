import { _decorator, Graphics } from 'cc';
import { EnemyBase } from './EnemyBase';
import { EnemyType, getEnemyColor } from '../constants/Index';
const { ccclass } = _decorator;

/**
 * Boss 敌人
 */
@ccclass('EnemyBoss')
export class EnemyBoss extends EnemyBase {
    
    start() {
        this.init(EnemyType.BOSS);
    }

    /**
     * Boss 可能有特殊的攻击逻辑
     */
    protected performAttack() {
        // Boss 的特殊攻击逻辑
        super.performAttack();
        // TODO: 可以添加额外的 Boss 攻击效果
    }
    
    /**
     * 绘制Boss外观
     */
    protected drawAppearance(graphics: Graphics, width: number, height: number) {
        const color = getEnemyColor(EnemyType.BOSS);
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        
        graphics.clear();
        
        // 绘制坦克主体（矩形，更大）
        graphics.strokeColor = color;
        graphics.lineWidth = 3;
        graphics.rect(-halfWidth * 0.8, -halfHeight * 0.6, width * 0.8, height * 0.6);
        graphics.stroke();
        
        // 绘制主炮管（指向右侧，更粗）
        graphics.lineWidth = 4;
        graphics.moveTo(halfWidth * 0.8, 0);
        graphics.lineTo(halfWidth, 0);
        graphics.stroke();
        
        // 绘制炮管前端（圆形）
        graphics.fillColor = color;
        graphics.circle(halfWidth, 0, 3);
        graphics.fill();
        
        // 添加双炮管
        graphics.lineWidth = 2;
        graphics.moveTo(halfWidth * 0.8, -halfHeight * 0.2);
        graphics.lineTo(halfWidth, -halfHeight * 0.2);
        graphics.stroke();
        graphics.moveTo(halfWidth * 0.8, halfHeight * 0.2);
        graphics.lineTo(halfWidth, halfHeight * 0.2);
        graphics.stroke();
        
        // 添加特殊标记（星形）
        graphics.moveTo(0, -halfHeight * 0.3);
        graphics.lineTo(2, 0);
        graphics.lineTo(0, halfHeight * 0.3);
        graphics.lineTo(-2, 0);
        graphics.close();
        graphics.stroke();
    }
}

