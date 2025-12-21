import { Node, EventTouch, Vec2, Vec3, Graphics, Color, instantiate, Component, UITransform } from 'cc';
import { GridHelper } from '../utils/Index';
import { UiConfig } from '../config/Index';
import { WarView } from '../screens/Components/Index';
import { WarScreen } from '../screens/Index';
import { WeaponCard } from '../screens/Components/Index';

/**
 * 武器卡片拖拽处理器
 * 负责处理武器卡片的拖拽和放置逻辑
 */
export class WeaponCardDragHandler {
    private cardNode: Node;
    private warViewNode: Node | null = null;
    private warScreenNode: Node | null = null;
    private isDragging: boolean = false;
    private lastTouchPos: Vec2 = new Vec2();
    private dragNode: Node | null = null;

    constructor(cardNode: Node) {
        this.cardNode = cardNode;
        this.findWarViewNode();
        this.findWarScreenNode();
    }

    /**
     * 递归查找包含指定组件的节点
     * @param node 起始节点
     * @param componentType 组件类型
     * @returns 找到的节点，如果没有则返回 null
     */
    private findNodeWithComponent(node: Node, componentType: typeof Component): Node | null {
        if (node.getComponent(componentType)) {
            return node;
        }
        for (let child of node.children) {
            const result = this.findNodeWithComponent(child, componentType);
            if (result) {
                return result;
            }
        }
        return null;
    }

    /**
     * 查找 WarView 节点
     */
    private findWarViewNode() {
        const scene = this.cardNode.scene;
        if (scene) {
            this.warViewNode = this.findNodeWithComponent(scene, WarView);
        }
    }

    /**
     * 查找 WarScreen 节点
     */
    private findWarScreenNode() {
        const scene = this.cardNode.scene;
        if (scene) {
            this.warScreenNode = this.findNodeWithComponent(scene, WarScreen);
        }
    }

    /**
     * 处理触摸开始事件
     * 创建拖拽副本节点并初始化拖拽状态
     */
    onTouchStart(event: EventTouch) {
        if (!this.warScreenNode) return;
        
        this.isDragging = true;
        const touchLocation = event.getUILocation();
        this.lastTouchPos = new Vec2(touchLocation.x, touchLocation.y);
        
        // 创建拖拽副本节点
        this.dragNode = this.createDragNode();
        
        // 提升拖拽节点层级，确保在最上层显示
        this.bringDragNodeToFront();
    }

    /**
     * 创建拖拽节点
     * @returns 创建的拖拽节点
     */
    private createDragNode(): Node {
        const dragNode = instantiate(this.cardNode);
        
        // 将拖拽节点添加到 WarScreen 下
        dragNode.setParent(this.warScreenNode);
        
        // 将原始节点的世界坐标转换为 WarScreen 的本地坐标
        const worldPos = this.cardNode.worldPosition;
        const localPos = new Vec3();
        this.warScreenNode!.inverseTransformPoint(localPos, worldPos);
        dragNode.setPosition(localPos);
        
        // 禁用拖拽节点上的 WeaponCard 组件，避免拖拽时触发事件
        const weaponCardComponent = dragNode.getComponent('WeaponCard');
        if (weaponCardComponent) {
            (weaponCardComponent as Component).enabled = false;
        }
        
        // 设置半透明红色，表示正在拖拽
        const graphics = dragNode.getComponent(Graphics);
        if (graphics) {
            graphics.fillColor = new Color(255, 0, 0, 128);
        }
        
        return dragNode;
    }

    /**
     * 将拖拽节点提升到最上层
     */
    private bringDragNodeToFront() {
        if (!this.dragNode) return;
        
        const parent = this.dragNode.parent;
        if (parent) {
            this.dragNode.setSiblingIndex(parent.children.length - 1);
        }
    }

    /**
     * 处理触摸移动事件
     */
    onTouchMove(event: EventTouch) {
        if (!this.isDragging || !this.dragNode || !this.warScreenNode) return;

        const touchLocation = event.getUILocation();
        const deltaX = touchLocation.x - this.lastTouchPos.x;
        const deltaY = touchLocation.y - this.lastTouchPos.y;

        // 获取当前世界坐标
        const currentWorldPos = this.dragNode.worldPosition;
        const newWorldX = currentWorldPos.x + deltaX;
        const newWorldY = currentWorldPos.y + deltaY;
        
        // 将新的世界坐标转换为 WarScreen 的本地坐标
        const newWorldPos = new Vec3(newWorldX, newWorldY, 0);
        const localPos = new Vec3();
        this.warScreenNode.inverseTransformPoint(localPos, newWorldPos);

        // 更新拖拽节点的位置，跟随手指移动
        this.dragNode.setPosition(localPos);
        this.lastTouchPos = new Vec2(touchLocation.x, touchLocation.y);
    }

