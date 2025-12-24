import { _decorator, Graphics, Color, UITransform } from 'cc';
import { ObstacleBase } from './ObstacleBase';
import { ObstacleType } from '../constants/Index';
import { RockObstacleRenderer } from '../renderers/obstacles/RockObstacleRenderer';
const { ccclass } = _decorator;

/**
 * 岩石障碍物
 * 参考原游戏：不规则的岩石障碍物，阻挡敌人和武器视线
 */
@ccclass('RockObstacle')
export class RockObstacle extends ObstacleBase {
    
    /**
     * 重写障碍物类型
     */
    protected getObstacleType(): ObstacleType {
        return ObstacleType.ROCK;
    }
    
    /**
     * 重写绘制方法
     */
    protected drawObstacle() {
        if (!this.graphics) return;
        
        const transform = this.node.getComponent(UITransform);
        if (!transform) return;
        
        const width = transform.width;
        const height = transform.height;
        
        // 使用渲染器绘制岩石
        RockObstacleRenderer.render(this.graphics, width, height);
    }
}

