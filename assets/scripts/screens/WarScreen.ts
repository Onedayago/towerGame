import { _decorator, Component, Graphics, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
import { GridHelper } from '../utils/Index';
const { ccclass } = _decorator;

/**
 * 战争界面
 * 显示游戏主界面，包含网格背景
 */
@ccclass('WarScreen')
export class WarScreen extends Component {

    private graphics: Graphics | null = null;

    onLoad() {
        this.initTransform();
    }

    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        this.graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        transform.setAnchorPoint(0, 0);
        transform.setContentSize(UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        this.node.setPosition(0, 0, 0);
    }

    start() {
        this.drawGrid();
    }

    update(deltaTime: number) {
        // 更新逻辑可以在这里添加
    }

    /**
     * 绘制网格
     */
    private drawGrid() {
        if (!this.graphics) return;
        
        const transform = this.node.getComponent(UITransform);
        if (!transform) return;

        GridHelper.drawGrid(
            this.graphics,
            transform.width,
            transform.height
        );
    }
}

