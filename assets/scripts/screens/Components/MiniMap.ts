import { _decorator, Component, Node, Graphics, UITransform } from 'cc';
import { UiConfig } from '../../config/Index';
import { WarView } from './Index';
import { EnemyManager, WeaponManager } from '../../managers/Index';
import { MiniMapRenderer } from '../../renderers/Index';
const { ccclass, property } = _decorator;

/**
 * 小地图组件
 * 显示战场上所有的武器和敌人
 */
@ccclass('MiniMap')
export class MiniMap extends Component {
    private graphics: Graphics | null = null;
    private warViewNode: Node | null = null;
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
    }

    /**
     * 初始化节点变换属性
     * 将 MiniMap 定位到左下角，设置尺寸为 4 个格子宽 x 2 个格子高
     * 距离左边40边距，距离底部20边距，距离顶部20边距，缩小尺寸以适配
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
            
            // 左边距40，底部边距20，顶部边距20，缩小尺寸以适配
            const leftMargin = 40;
            const bottomMargin = 20;
            const topMargin = 20;
            
            // 缩小宽度和高度来适配边距
            const width = UiConfig.CELL_SIZE * 4 - leftMargin;
            const height = UiConfig.CELL_SIZE * 2 - bottomMargin - topMargin;
            finalTransform.setContentSize(width, height);
            
            // 设置位置：左边距40，底部边距20
            // 由于锚点是左下角，y 位置就是底部边距
            this.node.setPosition(leftMargin, bottomMargin, 0);
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

        // 获取 WarView 的 UITransform（用于绘制网格）
        const warViewTransform = this.warViewNode.getComponent(UITransform);

        // 使用渲染器绘制背景（包含网格）
        MiniMapRenderer.renderBackground(this.graphics, minimapWidth, minimapHeight, warViewTransform || undefined);

        // 使用渲染器绘制敌人位置
        MiniMapRenderer.renderEnemies(
            this.graphics,
            minimapWidth,
            minimapHeight,
            this.warViewNode,
            this.enemyManager
        );

        // 使用渲染器绘制武器位置
        MiniMapRenderer.renderWeapons(
            this.graphics,
            minimapWidth,
            minimapHeight,
            this.warViewNode,
            this.weaponManager
        );
    }

}

