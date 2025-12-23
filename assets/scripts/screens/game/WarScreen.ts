import { _decorator, Component, UITransform, Graphics } from 'cc';
import { UiConfig } from '../../config/Index';
import { WarScreenRenderer } from '../../renderers/Index';
const { ccclass } = _decorator;

/**
 * 战争界面
 * 显示游戏主界面
 */
@ccclass('WarScreen')
export class WarScreen extends Component {

    private graphics: Graphics | null = null;

    onLoad() {
        this.initTransform();
        this.initBackground();
    }

    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        const transform = this.node.getComponent(UITransform);
        transform.setAnchorPoint(0, 0);
        transform.setContentSize(UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        this.node.setPosition(0, 0, 0);
    }
    
    /**
     * 初始化背景
     */
    private initBackground() {
        // 获取或创建 Graphics 组件
        this.graphics = this.node.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.node.addComponent(Graphics);
        }
        
        // 绘制背景
        const transform = this.node.getComponent(UITransform);
        if (transform && this.graphics) {
            WarScreenRenderer.renderBackground(this.graphics, transform);
        }
    }
}

