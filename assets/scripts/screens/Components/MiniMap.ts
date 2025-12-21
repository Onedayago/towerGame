import { _decorator, Component, Node, Graphics, UITransform, Color, Vec3 } from 'cc';
import { UiConfig } from '../../config/Index';
import { WarView } from './Index';
import { WarContainer } from './Index';
import { EnemyManager, WeaponManager } from '../../managers/Index';
import { DrawHelper } from '../../utils/Index';
const { ccclass, property } = _decorator;

/**
 * 小地图组件
 * 显示战场上所有的武器和敌人
 */
@ccclass('MiniMap')
export class MiniMap extends Component {
    private graphics: Graphics | null = null;
    private warViewNode: Node | null = null;
    private warContainerNode: Node | null = null;
    private warViewComponent: WarView | null = null;
    private enemyManager: EnemyManager | null = null;
    private weaponManager: WeaponManager | null = null;
    
    // 更新间隔（秒）
    private readonly UPDATE_INTERVAL = 0.1;
    private updateTimer: number = 0;

    onLoad() {
        this.initTransform();
        this.initGraphics();
        this.findWarView();
        this.findWarContainer();
    }

    /**
     * 查找 WarContainer 节点
     */
    private findWarContainer() {
        const scene = this.node.scene;
        if (!scene) return;

        this.warContainerNode = this.findNodeWithComponent(scene, WarContainer);
    }

    /**
     * 初始化节点变换属性
     * 将 MiniMap 定位到左下角，设置尺寸为 4 个格子宽 x 2 个格子高
     */
    private initTransform() {
        const transform = this.node.getComponent(UITransform);
    
        if (!transform) {
            this.node.addComponent(UITransform);
        }
        
        const finalTransform = this.node.getComponent(UITransform);
        if (finalTransform) {
            // 设置锚点为左下角 (0, 0)
            finalTransform.setAnchorPoint(0, 0);
            
            // 设置尺寸：宽度 4 个格子，高度 2 个格子
            const width = UiConfig.CELL_SIZE * 4;
            const height = UiConfig.CELL_SIZE * 2;
            finalTransform.setContentSize(width, height);
            
            // 设置位置为左下角 (0, 0)
            this.node.setPosition(0, 0, 0);
        }
    }

    start() {
        // 初始化完成后绘制一次
        this.drawMiniMap();
    }

    update(deltaTime: number) {
        // 定时更新小地图
        this.updateTimer += deltaTime;
        if (this.updateTimer >= this.UPDATE_INTERVAL) {
            this.updateTimer = 0;
            this.drawMiniMap();
        }
    }

