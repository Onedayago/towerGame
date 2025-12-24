import { _decorator, Component, Node, Graphics, UITransform, UIOpacity } from 'cc';
import { UiConfig } from '../../../config/Index';
import { WarView } from './Index';
import { EnemyManager, WeaponManager } from '../../../managers/Index';
import { MiniMapRenderer } from '../../../renderers/Index';
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
    private baseNode: Node | null = null;
    
    // 更新间隔（秒）
    private readonly UPDATE_INTERVAL = 0.1;
    private updateTimer: number = 0;

    onLoad() {
        this.initTransform();
        this.initOpacity();
        this.initGraphics();
        this.findWarView();
    }
    
    /**
     * 初始化透明度
     */
    private initOpacity() {
        // 添加 UIOpacity 组件，设置透明度为 80%（0.8）
        let uiOpacity = this.node.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = this.node.addComponent(UIOpacity);
        }
        // 设置透明度为 200（约 78% 不透明，22% 透明）
        uiOpacity.opacity = 200;
    }

    /**
     * 初始化节点变换属性
     * 位置和大小由编辑器处理
     */
    private initTransform() {
        // 位置和大小由编辑器处理，这里只确保有 UITransform 组件
        const transform = this.node.getComponent(UITransform);
        if (!transform) {
            this.node.addComponent(UITransform);
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
                
                // 查找基地节点（Home 节点）
                this.baseNode = this.warViewNode.getChildByName('Home');
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

        // 使用渲染器绘制背景（只绘制边框）
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

        // 使用渲染器绘制基地位置
        MiniMapRenderer.renderBase(
            this.graphics,
            minimapWidth,
            minimapHeight,
            this.warViewNode,
            this.baseNode
        );
    }

}

