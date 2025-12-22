import { _decorator, Component, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
const { ccclass } = _decorator;

/**
 * 战争界面
 * 显示游戏主界面
 */
@ccclass('WarScreen')
export class WarScreen extends Component {

    onLoad() {
        this.initTransform();
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
}

