import { _decorator, Color, Graphics } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
import { CyberpunkColors } from '../../constants/Index';
import { EnemyHeavyTankBulletRenderer } from '../../renderers/Index';
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
     * 重型坦克子弹使用霓虹蓝色（赛博朋克风格）
     */
    protected getBulletColor(): Color {
        return CyberpunkColors.NEON_BLUE;
    }
    
    /**
     * 绘制重型坦克子弹外观：大圆形，带装甲效果
     * 使用渲染器处理绘制逻辑
     */
    protected drawBullet(graphics: Graphics, size: number) {
        EnemyHeavyTankBulletRenderer.render(graphics, size);
    }
}

