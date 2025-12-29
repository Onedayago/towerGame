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
     * 绘制Boss外观
     * 使用渲染器处理绘制逻辑
     */
    protected drawAppearance(width: number, height: number) {
        if (!this.appearanceNode) return;
        
        const graphics = this.appearanceNode.getComponent(Graphics);
        if (!graphics) return;
        
        EnemyBossRenderer.render(graphics, width, height);
    }
}

