import { _decorator, Graphics, UITransform } from 'cc';
import { ObstacleBase } from './ObstacleBase';
import { ObstacleType } from '../constants/Index';
import { BoxObstacleRenderer } from '../renderers/obstacles/BoxObstacleRenderer';
const { ccclass } = _decorator;

/**
 * 箱子障碍物
 * 参考原游戏：方形箱子/集装箱障碍物
 */
@ccclass('BoxObstacle')
export class BoxObstacle extends ObstacleBase {
    
    /**
     * 重写障碍物类型
     */
    protected getObstacleType(): ObstacleType {
        return ObstacleType.BOX;
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
        
        // 使用渲染器绘制箱子
        BoxObstacleRenderer.render(this.graphics, width, height);
    }
}

