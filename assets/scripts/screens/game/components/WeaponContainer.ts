import { _decorator, Component, Node, Graphics, UITransform, Prefab } from 'cc';
import { UiConfig, UiMarginConfig } from '../../../config/Index';
import { WeaponCard } from './WeaponCard';
import { WeaponType } from '../../../constants/Index';
import { WeaponContainerRenderer } from '../../../renderers/Index';
const { ccclass, property } = _decorator;

@ccclass('WeaponContainer')
export class WeaponContainer extends Component {

    @property({ type: Prefab, displayName: '基础武器预制体' })
    public basicWeaponPrefab: Prefab = null;

    @property({ type: Prefab, displayName: '激光武器预制体' })
    public laserWeaponPrefab: Prefab = null;

    @property({ type: Prefab, displayName: '火箭塔预制体' })
    public rocketWeaponPrefab: Prefab = null;
    
    private graphics: Graphics | null = null;
    
    onLoad() {
        const transform = this.node.getComponent(UITransform);
        
        // 底部边距20，宽度改为4个格子，高度减去底部边距以适配
        const bottomMargin = UiMarginConfig.WEAPON_CONTAINER_BOTTOM_MARGIN;
        const width = UiConfig.CELL_SIZE * 4;
        const height = UiConfig.CELL_SIZE * 2 - bottomMargin;
        transform.setAnchorPoint(0, 0);
        transform.setContentSize(width, height);
        
        // 设置位置：底部边距20（由于锚点在左下角，y位置就是底部边距）
        this.node.setPosition(0, bottomMargin, 0);
        
        // 初始化 Graphics 组件
        this.graphics = this.node.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.node.addComponent(Graphics);
        }
        
        // 使用渲染器绘制美化背景（只绘制边框）
        WeaponContainerRenderer.renderBackground(this.graphics, width, height);
    }

    start() {
        this.createWeaponCards();
    }

    /**
     * 创建武器卡片
     * 为每种武器类型创建一个武器卡片节点
     * 动态计算 margin 实现居中
     */
    private createWeaponCards() {
        // 定义3种武器类型和对应的预制体
        const weaponConfigs: Array<{ type: WeaponType; prefab: Prefab | null }> = [
            { type: WeaponType.BASIC, prefab: this.basicWeaponPrefab },
            { type: WeaponType.LASER, prefab: this.laserWeaponPrefab },
            { type: WeaponType.ROCKET, prefab: this.rocketWeaponPrefab }
        ];
        
        const transform = this.node.getComponent(UITransform);
        if (!transform) return;
        
        const containerWidth = transform.width;
        const containerHeight = transform.height;
        const cellSize = UiConfig.CELL_SIZE;
        const cardCount = weaponConfigs.length;
        
        // 动态计算横向 margin（实现水平居中）
        const totalCardWidth = cellSize * cardCount;
        const horizontalMargin = (containerWidth - totalCardWidth) / 2;
        
        // 动态计算纵向 margin（实现垂直居中）
        const cardHeight = cellSize;
        const verticalMargin = (containerHeight - cardHeight) / 2;
        
        // 为每种武器类型动态创建一个武器卡片节点
        weaponConfigs.forEach((config, index) => {
            const weaponCardNode = this.createWeaponCardNode(config.type, config.prefab, cellSize);
            weaponCardNode.setParent(this.node);
            
            // 使用动态计算的 margin 设置位置
            const x = horizontalMargin + index * cellSize;
            const y = verticalMargin;
            weaponCardNode.setPosition(x, y, 0);
        });
    }

    /**
     * 创建单个武器卡片节点
     * @param weaponType 武器类型
     * @param weaponPrefab 武器预制体
     * @param cellSize 格子大小
     * @returns 创建的武器卡片节点
     */
    private createWeaponCardNode(weaponType: WeaponType, weaponPrefab: Prefab | null, cellSize: number): Node {
        // 创建新节点
        const weaponCardNode = new Node(`WeaponCard_${weaponType}`);
        
        // 添加 UITransform 组件
        const transform = weaponCardNode.addComponent(UITransform);
        transform.setAnchorPoint(0, 0); // 使用左下角锚点
        transform.setContentSize(cellSize, cellSize);
        
        // 添加 Graphics 组件（用于绘制）
        weaponCardNode.addComponent(Graphics);
        
        // 添加 WeaponCard 组件并设置属性
        const weaponCardComponent = weaponCardNode.addComponent(WeaponCard);
        weaponCardComponent.weaponType = weaponType;
        weaponCardComponent.weaponPrefab = weaponPrefab;
        
        return weaponCardNode;
    }

}

