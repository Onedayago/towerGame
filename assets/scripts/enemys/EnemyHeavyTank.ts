import { _decorator, Graphics } from 'cc';
import { EnemyBase } from './EnemyBase';
import { EnemyType } from '../constants/Index';
import { EnemyHeavyTankRenderer } from '../renderers/Index';
const { ccclass } = _decorator;

/**
 * 重型坦克敌人
 */
@ccclass('EnemyHeavyTank')
export class EnemyHeavyTank extends EnemyBase {
    
    start() {
        this.init(EnemyType.HEAVY_TANK);
    }
    
    /**
     * 绘制重型坦克外观
     * 使用渲染器处理绘制逻辑
     */
    protected drawAppearance(graphics: Graphics, width: number, height: number) {
        EnemyHeavyTankRenderer.render(graphics, width, height);
    }
}

