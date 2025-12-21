import { _decorator, Component, Graphics, UITransform, Color } from 'cc';
import { UiConfig } from '../../config/Index';
import { DrawHelper } from '../../utils/Index';
const { ccclass } = _decorator;

/**
 * 战争容器
 * 包含 WarView 的容器，提供红色背景
 */
@ccclass('WarContainer')
export class WarContainer extends Component {
    
    onLoad() {
        this.initTransform();
        this.drawBackground();
    }

    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        const transform = this.node.getComponent(UITransform);
        
        // 设置大小为画布宽度 x 4个格子高
        const width = UiConfig.GAME_WIDTH;
        const height = UiConfig.CELL_SIZE * 4;
        transform.setContentSize(width, height);
        transform.setAnchorPoint(0, 0);
        
        // 设置位置：距离底部 2 个格子的高度
        this.node.setPosition(0, UiConfig.CELL_SIZE * 2, 0);
    }

    /**
     * 绘制红色背景
     */
    private drawBackground() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        if (!graphics || !transform) return;
        
        DrawHelper.drawSolidBackground(
            graphics,
            0,
            0,
            transform.width,
            transform.height,
            Color.RED
        );
    }

    start() {
        // 初始化完成后的逻辑可以在这里添加
    }

    update(deltaTime: number) {
        // 更新逻辑可以在这里添加
    }
}

