import { _decorator, Graphics } from 'cc';
import { EnemyBase } from './EnemyBase';
import { EnemyType } from '../constants/Index';
import { EnemyBossRenderer } from '../renderers/Index';
const { ccclass } = _decorator;

/**
 * Boss 敌人
 */
@ccclass('EnemyBoss')
export class EnemyBoss extends EnemyBase {
    
    start() {
        this.init(EnemyType.BOSS);
    }

    /**
     * Boss 可能有特殊的攻击逻辑
     */
    protected performAttack() {
        // Boss 的特殊攻击逻辑
        super.performAttack();
        // TODO: 可以添加额外的 Boss 攻击效果
    }
    
    /**
     * 绘制Boss外观
     * 使用渲染器处理绘制逻辑
     */
    protected drawAppearance(graphics: Graphics, width: number, height: number) {
        EnemyBossRenderer.render(graphics, width, height);
    }
}

