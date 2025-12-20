import { _decorator, Component, Node, Graphics, UITransform, Color } from 'cc';
import { UiConfig } from '../config/Index';
const { ccclass, property } = _decorator;

@ccclass('WarScreen')
export class WarScreen extends Component {

    private graphics: Graphics | null = null;

    onLoad() {
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
        
    }

    drawGrid() {
        const cellCountX = UiConfig.CELL_COUNT_X;
        const cellCountY = UiConfig.CELL_COUNT_Y;
        const cellSize = UiConfig.CELL_SIZE;
        
        // 设置线条颜色为红色
        this.graphics.strokeColor = Color.RED;
        this.graphics.lineWidth = 1;
        
        // 绘制竖线
        for (let j = 0; j <= cellCountX; j++) {
            const x = 0 + j * cellSize;
            const topY = UiConfig.GAME_HEIGHT;
            const bottomY = 0;
            this.graphics.moveTo(x, topY);
            this.graphics.lineTo(x, bottomY);
            this.graphics.stroke();
        }
        
        // 绘制横线
        for (let i = 0; i <= cellCountY; i++) {
            const y = UiConfig.GAME_HEIGHT - i * cellSize;
            const leftX = 0;
            const rightX = UiConfig.GAME_WIDTH;
            this.graphics.moveTo(leftX, y);
            this.graphics.lineTo(rightX, y);
            this.graphics.stroke();
        }
    }

}

