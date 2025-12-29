import { Node, EventTouch, Vec2, Vec3, Graphics, Color, instantiate, Component, UITransform } from 'cc';
import { GridHelper } from '../utils/Index';
import { UiConfig } from '../config/Index';
import { WarView, WarScreen, WeaponCard } from '../screens/Index';
import { GoldManager } from '../managers/Index';
import { WeaponType } from '../constants/Index';
import { getWeaponBuildCost, getWeaponUpgradeConfig, getWeaponLevelConfig } from '../constants/Index';
import { PathFinder } from '../utils/PathFinder';

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
        
        // 隐藏金币显示节点（如果存在）
        const costDisplayNode = dragNode.getChildByName('CostDisplay');
        if (costDisplayNode) {
            costDisplayNode.active = false;
        }
        
        // 创建背景圆圈节点（用于显示可放置状态）
        // 需要在隐藏金币后创建，以便正确计算位置
        this.createBackgroundCircle(dragNode);
        
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
        
        // 更新拖拽节点的背景颜色（根据是否可以放置）
        this.updateDragNodeBackground(event);
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

        // 对齐到网格中心（武器锚点在中心）
        const snapped = GridHelper.snapToGrid(touchLocalPos.x, touchLocalPos.y, UiConfig.CELL_SIZE, true);
        
        // 使用 canPlaceWeapon 统一检查所有条件（包括路径检查）
        if (!this.canPlaceWeapon(snapped.x, snapped.y, warViewTransform)) {
            return; // 不能放置，退出
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

        // 检查是否有武器
        const weaponManager = warViewComponent.getWeaponManager();
        if (weaponManager && weaponManager.getWeaponAtPosition(x, y) !== null) {
            return true;
        }

        // 检查是否有敌人
        const enemyManager = warViewComponent.getEnemyManager();
        if (enemyManager && enemyManager.hasEnemyAt(x, y)) {
            return true;
        }

        // 检查是否在基地上
        if (this.isOnBase(x, y)) {
            return true;
        }

        return false;
    }
    
    /**
     * 检查位置是否在基地上
     * @param x X坐标
     * @param y Y坐标
     * @returns 如果位置在基地上返回 true，否则返回 false
     */
    private isOnBase(x: number, y: number): boolean {
        const warViewComponent = this.warViewNode!.getComponent(WarView);
        if (!warViewComponent) return false;
        
        const baseNode = warViewComponent.getBaseNode();
        if (!baseNode || !baseNode.isValid) return false;
        
        const baseTransform = baseNode.getComponent(UITransform);
        if (!baseTransform) return false;
        
        // 基地锚点在左下角(0,0)
        const basePos = baseNode.position;
        const baseLeft = basePos.x;
        const baseRight = basePos.x + baseTransform.width;
        const baseBottom = basePos.y;
        const baseTop = basePos.y + baseTransform.height;
        
        // 武器锚点在中心，检查武器中心是否在基地范围内
        const epsilon = 0.1; // 允许的误差范围
        if (x >= baseLeft - epsilon && x <= baseRight + epsilon &&
            y >= baseBottom - epsilon && y <= baseTop + epsilon) {
            return true;
        }
        
        return false;
    }

    /**
     * 放置武器到指定位置
     * @param x X坐标
     * @param y Y坐标
     */
    private placeWeapon(x: number, y: number) {
        const weaponCardComponent = this.cardNode.getComponent(WeaponCard);
        if (!weaponCardComponent || !weaponCardComponent.weaponPrefab) return;

        // 获取武器类型和建造成本
        const weaponType = weaponCardComponent.weaponType;
        const cost = getWeaponBuildCost(weaponType);
        
        // 检查是否有足够的金币
        const goldManager = GoldManager.getInstance();
        if (!goldManager.canAfford(cost)) {
            console.log(`Not enough gold to purchase weapon. Need: ${cost}, Have: ${goldManager.getGold()}`);
            return; // 金币不足，不放置武器
        }
        
        // 扣除金币
        if (!goldManager.spend(cost)) {
            console.log(`Failed to spend gold for weapon purchase`);
            return;
        }
        
        console.log(`Purchased weapon ${weaponType} for ${cost} gold. Remaining: ${goldManager.getGold()}`);

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
     * 创建背景圆圈节点
     * @param dragNode 拖拽节点
     */
    private createBackgroundCircle(dragNode: Node) {
        // 查找或创建背景圆圈节点
        let backgroundNode = dragNode.getChildByName('BackgroundCircle');
        if (!backgroundNode) {
            backgroundNode = new Node('BackgroundCircle');
            backgroundNode.setParent(dragNode);
            
            // 将背景节点移到最下层（索引0）
            backgroundNode.setSiblingIndex(0);
            
            // 添加 UITransform
            const transform = backgroundNode.addComponent(UITransform);
            
            // 获取武器的1级攻击范围
            const weaponCardComponent = this.cardNode.getComponent(WeaponCard);
            let range = 60; // 默认1个格子的范围（60像素）
            if (weaponCardComponent) {
                const weaponType = weaponCardComponent.weaponType;
                const upgradeConfig = getWeaponUpgradeConfig(weaponType);
                const level1Config = getWeaponLevelConfig(upgradeConfig, 1);
                if (level1Config) {
                    range = level1Config.range;
                }
            }
            
            // 圆圈大小 = 攻击范围 * 2（因为range是半径，直径需要乘以2）
            const size = range * 2;
            transform.setContentSize(size, size);
            transform.setAnchorPoint(0.5, 0.5); // 中心锚点
            
            const cardTransform = dragNode.getComponent(UITransform);
            if (cardTransform) {
                
                // 查找武器节点，获取其位置
                // 武器节点通常是第一个子节点（除了 CostDisplay 和 BackgroundCircle）
                let weaponNode: Node | null = null;
                for (let child of dragNode.children) {
                    if (child.name !== 'CostDisplay' && child.name !== 'BackgroundCircle') {
                        weaponNode = child;
                        break;
                    }
                }
                
                if (weaponNode) {
                    // 背景位置在武器节点的位置（武器在卡片中心偏上）
                    const weaponPos = weaponNode.position;
                    backgroundNode.setPosition(weaponPos.x, weaponPos.y, 0);
                } else {
                    // 如果没有找到武器节点，使用卡片中心偏上的位置
                    // 卡片锚点在左下角(0,0)，武器通常在中心偏上
                    const centerX = cardTransform.width / 2;
                    const centerY = cardTransform.height / 2 + cardTransform.height * 0.15;
                    backgroundNode.setPosition(centerX, centerY, 0);
                }
            } else {
                // 如果没有卡片变换组件，默认位置在 (0, 0)
                backgroundNode.setPosition(0, 0, 0);
            }
            
            // 添加 Graphics
            backgroundNode.addComponent(Graphics);
        }
    }
    
    /**
     * 更新拖拽节点的背景颜色（根据是否可以放置）
     * @param event 触摸事件
     */
    private updateDragNodeBackground(event: EventTouch) {
        if (!this.dragNode || !this.warViewNode) return;
        
        // 获取触摸位置并转换为 WarView 的本地坐标
        const touchLocalPos = this.getTouchLocalPosition(event);
        if (!touchLocalPos) {
            this.setBackgroundColor(false);
            return;
        }
        
        const warViewTransform = this.warViewNode.getComponent(UITransform);
        if (!warViewTransform) {
            this.setBackgroundColor(false);
            return;
        }
        
        // 对齐到网格中心（武器锚点在中心）
        const snapped = GridHelper.snapToGrid(touchLocalPos.x, touchLocalPos.y, UiConfig.CELL_SIZE, true);
        
        // 检查是否可以放置
        const canPlace = this.canPlaceWeapon(snapped.x, snapped.y, warViewTransform);
        
        // 更新背景颜色
        this.setBackgroundColor(canPlace);
    }
    
    /**
     * 检查是否可以放置武器
     * @param x X坐标
     * @param y Y坐标
     * @param warViewTransform WarView 的变换组件
     * @returns 是否可以放置
     */
    private canPlaceWeapon(x: number, y: number, warViewTransform: UITransform): boolean {
        // 检查是否在 WarView 范围内
        if (!GridHelper.isInBounds(x, y, warViewTransform.width, warViewTransform.height)) {
            return false;
        }
        
        // 检查是否在前三列（前三列不能放置武器）
        const gridX = Math.floor(x / UiConfig.CELL_SIZE);
        if (gridX < 3) {
            return false;
        }
        
        // 检查位置是否已被占用（包括武器、障碍物、敌人、基地）
        if (this.isPositionOccupied(x, y)) {
            return false;
        }
        
        // 检查金币是否足够
        const weaponCardComponent = this.cardNode.getComponent(WeaponCard);
        if (!weaponCardComponent) return false;
        
        const weaponType = weaponCardComponent.weaponType;
        const cost = getWeaponBuildCost(weaponType);
        const goldManager = GoldManager.getInstance();
        if (!goldManager.canAfford(cost)) {
            return false;
        }
        
        // 检查放置武器后是否还有路径从敌人生成点到基地
        if (!this.checkPathAvailable(x, y)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * 检查放置武器后是否还有路径从敌人生成点到基地
     * @param weaponX 武器X坐标（世界坐标）
     * @param weaponY 武器Y坐标（世界坐标）
     * @returns 如果还有路径则返回 true，否则返回 false
     */
    private checkPathAvailable(weaponX: number, weaponY: number): boolean {
        if (!this.warViewNode) return false;
        
        const warViewComponent = this.warViewNode.getComponent(WarView);
        if (!warViewComponent) return false;
        
        // 获取敌人管理器和PathFinder
        const enemyManager = warViewComponent.getEnemyManager();
        if (!enemyManager) return false;
        
        const pathFinder = enemyManager.getPathFinder();
        if (!pathFinder) return false;
        
        // 获取基地中心位置
        const baseCenter = warViewComponent.getBaseCenterPosition();
        if (!baseCenter) return false;
        
        // 计算敌人生成点位置（第5行，最左边，从下往上数，索引为4）
        const cellSize = UiConfig.CELL_SIZE;
        const spawnX = cellSize / 2; // 第一个格子的中心X
        const spawnY = 4 * cellSize + cellSize / 2; // 第5行的中心Y
        
        // 将武器位置转换为网格坐标
        const weaponGridX = Math.floor(weaponX / cellSize);
        const weaponGridY = Math.floor(weaponY / cellSize);
        
        // 检查路径（将武器位置作为临时障碍物）
        const path = pathFinder.findPath(spawnX, spawnY, baseCenter.x, baseCenter.y, weaponGridX, weaponGridY);
        
        // 如果找到路径（路径长度 > 0），说明可以放置
        return path.length > 0;
    }
    
    /**
     * 设置背景圆圈颜色
     * @param canPlace 是否可以放置
     */
    private setBackgroundColor(canPlace: boolean) {
        if (!this.dragNode) return;
        
        const backgroundNode = this.dragNode.getChildByName('BackgroundCircle');
        if (!backgroundNode) return;
        
        const graphics = backgroundNode.getComponent(Graphics);
        if (!graphics) return;
        
        const transform = backgroundNode.getComponent(UITransform);
        if (!transform) return;
        
        graphics.clear();
        
        // 根据是否可以放置设置颜色
        if (canPlace) {
            // 绿色圆圈（可以放置）
            graphics.fillColor = new Color(0, 255, 0, 150); // 半透明绿色
        } else {
            // 红色圆圈（不可放置）
            graphics.fillColor = new Color(255, 0, 0, 150); // 半透明红色
        }
        
        // 绘制圆圈（考虑锚点在中心）
        const radius = Math.min(transform.width, transform.height) / 2;
        graphics.circle(0, 0, radius);
        graphics.fill();
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

