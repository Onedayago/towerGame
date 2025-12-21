import { Node, EventTouch, Vec2, Vec3, Graphics, Color, instantiate, Component, UITransform, Camera, view } from 'cc';
import { GridHelper } from '../utils/Index';
import { WarView } from '../screens/Components/Index';
import { WarScreen } from '../screens/Index';
import { WeaponCard } from '../screens/Components/Index';
import { WeaponManager } from '../managers/Index';

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
     * 查找 WarView 节点
     */
    private findWarViewNode() {
        const scene = this.cardNode.scene;
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

    /**
     * 查找 WarScreen 节点
     */
    private findWarScreenNode() {
        const scene = this.cardNode.scene;
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
            
            this.warScreenNode = findNodeWithComponent(scene, WarScreen);
        }
    }

    /**
     * 处理触摸开始事件
     */
    onTouchStart(event: EventTouch) {
        if (!this.warScreenNode) return;
        
        this.isDragging = true;
        const touchLocation = event.getUILocation();
        this.lastTouchPos = new Vec2(touchLocation.x, touchLocation.y);
        
        // 创建拖拽副本节点
        const dragNode = instantiate(this.cardNode);
        
        // 将拖拽节点添加到 WarScreen 下
        dragNode.setParent(this.warScreenNode);
        
        // 将原始节点的世界坐标转换为 WarScreen 的本地坐标
        const worldPos = this.cardNode.worldPosition;
        const localPos = new Vec3();
        this.warScreenNode.inverseTransformPoint(localPos, worldPos);
        dragNode.setPosition(localPos);
        
        // 禁用拖拽节点上的 WeaponCard 组件，避免拖拽时触发事件
        const weaponCardComponent = dragNode.getComponent('WeaponCard');
        if (weaponCardComponent) {
            (weaponCardComponent as Component).enabled = false;
        }
        
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
     */
    onTouchEnd(event: EventTouch) {
        if (!this.isDragging || !this.dragNode) return;
        this.isDragging = false;

        // 检查是否在 WarView 范围内，如果是则对齐到格子并创建新节点
        if (this.warViewNode) {
            const warViewTransform = this.warViewNode.getComponent(UITransform);
            const dragNodeTransform = this.dragNode.getComponent(UITransform);
            
            if (warViewTransform && dragNodeTransform) {
                // 获取触摸位置（UI 坐标，相对于 Canvas）
                const touchLocation = event.getUILocation();
                
                // 将 UI 坐标转换为世界坐标
                // 对于 2D UI，UI 坐标通常可以直接作为世界坐标使用
                // 但需要确保坐标系统正确
                const touchWorldPos = new Vec3(touchLocation.x, touchLocation.y, 0);
                
                // 将触摸位置转换为 WarView 的本地坐标
                const touchLocalPos = new Vec3();
                this.warViewNode.inverseTransformPoint(touchLocalPos, touchWorldPos);
                
                // 计算拖拽节点的中心点偏移
                const dragNodeWidth = dragNodeTransform.width;
                const dragNodeHeight = dragNodeTransform.height;
                const anchorPoint = dragNodeTransform.anchorPoint;
                const centerOffsetX = (0.5 - anchorPoint.x) * dragNodeWidth;
                const centerOffsetY = (0.5 - anchorPoint.y) * dragNodeHeight;
                
                // 计算中心点在 WarView 的本地坐标
                const centerLocalPos = new Vec3(
                    touchLocalPos.x + centerOffsetX,
                    touchLocalPos.y + centerOffsetY,
                    touchLocalPos.z
                );

                // 使用中心点判断是否在 WarView 范围内
                if (GridHelper.isInBounds(centerLocalPos.x, centerLocalPos.y, warViewTransform.width, warViewTransform.height)) {
                    // 使用触摸位置（节点位置）对齐到网格
                    const snapped = GridHelper.snapToGrid(touchLocalPos.x, touchLocalPos.y);
                    
                    const gridX = snapped.x;
                    const gridY = snapped.y;

                    // 从原始 WeaponCard 获取武器预制体
                    const weaponCardComponent = this.cardNode.getComponent(WeaponCard);
                    if (weaponCardComponent && weaponCardComponent.weaponPrefab) {
                        // 实例化武器预制体
                        const weaponNode = instantiate(weaponCardComponent.weaponPrefab);
                        weaponNode.setPosition(gridX, gridY, 0);
                        
                        // 通过 WeaponManager 添加武器
                        const warViewComponent = this.warViewNode.getComponent(WarView);
                        
                        if (warViewComponent) {
                            const weaponManager = warViewComponent.getWeaponManager();
                            if (weaponManager) {
                                weaponManager.addWeapon(weaponNode);
                            } else {
                                // 如果没有武器管理器，直接添加到 WarView
                                weaponNode.setParent(this.warViewNode);
                            }
                        } else {
                            // 如果没有 WarView 组件，直接添加到 WarView 节点
                            weaponNode.setParent(this.warViewNode);
                        }
                        
                        // 武器预制体中的组件会在 start() 时自动调用 init() 初始化
                        // 不需要手动调用，因为每个武器预制体已经绑定了对应的武器类型
                    }
                }
            }
        }

        // 销毁拖拽节点
        this.destroyDragNode();
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

