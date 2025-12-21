import { _decorator, Color, Graphics } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
const { ccclass } = _decorator;

/**
 * 重型坦克子弹
 * 重型坦克发射的子弹
 */
@ccclass('EnemyHeavyTankBullet')
export class EnemyHeavyTankBullet extends BulletBase {
    
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
        return BulletType.ENEMY_HEAVY_TANK;
    }

    /**
     * 重写子弹颜色
     * 重型坦克子弹使用深红色
     */
    protected getBulletColor(): Color {
        return new Color(139, 0, 0, 255); // 深红色
    }
    
    /**
     * 绘制重型坦克子弹外观：大圆形，带装甲效果
     */
    protected drawBullet(graphics: Graphics, size: number) {
        graphics.clear();
        const radius = size / 2 * 1.1; // 稍大一些
        
        // 绘制外圈（深红色）
        graphics.fillColor = new Color(139, 0, 0, 255);
        graphics.circle(0, 0, radius);
        graphics.fill();
        
        // 绘制中间层（稍亮的红色）
        graphics.fillColor = new Color(180, 0, 0, 255);
        graphics.circle(0, 0, radius * 0.7);
        graphics.fill();
        
        // 绘制内圈（更亮的红色）
        graphics.fillColor = new Color(220, 50, 50, 255);
        graphics.circle(0, 0, radius * 0.4);
        graphics.fill();
    }
}

