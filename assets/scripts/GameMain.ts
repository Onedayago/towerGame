import { _decorator, Component, Graphics, UITransform } from 'cc';
import { UiConfig } from './config/Index';
const { ccclass, property } = _decorator;

/**
 * 游戏主组件
 * 游戏根节点组件，负责初始化游戏画布
 */
@ccclass('gameMain')
export class gameMain extends Component {

    @property(Node)
    childNode: Node | null = null; // 在编辑器中拖拽子节点到这里

    start() {
        this.initTransform();
    }

    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        transform.setContentSize(UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        transform.setAnchorPoint(0, 0);
        // 设置位置使画布居中
        this.node.setPosition(-UiConfig.GAME_WIDTH / 2, -UiConfig.GAME_HEIGHT / 2, 0);
    }

    update(deltaTime: number) {
        // 更新逻辑可以在这里添加
    }
}

