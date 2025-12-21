import { _decorator, Color, Graphics } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
const { ccclass } = _decorator;

/**
 * Boss子弹
 * Boss发射的子弹
 */
@ccclass('EnemyBossBullet')
export class EnemyBossBullet extends BulletBase {
    
    start() {
        // 子弹在创建时通过 init() 方法初始化
        // 不需要在这里初始化
    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }

    /**
     * 重写子弹类型
     */
    protected getBulletType(): BulletType {
        return BulletType.ENEMY_BOSS;
    }

    /**
     * 重写子弹颜色
     * Boss子弹使用紫色
     */
    protected getBulletColor(): Color {
        return new Color(128, 0, 128, 255); // 紫色
    }
    
    /**
     * 绘制Boss子弹外观：星形，带特殊效果
     */
    protected drawBullet(graphics: Graphics, size: number) {
        graphics.clear();
        const radius = size / 2;
        
        // 绘制外圈（紫色）
        graphics.fillColor = new Color(128, 0, 128, 255);
        graphics.circle(0, 0, radius);
        graphics.fill();
        
        // 绘制星形（5角星）
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
        
        // 绘制中心点
        graphics.fillColor = Color.WHITE;
        graphics.circle(0, 0, radius * 0.2);
        graphics.fill();
    }
}

