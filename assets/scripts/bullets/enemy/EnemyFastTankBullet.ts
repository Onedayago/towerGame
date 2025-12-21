import { _decorator, Color, Graphics } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
const { ccclass } = _decorator;

/**
 * 快速坦克子弹
 * 快速坦克发射的子弹
 */
@ccclass('EnemyFastTankBullet')
export class EnemyFastTankBullet extends BulletBase {
    
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
        return BulletType.ENEMY_FAST_TANK;
    }

    /**
     * 重写子弹颜色
     * 快速坦克子弹使用浅红色
     */
    protected getBulletColor(): Color {
        return new Color(255, 100, 100, 255); // 浅红色
    }
    
    /**
     * 绘制快速坦克子弹外观：小圆形，带速度线条
     */
    protected drawBullet(graphics: Graphics, size: number) {
        graphics.clear();
        const radius = size / 2 * 0.8; // 稍小一些
        
        // 绘制外圈（浅红色）
        graphics.fillColor = new Color(255, 100, 100, 255);
        graphics.circle(0, 0, radius);
        graphics.fill();
        
        // 绘制速度线条（尾部）
        graphics.strokeColor = new Color(255, 150, 150, 255);
        graphics.lineWidth = 1;
        graphics.moveTo(-radius, 0);
        graphics.lineTo(-radius * 1.5, 0);
        graphics.stroke();
    }
}

