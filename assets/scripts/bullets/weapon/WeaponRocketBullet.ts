import { _decorator, Color, Graphics } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
import { WeaponRocketBulletRenderer } from '../../renderers/Index';
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
    
    /**
     * 绘制火箭子弹外观：火箭形状（带尾翼）
     * 使用渲染器处理绘制逻辑
     */
    protected drawBullet(graphics: Graphics, size: number) {
        WeaponRocketBulletRenderer.render(graphics, size);
    }
}

