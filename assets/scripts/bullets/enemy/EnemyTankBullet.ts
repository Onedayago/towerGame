import { _decorator, Color, Graphics } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
import { EnemyTankBulletRenderer } from '../../renderers/Index';
const { ccclass } = _decorator;

/**
 * 坦克子弹
 * 坦克发射的子弹
 */
@ccclass('EnemyTankBullet')
export class EnemyTankBullet extends BulletBase {
    
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
        return BulletType.ENEMY_TANK;
    }

    /**
     * 重写子弹颜色
     * 坦克子弹使用红色
     */
    protected getBulletColor(): Color {
        return Color.RED;
    }
    
    /**
     * 绘制坦克子弹外观：实心圆形
     * 使用渲染器处理绘制逻辑
     */
    protected drawBullet(graphics: Graphics, size: number) {
        EnemyTankBulletRenderer.render(graphics, size);
    }
}

