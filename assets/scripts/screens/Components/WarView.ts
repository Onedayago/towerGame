import { _decorator, Color, Component, Graphics, Node, UITransform, EventTouch, Vec2, Prefab } from 'cc';
import { UiConfig } from '../../config/Index';
const { ccclass, property } = _decorator;

@ccclass('WarView')
export class WarView extends Component {

    private lastTouchPos: Vec2 = new Vec2();
    private isDragging: boolean = false;
    private containerTransform: UITransform | null = null;
    graphics: any;

    @property(Prefab)
    public enemyTankPrefab: Prefab = null;

    onLoad() {
        this.graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        // 设置大小为 画布宽度2倍 x 8个格子高
        const width = UiConfig.GAME_WIDTH * 2;
        const height = UiConfig.CELL_SIZE * 8;
        transform.setContentSize(width, height);
        
       
        transform.setAnchorPoint(0, 0);
        

        this.node.setPosition(0, -UiConfig.CELL_SIZE*4, 0);
        
       
        // 获取父容器（WarContainer）的 UITransform
        const parent = this.node.parent;
        if (parent) {
            this.containerTransform = parent.getComponent(UITransform);
        }

        // 启用触摸事件
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.drawGrid();
    }

    onTouchStart(event: EventTouch) {
        this.isDragging = true;
        const touchLocation = event.getUILocation();
        console.log('touchLocation', touchLocation);
        this.lastTouchPos = new Vec2(touchLocation.x, touchLocation.y);
    }

    onTouchMove(event: EventTouch) {
        if (!this.isDragging) return;

        const touchLocation = event.getUILocation();
        const deltaX = touchLocation.x - this.lastTouchPos.x;
        const deltaY = touchLocation.y - this.lastTouchPos.y;
       
     
        const currentPos = this.node.position;
    
        let newX = currentPos.x + deltaX;
        let newY = currentPos.y + deltaY;
       
        // 限制在 WarContainer 范围内（原点在左下角，Y轴向上）
        if (this.containerTransform) {
            const containerWidth = this.containerTransform.width;
            const containerHeight = this.containerTransform.height;
            const viewWidth = this.node.getComponent(UITransform)!.width;
            const viewHeight = this.node.getComponent(UITransform)!.height;

            // 限制 X 坐标
            const minX = 0;
            const maxX = containerWidth - viewWidth;
            
            newX = Math.min(minX, Math.max(maxX, newX));
            
            // 限制 Y 坐标
            const maxY = 0;
            const minY = containerHeight - viewHeight;
            
            newY = Math.max(minY, Math.min(maxY, newY));
        }

        this.node.setPosition(newX, newY, 0);
        this.lastTouchPos = new Vec2(touchLocation.x, touchLocation.y);
    }

    onTouchEnd(event: EventTouch) {
        this.isDragging = false;
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    start() {
        
    }

    update(deltaTime: number) {
        
    }

    drawGrid() {
        const cellCountX = UiConfig.CELL_COUNT_X*2;
        const cellCountY = 8;
        const cellSize = UiConfig.CELL_SIZE;
        
        // 设置线条颜色为红色
        this.graphics.strokeColor = Color.RED;
        this.graphics.lineWidth = 1;
        
        // 绘制竖线
        for (let j = 0; j <= cellCountX; j++) {
            const x = 0 + j * cellSize;
            const topY = UiConfig.CELL_SIZE * 8;
            const bottomY = 0;
            this.graphics.moveTo(x, topY);
            this.graphics.lineTo(x, bottomY);
            this.graphics.stroke();
        }
        
        // 绘制横线
        for (let i = 0; i <= cellCountY; i++) {
            const y = UiConfig.CELL_SIZE * 8 - i * cellSize;
            const leftX = 0;
            const rightX = UiConfig.GAME_WIDTH*2;
            this.graphics.moveTo(leftX, y);
            this.graphics.lineTo(rightX, y);
            this.graphics.stroke();
        }
    }
}

