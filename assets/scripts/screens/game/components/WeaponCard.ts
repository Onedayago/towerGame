import { _decorator, Color, Component, Graphics, Node, UITransform, EventTouch, Prefab, instantiate, Label } from 'cc';
import { WeaponCardDragHandler } from '../../../business/Index';
import { WeaponType } from '../../../constants/Index';
import { getWeaponBuildCost } from '../../../config/Index';
import { UiConfig } from '../../../config/Index';
const { ccclass, property } = _decorator;

@ccclass('WeaponCard')
export class WeaponCard extends Component {

    private dragHandler: WeaponCardDragHandler | null = null;
    private weaponNode: Node | null = null;
    
    @property({ type: String, displayName: '武器类型' })
    public weaponType: WeaponType = WeaponType.BASIC;

    @property({ type: Prefab, displayName: '武器预制体' })
    public weaponPrefab: Prefab = null;

    start() {
        this.initCard();
    }

    /**
     * 初始化卡片
     */
    private initCard() {
        const transform = this.node.getComponent(UITransform);
        transform.setAnchorPoint(0, 0);
        // 设置大小为 1个格子
        const width = UiConfig.CELL_SIZE;
        const height = UiConfig.CELL_SIZE;
        transform.setContentSize(width, height);

        // 如果提供了武器预制体，则实例化武器
        if (this.weaponPrefab) {
            this.createWeapon();
        }

        // 初始化拖拽处理器
        this.dragHandler = new WeaponCardDragHandler(this.node);

        // 启用触摸事件
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    /**
     * 创建武器节点
     * 实例化武器预制体并添加到卡片中
     */
    private createWeapon() {
        if (!this.weaponPrefab) return;

        // 如果已存在武器节点，先销毁
        if (this.weaponNode) {
            this.weaponNode.destroy();
            this.weaponNode = null;
        }

        // 实例化武器预制体
        this.weaponNode = instantiate(this.weaponPrefab);
        this.weaponNode.setParent(this.node);
        
        // 设置武器节点位置（卡片锚点在左下角，武器锚点在中心，所以需要偏移到卡片中心偏上）
        const cardTransform = this.node.getComponent(UITransform);
        if (cardTransform) {
            const centerX = cardTransform.width / 2;
            // 武器位置稍微上移，为金币文本留出空间
            const centerY = cardTransform.height / 2 + cardTransform.height * 0.15;
            this.weaponNode.setPosition(centerX, centerY, 0);
        } else {
            this.weaponNode.setPosition(0, 0, 0);
        }
        
        // 创建金币显示
        this.createCostLabel();
    }
    
    /**
     * 创建金币显示
     * 使用 Label 组件显示金币数量
     */
    private createCostLabel() {
        // 获取武器建造成本
        const cost = getWeaponBuildCost(this.weaponType);
        
        // 查找或创建金币显示节点
        let costNode = this.node.getChildByName('CostDisplay');
        
        if (!costNode) {
            costNode = new Node('CostDisplay');
            costNode.setParent(this.node);
            
            // 添加 UITransform 组件
            const transform = costNode.addComponent(UITransform);
            transform.setAnchorPoint(0.5, 0.5);
            
            // 设置位置（卡片底部）
            const cardTransform = this.node.getComponent(UITransform);
            if (cardTransform) {
                const offsetY = 10; // 距离底部的偏移
                costNode.setPosition(cardTransform.width / 2, offsetY, 0);
            }
            
            // 添加 Label 组件
            const label = costNode.addComponent(Label);
            label.string = `${cost}`;
            label.fontSize = 18;
            label.color = Color.YELLOW;
            
            // 设置标签大小
            transform.setContentSize(30, 20);
        } else {
            // 更新标签文本
            const label = costNode.getComponent(Label);
            if (label) {
                label.string = `${cost}`;
            }
        }
    }

    /**
     * 设置武器类型和预制体
     */
    public setWeaponType(type: WeaponType, prefab: Prefab | null = null) {
        this.weaponType = type;
        if (prefab) {
            this.weaponPrefab = prefab;
            this.createWeapon();
        }
    }

    /**
     * 触摸开始事件处理
     */
    onTouchStart(event: EventTouch) {
        this.dragHandler?.onTouchStart(event);
    }

    /**
     * 触摸移动事件处理
     */
    onTouchMove(event: EventTouch) {
        this.dragHandler?.onTouchMove(event);
    }

    /**
     * 触摸结束事件处理
     */
    onTouchEnd(event: EventTouch) {
        this.dragHandler?.onTouchEnd(event);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        
        // 安全销毁武器节点，避免重复销毁
        if (this.weaponNode && this.weaponNode.isValid) {
            this.weaponNode.destroy();
            this.weaponNode = null;
        }
        
        // 清理拖拽处理器（会安全销毁拖拽节点）
        if (this.dragHandler) {
            this.dragHandler.destroy();
            this.dragHandler = null;
        }
    }
}

