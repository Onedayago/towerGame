import { _decorator, Component, Node, Graphics, UITransform, Color, Vec2 } from 'cc';
import { UiConfig } from '../../config/Index';
const { ccclass, property } = _decorator;

@ccclass('WarContainer')
export class WarContainer extends Component {
    
    onLoad() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        // 设置大小为 画布宽度2倍 x 8个格子高
        const width = UiConfig.GAME_WIDTH * 2;
        const height = UiConfig.CELL_SIZE * 8;
        transform.setContentSize(width, height);
        
        // 设置锚点为左上角 (0, 1)
        transform.setAnchorPoint(0, 0);
        
        // 设置位置与画布左上角对齐
        // 画布左上角在坐标系中的位置是 (-GAME_WIDTH/2, GAME_HEIGHT/2)
        // this.node.setPosition(-UiConfig.GAME_WIDTH / 2, UiConfig.GAME_HEIGHT / 2, 0);
        
        // 绘制红色背景
        graphics.fillColor = Color.RED;
        // 由于锚点在左上角，矩形从 (0, 0) 开始绘制
        graphics.rect(0, -height, width, height);
        graphics.fill();

        // 创建一个新节点，大小为1个格子，蓝色背景，放置在左上角
        const cellNode = new Node('Cell');
        cellNode.setParent(this.node);
        cellNode.layer = this.node.layer;
        cellNode.active = true;
        const cellTransform = cellNode.addComponent(UITransform);
        
        const cellSize = UiConfig.CELL_SIZE;
        console.log(cellSize);
        cellTransform.setContentSize(cellSize, cellSize);
        
        // 设置锚点为左上角
        // cellTransform.setAnchorPoint(0.5, 0.5);
        
        // 设置位置在 WarContainer 的左上角
        // WarContainer 的左上角在本地坐标系中是 (-width/2, height/2)
        cellNode.setPosition(0, -100, 0);
        
        const cellGraphics = cellNode.addComponent(Graphics);
        console.log(cellGraphics);
        cellGraphics.fillColor = Color.BLUE;
        cellGraphics.rect(10, -cellSize, cellSize, cellSize);
        cellGraphics.fill();
        // cellNode.setSiblingIndex(1);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

