import { _decorator, Color } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
const { ccclass } = _decorator;

/**
 * 火箭塔子弹
 * 火箭塔发射的子弹
 */
@ccclass('WeaponRocketBullet')
export class WeaponRocketBullet extends BulletBase {
    
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
        return BulletType.WEAPON_ROCKET;
    }

    /**
     * 重写子弹颜色
     * 火箭塔子弹使用橙色
     */
    protected getBulletColor(): Color {
        return new Color(255, 165, 0, 255); // 橙色
    }
}

