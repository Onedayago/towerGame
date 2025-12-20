import { _decorator, Color, Component, Graphics, Node, UITransform } from 'cc';
import { UiConfig } from '../config/Index';
const { ccclass, property } = _decorator;

@ccclass('EnemyTank')
export class EnemyTank extends Component {
    start() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        transform.setAnchorPoint(0, 0);
        // 设置大小为 1个格子
        const width = UiConfig.CELL_SIZE;
        const height = UiConfig.CELL_SIZE;
        transform.setContentSize(width, height);

        // 绘制红色背景
        graphics.fillColor = Color.YELLOW;
        graphics.rect(0, 0, width, height);
        graphics.fill();
    }

    update(deltaTime: number) {
        
    }
}

