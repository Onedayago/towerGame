import { _decorator, Color } from 'cc';
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
}

