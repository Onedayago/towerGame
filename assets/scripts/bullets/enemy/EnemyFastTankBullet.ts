import { _decorator, Color, Graphics } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
import { CyberpunkColors } from '../../constants/Index';
import { EnemyFastTankBulletRenderer } from '../../renderers/Index';
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
     * 快速坦克子弹使用霓虹绿色（赛博朋克风格）
     */
    protected getBulletColor(): Color {
        return CyberpunkColors.NEON_GREEN;
    }
    
    /**
     * 绘制快速坦克子弹外观：小圆形，带速度线条
     * 使用渲染器处理绘制逻辑
     */
    protected drawBullet(graphics: Graphics, size: number) {
        EnemyFastTankBulletRenderer.render(graphics, size);
    }
}

