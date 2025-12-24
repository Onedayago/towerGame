import { _decorator, Component, Graphics, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
import { ObstacleType } from '../constants/Index';
const { ccclass, property } = _decorator;

/**
 * 障碍物基类
 * 所有障碍物类型都继承此类
 */
@ccclass('ObstacleBase')
export class ObstacleBase extends Component {
    
    protected obstacleType: ObstacleType;
    protected graphics: Graphics | null = null;
    
    onLoad() {
        this.initTransform();
        this.initGraphics();
    }
    
    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        const transform = this.node.getComponent(UITransform);
        if (!transform) {
            this.node.addComponent(UITransform);
        }
    }
    
    /**
     * 初始化 Graphics 组件
     */
    private initGraphics() {
        this.graphics = this.node.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.node.addComponent(Graphics);
        }
    }
    
    /**
     * 获取障碍物类型
     * 子类必须重写此方法返回对应的障碍物类型
     */
    protected getObstacleType(): ObstacleType {
        return ObstacleType.ROCK; // 默认值，子类应该重写
    }
    
    /**
     * 绘制障碍物
     * 子类必须重写此方法实现自己的外观绘制
     */
    protected drawObstacle() {
        // 由子类实现
    }
    
    /**
     * 初始化障碍物
     * 设置大小和绘制外观
     */
    protected initObstacle() {
        const transform = this.node.getComponent(UITransform);
        if (!transform || !this.graphics) return;
        
        // 设置锚点为左下角
        transform.setAnchorPoint(0, 0);
        
        // 设置大小为格子大小
        const size = UiConfig.CELL_SIZE;
        transform.setContentSize(size, size);
        
        // 绘制障碍物外观
        this.drawObstacle();
    }
    
    start() {
        this.obstacleType = this.getObstacleType();
        this.initObstacle();
    }
}

