import { _decorator, Component, Node, Graphics, UITransform, Prefab } from 'cc';
import { UiConfig } from '../../../config/Index';
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
        
        // 上下边距各20，宽度改为4个格子，高度减去上下边距以适配
        const topMargin = 20;
        const bottomMargin = 20;
        const width = UiConfig.CELL_SIZE * 4;
        const height = UiConfig.CELL_SIZE * 2 - topMargin - bottomMargin;
        transform.setAnchorPoint(0, 0);
        transform.setContentSize(width, height);
        
        // 设置位置：底部边距20（由于锚点在左下角，y位置就是底部边距）
        this.node.setPosition(0, bottomMargin, 0);
        
        // 初始化 Graphics 组件
        this.graphics = this.node.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.node.addComponent(Graphics);
        }
        
        // 使用渲染器绘制美化背景
        WeaponContainerRenderer.renderBackground(this.graphics, width, height);
    }

    start() {
        this.createWeaponCards();
    }

    /**
     * 创建武器卡片
     * 为每种武器类型创建一个武器卡片节点
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
        
        // 计算横向均匀排布
        // 卡片总宽度
        const totalCardWidth = cellSize * cardCount;
        // 剩余空间
        const remainingSpace = containerWidth - totalCardWidth;
        // 间距数：卡片前、卡片之间、卡片后（共 cardCount + 1 个间距）
        const spacingCount = cardCount + 1;
        // 每个间距
        const spacing = remainingSpace / spacingCount;
        
        // 计算竖向居中
        const cardHeight = cellSize;
        const centerY = (containerHeight - cardHeight) / 2;
        
        // 为每种武器类型动态创建一个武器卡片节点
        weaponConfigs.forEach((config, index) => {
            const weaponCardNode = this.createWeaponCardNode(config.type, config.prefab, cellSize);
            
            // 横向均匀排布：第一个间距 + 前面所有卡片和间距的宽度
            const x = spacing + index * (cellSize + spacing);
            // 竖向居中
            const y = centerY;
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
        transform.setAnchorPoint(0, 0);
        transform.setContentSize(cellSize, cellSize);
        
        // 添加 Graphics 组件（用于绘制）
        weaponCardNode.addComponent(Graphics);
        
        // 添加 WeaponCard 组件并设置属性
        const weaponCardComponent = weaponCardNode.addComponent(WeaponCard);
        weaponCardComponent.weaponType = weaponType;
        weaponCardComponent.weaponPrefab = weaponPrefab;
        
        // 设置父节点
        weaponCardNode.setParent(this.node);
        
        return weaponCardNode;
    }

}

