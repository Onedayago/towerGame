import { _decorator, Graphics, UITransform } from 'cc';
import { ObstacleBase } from './ObstacleBase';
import { ObstacleType } from '../constants/Index';
import { WallObstacleRenderer } from '../renderers/obstacles/WallObstacleRenderer';
const { ccclass } = _decorator;

/**
 * 墙壁障碍物
 * 参考原游戏：直线墙壁，阻挡敌人路径
 */
@ccclass('WallObstacle')
export class WallObstacle extends ObstacleBase {
    
    /**
     * 重写障碍物类型
     */
    protected getObstacleType(): ObstacleType {
        return ObstacleType.WALL;
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
        
        // 使用渲染器绘制墙壁
        WallObstacleRenderer.render(this.graphics, width, height);
    }
}