    /**
     * 初始化 Graphics 组件
     */
    private initGraphics() {
        this.graphics = this.node.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.node.addComponent(Graphics);
        }
    }

    /**
     * 查找 WarView 节点
     */
    private findWarView() {
        const scene = this.node.scene;
        if (!scene) return;

        // 递归查找 WarView 组件
        this.warViewNode = this.findNodeWithComponent(scene, WarView);
    
        if (this.warViewNode) {
            this.warViewComponent = this.warViewNode.getComponent(WarView);
            
            if (this.warViewComponent) {
                this.enemyManager = this.warViewComponent.getEnemyManager();
                this.weaponManager = this.warViewComponent.getWeaponManager();
            }
        }
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
     * 绘制小地图
     * 显示战场上所有的武器和敌人
     */
    private drawMiniMap() {
        if (!this.graphics || !this.warViewNode) return;

        const transform = this.node.getComponent(UITransform);
        if (!transform) return;

        const minimapWidth = transform.width;
        const minimapHeight = transform.height;

        // 清空之前的绘制
        this.graphics.clear();

        // 绘制背景
        this.drawBackground(minimapWidth, minimapHeight);

        // 绘制敌人位置
        this.drawEnemies(minimapWidth, minimapHeight);

        // 绘制武器位置
        this.drawWeapons(minimapWidth, minimapHeight);
    }

    /**
     * 绘制背景
     */
    private drawBackground(width: number, height: number) {
        if (!this.graphics) return;

        DrawHelper.drawTransparentRect(
            this.graphics,
            0,
            0,
            width,
            height,
            new Color(0, 0, 0, 180),
            Color.WHITE,
            2
        );
    }


    /**
     * 绘制敌人位置
     * 显示战场上所有的敌人
     */
    private drawEnemies(minimapWidth: number, minimapHeight: number) {
        if (!this.graphics || !this.warViewNode || !this.enemyManager) return;

        const enemies = this.enemyManager.getAllEnemies();
        if (enemies.length === 0) return;

        const warViewTransform = this.warViewNode.getComponent(UITransform);
        if (!warViewTransform) return;

        // 计算缩放比例（基于整个 WarView）
        const scale = this.calculateScale(minimapWidth, minimapHeight, warViewTransform);
        const offset = this.calculateOffset(minimapWidth, minimapHeight, warViewTransform, scale);

        // 绘制敌人位置（红色点）
        for (const enemy of enemies) {
            if (!enemy || !enemy.isValid) continue;

            const enemyPos = enemy.position;
            const minimapX = offset.x + enemyPos.x * scale;
            const minimapY = offset.y + enemyPos.y * scale;

            // 绘制小圆点
            DrawHelper.drawDot(this.graphics, minimapX, minimapY, 2, Color.RED);
        }
    }

    /**
     * 绘制武器位置
     * 显示战场上所有的武器
     */
    private drawWeapons(minimapWidth: number, minimapHeight: number) {
        if (!this.graphics || !this.warViewNode || !this.weaponManager) return;

        const weapons = this.weaponManager.getAllWeapons();
        if (weapons.length === 0) return;

        const warViewTransform = this.warViewNode.getComponent(UITransform);
        if (!warViewTransform) return;

        // 计算缩放比例（基于整个 WarView）
        const scale = this.calculateScale(minimapWidth, minimapHeight, warViewTransform);
        const offset = this.calculateOffset(minimapWidth, minimapHeight, warViewTransform, scale);
        
        // 绘制武器位置（蓝色点）
        for (const weapon of weapons) {
            if (!weapon || !weapon.isValid) continue;

            const weaponPos = weapon.position;
            const minimapX = offset.x + weaponPos.x * scale;
            const minimapY = offset.y + weaponPos.y * scale;

            // 绘制小方块
            DrawHelper.drawSquare(this.graphics, minimapX, minimapY, 3, Color.BLUE);
        }
    }


    /**
     * 计算缩放比例
     * 根据小地图的宽度和高度适配 WarView
     */
    private calculateScale(minimapWidth: number, minimapHeight: number, warViewTransform: UITransform): number {
        const warViewWidth = warViewTransform.width;
        const warViewHeight = warViewTransform.height;

        // 计算宽高比
        const minimapAspect = minimapWidth / minimapHeight;
        const warViewAspect = warViewWidth / warViewHeight;

        // 根据宽高比选择合适的缩放方式
        let scale: number;
        if (minimapAspect > warViewAspect) {
            // 小地图更宽，以高度为准
            scale = minimapHeight / warViewHeight;
        } else {
            // 小地图更高，以宽度为准
            scale = minimapWidth / warViewWidth;
        }

        // 不使用边距，完全填充
        return scale;
    }

    /**
     * 计算偏移量
     * 将 WarView 居中显示在小地图中
     */
    private calculateOffset(minimapWidth: number, minimapHeight: number, warViewTransform: UITransform, scale: number): Vec3 {
        const warViewWidth = warViewTransform.width;
        const warViewHeight = warViewTransform.height;

        const scaledWidth = warViewWidth * scale;
        const scaledHeight = warViewHeight * scale;
        
        // 居中显示
        const offsetX = (minimapWidth - scaledWidth) / 2;
        const offsetY = (minimapHeight - scaledHeight) / 2;

        return new Vec3(offsetX, offsetY, 0);
    }

    /**
     * 获取视野范围边界
     * @returns 视野范围在 WarView 中的位置和尺寸
     */
    private getViewportBounds(warViewTransform: UITransform, warContainerTransform: UITransform): { x: number; y: number; width: number; height: number } {
        // WarView 的位置就是视野范围左下角在 WarView 中的位置
        const warViewPos = this.warViewNode!.position;
        const viewportWidth = warContainerTransform.width;
        const viewportHeight = warContainerTransform.height;

        return {
            x: warViewPos.x,
            y: warViewPos.y,
            width: viewportWidth,
            height: viewportHeight
        };
    }

    /**
     * 检查位置是否在视野范围内
     */
    private isInViewport(pos: Vec3, viewport: { x: number; y: number; width: number; height: number }): boolean {
        return pos.x >= viewport.x &&
               pos.x <= viewport.x + viewport.width &&
               pos.y >= viewport.y &&
               pos.y <= viewport.y + viewport.height;
    }

    /**
     * 计算视野范围的缩放比例
     * 根据小地图的宽度和高度适配视野范围
     */
    private calculateViewportScale(minimapWidth: number, minimapHeight: number, viewport: { x: number; y: number; width: number; height: number }): number {
        // 计算宽高比
        const minimapAspect = minimapWidth / minimapHeight;
        const viewportAspect = viewport.width / viewport.height;

        // 根据宽高比选择合适的缩放方式
        let scale: number;
        if (minimapAspect > viewportAspect) {
            // 小地图更宽，以高度为准
            scale = minimapHeight / viewport.height;
        } else {
            // 小地图更高，以宽度为准
            scale = minimapWidth / viewport.width;
        }

        // 留出一些边距
        return scale * 0.95;
    }

    /**
     * 计算视野范围的偏移量
     * 将视野范围居中显示在小地图中
     */
    private calculateViewportOffset(minimapWidth: number, minimapHeight: number, viewport: { x: number; y: number; width: number; height: number }, scale: number): Vec3 {
        const scaledWidth = viewport.width * scale;
        const scaledHeight = viewport.height * scale;
        
        // 居中显示
        const offsetX = (minimapWidth - scaledWidth) / 2;
        const offsetY = (minimapHeight - scaledHeight) / 2;

        return new Vec3(offsetX, offsetY, 0);
    }
}

