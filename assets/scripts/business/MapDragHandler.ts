import { Node, UITransform, EventTouch, Vec2 } from 'cc';

/**
 * 地图拖拽处理器
 * 负责处理地图视图的拖拽逻辑
 */
export class MapDragHandler {
    private targetNode: Node;
    private containerTransform: UITransform | null = null;
    private lastTouchPos: Vec2 = new Vec2();
    private isDragging: boolean = false;
    private enabled: boolean = true; // 是否启用拖拽

    constructor(targetNode: Node, containerNode: Node | null = null) {
        this.targetNode = targetNode;
        
        // 获取容器的 UITransform（用于边界限制）
        if (containerNode) {
            this.containerTransform = containerNode.getComponent(UITransform);
        }
    }

    /**
     * 处理触摸开始事件
     */
    onTouchStart(event: EventTouch) {
        if (!this.enabled) return;
        this.isDragging = true;
        const touchLocation = event.getUILocation();
        this.lastTouchPos = new Vec2(touchLocation.x, touchLocation.y);
    }

    /**
     * 处理触摸移动事件
     */
    onTouchMove(event: EventTouch) {
        if (!this.isDragging) return;

        const touchLocation = event.getUILocation();
        const deltaX = touchLocation.x - this.lastTouchPos.x;
        const deltaY = touchLocation.y - this.lastTouchPos.y;

        const currentPos = this.targetNode.position;
        let newX = currentPos.x + deltaX;
        let newY = currentPos.y + deltaY;

        // 限制在容器范围内
        const clampedPos = this.clampPosition(newX, newY);
        newX = clampedPos.x;
        newY = clampedPos.y;

        this.targetNode.setPosition(newX, newY, 0);
        this.lastTouchPos = new Vec2(touchLocation.x, touchLocation.y);
    }

    /**
     * 处理触摸结束事件
     */
    onTouchEnd(event: EventTouch) {
        this.isDragging = false;
    }

    /**
     * 限制位置在容器范围内
     * @param x X坐标
     * @param y Y坐标
     * @returns 限制后的坐标
     */
    private clampPosition(x: number, y: number): { x: number; y: number } {
        if (!this.containerTransform) {
            return { x, y };
        }

        const containerWidth = this.containerTransform.width;
        const containerHeight = this.containerTransform.height;
        const targetTransform = this.targetNode.getComponent(UITransform);
        
        if (!targetTransform) {
            return { x, y };
        }

        const viewWidth = targetTransform.width;
        const viewHeight = targetTransform.height;

        // 限制 X 坐标
        const minX = 0;
        const maxX = containerWidth - viewWidth;
        x = Math.min(minX, Math.max(maxX, x));

        // 限制 Y 坐标（原点在左下角，Y轴向上）
        const maxY = 0;
        const minY = containerHeight - viewHeight;
        y = Math.max(minY, Math.min(maxY, y));

        return { x, y };
    }

    /**
     * 设置是否启用拖拽
     * @param enabled 是否启用
     */
    setEnabled(enabled: boolean) {
        this.enabled = enabled;
        if (!enabled) {
            this.isDragging = false;
        }
    }

    /**
     * 清理资源
     */
    destroy() {
        this.isDragging = false;
        this.containerTransform = null;
    }
}

