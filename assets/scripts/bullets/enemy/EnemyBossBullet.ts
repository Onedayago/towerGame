import { _decorator, Color, Graphics } from 'cc';
import { BulletBase } from '../BulletBase';
import { BulletType } from '../../constants/Index';
import { CyberpunkColors } from '../../constants/Index';
import { EnemyBossBulletRenderer } from '../../renderers/Index';
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
     * Boss子弹使用霓虹紫色（赛博朋克风格）
     */
    protected getBulletColor(): Color {
        return CyberpunkColors.NEON_PURPLE;
    }
    
    /**
     * 绘制Boss子弹外观：星形，带特殊效果
     * 使用渲染器处理绘制逻辑
     */
    protected drawBullet(graphics: Graphics, size: number) {
        EnemyBossBulletRenderer.render(graphics, size);
    }
}

