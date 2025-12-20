import { _decorator, Component, Node, Graphics, UITransform, Color, Vec2 } from 'cc';
import { UiConfig } from '../../config/Index';
const { ccclass, property } = _decorator;

@ccclass('WarContainer')
export class WarContainer extends Component {
    
    onLoad() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        // 设置大小为 画布宽度2倍 x 8个格子高
        const width = UiConfig.GAME_WIDTH;
        const height = UiConfig.CELL_SIZE * 4;
        transform.setContentSize(width, height);
        
       
        transform.setAnchorPoint(0, 0);
        
       
        this.node.setPosition(0, UiConfig.CELL_SIZE*2, 0);
        
        // 绘制红色背景
        graphics.fillColor = Color.RED;
       
        graphics.rect(0, 0, width, height);
        graphics.fill();

    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

