import { _decorator, Color } from 'cc';
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
}

