import { _decorator, Color } from 'cc';
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
}

