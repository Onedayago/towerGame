import { _decorator, Graphics } from 'cc';
import { EnemyBase } from './EnemyBase';
import { EnemyType } from '../constants/Index';
import { EnemyFastTankRenderer } from '../renderers/Index';
const { ccclass } = _decorator;

/**
 * 快速坦克敌人
 */
@ccclass('EnemyFastTank')
export class EnemyFastTank extends EnemyBase {
    
    start() {
        this.init(EnemyType.FAST_TANK);
    }
    
    /**
     * 绘制快速坦克外观
     * 使用渲染器处理绘制逻辑
     */
    protected drawAppearance(graphics: Graphics, width: number, height: number) {
        EnemyFastTankRenderer.render(graphics, width, height);
    }
}

