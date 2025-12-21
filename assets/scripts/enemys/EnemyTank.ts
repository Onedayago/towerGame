import { _decorator, Graphics } from 'cc';
import { EnemyBase } from './EnemyBase';
import { EnemyType } from '../constants/Index';
import { EnemyTankRenderer } from '../renderers/Index';
const { ccclass } = _decorator;

/**
 * 普通坦克敌人
 */
@ccclass('EnemyTank')
export class EnemyTank extends EnemyBase {
    
    start() {
        this.init(EnemyType.TANK);
    }
    
    /**
     * 绘制基础坦克外观
     * 使用渲染器处理绘制逻辑
     */
    protected drawAppearance(graphics: Graphics, width: number, height: number) {
        EnemyTankRenderer.render(graphics, width, height);
    }
}