    /**
     * 处理触摸结束事件
     * 检查是否可以放置武器，如果可以则创建武器节点
     */
    onTouchEnd(event: EventTouch) {
        if (!this.isDragging || !this.dragNode) return;
        this.isDragging = false;

        // 尝试放置武器
        this.tryPlaceWeapon(event);

        // 无论是否成功放置，都要销毁拖拽节点
        this.destroyDragNode();
    }

    /**
     * 尝试放置武器
     * @param event 触摸事件
     */
    private tryPlaceWeapon(event: EventTouch) {
        if (!this.warViewNode || !this.dragNode) return;

        const warViewTransform = this.warViewNode.getComponent(UITransform);
        const dragNodeTransform = this.dragNode.getComponent(UITransform);
        
        if (!warViewTransform || !dragNodeTransform) return;

        // 获取触摸位置并转换为 WarView 的本地坐标
        const touchLocalPos = this.getTouchLocalPosition(event);
        if (!touchLocalPos) return;

        // 计算中心点位置（用于判断是否在范围内）
        const centerLocalPos = this.calculateCenterPosition(touchLocalPos, dragNodeTransform);
        
        // 检查是否在 WarView 范围内
        if (!GridHelper.isInBounds(centerLocalPos.x, centerLocalPos.y, warViewTransform.width, warViewTransform.height)) {
            return; // 不在范围内，不放置
        }

        // 对齐到网格中心（武器锚点在中心）
        const snapped = GridHelper.snapToGrid(touchLocalPos.x, touchLocalPos.y, UiConfig.CELL_SIZE, true);
        
        // 检查位置是否已被占用
        if (this.isPositionOccupied(snapped.x, snapped.y)) {
            return; // 位置已被占用，不放置
        }

        // 放置武器
        this.placeWeapon(snapped.x, snapped.y);
    }

    /**
     * 获取触摸位置在 WarView 的本地坐标
     * @param event 触摸事件
     * @returns 本地坐标，如果转换失败则返回 null
     */
    private getTouchLocalPosition(event: EventTouch): Vec3 | null {
        const touchLocation = event.getUILocation();
        const touchWorldPos = new Vec3(touchLocation.x, touchLocation.y, 0);
        
        const touchLocalPos = new Vec3();
        this.warViewNode!.inverseTransformPoint(touchLocalPos, touchWorldPos);
        
        return touchLocalPos;
    }

    /**
     * 计算中心点位置
     * @param nodeLocalPos 节点本地坐标
     * @param transform 节点变换组件
     * @returns 中心点本地坐标
     */
    private calculateCenterPosition(nodeLocalPos: Vec3, transform: UITransform): Vec3 {
        const width = transform.width;
        const height = transform.height;
        const anchorPoint = transform.anchorPoint;
        
        // 计算中心点偏移：中心点 = 节点位置 + (0.5 - 锚点) * 尺寸
        const centerOffsetX = (0.5 - anchorPoint.x) * width;
        const centerOffsetY = (0.5 - anchorPoint.y) * height;
        
        return new Vec3(
            nodeLocalPos.x + centerOffsetX,
            nodeLocalPos.y + centerOffsetY,
            nodeLocalPos.z
        );
    }

    /**
     * 检查位置是否已被占用
     * @param x X坐标
     * @param y Y坐标
     * @returns 如果位置已被占用返回 true，否则返回 false
     */
    private isPositionOccupied(x: number, y: number): boolean {
        const warViewComponent = this.warViewNode!.getComponent(WarView);
        if (!warViewComponent) return false;

        const weaponManager = warViewComponent.getWeaponManager();
        return weaponManager ? weaponManager.getWeaponAtPosition(x, y) !== null : false;
    }

    /**
     * 放置武器到指定位置
     * @param x X坐标
     * @param y Y坐标
     */
    private placeWeapon(x: number, y: number) {
        const weaponCardComponent = this.cardNode.getComponent(WeaponCard);
        if (!weaponCardComponent || !weaponCardComponent.weaponPrefab) return;

        // 实例化武器预制体
        const weaponNode = instantiate(weaponCardComponent.weaponPrefab);
        weaponNode.setPosition(x, y, 0);
        
        // 通过 WeaponManager 添加武器
        const warViewComponent = this.warViewNode!.getComponent(WarView);
        if (warViewComponent) {
            const weaponManager = warViewComponent.getWeaponManager();
            if (weaponManager) {
                weaponManager.addWeapon(weaponNode);
            } else {
                // 如果没有武器管理器，直接添加到 WarView
                weaponNode.setParent(this.warViewNode);
            }
        }
    }

    /**
     * 销毁拖拽节点（安全销毁，避免重复销毁）
     */
    private destroyDragNode() {
        if (this.dragNode && this.dragNode.isValid) {
            this.dragNode.destroy();
            this.dragNode = null;
        }
    }

    /**
     * 清理资源
     */
    destroy() {
        this.isDragging = false;
        // 安全销毁拖拽节点，避免重复销毁
        this.destroyDragNode();
        this.warViewNode = null;
        this.warScreenNode = null;
    }
}

