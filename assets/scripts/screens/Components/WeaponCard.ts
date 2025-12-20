import { _decorator, Color, Component, Graphics, Node, UITransform } from 'cc';
import { UiConfig } from '../../config/Index';
const { ccclass, property } = _decorator;

@ccclass('WeaponCard')
export class WeaponCard extends Component {
    start() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        // 设置大小为 4个格子宽 x 2个格子高
        const width = UiConfig.CELL_SIZE;
        const height = UiConfig.CELL_SIZE;
        transform.setContentSize(width, height);

        // 绘制蓝色背景
        graphics.fillColor = Color.RED;
        graphics.rect(-width / 2, -height / 2, width, height);
        graphics.fill();
    }

    update(deltaTime: number) {
        
    }
}

