import { _decorator, Color } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
const { ccclass } = _decorator;

/**
 * 激光武器子弹
 * 激光武器发射的子弹
 */
@ccclass('WeaponLaserBullet')
export class WeaponLaserBullet extends BulletBase {
    
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
        return BulletType.WEAPON_LASER;
    }

    /**
     * 重写子弹颜色
     * 激光武器子弹使用青色
     */
    protected getBulletColor(): Color {
        return Color.CYAN;
    }
}

