import { _decorator, Color, Component, Graphics, Node, UITransform, EventTouch, Vec2, Vec3, instantiate } from 'cc';
import { UiConfig } from '../../config/Index';
import { WarView } from './WarView';
import { GridHelper } from '../../utils/Index';
const { ccclass, property } = _decorator;

@ccclass('WeaponCard')
export class WeaponCard extends Component {

    private isDragging: boolean = false;
    private lastTouchPos: Vec2 = new Vec2();
    private dragNode: Node | null = null;
    private warViewNode: Node | null = null;

    start() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        transform.setAnchorPoint(0, 0);
        // 设置大小为 1个格子
        const width = UiConfig.CELL_SIZE;
        const height = UiConfig.CELL_SIZE;
        transform.setContentSize(width, height);

        // 绘制红色背景
        graphics.fillColor = Color.RED;
        graphics.rect(0, 0, width, height);
        graphics.fill();

        // 查找 WarView 节点
        this.findWarViewNode();

        // 启用触摸事件
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    findWarViewNode() {
        // 从场景中查找 WarView 节点（通过组件类型查找）
        const scene = this.node.scene;
        if (scene) {
            // 递归查找所有节点
            const findNodeWithComponent = (node: Node, componentType: typeof Component): Node | null => {
                if (node.getComponent(componentType)) {
                    return node;
                }
                for (let child of node.children) {
                    const result = findNodeWithComponent(child, componentType);
                    if (result) {
                        return result;
                    }
                }
                return null;
            };
            
            this.warViewNode = findNodeWithComponent(scene, WarView);
        }
    }

    onTouchStart(event: EventTouch) {
        this.isDragging = true;
        const touchLocation = event.getUILocation();
        this.lastTouchPos = new Vec2(touchLocation.x, touchLocation.y);
        
        // 创建拖拽副本节点
        const dragNode = instantiate(this.node);
        dragNode.setParent(this.node.parent);
        dragNode.setPosition(this.node.position);
        
        // 设置透明度，表示正在拖拽
        const graphics = dragNode.getComponent(Graphics);
        if (graphics) {
            graphics.fillColor = new Color(255, 0, 0, 128);
        }
        
        this.dragNode = dragNode;
        
        // 提升拖拽节点层级，确保在最上层
        const parent = dragNode.parent;
        if (parent) {
            dragNode.setSiblingIndex(parent.children.length - 1);
        }
    }

    onTouchMove(event: EventTouch) {
        if (!this.isDragging || !this.dragNode) return;

        const touchLocation = event.getUILocation();
        const deltaX = touchLocation.x - this.lastTouchPos.x;
        const deltaY = touchLocation.y - this.lastTouchPos.y;

        const currentPos = this.dragNode.position;
        const newX = currentPos.x + deltaX;
        const newY = currentPos.y + deltaY;

        // 更新拖拽节点的位置，跟随手指移动
        this.dragNode.setPosition(newX, newY, 0);
        this.lastTouchPos = new Vec2(touchLocation.x, touchLocation.y);
    }

    onTouchEnd(event: EventTouch) {
        if (!this.isDragging || !this.dragNode) return;
        this.isDragging = false;

        // 检查是否在 WarView 范围内，如果是则对齐到格子并创建新节点
        if (this.warViewNode) {
            const warViewTransform = this.warViewNode.getComponent(UITransform);
            if (warViewTransform) {
                const worldPos = this.dragNode.worldPosition;
                const localPos = new Vec3();
                this.warViewNode.inverseTransformPoint(localPos, worldPos);

                if (GridHelper.isInBounds(localPos.x, localPos.y, warViewTransform.width, warViewTransform.height)) {
                    const snapped = GridHelper.snapToGrid(localPos.x, localPos.y);
                    const gridX = snapped.x;
                    const gridY = snapped.y;

                    const newCard = instantiate(this.node);
                    newCard.setParent(this.warViewNode);
                    newCard.setPosition(gridX, gridY, 0);
                    
                    const newGraphics = newCard.getComponent(Graphics);
                    if (newGraphics) {
                        newGraphics.fillColor = Color.RED;
                    }
                }
            }
        }

        // 销毁拖拽节点
        this.dragNode.destroy();
        this.dragNode = null;
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}

