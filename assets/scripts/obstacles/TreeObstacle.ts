import { _decorator, Graphics, UITransform } from 'cc';
import { ObstacleBase } from './ObstacleBase';
import { ObstacleType } from '../constants/Index';
import { TreeObstacleRenderer } from '../renderers/obstacles/TreeObstacleRenderer';
const { ccclass } = _decorator;

/**
 * 树木障碍物
 * 参考原游戏：树木障碍物，提供自然遮挡
 */
@ccclass('TreeObstacle')
export class TreeObstacle extends ObstacleBase {
    
    /**
     * 重写障碍物类型
     */
    protected getObstacleType(): ObstacleType {
        return ObstacleType.TREE;
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
        
        // 使用渲染器绘制树木
        TreeObstacleRenderer.render(this.graphics, width, height);
    }
}

